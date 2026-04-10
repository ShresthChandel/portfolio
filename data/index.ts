export const navItems = [
  { name: "About", link: "#about" },
  { name: "Projects", link: "#projects" },
  { name: "Contact", link: "#contact" },
];

export const gridItems = [
  {
    id: 1,
    title: "I prioritize client collaboration, fostering open communication ",
    description: "",
    className: "lg:col-span-3 md:col-span-6 md:row-span-4 lg:min-h-[60vh]",
    imgClassName: "w-full h-full",
    titleClassName: "justify-end",
    img: "/b1.svg",
    spareImg: "",
  },
  {
    id: 2,
    title: "I am a catalyst for new ideas.",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-2",
    imgClassName: "",
    titleClassName: "justify-start",
    img: "",
    spareImg: "",
  },
  {
    id: 3,
    title: "My tech stack",
    description: "C++, TS, React, Node, PostgreSQL, MongoDB, Docker",
    className: "lg:col-span-2 md:col-span-3 md:row-span-2",
    imgClassName: "",
    titleClassName: "justify-center",
    img: "",
    spareImg: "",
  },
  {
    id: 4,
    title: "Driven by Leadership & Event Execution",
    description: "Led core teams for TantraFiesta'25 and E-Summit'25.",
    className: "lg:col-span-2 md:col-span-3 md:row-span-1",
    imgClassName: "",
    titleClassName: "justify-start",
    img: "/grid.svg",
    spareImg: "/b4.svg",
  },
  {
    id: 5,
    title: "Currently pursuing BTech from IIIT Nagpur (7.76 CGPA).",
    description: "Solved 200+ DSA Questions across platforms.",
    className: "md:col-span-3 md:row-span-2",
    imgClassName: "absolute right-0 bottom-0 md:w-96 w-60",
    titleClassName: "justify-center md:justify-start lg:justify-center",
    img: "/b5.svg",
    spareImg: "/grid.svg",
  },
  {
    id: 6,
    title: "Do you want to start a project together?",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-1",
    imgClassName: "",
    titleClassName: "justify-center md:max-w-full max-w-60 text-center",
    img: "",
    spareImg: "",
  },
];

export const projects = [
  {
    id: 1,
    title: "InternMitra — AI-Powered Internship Platform",
    des: "A full-stack internship portal with secure Clerk OAuth, an AI-driven matching engine, and a responsive UI.",
    img: "/p1.svg",
    iconLists: ["/re.svg", "/tail.svg", "/ts.svg", "/next.svg"],
    link: "https://intern-mitra-sand.vercel.app/", 
  },
  {
    id: 2,
    title: "The Editor — AI-Powered Web IDE",
    des: "Browser-based Web IDE with WebContainers, NextAuth, Monaco Editor, and local CodeLlama AI debugging models.",
    img: "/p2.svg",
    iconLists: ["/next.svg", "/tail.svg", "/ts.svg", "/dock.svg"],
    link: "https://github.com/ShresthChandel/web-ide.git",
  },
];

export const testimonials: { quote: string; name: string; title: string }[] = [];

export const companies: {
  id: number;
  name: string;
  img: string;
  nameImg: string;
}[] = [];

export const workExperience = [
  {
    id: 1,
    title: "Full Stack & AI Intern - Varnet Solutions",
    desc: "Built a real-time web app using Google Maps API. Engineered low-latency synchronization with Socket.io and designed a RAG-based AI chatbot.",
    className: "md:col-span-2",
    thumbnail: "/exp1.svg",
  },
  {
    id: 2,
    title: "BTech at IIIT Nagpur",
    desc: "Currently pursuing my Bachelor's degree with a 7.76 CGPA, focusing on Data Structures, Algorithms, OS, DBMS, and Networks.",
    className: "md:col-span-2",
    thumbnail: "/exp2.svg",
  },
  {
    id: 3,
    title: "12th Grade - Deep Jyoti H.S. School",
    desc: "Completed my higher secondary education in Rewa, MP, scoring 83.8%.",
    className: "md:col-span-2",
    thumbnail: "/exp3.svg",
  },
  {
    id: 4,
    title: "10th Grade - Jyoti Senior Secondary",
    desc: "Completed secondary education in Rewa, MP, scoring 93.2%.",
    className: "md:col-span-2",
    thumbnail: "/exp4.svg",
  },
];

export const socialMedia = [
  {
    id: 1,
    img: "/git.svg",
    link: "https://github.com/ShresthChandel"
  },
  {
    id: 2,
    img: "/twit.svg",
    link: "https://x.com/ShresthCha29886"
  },
  {
    id: 3,
    img: "/link.svg",
    link: "https://www.linkedin.com/in/shresth-singh-chandel-5576242a9/"
  },
  {
    id: 4,
    img: "/insta.svg",
    link: "https://www.instagram.com/shresth_singh_chandel?igsh=bHkxemx5Mm96NW4w&utm_source=qr"
  }
];
