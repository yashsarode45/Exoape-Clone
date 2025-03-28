import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  overlayTransition,
  anim,
  outerDivTransition,
  innerDivTransition,
  easeOutExpo,
  countTransition,
} from "../../utils/anim";
import { projectDetails } from "./projectDetails";
import { debounce } from "lodash";
import { useGSAP } from "@gsap/react";
import gsap from "gsap/all";
import Overflow from "../../utils/Overflow";
import AllProjects from "./AllProjects";
type WorkSpaceProps = {
  setLogoColor: React.Dispatch<React.SetStateAction<string>>;
};
const WorkShowCase = ({ setLogoColor }: WorkSpaceProps) => {
  const absoluteStyle = "absolute inset-0 overflow-hidden";
  const [currentNumber, setCurrentNumber] = useState(1);
  const [direction, setDirection] = useState(1); // 1 for down, -1 for up
  const tl = useRef<gsap.core.Timeline>();
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [showMoreProject, setShowMoreProject] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const latestDeltaSignRef = useRef<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsInitialRender(false);
  }, []);

  const processDeltaSign = useCallback(
    debounce(
      () => {
        const deltaSign = latestDeltaSignRef.current;
        if (deltaSign === null) return;

        setDirection(deltaSign);
        setCurrentNumber((prevNumber) => {
          if (deltaSign > 0) {
            return prevNumber === 12 ? 1 : prevNumber + 1;
          } else {
            return prevNumber === 1 ? 12 : prevNumber - 1;
          }
        });
        setIsAnimating(true);
        latestDeltaSignRef.current = null;
      },
      100,
      {
        leading: true,
        trailing: false,
      }
    ),
    []
  );

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const deltaSign = e.deltaY > 0 ? 1 : -1;
      latestDeltaSignRef.current = deltaSign;

      if (!isAnimating) {
        processDeltaSign();
      }
    },
    [isAnimating, processDeltaSign]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [handleWheel]);

  Overflow(".headings h2 span", 0, 1.3, [currentNumber, direction]);
  Overflow(".headings p span", 0.5, 1.3, [currentNumber, direction]);

  // Scroll animations
  useGSAP(
    () => {
      // Project Elements
      const currentprojectContainers = document.querySelector(
        `[data-currentelement="true"]`
      );
      const currentprojectImgContainer =
        currentprojectContainers?.querySelector(".projectWrap");

      const outprojectContainers = document.querySelector(
        `[data-outgoingelement="true"]`
      );
      const outprojectImgContainer =
        outprojectContainers?.querySelector(".projectWrap");

      //Thumbnail Elements
      const currentThumbnail = document.querySelector(
        `[data-currentthumbnail="true"]`
      );

      const currentThumbnailImgContainer =
        currentThumbnail?.querySelector(".thumbnailImage");

      const outgoingThumbnail = document.querySelector(
        `[data-outgoingthumbnail="true"]`
      );

      const outgoingThumbnailImgContainer =
        outgoingThumbnail?.querySelector(".thumbnailImage");

      // Create new timeline
      tl.current = gsap.timeline({
        defaults: {
          duration: 1.3,
          ease: "power4.out",
        },
        onUpdate: function () {
          if (this.progress() >= 0.9) {
            setIsAnimating(false);
          }
        },
        onComplete: () => {
          if (latestDeltaSignRef.current !== null) {
            processDeltaSign.cancel();
          }
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      currentThumbnail &&
        tl.current.set([currentprojectContainers, currentThumbnail], {
          display: "block",
          zIndex: 1,
        });

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      outgoingThumbnail &&
        tl.current.set([outprojectContainers, outgoingThumbnail], {
          display: "block",
          zIndex: 2,
        });

      // Animating Projects
      tl.current.fromTo(
        outprojectContainers,
        {
          clipPath:
            direction === 1
              ? "polygon(0 0, 100% 0, 100% 91%, 0 98%)"
              : "polygon(0 7%, 100% 15%, 100% 100%, 0% 100%)",
        },
        {
          clipPath:
            direction === 1
              ? "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)"
              : "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",

          onComplete: () => {
            gsap.set(outprojectContainers, {
              display: "none",
              clipPath: "none",
            });
          },
        }
      );
      // Animating Thumbnail Container
      tl.current.fromTo(
        outgoingThumbnail,
        {
          clipPath:
            direction === 1
              ? "polygon(0 2%, 100% 8%, 100% 100%, 0% 100%)"
              : "polygon(0 0, 100% 0, 100% 91%, 0 98%)",
        },
        {
          clipPath:
            direction === 1
              ? "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)"
              : "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",

          onComplete: () => {
            gsap.set(outprojectContainers, {
              display: "none",
              clipPath: "none",
            });
          },
        },
        0
      );

      // Project current img container
      tl.current.from(
        currentprojectImgContainer as Element,
        {
          yPercent: direction === 1 ? 25 : -25,
        },
        0
      );

      // Thumbnail current img container
      tl.current.from(
        currentThumbnailImgContainer as Element,
        {
          yPercent: direction === 1 ? -25 : 25,
        },
        0
      );

      // Project outgoing img container
      tl.current.to(
        outprojectImgContainer as Element,
        {
          yPercent: direction === 1 ? -50 : 50,
          scale: 1.5,
          rotate: direction === 1 ? -7 : 7,
        },
        0
      );

      // Thumbnail outgoing img container
      tl.current.to(
        outgoingThumbnailImgContainer as Element,
        {
          yPercent: direction === 1 ? 50 : -50,
        },
        0
      );
    },
    { dependencies: [currentNumber, direction], revertOnUpdate: true }
  );

  // Animations WorkShowCase -> All Projects
  useGSAP(
    () => {
      if (showMoreProject) {
        const tl = gsap.timeline({
          defaults: {
            duration: 1.1,
            ease: "power4.out",
          },
        });

        tl.fromTo(
          "#experience",
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 96%)",
          },
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            onUpdate: function () {
              if (this.progress() >= 0.4) {
                setLogoColor("#0d0e13");
                this.eventCallback("onUpdate", null);
              }
            },
          }
        );
        tl.to(
          ".projects",
          {
            rotate: -6,
            scale: 1.5,
          },
          "<"
        );
      }
      if (!showMoreProject && !isInitialRender) {
        const tl2 = gsap.timeline({
          defaults: {
            duration: 0.9,
            ease: "power4.out",
          },
        });

        tl2.fromTo(
          "#experience",
          {
            clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
          },
          {
            clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
            duration: 0.3,
          }
        ); // Empty tween for delay

        tl2.fromTo(
          "#experience",
          {
            clipPath: "polygon(0% 96%, 100% 98%, 100% 100%, 0% 100%)",
          },
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            onUpdate: function () {
              if (this.progress() >= 0.4) {
                setLogoColor("#fff");
                this.eventCallback("onUpdate", null);
              }
            },
          }
        );
        tl2.from(
          ".projects",
          {
            rotate: 6,
            scale: 1.5,
          },
          "<"
        );
      }
    },
    { dependencies: [showMoreProject], revertOnUpdate: true }
  );

  const getOutgoingElement = (id: number) => {
    // Return false on initial render
    if (isInitialRender) return false;

    if (direction === 1) {
      if (currentNumber === 1 && id === 12) {
        return true;
      } else if (id === currentNumber - 1) {
        return true;
      }
    } else if (direction === -1) {
      if (currentNumber === 12 && id === 1) {
        return true;
      } else if (id === currentNumber + 1) {
        return true;
      }
    }
    return false;
  };

  const handleShowMoreProject = () => {
    setShowMoreProject((prev) => !prev);
  };
  return (
    <motion.div
      key={"home"}
      className={`workshowcase ${absoluteStyle} bg-[#0d0e13] origin-top-left select-none overscroll-none`}
      {...anim(outerDivTransition)}
    >
      <motion.div
        className="overlay bg-[#0d0e13] z-[1] absolute inset-0 invisible opacity-0"
        {...anim(overlayTransition)}
        initial={false}
      />
      <motion.div
        className="fixed inset-0 overflow-hidden"
        {...anim(innerDivTransition)}
      >
        <section
          id="experience"
          ref={containerRef}
          className={`experience z-[2] ${absoluteStyle} select-none flex justify-center items-center`}
        >
          <div className={`projects ${absoluteStyle}`}>
            {projectDetails.map(({ img, id }) => {
              return (
                <div
                  key={id}
                  className={`projectContainer ${absoluteStyle} hidden`}
                  data-currentElement={id === currentNumber ? true : false}
                  data-outgoingElement={getOutgoingElement(id)}
                >
                  <div className={`projectWrap ${absoluteStyle} bg-[#0d0e13]`}>
                    <img
                      src={img}
                      className="project_img h-[125vw] opacity-80 scale-110 w-full object-cover"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className=" thumbnails relative overflow-hidden pointer-events-none z-[5] h-[27vw] w-[22vw]">
            {projectDetails.map(({ img, id }) => {
              return (
                <div
                  key={id}
                  data-currentThumbnail={id === currentNumber ? true : false}
                  data-outgoingThumbnail={getOutgoingElement(id)}
                  className={`thumbnail ${absoluteStyle} hidden`}
                >
                  <img
                    src={img}
                    className={`thumbnailImage h-full w-full ${absoluteStyle} object-cover`}
                  />
                </div>
              );
            })}
          </div>

          <div className="headings absolute left-[16vw] z-[5] text-white">
            {projectDetails.map(({ title, id, subtitle }) => {
              return (
                id === currentNumber && (
                  <div key={id}>
                    {title.split(" ").map((str) => (
                      <h2 className=" overflow-hidden text-6xl tracking-tighter leading-tight">
                        <span className="block">{str}</span>
                      </h2>
                    ))}
                    <p className=" overflow-hidden text-xl font-light opacity-80 tracking-tighter">
                      <span className="block ">{subtitle}</span>
                    </p>
                  </div>
                )
              );
            })}
          </div>

          <div className="indicator absolute right-[4vw] bottom-[4vw] z-[9] flex text-2xl font-light text-white gap-2 overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.span
                key={currentNumber}
                variants={countTransition}
                initial="initial"
                animate="animate"
                exit="exit"
                custom={direction}
              >
                {`0${currentNumber}`}
              </motion.span>
            </AnimatePresence>
            <span className=" opacity-70">/ {projectDetails.length}</span>
          </div>

          <motion.button
            className="allProjects  absolute flex gap-2 items-center z-[9] left-14 bottom-14 text-white"
            whileHover="hover"
            initial="initial"
            onClick={handleShowMoreProject}
          >
            <motion.svg
              className=" w-4 h-4"
              viewBox="0 0 9 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.g
                variants={{
                  initial: {
                    opacity: 1,
                    display: "block",
                  },
                  hover: {
                    opacity: 0,
                    transitionEnd: {
                      display: "none",
                    },
                  },
                }}
                transition={{
                  ease: easeOutExpo,
                  duration: 0.8,
                }}
                className=" origin-center  "
              >
                <path
                  d="M0.296875 5.73439C0.494792 5.53972 0.729167 5.44238 1 5.44238C1.27083 5.44238 1.50521 5.53972 1.70313 5.73439C1.90104 5.92906 2 6.1596 2 6.42599C2 6.67189 1.90104 6.8973 1.70313 7.10222C1.50521 7.30714 1.27604 7.4096 1.01563 7.4096C0.744792 7.4096 0.505208 7.31226 0.296875 7.11759C0.0989582 6.92292 -5.55499e-08 6.69238 -4.37114e-08 6.42599C-3.18729e-08 6.1596 0.0989585 5.92906 0.296875 5.73439Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M0.296875 11.2918C0.494792 11.0971 0.729167 10.9998 1 10.9998C1.27083 10.9998 1.50521 11.0971 1.70313 11.2918C1.90104 11.4864 2 11.717 2 11.9834C2 12.2293 1.90104 12.4547 1.70313 12.6596C1.50521 12.8645 1.27604 12.967 1.01563 12.967C0.744792 12.967 0.505208 12.8696 0.296875 12.675C0.0989582 12.4803 -5.55499e-08 12.2498 -4.37114e-08 11.9834C-3.18729e-08 11.717 0.0989585 11.4864 0.296875 11.2918Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M0.296875 0.291764C0.494792 0.097092 0.729167 -0.000244198 1 -0.000244184C1.27083 -0.000244169 1.50521 0.097092 1.70313 0.291764C1.90104 0.486437 2 0.716969 2 0.983363C2 1.22926 1.90104 1.45467 1.70313 1.65959C1.50521 1.86451 1.27604 1.96697 1.01563 1.96697C0.744792 1.96697 0.505208 1.86963 0.296875 1.67496C0.0989582 1.48029 -5.55499e-08 1.24976 -4.37114e-08 0.983363C-3.18729e-08 0.716969 0.0989585 0.486436 0.296875 0.291764Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M7.29688 5.73439C7.49479 5.53972 7.72917 5.44238 8 5.44238C8.27083 5.44238 8.50521 5.53972 8.70313 5.73439C8.90104 5.92906 9 6.1596 9 6.42599C9 6.67189 8.90104 6.8973 8.70313 7.10222C8.50521 7.30714 8.27604 7.4096 8.01563 7.4096C7.74479 7.4096 7.50521 7.31226 7.29687 7.11759C7.09896 6.92292 7 6.69238 7 6.42599C7 6.1596 7.09896 5.92906 7.29688 5.73439Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M7.29688 11.2918C7.49479 11.0971 7.72917 10.9998 8 10.9998C8.27083 10.9998 8.50521 11.0971 8.70313 11.2918C8.90104 11.4864 9 11.717 9 11.9834C9 12.2293 8.90104 12.4547 8.70313 12.6596C8.50521 12.8645 8.27604 12.967 8.01563 12.967C7.74479 12.967 7.50521 12.8696 7.29687 12.675C7.09896 12.4803 7 12.2498 7 11.9834C7 11.717 7.09896 11.4864 7.29688 11.2918Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M7.29688 0.291764C7.49479 0.097092 7.72917 -0.000244198 8 -0.000244184C8.27083 -0.000244169 8.50521 0.097092 8.70313 0.291764C8.90104 0.486437 9 0.716969 9 0.983363C9 1.22926 8.90104 1.45467 8.70313 1.65959C8.50521 1.86451 8.27604 1.96697 8.01563 1.96697C7.74479 1.96697 7.50521 1.86963 7.29687 1.67496C7.09896 1.48029 7 1.24976 7 0.983363C7 0.716969 7.09896 0.486436 7.29688 0.291764Z"
                  fill="currentColor"
                ></path>
              </motion.g>
              <motion.g
                variants={{
                  initial: {
                    opacity: 0,
                    display: "none",
                  },
                  hover: {
                    opacity: 1,
                    display: "block",
                  },
                }}
                transition={{
                  ease: easeOutExpo,
                  duration: 0.8,
                }}
                className=" origin-center  "
              >
                <path
                  d="M1.66445 8.82257L1.66448 8.82254C0.895746 8.03957 0.5 7.07263 0.5 5.97561C0.5 4.8778 0.896847 3.91438 1.67758 3.1481C2.45358 2.38648 3.41664 2 4.50813 2C5.59836 2 6.55858 2.38585 7.32575 3.15138C8.10428 3.91712 8.5 4.87936 8.5 5.97561C8.5 7.07258 8.1043 8.03947 7.33564 8.82242M6.62195 3.86179C6.04743 3.28726 5.34282 3 4.50813 3C3.67344 3 2.96341 3.28726 2.37805 3.86179C1.79268 4.43631 1.5 5.14092 1.5 5.97561C1.5 6.8103 1.79268 7.52575 2.37805 8.12195C2.96341 8.70732 3.67344 9 4.50813 9C5.34282 9 6.04743 8.70732 6.62195 8.12195C7.20732 7.52575 7.5 6.8103 7.5 5.97561C7.5 5.14092 7.20732 4.43631 6.62195 3.86179ZM1.66445 8.82257L1.67094 8.82906ZM7.33552 8.82254C6.56926 9.60319 5.60588 10 4.50813 10C3.4107 10 2.44558 9.6037 1.67094 8.82906"
                  fill="currentColor"
                ></path>
              </motion.g>
            </motion.svg>
            <span className=" text-nowrap opacity-80">All Projects</span>
          </motion.button>
        </section>
        <AllProjects
          setShowMoreProject={setShowMoreProject}
          currentNumber={currentNumber}
          showMoreProject={showMoreProject}
        />
      </motion.div>
    </motion.div>
  );
};

export default WorkShowCase;
