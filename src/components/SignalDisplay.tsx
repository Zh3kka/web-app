import React, { useState, useEffect } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { WebSocketMessage } from "../types/websocket";

interface SignalDisplayProps {
  wsUrl: string;
}

interface Signal {
  signal: string;
  deviceId: string;
  timestamp: number;
}

export const SignalDisplay: React.FC<SignalDisplayProps> = ({ wsUrl }) => {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [connectedDevices, setConnectedDevices] = useState<Set<string>>(
    new Set()
  );

  const handleMessage = (message: WebSocketMessage) => {
    if (message.type === "signal") {
      setSignals((prev) => [...prev, message.data]);
    } else if (message.type === "connect") {
      setConnectedDevices((prev) => new Set([...prev, message.data.deviceId]));
    } else if (message.type === "disconnect") {
      setConnectedDevices((prev) => {
        const newSet = new Set(prev);
        newSet.delete(message.data.deviceId);
        return newSet;
      });
    }
  };

  const { isConnected } = useWebSocket({
    url: wsUrl,
    onMessage: handleMessage,
    onConnect: () => console.log("WebSocket подключен"),
    onDisconnect: () => console.log("WebSocket отключен"),
  });

  // Очистка старых сигналов каждые 5 минут
  useEffect(() => {
    const interval = setInterval(() => {
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
      setSignals((prev) =>
        prev.filter((signal) => signal.timestamp > fiveMinutesAgo)
      );
    }, 60000); // Проверка каждую минуту

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Статус подключения</h2>
        <div
          className={`inline-block px-3 py-1 rounded ${
            isConnected ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {isConnected ? "Подключено" : "Отключено"}
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Подключенные устройства</h2>
        <div className="grid grid-cols-2 gap-2">
          {Array.from(connectedDevices).map((deviceId) => (
            <div key={deviceId} className="bg-blue-100 p-2 rounded">
              {deviceId}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">Последние сигналы</h2>
        <div className="space-y-2">
          {signals
            .slice(-10)
            .reverse()
            .map((signal, index) => (
              <div key={index} className="bg-gray-100 p-2 rounded">
                <div className="font-semibold">
                  Устройство: {signal.deviceId}
                </div>
                <div>Сигнал: {signal.signal}</div>
                <div className="text-sm text-gray-500">
                  {new Date(signal.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
