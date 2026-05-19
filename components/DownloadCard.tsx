'use client';

import { Download, RotateCcw, CheckCircle } from 'lucide-react';

interface DownloadCardProps {
  videoUrl: string;
  onReset: () => void;
}

export default function DownloadCard({ videoUrl, onReset }: DownloadCardProps) {
  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = 'loopcast-output.mp4';
    a.click();
  };

  return (
    <div className="w-full rounded-lg border border-[var(--border)] bg-[var(--white)] p-8">
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--sage-lt)]">
          <CheckCircle className="h-6 w-6 text-[var(--sage)]" />
        </div>

        <div>
          <h3 className="font-heading text-xl font-bold text-[var(--ink)]">
            Video looped to match audio.
          </h3>
          <p className="mt-2 font-body text-sm text-[var(--muted)]">
            Your output is ready to download.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--rust)] px-6 py-3 font-body text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[var(--accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--rust)] focus:ring-offset-2 focus:ring-offset-[var(--white)]"
          >
            <Download className="h-4 w-4" />
            Download Video
          </button>
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--border2)] bg-[var(--paper2)] px-6 py-3 font-body text-sm font-medium text-[var(--ink2)] transition-colors hover:border-[var(--rust)] hover:text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--border2)] focus:ring-offset-2"
          >
            <RotateCcw className="h-4 w-4" />
            Process Another
          </button>
        </div>
      </div>
    </div>
  );
}
