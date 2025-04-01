import { useEffect, useRef, useCallback, useState } from "react";
import { createWebSocketService } from "../services/websocket";
import { WebSocketMessage } from "../types/websocket";

interface UseWebSocketProps {
  url: string;
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  sendSignal: (signal: string, deviceId: string) => void;
  sendConnect: (deviceId: string, deviceName: string) => void;
  sendDisconnect: (deviceId: string) => void;
}

export const useWebSocket = ({
  url,
  onMessage,
  onConnect,
  onDisconnect,
  onError,
}: UseWebSocketProps): UseWebSocketReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const wsService = useRef(createWebSocketService(url));

  useEffect(() => {
    const service = wsService.current;

    if (onMessage) {
      service.on("signal", onMessage);
    }

    service.on("connect", () => {
      setIsConnected(true);
      onConnect?.();
    });

    service.on("disconnect", () => {
      setIsConnected(false);
      onDisconnect?.();
    });

    service.connect();

    return () => {
      if (onMessage) {
        service.off("signal", onMessage);
      }
      service.disconnect();
    };
  }, [url, onMessage, onConnect, onDisconnect]);

  const sendSignal = useCallback((signal: string, deviceId: string) => {
    wsService.current.sendSignal(signal, deviceId);
  }, []);

  const sendConnect = useCallback((deviceId: string, deviceName: string) => {
    wsService.current.sendConnect(deviceId, deviceName);
  }, []);

  const sendDisconnect = useCallback((deviceId: string) => {
    wsService.current.sendDisconnect(deviceId);
  }, []);

  return {
    isConnected,
    sendSignal,
    sendConnect,
    sendDisconnect,
  };
};
