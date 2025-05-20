import { execFile } from 'child_process';
import ffprobePath from 'ffprobe-static';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

export async function getVideoMetadata(videoPath: string): Promise<any> {
  const { stdout } = await execFileAsync(ffprobePath.path, [
    '-v',
    'quiet',
    '-print_format',
    'json',
    '-show_streams',
    videoPath,
  ]);

  return JSON.parse(stdout);
}

export type TQuality = 'SD' | 'HD' | 'FULLHD' | 'UHD' | 'UNKNOWN';
export async function getVideoQuality(filePath: string): Promise<TQuality> {
  const metadata = await getVideoMetadata(filePath);
  const stream = metadata.streams.find((s: any) => s.width && s.height);

  if (!stream) return 'UNKNOWN';
  const { width, height } = stream;

  if (width >= 3840 || height >= 2160) return 'UHD';
  if (width >= 1920 || height >= 1080) return 'FULLHD';
  if (width >= 1280 || height >= 720) return 'HD';
  if (width >= 640 || height >= 480) return 'SD';

  return 'UNKNOWN';
}

export async function getVideoLanguage(filePath: string): Promise<string> {
  const metadata = await getVideoMetadata(filePath);
  const audioStream = metadata.streams.find(
    (s: any) => s.codec_type === 'audio',
  );
  return audioStream?.tags?.language || 'uz';
}
