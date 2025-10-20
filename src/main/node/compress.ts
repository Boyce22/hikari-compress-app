import util from 'util';
import * as ChildProcess from 'child_process';
const exec = util.promisify(ChildProcess.exec);

import { ConvertOptions } from '@/shared/types/convert-options';

export const compress = async (options: ConvertOptions): Promise<{ size: number; outputPath: string }> => {
  try {
    console.log('Iniciando compressão', { options });

    const args: string[] = [];

    // Codec de vídeo e CRF
    args.push('-c:v', options.codec);

    if (options.quality) args.push('-crf', options.quality.toString());
    if (options.preset) args.push('-preset', options.preset);

    // Resolução e FPS
    if (options.resolution) args.push('-s', options.resolution);
    if (options.fps) args.push('-r', options.fps.toString());

    // Áudio
    if (options.keepAudio) {
      args.push('-c:a', options.audioCodec || 'copy');
      if (options.audioBitrate) args.push('-b:a', options.audioBitrate);
    } else {
      args.push('-an'); // remove áudio
    }

    // Legendas
    if (!options.keepSubtitles) {
      args.push('-sn'); // remove subtitles
    }

    // Hardware acceleration
    if (options.hardwareAcceleration) {
      args.unshift('-hwaccel', 'auto');
    }

    // Input e output
    args.unshift('-i', options.inputPath);
    args.push(options.outputPath);

    const command = `ffmpeg ${args.join(' ')}`;
    console.log('Executando comando:', command);

    await exec(command);

    // Retorna tamanho do arquivo gerado
    const { stdout } = await exec(`stat -c%s "${options.outputPath}"`);
    const size = parseInt(stdout.trim(), 10);

    return { size, outputPath: options.outputPath };
  } catch (error) {
    console.error('Não foi possível comprimir o arquivo', { options, error });
    throw error;
  }
};
