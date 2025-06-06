import { LiveInspectionView } from "@/app/types/live";
import fs from "fs";
import path from "path";

type MessageHandler = (event: MessageEvent) => void;

export class MockLiveWebSocket {
  readyState: number = WebSocket.CONNECTING;
  onopen: (() => void) | null = null;
  onerror: ((error: any) => void) | null = null;
  onclose: (() => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;

  private intervalId: NodeJS.Timeout | null = null;
  private currentCamera: string | null = null;

  constructor(cameraId?: string) {
    this.currentCamera = cameraId ?? null;

    setTimeout(() => {
      this.readyState = WebSocket.OPEN;
      if (this.onopen) this.onopen();
    }, 100);
  }

  connect() {
    this.readyState = WebSocket.OPEN;
    if (this.onopen) this.onopen();
  }

  send(data: string) {
    try {
      const payload = JSON.parse(data);
      if (payload?.action === "join") {
        this.currentCamera = payload.cameraId;
        this.startMockStream();
      } else if (payload?.action === "leave") {
        this.stopMockStream();
      }
    } catch (err) {
      console.error("Invalid message format", err);
    }
  }

  close() {
    this.stopMockStream();
    this.readyState = WebSocket.CLOSED;
    if (this.onclose) this.onclose();
  }

  startMockStream() {
    if (this.intervalId) clearInterval(this.intervalId);

    this.intervalId = setInterval(() => {
      const base64Image = this.generateMockBase64Image();

      const data: LiveInspectionView = {
        liveStream: "", // base64Image,
        cameraId: this.currentCamera ?? "",
        cameraName: `Mock Camera ${this.currentCamera}`,
        location: `Zone ${this.currentCamera}`,
        status: ["OK", "NG"][Math.floor(Math.random() * 2)],
        productId: `PID-${Math.floor(Math.random() * 10000)}`,
        productName: `Product ${Math.floor(Math.random() * 50)}`,
        productTypeId: "T1",
        productTypeName: "Mock Type",
        serialNo: `SN-${Date.now()}`,
        defectType: Math.random() > 0.5 ? "Scratch" : "None",
        productDateTime: new Date().toISOString(),
        lotNo: `Lot-${Math.floor(Math.random() * 10)}`,
        totalNG: Math.floor(Math.random() * 10).toString(),
        totalPlanning: "100",
        actualPlanning: Math.floor(Math.random() * 100).toString(),
      };

      if (this.onmessage) {
        this.onmessage(new MessageEvent("message", { data: JSON.stringify(data) }));
      }
    }, 1000);
  }

  stopMockStream() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  async generateMockBase64Image(): Promise<string> {
    try {
      const res = await fetch("/api/mock-frame", { cache: "no-store" });
      const json = await res.json();
      return json.dataUrl;
    } catch (error) {
      console.error("Error fetching image from API:", error);
      return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj+P///38ACfsD/QZBt0sAAAAASUVORK5CYII=";
    }
  }
  
}
