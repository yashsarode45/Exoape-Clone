import gsap from "gsap/all";
import { Power4 } from "gsap";
import { motion } from "framer-motion";
import React from "react";
import Overflow from "../../utils/Overflow";
import HeroBG from "../../assets/hero_bg.webp";
import { useGSAP } from "@gsap/react";

const Hero = ({
  setCursorProps,
}: {
  setCursorProps: React.Dispatch<
    React.SetStateAction<{
      text: string;
      isVisible: boolean;
    }>
  >;
}) => {
  Overflow(".para p span");
  Overflow(".headings h1 span", 0.5);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#hero",
        scroller: "#homeFixedContainer",
        start: "0 0",
        end: "bottom ",
        scrub: true,
        // markers: true,
      },
    });
    tl.to(
      ".picture img",
      {
        opacity: 0.5,
        yPercent: 15,
      },
      0
    );
    tl.to(
      ".heroTextContainer",
      {
        yPercent: -50,
      },
      0
    );
    gsap.to(".scroll-down", {
      scrollTrigger: {
        trigger: ".scroll-down",
        scroller: "#homeFixedContainer",
        start: "0 90%",
        end: "bottom 80%",
        scrub: true,
      },
      ease: Power4.easeOut,
      opacity: 0,
    });
  }, []);

  return (
    <motion.div
      onHoverStart={() => setCursorProps({ text: "Scroll", isVisible: true })}
      onHoverEnd={() => setCursorProps({ text: "", isVisible: false })}
      id="hero"
      className="main relative w-full h-[200vh] "
    >
      <div className="picture w-full h-full overflow-hidden bg-black">
        <img className="w-full h-[270vh] object-cover" src={HeroBG} alt="" />
      </div>

      <div className="absolute w-full top-0 left-0">
        <div className="heroTextContainer text text-white  mx-auto h-full px-5 sm:px-32">
          <div className="para mt-[32rem]">
            {[
              " Global digital design studio partnering with",
              " brands and businesses that create exceptional",
              " experiences where people live, work, and unwind.",
            ].map((item) => (
              <p
                className="font-light overflow-hidden text-lg sm:text-2xl leading-[1.5rem]"
                key={item}
              >
                <span className="block">{item}</span>
              </p>
            ))}
          </div>

          <div className="headings mt-5 sm:mt-44">
            {["Digital", "Design", "Experience"].map((item) => (
              <h1
                className=" text-6xl  -mt-3 sm:-mt-20 overflow-hidden sm:text-[16rem]  tracking-tighter leading-[1.35]"
                key={item}
              >
                <span className="block">{item}</span>
              </h1>
            ))}
          </div>

          <div className="scroll-down mt-3 sm:hidden bg-opacity-60 bg-black rounded-full w-fit p-3">
            <svg
              className="size-4 rotate-90"
              viewBox="0 0 11 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 5.65612V4.30388L8.41874 4.31842L5.05997 0.95965L5.99054 0L10.9923 4.97273L6.00508 9.96L5.07451 9.00035L8.43328 5.64158L0 5.65612Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>

          <div className="mt-20 sm:mt-32">
            <p className="font-light text-lg sm:text-2xl sm:w-[37.33%] leading-[1.5rem]">
              We help experience-driven companies thrive by making their
              audience feel the refined intricacies of their brand and product
              in the digital space. Unforgettable journeys start with a click.
            </p>
            <div className="flex justify-between items-center mt-5 sm:mt-20">
              <a
                className="border-b sm:text-lg border-white inline-block"
                href="#"
              >
                {" "}
                The Studio{" "}
              </a>

              <div className="flex gap-32 max-sm:hidden">
                <div className="space-y-3">
                  {["Work", "Studio", "News", "Contact"].map((item) => {
                    return (
                      <a
                        key={item}
                        className="block text-sm opacity-85 capitalize"
                        href="#"
                      >
                        {item}
                      </a>
                    );
                  })}
                </div>
                <div className="space-y-3">
                  {["hello@exoape.com", "+31 772 086 200"].map((item) => {
                    return (
                      <a
                        key={item}
                        className="block text-sm opacity-85 "
                        href="#"
                      >
                        {item}
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Hero;
