'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Video, AudioLines, Loader2, AlertCircle, X,
  CheckCircle, Download, RotateCcw, Play, Lock,
} from 'lucide-react';
import AudioWaveform from '@/components/AudioWaveform';
import { useFFmpeg } from '@/hooks/useFFmpeg';

/* ── SVG Infinity / Loop icon ─────────────────────────────────── */
function LoopIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 24" fill="none" className={className}>
      <path
        d="M24 12
           C22 4 10 2 6 7
           C2 11 2 14 6 18
           C10 22 22 21 24 12
           C26 4 38 2 42 7
           C46 11 46 14 42 18
           C38 22 26 21 24 12"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Helpers ──────────────────────────────────────────────────── */
function fmt(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function Home() {
  const [videoFile, setVideoFile]     = useState<File | null>(null);
  const [audioFile, setAudioFile]     = useState<File | null>(null);
  const [videoSrc,  setVideoSrc]      = useState('');
  const [videoDur,  setVideoDur]      = useState(0);
  const [audioDur,  setAudioDur]      = useState(0);
  const prevVideoSrc = useRef('');

  const {
    isReady, isLoading, isProcessing, progress,
    videoUrl: outputUrl, error, processVideo, reset,
  } = useFFmpeg();

  const canProcess = !!(videoFile && audioFile && isReady && !isProcessing);
  const numLoops   = videoDur > 0 && audioDur > 0 ? Math.ceil(audioDur / videoDur) : 0;

  /* revoke previous preview URL */
  useEffect(() => {
    if (prevVideoSrc.current) URL.revokeObjectURL(prevVideoSrc.current);
    prevVideoSrc.current = videoSrc;
  }, [videoSrc]);

  const onVideoDrop = useCallback((files: File[]) => {
    if (!files[0]) return;
    setVideoFile(files[0]);
    setVideoSrc(URL.createObjectURL(files[0]));
    setVideoDur(0);
  }, []);

  const onAudioDrop = useCallback((files: File[]) => {
    if (files[0]) { setAudioFile(files[0]); setAudioDur(0); }
  }, []);

  const { getRootProps: vRP, getInputProps: vIP, isDragActive: vDrag } = useDropzone({
    onDrop: onVideoDrop,
    accept: { 'video/*': ['.mp4', '.mov', '.avi', '.webm', '.mkv'] },
    maxFiles: 1, disabled: isProcessing,
  });

  const { getRootProps: aRP, getInputProps: aIP, isDragActive: aDrag } = useDropzone({
    onDrop: onAudioDrop,
    accept: { 'audio/*': ['.mp3', '.wav', '.m4a', '.ogg', '.flac', '.aac'] },
    maxFiles: 1, disabled: isProcessing,
  });

  const handleProcess = () => {
    if (videoFile && audioFile) processVideo(videoFile, audioFile);
  };

  const handleReset = () => {
    reset();
    setVideoFile(null); setAudioFile(null);
    setVideoSrc(''); setVideoDur(0); setAudioDur(0);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[var(--paper)]">

      {/* ── Nav ── */}
      <nav className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--white)] px-6 py-4 sm:px-10">
        <div className="flex items-center gap-2.5">
          <LoopIcon className="h-5 w-10 text-[var(--rust)]" />
          <span className="font-heading text-lg font-bold tracking-tight text-[var(--ink)]">LoopCast</span>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--paper2)] px-3 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--sage)]" />
          <span className="font-mono text-[10px] tracking-wide text-[var(--muted)]">Processed in your browser</span>
        </div>
      </nav>

      {/* ── Main ── */}
      <main className="flex flex-1 flex-col items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl">

          {/* FFmpeg loading */}
          {isLoading && (
            <div className="mb-5 flex items-center justify-center gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--white)] p-3.5">
              <Loader2 className="h-4 w-4 animate-spin text-[var(--muted)]" />
              <p className="font-mono text-xs text-[var(--muted)]">Loading FFmpeg engine…</p>
            </div>
          )}

          {/* Two-panel grid */}
          <div className="mb-4 grid grid-cols-2 gap-3">

            {/* VIDEO panel */}
            <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--white)]">
              <div className="border-b border-[var(--border)] px-4 py-2.5">
                <span className="font-mono text-[9px] tracking-[0.18em] text-[var(--muted)] uppercase">Video</span>
              </div>

              {videoFile && videoSrc ? (
                <>
                  <video
                    src={videoSrc}
                    className="aspect-video w-full object-cover"
                    onLoadedMetadata={e => setVideoDur((e.target as HTMLVideoElement).duration)}
                    muted playsInline
                  />
                  <div className="flex items-center gap-2 border-t border-[var(--border)] px-3 py-2.5">
                    <span className="font-mono text-[9px] text-[var(--muted)]">0:00</span>
                    <div className="relative flex-1">
                      <div className="h-[3px] w-full rounded-full bg-[var(--rust-lt)]">
                        <div className="h-full w-0 rounded-full bg-[var(--rust)]" />
                      </div>
                      <div className="absolute -top-[4px] left-0 h-[11px] w-[11px] rounded-full border-2 border-[var(--white)] bg-[var(--rust)] shadow-sm" />
                    </div>
                    <span className="font-mono text-[9px] text-[var(--muted)]">
                      {videoDur > 0 ? fmt(videoDur) : '—'}
                    </span>
                  </div>
                </>
              ) : (
                <div
                  {...vRP()}
                  className={`flex cursor-pointer flex-col items-center justify-center gap-3 py-10 px-6 transition-colors
                    ${vDrag ? 'bg-[var(--rust-lt)]' : 'hover:bg-[var(--paper2)]'}`}
                >
                  <input {...vIP()} />
                  <Video className="h-7 w-7 text-[var(--muted)]" />
                  <div className="text-center">
                    <p className="font-body text-sm font-medium text-[var(--ink2)]">Drop video here</p>
                    <p className="mt-0.5 font-mono text-[10px] text-[var(--muted)]">.mp4 · .mov · .webm</p>
                  </div>
                </div>
              )}
            </div>

            {/* AUDIO panel */}
            <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--white)]">
              <div className="border-b border-[var(--border)] px-4 py-2.5">
                <span className="font-mono text-[9px] tracking-[0.18em] text-[var(--muted)] uppercase">Audio</span>
              </div>

              {audioFile ? (
                <div className="px-4 pt-4 pb-3">
                  <AudioWaveform file={audioFile} onDuration={setAudioDur} />
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-mono text-[9px] text-[var(--muted)]">00:00</span>
                    <span className="font-mono text-[9px] text-[var(--muted)]">
                      {audioDur > 0 ? fmt(audioDur) : '—'}
                    </span>
                  </div>

                  {/* Success row — inside audio panel, shown after processing */}
                  {outputUrl && (
                    <div className="mt-3 flex items-center justify-between border-t border-[var(--border)] pt-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[var(--sage-lt)]">
                          <CheckCircle className="h-3.5 w-3.5 text-[var(--sage)]" />
                        </div>
                        <div>
                          <p className="font-body text-xs font-medium text-[var(--ink)]">
                            Video looped to match audio
                          </p>
                          {numLoops > 0 && (
                            <p className="font-mono text-[9px] text-[var(--muted)]">
                              {fmt(audioDur)} · {numLoops} loops
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const a = document.createElement('a');
                          a.href = outputUrl;
                          a.download = 'loopcast-output.mp4';
                          a.click();
                        }}
                        className="ml-2 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[var(--sage-lt)] text-[var(--sage)] transition-colors hover:bg-[var(--sage)] hover:text-white"
                      >
                        <Play className="h-3.5 w-3.5 translate-x-px" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  {...aRP()}
                  className={`flex cursor-pointer flex-col items-center justify-center gap-3 py-10 px-6 transition-colors
                    ${aDrag ? 'bg-[var(--rust-lt)]' : 'hover:bg-[var(--paper2)]'}`}
                >
                  <input {...aIP()} />
                  <AudioLines className="h-7 w-7 text-[var(--muted)]" />
                  <div className="text-center">
                    <p className="font-body text-sm font-medium text-[var(--ink2)]">Drop audio here</p>
                    <p className="mt-0.5 font-mono text-[10px] text-[var(--muted)]">.mp3 · .wav · .m4a</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Download row — shown after processing */}
          {outputUrl && (
            <div className="mb-4 flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--white)] px-5 py-3.5">
              <p className="font-body text-sm text-[var(--ink2)]">Output ready</p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const a = document.createElement('a');
                    a.href = outputUrl;
                    a.download = 'loopcast-output.mp4';
                    a.click();
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--rust)] px-4 py-2 font-body text-xs font-semibold text-white transition-colors hover:bg-[var(--accent-hover)]"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </button>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border2)] bg-[var(--paper2)] px-4 py-2 font-body text-xs font-medium text-[var(--ink2)] transition-colors hover:border-[var(--rust)]"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </button>
              </div>
            </div>
          )}

          {/* Loop It button */}
          {!outputUrl && (
            <>
              <button
                onClick={handleProcess}
                disabled={!canProcess}
                className={`mb-4 w-full rounded-xl px-6 py-3 font-body text-sm font-semibold transition-all
                  focus:outline-none focus:ring-2 focus:ring-[var(--rust)] focus:ring-offset-2 focus:ring-offset-[var(--paper)]
                  ${canProcess
                    ? 'bg-[var(--rust)] text-white shadow-sm hover:bg-[var(--accent-hover)]'
                    : 'cursor-not-allowed bg-[var(--rust-lt)] text-[var(--rust)] opacity-60'
                  }`}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing…
                  </span>
                ) : 'Loop It'}
              </button>

              {isProcessing && (
                <div className="mb-4">
                  <div className="h-1 w-full overflow-hidden rounded-full bg-[var(--paper2)]">
                    <div
                      className="h-full rounded-full bg-[var(--rust)] transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="mt-1.5 flex justify-between">
                    <p className="font-mono text-[10px] text-[var(--muted)]">Looping video to match audio…</p>
                    <p className="font-mono text-[10px] text-[var(--muted)]">{progress}%</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4" role="alert">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--error)]" />
                  <p className="flex-1 font-body text-sm text-[var(--error)]">{error}</p>
                  <button onClick={reset} className="text-[var(--muted)] transition-colors hover:text-[var(--ink)]">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-[var(--border)] bg-[var(--white)] px-6 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2.5">
              <LoopIcon className="h-4 w-8 text-[var(--rust)]" />
              <p className="font-heading text-base font-bold text-[var(--ink)]">
                Loop. <em className="italic text-[var(--rust)]">Instantly.</em>
              </p>
            </div>
            <p className="font-mono text-[11px] text-[var(--muted)]">All processing happens in your browser.</p>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-[var(--rust)] px-4 py-2 shadow-sm">
            <Lock className="h-3 w-3 text-white" />
            <span className="font-mono text-[11px] font-medium text-white">100% Private</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
