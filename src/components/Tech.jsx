import React from "react";

import { BallCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";
import { styles } from "../styles";

const Tech = () => {
  return (
    <>
      <div className="mb-12">
        <p className={styles.sectionSubText}>What I use</p>
        <h2 className={styles.sectionHeadText}>My Tech Stack.</h2>
      </div>
      <div className='flex flex-row flex-wrap justify-center gap-10'>
        {technologies.map((technology) => (
          <div className='w-28 h-32 flex flex-col items-center justify-center' key={technology.name}>
            <div className='w-28 h-28'>
              <BallCanvas icon={technology.icon} />
            </div>
            <p className="text-secondary text-[14px] mt-2 font-semibold text-center">{technology.name}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Tech, "tech");
