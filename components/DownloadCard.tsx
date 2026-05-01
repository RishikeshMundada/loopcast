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
    <div className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <CheckCircle className="h-10 w-10 text-[var(--success)]" />
        <div>
          <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)]">
            Processing Complete!
          </h3>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Your video has been generated and is ready to download.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[var(--bg-base)]"
          >
            <Download className="h-4 w-4" />
            Download Video
          </button>
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] px-6 py-3 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--border-active)] focus:outline-none focus:ring-2 focus:ring-[var(--border-active)] focus:ring-offset-2 focus:ring-offset-[var(--bg-base)]"
          >
            <RotateCcw className="h-4 w-4" />
            Process Another
          </button>
        </div>
      </div>
    </div>
  );
}
