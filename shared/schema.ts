import { pgTable, text, integer, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const qrCodes = pgTable("qr_codes", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  size: integer("size").notNull(),
  errorCorrection: text("error_correction").notNull(),
});

export const insertQrCodeSchema = createInsertSchema(qrCodes)
  .pick({
    content: true,
    size: true,
    errorCorrection: true,
  })
  .extend({
    content: z.string().min(1, "Content is required"),
    size: z.number().min(128).max(512),
    errorCorrection: z.enum(["L", "M", "Q", "H"]),
  });

export type InsertQrCode = z.infer<typeof insertQrCodeSchema>;
export type QrCode = typeof qrCodes.$inferSelect;
