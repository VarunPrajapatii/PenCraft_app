import React from "react";
import { motion } from "motion/react";

interface FlyUpImageProps {
  imageSrc: string;
  className?: string;        // Tailwind classes e.g. "w-32 h-auto"
  initialOffset?: string;    // e.g. "100%"
  finalOffset?: string;      // e.g. "10%"
  horizontalAlign?: string;  // e.g. "left-[20%]" or "center"
  transitionDuration?: number;
  isInView?: boolean;        // injected by FlyUpSection
}

export const FlyUpImage: React.FC<FlyUpImageProps> = ({
  imageSrc,
  className = "w-32 h-auto",
  initialOffset = "100%",
  finalOffset = "10%",
  horizontalAlign = "center",
  transitionDuration = 1,
  isInView = false,
}) => {
  // determine horizontal classes
  const horizontalClass =
    horizontalAlign === "center"
      ? "left-1/2 -translate-x-1/2"
      : horizontalAlign === "left"
      ? "left-0"
      : horizontalAlign === "right"
      ? "right-0"
      : horizontalAlign;

  return (
    <motion.img
      src={imageSrc}
      alt="Fly Up"
      className={`absolute bottom-0 z-0 ${className} ${horizontalClass}`}
      initial={{ y: initialOffset, opacity: 0 }}
      animate={{
        y: isInView ? finalOffset : initialOffset,
        opacity: isInView ? 1 : 0,
      }}
      transition={{ duration: transitionDuration, ease: "easeOut" }}
    />
  );
};
