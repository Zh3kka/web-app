import {
  WebSocketMessage,
  SignalMessage,
  ConnectMessage,
  DisconnectMessage,
} from "../types/websocket";

class WebSocketService {
  private ws: WebSocket | null = null;
  private messageHandlers: Map<
    string,
    ((message: WebSocketMessage) => void)[]
  > = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 3000;

  constructor(private url: string) {}

  connect() {
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log("WebSocket соединение установлено");
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error("Ошибка при обработке сообщения:", error);
        }
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket ошибка:", error);
        this.handleReconnect();
      };

      this.ws.onclose = () => {
        console.log("WebSocket соединение закрыто");
        this.handleReconnect();
      };
    } catch (error) {
      console.error("Ошибка при создании WebSocket:", error);
      this.handleReconnect();
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `Попытка переподключения ${this.reconnectAttempts}/${this.maxReconnectAttempts}`
      );
      setTimeout(() => this.connect(), this.reconnectTimeout);
    } else {
      console.error(
        "Превышено максимальное количество попыток переподключения"
      );
    }
  }

  private handleMessage(message: WebSocketMessage) {
    const handlers = this.messageHandlers.get(message.type) || [];
    handlers.forEach((handler) => handler(message));
  }

  on(type: string, handler: (message: WebSocketMessage) => void) {
    const handlers = this.messageHandlers.get(type) || [];
    handlers.push(handler);
    this.messageHandlers.set(type, handlers);
  }

  off(type: string, handler: (message: WebSocketMessage) => void) {
    const handlers = this.messageHandlers.get(type) || [];
    const index = handlers.indexOf(handler);
    if (index !== -1) {
      handlers.splice(index, 1);
    }
  }

  sendSignal(signal: string, deviceId: string) {
    const message: SignalMessage = {
      type: "signal",
      data: {
        signal,
        deviceId,
        timestamp: Date.now(),
      },
    };
    this.send(message);
  }

  sendConnect(deviceId: string, deviceName: string) {
    const message: ConnectMessage = {
      type: "connect",
      data: {
        deviceId,
        deviceName,
      },
    };
    this.send(message);
  }

  sendDisconnect(deviceId: string) {
    const message: DisconnectMessage = {
      type: "disconnect",
      data: {
        deviceId,
      },
    };
    this.send(message);
  }

  private send(message: WebSocketMessage) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error("WebSocket не подключен");
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const createWebSocketService = (url: string) =>
  new WebSocketService(url);
