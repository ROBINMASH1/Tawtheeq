/**
 * useScrollReveal — A custom Framer Motion hook for 3D flip-and-scale
 * scroll-driven animations with bi-directional triggering.
 *
 * When an element enters the viewport (scrolling DOWN):
 *   → rotates on X/Y axis (10-15°), scales 0.85→1, fades in
 * When it leaves (scrolling UP):
 *   → smoothly reverses so the animation can re-trigger
 */
import { useRef } from 'react';
import { useInView } from 'framer-motion';

/**
 * Returns { ref, variants, animate, initial } to spread onto a <motion.div>.
 *
 * @param {Object} opts
 * @param {'left'|'right'|'bottom'|'top'} opts.direction  — tilt origin
 * @param {number} opts.rotateAmount — degrees (default 12)
 * @param {number} opts.delay       — stagger delay in seconds
 * @param {number} opts.duration    — animation duration in seconds
 * @param {number} opts.y           — vertical offset in px
 */
export function useScrollReveal({
  direction = 'bottom',
  rotateAmount = 12,
  delay = 0,
  duration = 0.7,
  y = 50,
} = {}) {
  const ref = useRef(null);
  // amount: fraction visible before triggering; once: false ⇒ re-triggers
  const isInView = useInView(ref, { amount: 0.15, once: false });

  // Build rotation axis based on direction
  const rotation = {
    left:   { rotateY: rotateAmount },
    right:  { rotateY: -rotateAmount },
    bottom: { rotateX: -rotateAmount },
    top:    { rotateX: rotateAmount },
  }[direction] ?? { rotateX: -rotateAmount };

  const hiddenState = {
    opacity: 0,
    scale: 0.85,
    y,
    ...rotation,
    filter: 'blur(6px)',
  };

  const visibleState = {
    opacity: 1,
    scale: 1,
    y: 0,
    rotateX: 0,
    rotateY: 0,
    filter: 'blur(0px)',
  };

  return {
    ref,
    animate: isInView ? visibleState : hiddenState,
    initial: hiddenState,
    transition: {
      duration,
      delay,
      ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuad
    },
  };
}

/**
 * Convenience: returns props for a staggered list of children.
 * Use on each child with an incrementing `index`.
 */
export function useStaggerReveal({ index = 0, direction = 'bottom', baseDelay = 0 } = {}) {
  return useScrollReveal({
    direction,
    delay: baseDelay + index * 0.1,
    y: 40,
  });
}
