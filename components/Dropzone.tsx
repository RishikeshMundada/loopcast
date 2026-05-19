'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface DropzoneProps {
  label: string;
  accept: Record<string, string[]>;
  file: File | null;
  onFileSelect: (file: File) => void;
  icon: React.ReactNode;
  disabled?: boolean;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isLargeFile(file: File, thresholdMB: number): boolean {
  return file.size > thresholdMB * 1024 * 1024;
}

export default function Dropzone({
  label,
  accept,
  file,
  onFileSelect,
  icon,
  disabled = false,
}: DropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0 && !disabled) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect, disabled],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    disabled,
  });

  const showLargeWarning = file && isLargeFile(file, 500);

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          relative rounded-lg border-2 border-dashed p-8 text-center transition-all duration-200
          cursor-pointer bg-[var(--white)]
          ${disabled ? 'pointer-events-none opacity-40' : ''}
          ${file
            ? 'border-[var(--sage)] bg-[var(--sage-lt)]'
            : isDragActive
              ? 'border-[var(--rust)] bg-[var(--rust-lt)]'
              : 'border-[var(--border2)] hover:border-[var(--rust)] hover:bg-[var(--rust-lt)]'
          }
        `}
      >
        <input {...getInputProps()} />

        {/* Panel label */}
        <div className="absolute left-4 top-3">
          <span className="font-mono text-[10px] tracking-widest text-[var(--muted)] uppercase">
            {label}
          </span>
        </div>

        <div className="flex flex-col items-center gap-3 pt-4">
          <div className={file ? 'text-[var(--sage)]' : 'text-[var(--muted)]'}>
            {icon}
          </div>

          {file ? (
            <div>
              <p className="font-mono text-sm text-[var(--ink)] break-all">{file.name}</p>
              <p className="mt-1 font-mono text-xs text-[var(--muted)]">{formatFileSize(file.size)}</p>
            </div>
          ) : (
            <div>
              <p className="font-body text-sm font-medium text-[var(--ink2)]">
                Drop file here or click to browse
              </p>
              <p className="mt-1 font-mono text-xs text-[var(--muted)]">
                {label === 'Video'
                  ? '.mp4 · .mov · .webm · .avi'
                  : '.mp3 · .wav · .m4a · .ogg'}
              </p>
            </div>
          )}
        </div>
      </div>

      {showLargeWarning && (
        <p className="mt-2 font-mono text-xs text-[var(--muted)]" role="alert">
          Large files may slow down or fail depending on your browser and available RAM.
        </p>
      )}
    </div>
  );
}
