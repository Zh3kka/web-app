import { useWebcam } from "@hooks/useWebcam";
import { LegacyRef } from "react";

export const Webcam = () => {
  const {
    videoRef,
    isStreaming,
    streamError,
    devices,
    selectedDevice,
    toggleStream,
    handleDeviceChange,
  } = useWebcam();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-slate-900">
          Трансляция с веб-камеры
        </h2>

        <div className="flex gap-4 mb-4">
          <select
            className="flex-1 p-2 border rounded-md"
            value={selectedDevice || ""}
            onChange={(e) => handleDeviceChange(e.target.value)}
            disabled={isStreaming}
          >
            {devices.map((device) => (
              <option
                key={device.deviceId}
                value={device.deviceId}
                className="text-slate-900"
              >
                {device.label || `Камера ${devices.indexOf(device) + 1}`}
              </option>
            ))}
          </select>

          <button
            className={`px-4 py-2 rounded-md ${
              isStreaming
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white transition-colors`}
            onClick={toggleStream}
          >
            {isStreaming ? "Остановить" : "Запустить"}
          </button>
        </div>

        {streamError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {streamError}
          </div>
        )}

        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
          <video
            ref={videoRef as LegacyRef<HTMLVideoElement>}
            autoPlay
            playsInline
            className="w-full h-full object-cover transform scale-x-[-1]"
            aria-label="Трансляция с веб-камеры"
          >
            <track kind="captions" />
          </video>
        </div>
      </div>
    </div>
  );
};
