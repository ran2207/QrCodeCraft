export const ERROR_CORRECTION_LEVELS = [
  { value: "L", label: "L (Low)" },
  { value: "M", label: "M (Medium)" },
  { value: "Q", label: "Q (Quartile)" },
  { value: "H", label: "H (High)" },
] as const;

export const DOT_STYLES = [
  { value: "square", label: "Square" },
  { value: "dots", label: "Dots" },
  { value: "rounded", label: "Rounded" },
  { value: "extra-rounded", label: "Extra Rounded" },
  { value: "classy", label: "Classy" },
  { value: "classy-rounded", label: "Classy Rounded" },
] as const;

export const CORNER_SQUARE_STYLES = [
  { value: "none", label: "None" },
  { value: "square", label: "Square" },
  { value: "dot", label: "Dot" },
  { value: "extra-rounded", label: "Extra Rounded" },
] as const;

export const CORNER_DOT_STYLES = [
  { value: "none", label: "None" },
  { value: "square", label: "Square" },
  { value: "dot", label: "Dot" },
] as const;

export const QR_MODES = [
  { value: "Numeric", label: "Numeric" },
  { value: "Alphanumeric", label: "Alphanumeric" },
  { value: "Byte", label: "Byte" },
  { value: "Kanji", label: "Kanji" },
] as const;

export const GRADIENT_TYPES = [
  { value: "linear", label: "Linear" },
  { value: "radial", label: "Radial" },
] as const;

export const COLOR_TYPES = [
  { value: "single", label: "Single Color" },
  { value: "gradient", label: "Color Gradient" },
] as const;

export const FILE_EXTENSIONS = [
  { value: "png", label: "PNG" },
  { value: "jpeg", label: "JPEG" },
] as const;

export const WIDTH_OPTIONS = [
  { value: 300, label: "300px" },
  { value: 400, label: "400px" },
  { value: 500, label: "500px" },
  { value: 600, label: "600px" },
] as const;

export const MARGIN_OPTIONS = [
  { value: 0, label: "0px" },
  { value: 10, label: "10px" },
  { value: 20, label: "20px" },
  { value: 30, label: "30px" },
] as const;

export const DEFAULT_VALUES = {
  size: 300,
  margin: 0,
  rotation: 0,
  imageSize: 0.4,
  imageMargin: 0,
  typeNumber: 0,
} as const;

export const ACCEPTED_IMAGE_TYPES = {
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/svg+xml': ['.svg'],
} as const;

export const MAX_IMAGE_SIZE = 1024 * 1024; // 1MB

export const QR_CONTENT_TYPES = [
  { value: "text", label: "Plain Text" },
  { value: "url", label: "Website URL" },
  { value: "email", label: "Email Address" },
  { value: "tel", label: "Phone Number" },
  { value: "sms", label: "SMS" },
  { value: "wifi", label: "WiFi Network" },
] as const;

export const DEFAULT_COLORS = {
  fgColor: "#000000",
  bgColor: "#FFFFFF",
};