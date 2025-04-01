import { WebSocket, Server } from "ws";
import { WebSocketMessage } from "../types/websocket";
import { ConnectedClient, WebSocketServer } from "./types";

export class WebSocketServerImpl implements WebSocketServer {
  public clients: Map<string, ConnectedClient> = new Map();

  constructor(private wss: Server) {
    this.setupServer();
  }

  private setupServer() {
    this.wss.on("connection", this.handleConnection.bind(this));
  }

  public handleConnection(ws: WebSocket) {
    console.log("Новое подключение");

    ws.on("message", (data: string) => {
      try {
        const message: WebSocketMessage = JSON.parse(data.toString());
        this.handleMessage(ws, message);
      } catch (error) {
        console.error("Ошибка при обработке сообщения:", error);
      }
    });

    ws.on("close", () => {
      this.handleDisconnect(ws);
    });

    ws.on("error", (error) => {
      console.error("WebSocket ошибка:", error);
      this.handleDisconnect(ws);
    });
  }

  public handleMessage(ws: WebSocket, message: WebSocketMessage) {
    switch (message.type) {
      case "connect":
        const client: ConnectedClient = {
          ws,
          deviceId: message.data.deviceId,
          deviceName: message.data.deviceName,
        };
        this.clients.set(message.data.deviceId, client);
        console.log(`Устройство подключилось: ${message.data.deviceId}`);
        break;

      case "signal":
        // Пересылаем сигнал всем подключенным клиентам
        this.broadcast(message);
        break;

      case "disconnect":
        this.handleDisconnect(ws);
        break;
    }
  }

  public handleDisconnect(ws: WebSocket) {
    const client = Array.from(this.clients.values()).find((c) => c.ws === ws);
    if (client) {
      this.clients.delete(client.deviceId);
      console.log(`Устройство отключилось: ${client.deviceId}`);
    }
  }

  public broadcast(message: WebSocketMessage) {
    const messageStr = JSON.stringify(message);
    this.clients.forEach((client) => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(messageStr);
      }
    });
  }

  public sendToClient(deviceId: string, message: WebSocketMessage) {
    const client = this.clients.get(deviceId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
    }
  }
}
