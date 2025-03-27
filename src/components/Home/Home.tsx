import React, { useRef } from "react";
import Hero from "./Hero";
import Work from "./Work";
import Playreel from "./Playreel";
import Images from "./Images";
import Spread from "./Spread";
import Story from "./Story";
import { motion } from "framer-motion";
import { useLenisGsap } from "../hooks/useLenisGsap";
import {
  anim,
  innerDivTransition,
  outerDivTransition,
  overlayTransition,
} from "../../utils/anim";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type HomeProps = {
  setCursorProps: React.Dispatch<
    React.SetStateAction<{ text: string; isVisible: boolean }>
  >;
  setLogoColor: React.Dispatch<React.SetStateAction<string>>;
};
const Home = ({ setCursorProps, setLogoColor }: HomeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLenisGsap(containerRef);
  return (
    <motion.div
      id="home"
      key={"home"}
      className="home absolute inset-0 top-0 left-0 right-0   origin-top-left"
      {...anim(outerDivTransition)}
    >
      <motion.div
        className="overlay bg-[#0d0e13] z-[1] absolute inset-0 invisible opacity-0"
        {...anim(overlayTransition)}
        initial={false}
      />
      <motion.div
        id="homeFixedContainer"
        ref={containerRef}
        className=" overflow-hidden fixed inset-0 "
        {...anim(innerDivTransition)}
        onAnimationComplete={() => ScrollTrigger.refresh()} // Refresh scroll positions
      >
        <div>
          <Hero setCursorProps={setCursorProps} />
          <Work setCursorProps={setCursorProps} />
          <Playreel />
          <Images />
          <Spread />
          <Story setLogoColor={setLogoColor} />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Home;
