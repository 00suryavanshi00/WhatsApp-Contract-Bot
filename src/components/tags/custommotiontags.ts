import { HTMLMotionProps, motion } from "framer-motion";
type ExtendedMotionDivProps = HTMLMotionProps<"div"> & {
  className?: string;
};

type ExtendedMotionH1Props = HTMLMotionProps<"h1"> & {
  className?: string;
};

type ExtendedMotionSectionProps = HTMLMotionProps<"section"> & {
    className?: string;
  };

export const ExtendedMotionDiv = motion.div as React.FC<ExtendedMotionDivProps>;
export const ExtendedMotionh1 = motion.h1 as React.FC<ExtendedMotionH1Props>;
export const ExtendedMotionSection = motion.section as React.FC<ExtendedMotionSectionProps>;

