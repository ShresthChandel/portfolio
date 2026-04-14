import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { styles } from "../styles";

const ParticleCanvas = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let W, H, CX, CY, dpr;
    let appState = 1; // 0 = sphere | 1 = forming word | 2 = word + repel active
    let mouseX = -9999;
    let mouseY = -9999;
    let t = 0;
    let formTimeout;
    let animationFrameId;

    const REPEL_RADIUS = 100;
    const REPEL_FORCE = 8;
    const PHI = Math.PI * (1 + Math.sqrt(5));
    let rotY = 0;
    const FOV = 550;
    const CAMERA_Z = 600;

    const N = 10000;
    const px = new Float32Array(N);
    const py = new Float32Array(N);
    const pz = new Float32Array(N);
    const vx = new Float32Array(N);
    const vy = new Float32Array(N);
    const vz = new Float32Array(N);
    const tx = new Float32Array(N);
    const ty = new Float32Array(N);
    const tz = new Float32Array(N);
    const ox = new Float32Array(N);
    const oy = new Float32Array(N);
    const oz = new Float32Array(N);
    const hue = new Float32Array(N);
    const phase = new Float32Array(N);

    // Initial setup
    function resize() {
      dpr = window.devicePixelRatio || 1;
      const rect = containerRef.current.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      CX = W / 2;
      CY = H / 2;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(1, 0, 0, 1, 0, 0); // reset
      ctx.scale(dpr, dpr);
      if (appState === 0) initSphereTargets();
    }

    function initSphereTargets() {
      const baseDim = Math.min(W, H);
      const R = baseDim > 1200 ? baseDim * 0.28 : baseDim * 0.42;
      for (let i = 0; i < N; i++) {
        const polar = Math.acos(1 - 2 * (i + 0.5) / N);
        const azim = PHI * i;
        ox[i] = Math.sin(polar) * Math.cos(azim) * R;
        oy[i] = Math.sin(polar) * Math.sin(azim) * R;
        oz[i] = Math.cos(polar) * R;

        if (appState === 0) {
          tx[i] = ox[i];
          ty[i] = oy[i];
          tz[i] = oz[i];
        }
      }
    }

    function initParticles() {
      for (let i = 0; i < N; i++) {
        px[i] = (Math.random() - 0.5) * W * 2;
        py[i] = (Math.random() - 0.5) * H * 2;
        pz[i] = (Math.random() - 0.5) * 1000;
        vx[i] = vy[i] = vz[i] = 0;
        hue[i] = (i / N) * 320 + 170;
        phase[i] = Math.random() * Math.PI * 2;
      }
    }

    function sampleTextPositions(phrase) {
      const cW = Math.max(Math.floor(W), 100); // ensure valid dimensions
      const cH = Math.max(Math.floor(H), 100);
      const off = document.createElement("canvas");
      off.width = cW;
      off.height = cH;
      const c2 = off.getContext("2d");

      const words = phrase.split(" ");
      const lines = [];
      let currentLine = "";
      const maxChars = phrase.length > 25 ? 12 : 20;

      words.forEach((word) => {
        if ((currentLine + word).length > maxChars) {
          lines.push(currentLine.trim());
          currentLine = word + " ";
        } else {
          currentLine += word + " ";
        }
      });
      lines.push(currentLine.trim());

      let fs = Math.min((cW * 0.72) / (maxChars * 0.5), (cH * 0.5) / lines.length, 180);
      if (phrase.length > 30) fs *= 0.8;

      c2.fillStyle = "#fff";
      c2.font = `900 ${fs}px Arial Black, Arial, sans-serif`;
      c2.textAlign = "center";
      c2.textBaseline = "middle";

      const lineHeight = fs * 1.1;
      const startY = cH / 2 - ((lines.length - 1) * lineHeight) / 2;

      lines.forEach((line, i) => {
        c2.fillText(line, cW / 2, startY + i * lineHeight);
      });

      const imgData = c2.getImageData(0, 0, cW, cH);
      const data = imgData.data;
      const pts = [];
      const step = phrase.length > 30 ? 2 : 1;

      for (let y = 0; y < cH; y += step) {
        for (let x = 0; x < cW; x += step) {
          if (data[(y * cW + x) * 4 + 3] > 120) {
            pts.push(
              x - cW / 2 + (Math.random() - 0.5) * 0.8,
              y - cH / 2 + (Math.random() - 0.5) * 0.8
            );
          }
        }
      }

      for (let i = pts.length / 2 - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const ia = i * 2, ja = j * 2;
        let tmp = pts[ia];
        pts[ia] = pts[ja];
        pts[ja] = tmp;
        tmp = pts[ia + 1];
        pts[ia + 1] = pts[ja + 1];
        pts[ja + 1] = tmp;
      }
      return pts;
    }

    function formWord(phrase, isInterim = false) {
      if (!phrase.trim()) return;

      appState = 1;
      const pts = sampleTextPositions(phrase);
      const pCount = Math.max(pts.length / 2, 1);

      for (let i = 0; i < N; i++) {
        const idx = (i % pCount) * 2;
        tx[i] = pts[idx];
        ty[i] = pts[idx + 1];
        tz[i] = 0;
      }

      rotY = 0;
      t = 0;
      clearTimeout(formTimeout);
      if (!isInterim) {
        formTimeout = setTimeout(() => {
          appState = 2;
        }, 2000);
      }
    }

    function update() {
      t += 0.005;
      if (appState === 0) rotY += 0.006;
      const jitter = appState === 0 ? 1.8 : 0;

      for (let i = 0; i < N; i++) {
        let curTx = tx[i], curTy = ty[i], curTz = tz[i];
        const cosY = Math.cos(rotY), sinY = Math.sin(rotY);

        let targetX = curTx * cosY - curTz * sinY;
        let targetY = curTy;
        let targetZ = curTx * sinY + curTz * cosY;

        if (appState === 0) {
          targetX += Math.sin(t * 8 + phase[i]) * jitter;
          targetY += Math.cos(t * 9 + phase[i]) * jitter;
          targetZ += Math.sin(t * 7 + phase[i] * 2) * jitter;
        }

        const sp = appState === 0 ? 0.02 : 0.022;
        vx[i] += (targetX - px[i]) * sp;
        vy[i] += (targetY - py[i]) * sp;
        vz[i] += (targetZ - pz[i]) * sp;

        if (appState >= 1 && mouseX > 0) {
          const scale = FOV / (FOV + pz[i] + CAMERA_Z);
          const sx = px[i] * scale + CX;
          const sy = py[i] * scale + CY;

          const rdx = sx - mouseX;
          const rdy = sy - mouseY;
          const d2 = rdx * rdx + rdy * rdy;
          if (d2 < REPEL_RADIUS * REPEL_RADIUS && d2 > 1) {
            const d = Math.sqrt(d2);
            const mag = REPEL_FORCE * (1 - d / REPEL_RADIUS) * 5;
            vx[i] += (rdx / d) * mag;
            vy[i] += (rdy / d) * mag;
          }
        }

        vx[i] *= 0.82;
        vy[i] *= 0.82;
        vz[i] *= 0.82;

        px[i] += vx[i];
        py[i] += vy[i];
        pz[i] += vz[i];
      }
    }

    function draw() {
      ctx.fillStyle = "rgba(1,1,3,0.22)"; // Matching #010103 deeply
      ctx.fillRect(0, 0, W, H);

      for (let i = 0; i < N; i++) {
        const zPos = pz[i] + CAMERA_Z;
        if (zPos < 10) continue;

        const scale = FOV / zPos;
        const sx = px[i] * scale + CX;
        const sy = py[i] * scale + CY;

        const spd = Math.sqrt(vx[i] * vx[i] + vy[i] * vy[i] + vz[i] * vz[i]);
        let a = Math.min(1, (0.18 + spd * 0.1) * (scale * 0.65));
        let size = (0.4 + spd * 0.12) * scale;
        let h, s, l;

        if (appState >= 1) {
          h = 190;
          s = 90;
          l = 85;
          a = Math.min(1, a * 1.5);
          size *= 0.9;
        } else {
          h = (hue[i] + t * 25) % 360;
          s = 80;
          l = 70;
        }

        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, 6.2832);
        ctx.fillStyle = `hsla(${h}, ${s}%, ${l}%, ${a})`;
        ctx.fill();
      }

      if (appState >= 1 && mouseX > 0) {
        const r = REPEL_RADIUS;
        const grd = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, r);
        grd.addColorStop(0, "rgba(255,255,255,0.05)");
        grd.addColorStop(1, "rgba(255,255,255,0)");
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, r, 0, 6.2832);
        ctx.fillStyle = grd;
        ctx.fill();
      }
    }

    function loop() {
      update();
      draw();
      animationFrameId = requestAnimationFrame(loop);
    }

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    const handleMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };
    const handleResize = () => {
      resize();
      formWord("Hi I am Shresth");
    };

    containerRef.current.addEventListener("mousemove", handleMouseMove);
    containerRef.current.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    // Boot
    resize();
    initParticles();
    // Default load message based on your info
    formWord("Hi I am Shresth");
    loop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(formTimeout);
      if (containerRef.current) {
        containerRef.current.removeEventListener("mousemove", handleMouseMove);
        containerRef.current.removeEventListener("mouseleave", handleMouseLeave);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-primary">
      <canvas ref={canvasRef} className="w-full h-full cursor-none block outline-none" />
    </div>
  );
};

const Hero = () => {
  return (
    <section className={`relative w-full h-screen mx-auto overflow-hidden`}>
      <ParticleCanvas />

      <div
        className={`absolute inset-0 top-[120px] max-w-7xl mx-auto ${styles.paddingX} flex flex-row items-start gap-5 pointer-events-none`}
      >
        <div className='flex flex-col justify-center items-center mt-5'>
          <div className='w-5 h-5 rounded-full bg-[#915EFF]' />
          <div className='w-1 sm:h-80 h-40 violet-gradient' />
        </div>

        <div>
          <h1 className={`${styles.heroHeadText} text-white`}>
            Hi, I'm <span className='text-[#915EFF]'>Shresth</span>
          </h1>
          <p className={`${styles.heroSubText} mt-2 text-white-100`}>
            I want to try new things, explore new places,<br className='sm:block hidden' />
            meet new people, and break the pattern.
          </p>
        </div>
      </div>

      <div className='absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center pointer-events-auto'>
        <a href='#about'>
          <div className='w-[35px] h-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2'>
            <motion.div
              animate={{
                y: [0, 24, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className='w-3 h-3 rounded-full bg-secondary mb-1'
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
