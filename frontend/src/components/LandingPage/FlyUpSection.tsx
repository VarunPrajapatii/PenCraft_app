import  { useRef, Children, isValidElement, cloneElement } from "react";
import type { ReactNode } from "react";
import { useInView } from "motion/react";

interface FlyUpSectionProps {
  children: ReactNode;
  containerHeight?: string;   // e.g. "h-screen", "h-[150vh]"
  triggerThreshold?: number;  // fraction (0-1)
  className?: string; // additional classes for the container
}

export const FlyUpSection: React.FC<FlyUpSectionProps> = ({
  children,
  containerHeight = "h-screen",
  triggerThreshold = 0.5,
  className = "",
}) => {
  /**
    Framer Motion creates an Intersection Observer tied to your `ref`.
    It monitors whether the specified percentage (amount) of the element is visible within the viewport.
    When the condition is met:
      isInView becomes true.
      If once is true, the observer disconnects — no further updates.
      Otherwise, isInView toggles based on scroll position.
   */
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    amount: triggerThreshold,
  });

  return (
    <div
      ref={ref}
      className={`relative w-full overflow-hidden ${className} ${containerHeight}`}
    >
      {/* Pass isInView to each child */}
      {Children.map(children, (child) =>
        isValidElement(child)
          ? cloneElement(child as React.ReactElement<{ isInView?: boolean }>, { isInView })
          : child
      )}
    </div>
  );
};
