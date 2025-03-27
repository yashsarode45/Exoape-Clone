import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap/all";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const useLenisGsap = (containerRef: React.RefObject<HTMLDivElement>) => {
  const lenisRef = useRef<Lenis>();

  useEffect(() => {
    if (!containerRef.current) return;

    lenisRef.current = new Lenis({
      wrapper: containerRef.current,
      content: containerRef.current?.firstChild as HTMLDivElement,
    });

    const update = (time: number) => {
      lenisRef.current?.raf(time * 1000);
    };

    // Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
    lenisRef.current?.on("scroll", ScrollTrigger.update);
    const rafId = requestAnimationFrame(update);

    // Attach GSAP ticker
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenisRef.current?.destroy();
      cancelAnimationFrame(rafId);
      gsap.ticker.remove(update);
    };
  }, [containerRef]);

  return lenisRef;
};
