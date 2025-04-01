import { createServer } from "http";
import { WebSocketServer } from "ws";

const server = createServer();
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Новое подключение");

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log("Получено сообщение:", data);
    } catch (error) {
      console.error("Ошибка при обработке сообщения:", error);
    }
  });

  ws.on("close", () => {
    console.log("Клиент отключился");
  });
});

const PORT = process.env.WS_PORT || 3001;
server.listen(PORT, () => {
  console.log(`WebSocket сервер запущен на порту ${PORT}`);
});
