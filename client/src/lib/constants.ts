export const ERROR_CORRECTION_LEVELS = [
  { value: "L", label: "Low (7%)" },
  { value: "M", label: "Medium (15%)" },
  { value: "Q", label: "Quartile (25%)" },
  { value: "H", label: "High (30%)" },
] as const;

export const SIZE_OPTIONS = [
  { value: 128, label: "128px" },
  { value: 256, label: "256px" },
  { value: 384, label: "384px" },
  { value: 512, label: "512px" },
] as const;
