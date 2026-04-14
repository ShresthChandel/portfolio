import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const counterItems = [
  { value: 10, suffix: "+", label: "Projects Completed" },
  { value: 3, suffix: "+", label: "Years Experience" },
  { value: 20, suffix: "+", label: "Happy Clients" },
  { value: 5, suffix: "+", label: "Awards Won" },
];

const CounterItem = ({ value, suffix, label }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const incrementTime = Math.max(10, Math.floor(duration / end));

      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === end) clearInterval(timer);
      }, incrementTime);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-tertiary rounded-2xl p-8 flex flex-col justify-center items-center shadow-card"
    >
      <div className="text-white text-5xl font-bold mb-2">
        {count}
        <span className="text-[#915EFF]">{suffix}</span>
      </div>
      <div className="text-secondary text-lg font-medium">{label}</div>
    </motion.div>
  );
};

const AnimatedCounter = () => {
  return (
    <div className="w-full mt-20">
      <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {counterItems.map((item, index) => (
          <CounterItem
            key={index}
            value={item.value}
            suffix={item.suffix}
            label={item.label}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimatedCounter;