'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

interface UseFFmpegReturn {
  isReady: boolean;
  isLoading: boolean;
  isProcessing: boolean;
  progress: number;
  videoUrl: string | null;
  error: string | null;
  processVideo: (videoFile: File, audioFile: File) => Promise<void>;
  reset: () => void;
}

const LOAD_TIMEOUT_MS = 60000;

export function useFFmpeg(): UseFFmpegReturn {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const ffmpegRef = useRef<FFmpeg | null>(null);
  const loadedRef = useRef(false);

  const loadFFmpeg = useCallback(async () => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    try {
      const ffmpeg = new FFmpeg();
      ffmpegRef.current = ffmpeg;

      const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/umd';

      const loadPromise = ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('LOAD_TIMEOUT')), LOAD_TIMEOUT_MS);
      });

      await Promise.race([loadPromise, timeoutPromise]);

      setIsReady(true);
      setIsLoading(false);
    } catch (err) {
      if (err instanceof Error && err.message === 'LOAD_TIMEOUT') {
        setError('FFmpeg loading timed out. Please check your connection and refresh the page.');
      } else {
        setError('Failed to load FFmpeg. Please refresh the page and try again.');
      }
      setIsLoading(false);
      loadedRef.current = false;
    }
  }, []);

  useEffect(() => {
    loadFFmpeg();
  }, [loadFFmpeg]);

  const processVideo = useCallback(async (videoFile: File, audioFile: File) => {
    if (!ffmpegRef.current) {
      setError('FFmpeg is not ready yet. Please wait.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProgress(0);

    const audioExt = audioFile.name.split('.').pop() || 'mp3';
    const audioFileName = `audio.${audioExt}`;

    try {
      try { await ffmpegRef.current.deleteFile('video.mp4'); } catch {}
      try { await ffmpegRef.current.deleteFile(audioFileName); } catch {}
      try { await ffmpegRef.current.deleteFile('output.mp4'); } catch {}

      await ffmpegRef.current.writeFile('video.mp4', await fetchFile(videoFile));
      await ffmpegRef.current.writeFile(audioFileName, await fetchFile(audioFile));

      ffmpegRef.current.on('progress', ({ progress: ratio }) => {
        setProgress(Math.round(ratio * 100));
      });

      await ffmpegRef.current.exec([
        '-stream_loop', '-1',
        '-i', 'video.mp4',
        '-i', audioFileName,
        '-c:v', 'copy',
        '-c:a', 'aac',
        '-map', '0:v:0',
        '-map', '1:a:0',
        '-shortest',
        'output.mp4',
      ]);

      setProgress(100);

      const data = await ffmpegRef.current.readFile('output.mp4');
      const blob = new Blob([data as unknown as BlobPart], { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.toLowerCase().includes('memory') || message.toLowerCase().includes('oom')) {
        setError('Processing failed. The files may be too large for your browser\'s memory. Try a shorter audio file.');
      } else {
        setError(`Processing failed: ${message}`);
      }
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const reset = useCallback(() => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoUrl(null);
    setError(null);
    setProgress(0);
  }, [videoUrl]);

  return {
    isReady,
    isLoading,
    isProcessing,
    progress,
    videoUrl,
    error,
    processVideo,
    reset,
  };
}

export type { UseFFmpegReturn };
