import { useState, useEffect } from "react";
import { MediaDeviceInfo } from "@/types/webcam";
import { WebcamService } from "@services/webcamService";

export const useWebcamDevices = () => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getDevices = async () => {
      try {
        const videoDevices = await WebcamService.getDevices();

        if (videoDevices.length === 0) {
          setError("Камеры не найдены");
          return;
        }

        setDevices(videoDevices);
        if (!selectedDevice && videoDevices.length > 0) {
          setSelectedDevice(videoDevices[0].deviceId);
        }
      } catch (err) {
        setError("Ошибка при получении списка камер");
      }
    };

    getDevices();
  }, [selectedDevice]);

  return { devices, selectedDevice, setSelectedDevice, error };
};
