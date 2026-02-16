/**
 * Color and design system constants
 * Centralized color palette and values for consistency
 */

export const COLORS = {
  // Backgrounds
  background: "hsl(40, 20%, 97%)",
  backgroundSubtle: "hsl(40, 15%, 95%)",
  card: "hsl(40, 20%, 98%)",

  // Text
  foreground: "hsl(0, 0%, 16%)",
  mutedForeground: "hsl(0, 0%, 42%)",

  // Borders and inputs
  border: "hsl(40, 15%, 90%)",
  borderSubtle: "hsl(40, 15%, 85%)",
  input: "hsl(40, 15%, 90%)",

  // Primary (dark)
  primary: "hsl(0, 0%, 12%)",
  primaryForeground: "hsl(0, 0%, 100%)",
  primaryHover: "hsl(0, 0%, 18%)",

  // Secondary (light)
  secondary: "hsl(40, 15%, 92%)",

  // Accent (orange)
  accent: "hsl(20, 80%, 92%)",
  accentVivid: "hsl(20, 70%, 55%)",
  accentText: "hsl(20, 70%, 45%)",

  // Status colors
  success: "hsl(142, 72%, 29%)",
  successBg: "hsl(142, 72%, 90%)",
  error: "hsl(0, 100%, 50%)",
  errorBg: "hsl(0, 100%, 92%)",
  warning: "hsl(38, 92%, 50%)",
  warningBg: "hsl(38, 92%, 92%)",

  // Scope colors
  scopeInScope: "hsl(142, 72%, 29%)",
  scopeInScopeBg: "hsl(142, 72%, 90%)",
  scopeOutOfScope: "hsl(38, 92%, 50%)",
  scopeOutOfScopeBg: "hsl(38, 92%, 92%)",
  scopePartial: "hsl(20, 70%, 55%)",
  scopePartialBg: "hsl(20, 80%, 92%)",
} as const;

export const SPACING = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "2.5rem",
  "3xl": "3rem",
} as const;

export const BORDER_RADIUS = {
  sm: "0.375rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
  "2xl": "1.25rem",
} as const;

export const TRANSITIONS = {
  fast: "150ms",
  default: "300ms",
  slow: "400ms",
  slower: "600ms",
} as const;
