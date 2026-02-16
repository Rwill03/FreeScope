/**
 * Framer Motion animation constants and utilities
 */

export const MOTION_CONFIG = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
} as const;

export const MOTION_FAST = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
} as const;

export const MOTION_LIST_ITEM = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: (index: number) => ({
    duration: 0.4,
    delay: 0.05 * index,
  }),
} as const;

export const MOTION_DELAYED = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay },
});
