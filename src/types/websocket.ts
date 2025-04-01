export type WebSocketMessageType = "signal" | "connect" | "disconnect";

export interface WebSocketMessage {
  type: WebSocketMessageType;
  data: any;
}

export interface SignalMessage {
  type: "signal";
  data: {
    signal: string;
    deviceId: string;
    timestamp: number;
  };
}

export interface ConnectMessage {
  type: "connect";
  data: {
    deviceId: string;
    deviceName: string;
  };
}

export interface DisconnectMessage {
  type: "disconnect";
  data: {
    deviceId: string;
  };
}
