import { useState, useEffect } from "react";
import { motion, useAnimationControls, useSpring } from "framer-motion";

const Cursor = ({
  cursorProps,
}: {
  cursorProps: { text: string; isVisible: boolean };
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const controls = useAnimationControls();
  const { text, isVisible } = cursorProps;

  // Spring configuration
  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };

  // Create spring-animated values
  const springX = useSpring(mousePosition.x, springConfig);
  const springY = useSpring(mousePosition.y, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
      // Update spring values
      springX.set(e.clientX);
      springY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [springX, springY]);

  useEffect(() => {
    controls.start({
      opacity: isVisible ? 1 : 0,
      transition: { duration: 0.3 },
    });
  }, [isVisible, controls]);

  return (
    <motion.div
      className="fixed pointer-events-none z-[500]"
      animate={controls}
      initial={{ opacity: 1 }}
      style={{
        left: springX,
        top: springY,
      }}
    >
      <div
        className="rounded-full flex items-center justify-center"
        style={{
          width: 100,
          height: 100,
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: `blur(10px)`,
          WebkitBackdropFilter: `blur(10px)`,
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <span className="text-white text-sm font-medium">{text}</span>
      </div>
    </motion.div>
  );
};

export default Cursor;
