export const CARD_SIZES = {
  sm: 'w-48 h-75',   // 48x75 (era 40x64)
  md: 'w-64 h-96',   // 64x96 (era 48x75)
  lg: 'w-80 h-125',  // 80x125 (nuovo)
} as const;

export type CardSize = keyof typeof CARD_SIZES;