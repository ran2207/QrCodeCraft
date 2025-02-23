import { qrCodes, type QrCode, type InsertQrCode } from "@shared/schema";

export interface IStorage {
  createQrCode(qrCode: InsertQrCode): Promise<QrCode>;
  getQrCode(id: number): Promise<QrCode | undefined>;
}

export class MemStorage implements IStorage {
  private qrCodes: Map<number, QrCode>;
  private currentId: number;

  constructor() {
    this.qrCodes = new Map();
    this.currentId = 1;
  }

  async createQrCode(insertQrCode: InsertQrCode): Promise<QrCode> {
    const id = this.currentId++;
    const qrCode: QrCode = { ...insertQrCode, id };
    this.qrCodes.set(id, qrCode);
    return qrCode;
  }

  async getQrCode(id: number): Promise<QrCode | undefined> {
    return this.qrCodes.get(id);
  }
}

export const storage = new MemStorage();
