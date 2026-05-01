'use client';

import { useState } from 'react';
import { Video, AudioLines, Loader2, AlertCircle, X } from 'lucide-react';
import Dropzone from '@/components/Dropzone';
import ProgressBar from '@/components/ProgressBar';
import DownloadCard from '@/components/DownloadCard';
import { useFFmpeg } from '@/hooks/useFFmpeg';

export default function Home() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const {
    isReady,
    isLoading,
    isProcessing,
    progress,
    videoUrl,
    error,
    processVideo,
    reset,
  } = useFFmpeg();

  const canProcess = videoFile !== null && audioFile !== null && isReady && !isProcessing;

  const handleGenerate = async () => {
    if (!videoFile || !audioFile) return;
    await processVideo(videoFile, audioFile);
  };

  const handleReset = () => {
    reset();
    setVideoFile(null);
    setAudioFile(null);
  };

  const dismissError = () => {
    reset();
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col items-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-3xl">
          {/* Header */}
          <header className="mb-10 text-center">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
              LoopCast
            </h1>
            <p className="mt-3 text-base text-[var(--text-secondary)]">
              Loop any video to the length of any audio. In your browser. Locally.
            </p>
          </header>

          {/* FFmpeg Loading Banner */}
          {isLoading && (
            <div className="mb-6 flex items-center justify-center gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
              <Loader2 className="h-5 w-5 animate-spin text-[var(--text-secondary)]" />
              <p className="text-sm text-[var(--text-secondary)]">
                Loading FFmpeg engine...
              </p>
            </div>
          )}

          {/* Main Content */}
          {!videoUrl && (
            <>
              {/* Dropzones */}
              <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                <Dropzone
                  label="Video File"
                  accept={{ 'video/*': ['.mp4', '.mov', '.avi', '.webm', '.mkv'] }}
                  file={videoFile}
                  onFileSelect={setVideoFile}
                  icon={<Video className="h-8 w-8" />}
                  disabled={isProcessing}
                />
                <Dropzone
                  label="Audio File"
                  accept={{ 'audio/*': ['.mp3', '.wav', '.m4a', '.ogg', '.flac', '.aac'] }}
                  file={audioFile}
                  onFileSelect={setAudioFile}
                  icon={<AudioLines className="h-8 w-8" />}
                  disabled={isProcessing}
                />
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={!canProcess}
                aria-label={!canProcess ? 'Upload both a video and audio file to enable processing' : 'Generate video'}
                className={`
                  mb-6 w-full rounded-lg px-6 py-3 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[var(--bg-base)]
                  ${canProcess
                    ? 'bg-white text-black hover:bg-[var(--accent)]'
                    : 'bg-white/10 text-[var(--text-muted)] cursor-not-allowed opacity-40'
                  }
                `}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  'Generate Video'
                )}
              </button>

              {/* Progress Bar */}
              {isProcessing && (
                <div className="mb-6">
                  <ProgressBar progress={progress} label="Processing video..." />
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div
                  className="mb-6 flex items-start gap-3 rounded-lg border border-[var(--error)]/30 bg-[var(--error)]/10 p-4"
                  role="alert"
                >
                  <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--error)]" />
                  <div className="flex-1">
                    <p className="text-sm text-[var(--error)]">{error}</p>
                  </div>
                  <button
                    onClick={dismissError}
                    className="flex-shrink-0 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    aria-label="Dismiss error"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}

          {/* Download Card */}
          {videoUrl && <DownloadCard videoUrl={videoUrl} onReset={handleReset} />}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-subtle)] px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-center text-xs text-[var(--text-muted)]">
          All processing happens locally in your browser. No files are uploaded anywhere.
        </p>
      </footer>
    </div>
  );
}
