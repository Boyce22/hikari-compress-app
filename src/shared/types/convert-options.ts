export interface ConvertOptions {
  /** Caminho absoluto do arquivo de entrada */
  inputPath: string;

  /** Caminho absoluto do arquivo de saída (ex: /tmp/output.mp4) */
  outputPath: string;

  /** Codec de vídeo, ex: 'libx264', 'libx265', 'hevc_nvenc', 'libaom-av1' */
  codec: string;

  /** CRF (Constant Rate Factor): qualidade — menor = melhor qualidade (ex: 18–28) */
  quality: number;

  /** Preset de codificação: ex: 'ultrafast', 'fast', 'medium', 'slow', 'veryslow' */
  preset?: string;

  /** Flag para manter o áudio original */
  keepAudio?: boolean;

  /** Flag para manter legendas embutidas */
  keepSubtitles?: boolean;

  /** Ativar aceleração de hardware (NVENC, VAAPI, QSV, etc) */
  hardwareAcceleration?: boolean;

  /** Codec de áudio (ex: 'aac', 'mp3', 'copy'), se `keepAudio` for true */
  audioCodec?: string;

  /** Bitrate de áudio opcional (ex: '128k', '192k') */
  audioBitrate?: string;

  /** Resolução de saída (ex: '1920x1080', '1280x720') */
  resolution?: string;

  /** FPS de saída (ex: 30, 60) */
  fps?: number;
}
