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

export const QR_CONTENT_TYPES = [
  { value: "text", label: "Plain Text" },
  { value: "url", label: "Website URL" },
  { value: "email", label: "Email Address" },
  { value: "tel", label: "Phone Number" },
  { value: "sms", label: "SMS" },
  { value: "wifi", label: "WiFi Network" },
] as const;

export const STYLE_OPTIONS = [
  { value: "squares", label: "Squares" },
  { value: "dots", label: "Dots" },
] as const;