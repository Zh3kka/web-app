export interface MediaDeviceInfo {
  deviceId: string;
  label: string;
}

export interface WebcamState {
  isStreaming: boolean;
  streamError: string | null;
  devices: MediaDeviceInfo[];
  selectedDevice: string | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export interface WebcamControls {
  startStream: () => Promise<void>;
  stopStream: () => void;
  toggleStream: () => Promise<void>;
  handleDeviceChange: (deviceId: string) => void;
}
