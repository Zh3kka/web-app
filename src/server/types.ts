import { WebSocket } from "ws";
import { WebSocketMessage } from "../types/websocket";

export interface ConnectedClient {
  ws: WebSocket;
  deviceId: string;
  deviceName?: string;
}

export interface WebSocketServer {
  clients: Map<string, ConnectedClient>;
  broadcast: (message: WebSocketMessage) => void;
  sendToClient: (deviceId: string, message: WebSocketMessage) => void;
  handleConnection: (ws: WebSocket) => void;
  handleMessage: (ws: WebSocket, message: WebSocketMessage) => void;
  handleDisconnect: (ws: WebSocket) => void;
}
