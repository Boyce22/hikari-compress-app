import { BackgroundImage } from "./background-image";

export type Settings = {
  codec: string;
  quality: string;
  preset: string;
  resolution: string;
  fps: number;
  ram: number;
  keepSubtitles: boolean;
  keepAudio: boolean;
  audioCodec: string;
  audioBitrate: string;
  hardwareAcceleration: boolean;
  outputPath: string;
  backgroundImage: BackgroundImage | null;
}