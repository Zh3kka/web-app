import { MediaDeviceInfo } from "@/types/webcam";

export class WebcamService {
  static async getDevices(): Promise<MediaDeviceInfo[]> {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter((device) => device.kind === "videoinput");
  }

  static async getStream(deviceId: string): Promise<MediaStream> {
    return navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: { exact: deviceId },
      },
    });
  }

  static stopStream(stream: MediaStream): void {
    stream.getTracks().forEach((track) => track.stop());
  }
}
