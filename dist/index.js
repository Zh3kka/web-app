import { createServer } from "http";
import { WebSocketManager } from "./websocket.js";
const server = createServer();
const wsManager = new WebSocketManager(server);
const PORT = process.env.WS_PORT || 3001;
server.listen(PORT, () => {
    console.log(`WebSocket сервер запущен на порту ${PORT}`);
});
