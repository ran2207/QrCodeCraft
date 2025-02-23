import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertQrCodeSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/qr-codes", async (req, res) => {
    const result = insertQrCodeSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    const qrCode = await storage.createQrCode(result.data);
    res.json(qrCode);
  });

  app.get("/api/qr-codes/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const qrCode = await storage.getQrCode(id);
    if (!qrCode) {
      return res.status(404).json({ error: "QR code not found" });
    }

    res.json(qrCode);
  });

  const httpServer = createServer(app);
  return httpServer;
}
