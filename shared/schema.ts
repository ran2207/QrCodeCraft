import { pgTable, text, integer, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const qrCodes = pgTable("qr_codes", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  contentType: text("content_type").notNull(),
  size: integer("size").notNull(),
  errorCorrection: text("error_correction").notNull(),
  style: text("style").notNull(),
});

export const insertQrCodeSchema = createInsertSchema(qrCodes)
  .pick({
    content: true,
    contentType: true,
    size: true,
    errorCorrection: true,
    style: true,
  })
  .extend({
    content: z.string().min(1, "Content is required"),
    contentType: z.enum(["text", "url", "email", "tel", "sms", "wifi"]),
    size: z.number().min(128).max(512),
    errorCorrection: z.enum(["L", "M", "Q", "H"]),
    style: z.enum(["squares", "dots"]),
  });

export type InsertQrCode = z.infer<typeof insertQrCodeSchema>;
export type QrCode = typeof qrCodes.$inferSelect;