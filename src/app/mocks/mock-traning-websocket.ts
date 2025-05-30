export class MockTrainingWebSocket {
  readyState: number = WebSocket.CONNECTING;
  onopen: (() => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;

  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  connect() {
    setTimeout(() => {
      this.readyState = WebSocket.OPEN;
      this.onopen?.();
    }, 100);
  }

  send(data: string) {
    this.timeoutId = setTimeout(() => {
      const payload = JSON.parse(data);
      if (payload.action === 'start-training' || payload.action === 'processing') {
        this.onmessage?.({
          data: JSON.stringify({ status: 'done' }),
        } as MessageEvent);
      } else {
        this.onerror?.(new Event('error'));
      }
    }, 15000);
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
