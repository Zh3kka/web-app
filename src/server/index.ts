import { Server } from "ws";
import { WebSocketServerImpl } from "./websocket";

const PORT = process.env.WS_PORT || 8080;

const wss = new Server({ port: Number(PORT) });
const wsServer = new WebSocketServerImpl(wss);

console.log(`WebSocket сервер запущен на порту ${PORT}`);
