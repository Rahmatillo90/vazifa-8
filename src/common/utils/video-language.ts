import Ffmpeg from 'fluent-ffmpeg';

export function getVideoLanguage(videoPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    Ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) return reject(err);

      const audioStream = metadata.streams.find(
        (s) => s.codec_type === 'audio',
      );
      const lang = audioStream?.tags?.language || 'uz'; // default: 'uz'
      resolve(lang);
    });
  });
}
