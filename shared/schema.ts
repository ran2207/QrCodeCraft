import { pgTable, text, integer, serial, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Type for gradient color stops
const colorStopSchema = z.object({
  offset: z.number().min(0).max(1),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format"),
});

// Type for gradient
const gradientSchema = z.object({
  type: z.enum(["linear", "radial"]),
  rotation: z.number().min(0).max(360),
  colorStops: z.array(colorStopSchema).min(2),
});

// Database table schema
export const qrCodes = pgTable("qr_codes", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  margin: integer("margin").notNull(),

  // Dots options
  dotStyle: text("dot_style").notNull(),
  dotColorType: text("dot_color_type").notNull(),
  dotColor: text("dot_color"),
  dotGradient: text("dot_gradient"),
  dotGradientRotation: integer("dot_gradient_rotation"),

  // Corner square options
  cornerSquareStyle: text("corner_square_style").notNull(),
  cornerSquareColorType: text("corner_square_color_type").notNull(),
  cornerSquareColor: text("corner_square_color"),
  cornerSquareGradient: text("corner_square_gradient"),

  // Corner dot options
  cornerDotStyle: text("corner_dot_style").notNull(),
  cornerDotColorType: text("corner_dot_color_type").notNull(),
  cornerDotColor: text("corner_dot_color"),
  cornerDotGradient: text("corner_dot_gradient"),

  // Background options
  backgroundColorType: text("background_color_type").notNull(),
  backgroundColor: text("background_color"),
  backgroundGradient: text("background_gradient"),

  // Image options
  imageUrl: text("image_url"),
  hideBackgroundDots: boolean("hide_background_dots"),
  imageSize: integer("image_size"),
  imageMargin: integer("image_margin"),

  // QR options
  qrMode: text("qr_mode").notNull(),
  errorCorrectionLevel: text("error_correction_level").notNull(),
  typeNumber: integer("type_number").notNull(),
});

export const insertQrCodeSchema = createInsertSchema(qrCodes)
  .extend({
    content: z.string().min(1, "Content is required"),
    width: z.number().min(128).max(1024),
    height: z.number().min(128).max(1024),
    margin: z.number().min(0).max(50),

    // Dots options
    dotStyle: z.enum(["square", "dots", "rounded", "extra-rounded", "classy", "classy-rounded"]),
    dotColorType: z.enum(["single", "gradient"]),
    dotColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format").optional(),
    dotGradient: gradientSchema.optional(),
    dotGradientRotation: z.number().min(0).max(360).optional(),

    // Corner square options
    cornerSquareStyle: z.enum(["none", "square", "dot", "extra-rounded"]),
    cornerSquareColorType: z.enum(["single", "gradient"]),
    cornerSquareColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format").optional(),
    cornerSquareGradient: gradientSchema.optional(),

    // Corner dot options
    cornerDotStyle: z.enum(["none", "square", "dot"]),
    cornerDotColorType: z.enum(["single", "gradient"]),
    cornerDotColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format").optional(),
    cornerDotGradient: gradientSchema.optional(),

    // Background options
    backgroundColorType: z.enum(["single", "gradient"]),
    backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format").optional(),
    backgroundGradient: gradientSchema.optional(),

    // Image options
    imageUrl: z.string().url().optional(),
    hideBackgroundDots: z.boolean().optional(),
    imageSize: z.number().min(0.1).max(1).optional(),
    imageMargin: z.number().min(0).max(50).optional(),

    // QR options
    qrMode: z.enum(["Numeric", "Alphanumeric", "Byte", "Kanji"]),
    errorCorrectionLevel: z.enum(["L", "M", "Q", "H"]),
    typeNumber: z.number().min(0).max(40),
  });

export type InsertQrCode = z.infer<typeof insertQrCodeSchema>;
export type QrCode = typeof qrCodes.$inferSelect;