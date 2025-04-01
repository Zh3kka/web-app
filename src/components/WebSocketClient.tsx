"use client";

import React, { useEffect, useState } from "react";

interface WebSocketMessage {
  type: "video" | "status" | "error" | "info";
  data: any;
  timestamp: number;
}

export const WebSocketClient: React.FC = () => {
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const websocket = new WebSocket("ws://localhost:3001");

    websocket.onopen = () => {
      console.log("Подключено к WebSocket серверу");
    };

    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => [...prev, { ...message, timestamp: Date.now() }]);
    };

    websocket.onerror = (error) => {
      console.error("Ошибка WebSocket:", error);
    };

    websocket.onclose = () => {
      console.log("Отключено от WebSocket сервера");
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  const renderMessage = (message: WebSocketMessage) => {
    const time = new Date(message.timestamp).toLocaleTimeString();

    switch (message.type) {
      case "video":
        return (
          <div className="p-2 bg-blue-50 rounded">
            <p className="font-semibold text-blue-800">Видео данные</p>
            <p className="text-sm text-blue-600">
              Размер: {message.data.size} байт
            </p>
            <p className="text-xs text-gray-500">{time}</p>
          </div>
        );
      case "status":
        return (
          <div className="p-2 bg-green-50 rounded">
            <p className="font-semibold text-green-800">Статус</p>
            <p className="text-sm text-green-600">{message.data}</p>
            <p className="text-xs text-gray-500">{time}</p>
          </div>
        );
      case "error":
        return (
          <div className="p-2 bg-red-50 rounded">
            <p className="font-semibold text-red-800">Ошибка</p>
            <p className="text-sm text-red-600">{message.data}</p>
            <p className="text-xs text-gray-500">{time}</p>
          </div>
        );
      default:
        return (
          <div className="p-2 bg-gray-50 rounded">
            <p className="font-semibold">Информация</p>
            <p className="text-sm">{JSON.stringify(message.data)}</p>
            <p className="text-xs text-gray-500">{time}</p>
          </div>
        );
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Полученные сообщения:</h2>
      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index}>{renderMessage(message)}</div>
        ))}
      </div>
    </div>
  );
};
