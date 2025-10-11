import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import { ConvertOptions } from '@/shared/types/ConvertOptions';

export const compress = (options: ConvertOptions): Promise<{ size: number; outputPath: string }> => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(options.inputPath)) {
      return reject(new Error('Arquivo de entrada não encontrado'));
    }

    let command = ffmpeg(options.inputPath)
      .outputOptions([`-vcodec ${options.codec}`, `-crf ${options.quality}`]);

    if (options.preset) {
      command = command.outputOptions([`-preset ${options.preset}`]);
    }

    if (options.hardwareAcceleration) {
      command = command.outputOptions([`-hwaccel ${options.hardwareAcceleration}`]);
    }
    command = command.output(options.outputPath);

    if (!options.keepAudio) {
      command = command.noAudio();
    }

    if (!options.keepSubtitles) {
      command = command.noSubtitle();
    }

    command
      .on('end', () => {
        const stats = fs.statSync(options.outputPath);
        resolve({ size: stats.size, outputPath: options.outputPath });
      })
      .on('error', (err) => {
        reject(err);
      })
      .run();
  });
};
