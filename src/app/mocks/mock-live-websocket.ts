import { LiveInspection } from "@/app/types/live";

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
      const statusColorDetection = Math.random() > 0.5 ? "OK" : "NG";
      const statusTypeClassification = Math.random() > 0.5 ? "OK" : "NG";
      const statusComponentDetection = Math.random() > 0.5 ? "OK" : "NG";
      const statusObjectCounting = Math.random() > 0.5 ? "OK" : "NG";
      const statusBarcodeReading = Math.random() > 0.5 ? "OK" : "NG";
      const status = (statusColorDetection === "OK" &&
        statusTypeClassification === "OK" && 
        statusComponentDetection === "OK" && 
        statusObjectCounting === "OK" && 
        statusBarcodeReading === "OK") ? "OK" : "NG";

      const data: LiveInspection = {
        liveStream: "",
        cameraId: this.currentCamera ?? "",
        cameraName: `Mock Camera ${this.currentCamera}`,
        location: `Zone ${this.currentCamera}`,
        status: status,
        lotNo: `Lot-${Math.floor(Math.random() * 10)}`,
        totalNG: Math.floor(Math.random() * 10).toString(),
        totalProduct: Math.floor(Math.random() * 10000).toString(),
        actualProduct: Math.floor(Math.random() * 10000).toString(),
        currentInspection: {
          productId: `PID-${Math.floor(Math.random() * 10000)}`,
          productName: `Product ${Math.floor(Math.random() * 50)}`,
          serialNo: `SN-${Date.now()}`,
          productDateTime: new Date().toISOString(),
        },
        detectionInfo: [
          {
            function: "Color Detection",
            predicted: "Back Detected",
            expected: "Back",
            confident: Math.floor(Math.random() * 100),
            status: statusColorDetection,
          },
          {
            function: "Type Classification",
            predicted: "Circle Detected",
            expected: "Circle",
            confident: Math.floor(Math.random() * 100),
            status: statusTypeClassification,
          },
          {
            function: "Component Detection",
            predicted: "All Detected",
            expected: "All",
            confident: Math.floor(Math.random() * 100),
            status: statusComponentDetection,
          },
          {
            function: "Object Counting",
            predicted: "Circle Detected",
            expected: "Circle",
            // confident: Math.floor(Math.random() * 100),
            status: statusObjectCounting,
          },
          {
            function: "Barcode Reading",
            predicted: "Readable",
            expected: "Back",
            // confident: Math.floor(Math.random() * 100),
            status: statusBarcodeReading,
          },
        ]
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
