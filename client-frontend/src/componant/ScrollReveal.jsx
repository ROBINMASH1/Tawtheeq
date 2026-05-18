/**
 * ScrollReveal — A declarative wrapper component for 3D scroll-reveal animations.
 * Wraps any children in a motion.div with the 3D flip-and-scale effect.
 *
 * Props:
 *   direction  — 'left' | 'right' | 'bottom' | 'top'
 *   delay      — animation delay in seconds
 *   duration   — animation duration in seconds
 *   className  — passed through to the motion.div
 *   style      — passed through to the motion.div
 */
import { motion } from 'framer-motion';
import { useScrollReveal } from './useScrollReveal';

export default function ScrollReveal({
  children,
  direction = 'bottom',
  delay = 0,
  duration = 0.7,
  y = 50,
  className = '',
  style = {},
}) {
  const { ref, animate, initial, transition } = useScrollReveal({
    direction,
    delay,
    duration,
    y,
  });

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={animate}
      transition={transition}
      className={className}
      style={{ perspective: 800, ...style }}
    >
      {children}
    </motion.div>
  );
}
