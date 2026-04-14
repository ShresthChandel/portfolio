import React, { useEffect, useRef } from "react";

const CustomCursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    const moveCursor = (e) => {
      if (cursorRef.current) {
        requestAnimationFrame(() => {
          cursorRef.current.style.transform = `translate3d(${e.clientX - 16}px, ${e.clientY - 16}px, 0)`;
        });
      }
    };

    window.addEventListener("mousemove", moveCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none mix-blend-difference z-[9999] hidden md:block"
      style={{
        backgroundColor: "#915EFF",
        willChange: "transform",
        transition: "transform 0.1s ease-out",
      }}
    />
  );
};

export default CustomCursor;
