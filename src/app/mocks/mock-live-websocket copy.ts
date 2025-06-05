import { LiveInspectionView } from "@/app/types/live";

type MessageHandler = (event: MessageEvent) => void;

export class MockLiveWebSocket {
  readyState: number = WebSocket.CONNECTING;
  onopen: (() => void) | null = null;
  onerror: ((error: any) => void) | null = null;
  onclose: (() => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;

  private intervalId: NodeJS.Timeout | null = null;
  private currentCamera: string | null = null;

  constructor() {
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
      const data: LiveInspectionView = {
        liveStream: '/videos/2025-01-24_16-51-55.mp4',
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
}
