import { type AnimationProps } from "framer-motion";

export const easeOutExpo = [0.16, 1, 0.3, 1];
export const easeInExpo = [0.5, 0, 0.75, 0];
export const outerDivTransition: AnimationProps["variants"] = {
  initial: {
    zIndex: 2,
    clipPath: "polygon(0 86%, 100% 100%, 100% 100%, 0% 100%)",
  },
  enter: {
    zIndex: 2,
    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
    transitionEnd: {
      zIndex: 1,
    },
  },
  exit: {
    y: "-25%",
    rotate: -7,
    scale: 1.2,
    transformOrigin: "bottom left",
  },
};

export const innerDivTransition: AnimationProps["variants"] = {
  initial: {
    y: "25%",
    rotate: 7,
    scale: 1.2,
  },
  enter: {
    y: 0,
    rotate: 0,
    scale: 1,
  },
};

export const overlayTransition: AnimationProps["variants"] = {
  animate: {
    visibility: "hidden",
    opacity: 0,
  },
  exit: {
    visibility: "visible",
    opacity: 0.7,
  },
};

export const countTransition: AnimationProps["variants"] = {
  initial: (dir: number) => {
    if (dir === 1) {
      return {
        y: 30,
        opacity: 0,
      };
    }
    return {
      y: -30,
      opacity: 0,
    };
  },
  animate: { y: 0, opacity: 1 },
  exit: (dir: number) => {
    if (dir === 1) {
      return {
        y: -30,
        opacity: 0,
      };
    }
    return {
      y: 30,
      opacity: 0,
    };
  },
};

export const allProjectsTransition: AnimationProps["variants"] = {
  initial: {
    zIndex: 2,
    clipPath: "polygon(0 86%, 100% 100%, 100% 100%, 0% 100%)",
  },
  enter: {
    zIndex: 2,
    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
    transitionEnd: {
      zIndex: 1,
    },
  },
  exit: {
    y: "-25%",
    rotate: -7,
    scale: 1.2,
    transformOrigin: "bottom left",
  },
};

export const anim = (variants: AnimationProps["variants"]) => {
  return {
    initial: "initial",

    animate: "enter",

    exit: "exit",

    variants,

    transition: { duration: 1.3, ease: easeOutExpo },
  };
};
