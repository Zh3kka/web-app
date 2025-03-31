import { useRef, useState } from "react";
import { useWebcamDevices } from "@hooks/useWebcamDevices";
import { WebcamService } from "@services/webcamService";
import { WebcamControls, WebcamState } from "@/types/webcam";

export const useWebcam = (): WebcamControls & WebcamState => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const {
    devices,
    selectedDevice,
    setSelectedDevice,
    error: devicesError,
  } = useWebcamDevices();

  const startStream = async () => {
    try {
      setStreamError(null);

      if (!selectedDevice) {
        setStreamError("Не выбрана камера");
        return;
      }

      const stream = await WebcamService.getStream(selectedDevice);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current
              .play()
              .then(() => setIsStreaming(true))
              .catch(() => setStreamError("Ошибка при запуске видео"));
          }
        };
      }
    } catch (err) {
      setStreamError(
        "Ошибка при запуске трансляции. Убедитесь, что камера подключена и доступна."
      );
    }
  };

  const stopStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      WebcamService.stopStream(stream);
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  };

  const toggleStream = async () => {
    if (isStreaming) {
      stopStream();
    } else {
      startStream();
    }
  };

  const handleDeviceChange = (deviceId: string) => {
    setSelectedDevice(deviceId);

    if (isStreaming) {
      stopStream();
      setTimeout(() => {
        startStream();
      }, 300);
    }
  };

  return {
    videoRef,
    isStreaming,
    streamError: streamError || devicesError,
    devices,
    selectedDevice,
    startStream,
    stopStream,
    toggleStream,
    handleDeviceChange,
  };
};
