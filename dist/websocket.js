import { WebSocketServer, WebSocket } from "ws";
export class WebSocketManager {
    wss;
    clients = new Set();
    constructor(server) {
        this.wss = new WebSocketServer({ server });
        this.initialize();
    }
    initialize() {
        this.wss.on("connection", (ws) => {
            this.clients.add(ws);
            ws.isAlive = true;
            ws.on("pong", () => {
                ws.isAlive = true;
            });
            ws.on("close", () => {
                this.clients.delete(ws);
            });
            ws.on("message", (message) => {
                try {
                    const data = JSON.parse(message.toString());
                    console.log("Получено сообщение:", data);
                    // Здесь можно добавить обработку сообщений
                }
                catch (error) {
                    console.error("Ошибка при обработке сообщения:", error);
                }
            });
        });
        // Проверка активности соединений
        setInterval(() => {
            this.wss.clients.forEach((ws) => {
                const client = ws;
                if (!client.isAlive) {
                    return client.terminate();
                }
                client.isAlive = false;
            });
        }, 30000);
    }
    broadcast(message) {
        this.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message));
            }
        });
    }
}
