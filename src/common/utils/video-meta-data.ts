import Ffmpeg from 'fluent-ffmpeg';

export function getVideoQuality(
  filePath: string,
): Promise<'SD' | 'HD' | 'FULLHD' | 'UHD' | 'UNKNOWN'> {
  return new Promise((resolve, reject) => {
    Ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return reject(err);

      const stream = metadata.streams.find((s) => s.width && s.height);

      if (!stream || !stream.width || !stream.height) {
        return resolve('UNKNOWN');
      }

      const { width, height } = stream;

      if (width >= 3840 || height >= 2160) return resolve('UHD'); // 4K
      if (width >= 1920 || height >= 1080) return resolve('FULLHD'); // 1080p
      if (width >= 1280 || height >= 720) return resolve('HD'); // 720p
      if (width >= 640 || height >= 480) return resolve('SD'); // 480p

      return resolve('UNKNOWN');
    });
  });
}
