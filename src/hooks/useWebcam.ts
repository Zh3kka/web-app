import { useRef, useState, useEffect } from "react";
import { WebcamControls, MediaDevice, WebcamConstraints } from "@/types/webcam";

export const useWebcam = (
  constraints: WebcamConstraints = { video: { facingMode: "environment" } }
): WebcamControls => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [devices, setDevices] = useState<MediaDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [currentStream, setCurrentStream] = useState<MediaStream | null>(null);

  // Получение списка доступных устройств
  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        setDevices(videoDevices);

        if (videoDevices.length > 0 && !selectedDevice) {
          setSelectedDevice(videoDevices[0].deviceId);
        }
      } catch (error) {
        setStreamError("Ошибка при получении списка устройств");
      }
    };

    getDevices();
  }, []);

  // Обработка изменения выбранного устройства
  const handleDeviceChange = (deviceId: string) => {
    setSelectedDevice(deviceId);
    if (isStreaming) {
      stopStream();
      setTimeout(() => {
        startStream();
      }, 300);
    }
  };

  // Запуск трансляции
  const startStream = async () => {
    try {
      setStreamError(null);

      if (!selectedDevice) {
        setStreamError("Не выбрана камера");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        ...constraints,
        video: {
          ...constraints.video,
          deviceId: { exact: selectedDevice },
        },
      });

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

      setCurrentStream(stream);
    } catch (error) {
      setStreamError(
        "Ошибка при запуске трансляции. Убедитесь, что камера подключена и доступна."
      );
    }
  };

  // Остановка трансляции
  const stopStream = () => {
    if (currentStream) {
      currentStream.getTracks().forEach((track) => track.stop());
      setCurrentStream(null);
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsStreaming(false);
  };

  // Переключение трансляции
  const toggleStream = async () => {
    if (isStreaming) {
      stopStream();
    } else {
      await startStream();
    }
  };

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      stopStream();
    };
  }, []);

  return {
    videoRef,
    isStreaming,
    streamError,
    devices,
    selectedDevice,
    toggleStream,
    handleDeviceChange,
  };
};
