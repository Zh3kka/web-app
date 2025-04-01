export interface MediaDevice {
  deviceId: string;
  label: string;
  kind: string;
}

export interface WebcamState {
  isStreaming: boolean;
  streamError: string | null;
  devices: MediaDeviceInfo[];
  selectedDevice: string | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export interface WebcamControls {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isStreaming: boolean;
  streamError: string | null;
  devices: MediaDevice[];
  selectedDevice: string | null;
  toggleStream: () => void;
  handleDeviceChange: (deviceId: string) => void;
}

export interface WebcamStream {
  stream: MediaStream | null;
  error: string | null;
  isLoading: boolean;
}

export interface WebcamConstraints {
  video: {
    facingMode?: "user" | "environment";
    width?: number | { ideal: number };
    height?: number | { ideal: number };
    frameRate?: number | { ideal: number };
  };
  audio?: boolean;
}
