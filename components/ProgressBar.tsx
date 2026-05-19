'use client';

interface ProgressBarProps {
  progress: number;
  label?: string;
}

export default function ProgressBar({ progress, label }: ProgressBarProps) {
  return (
    <div className="w-full">
      {label && (
        <p className="mb-2 font-mono text-xs text-[var(--muted)]">{label}</p>
      )}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--paper2)]">
        <div
          className="h-full rounded-full bg-[var(--rust)] transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <p className="mt-1 text-right font-mono text-xs text-[var(--muted)]">
        {progress}%
      </p>
    </div>
  );
}
