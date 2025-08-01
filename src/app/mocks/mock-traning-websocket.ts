export class MockTrainingWebSocket {
  readyState: number = WebSocket.CONNECTING;
  onopen: (() => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;

  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private modelversionId: number | null = null;

  constructor(modelversionId: number) {
    this.modelversionId = modelversionId;
  }

  connect(modelversionId: number) {
    this.modelversionId = modelversionId;
    setTimeout(() => {
      this.readyState = WebSocket.OPEN;
      this.onopen?.();
    }, 100);
  }

  send(data: string) {
    if (this.readyState !== WebSocket.OPEN) {
      this.onerror?.(new Event('Mock WebSocket not open'));
      return;
    }

    this.timeoutId = setTimeout(() => {
      const payload = JSON.parse(data);
      if (payload.action === 'start-training') {
        const mockResponse = { status: 'done' };
        this.onmessage?.({ data: JSON.stringify(mockResponse) } as MessageEvent);
      } else {
        this.onerror?.(new Event('Invalid action'));
      }
    }, 10000);
  }

  close() {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.readyState = WebSocket.CLOSED;
    const closeEvent = {
      type: 'close',
      code: 1000,
      reason: 'Normal Closure',
      wasClean: true,
    } as CloseEvent;
    this.onclose?.(closeEvent);
  }
}
