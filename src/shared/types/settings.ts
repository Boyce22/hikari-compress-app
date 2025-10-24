import { BackgroundImage } from './background-image';

export interface Settings {
  id: string;
  codec: string;
  quality: string;
  preset: string;
  resolution: string;
  fps: number;
  ram: number;
  keepSubtitles: number;
  keepAudio: number;
  audioCodec: string;
  audioBitrate: string;
  hardwareAcceleration: number;
  outputPath: string;
  backgroundImage: BackgroundImage | null;
}

export interface SettingsData extends Partial<Omit<Settings, 'backgroundImage'>> {
  backgroundId?: string | null;
}

export interface SettingsUpdateData {
  data: SettingsData;
  id?: string;
}

export const convertRawToSettingsObject = (raw: Record<string, any>): Settings => {
  return {
    id: raw['id'],
    codec: raw['codec'],
    quality: raw['quality'],
    preset: raw['preset'],
    resolution: raw['resolution'],
    fps: Number(raw['fps']),
    ram: Number(raw['ram']),
    keepSubtitles: Number(raw['keep_subtitles']),
    keepAudio: Number(raw['keep_audio']),
    audioCodec: raw['audio_codec'],
    audioBitrate: raw['audio_bitrate'],
    hardwareAcceleration: Number(raw['hardware_acceleration']),
    outputPath: raw['output_path'],
    backgroundImage: raw['background'] ? (JSON.parse(raw['background']) as BackgroundImage) : null,
  };
};
