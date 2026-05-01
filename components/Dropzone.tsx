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
          cursor-pointer
          ${disabled ? 'opacity-40 pointer-events-none' : ''}
          ${file
            ? 'border-[var(--success)] bg-[var(--bg-elevated)]'
            : isDragActive
              ? 'border-[var(--border-active)] bg-[var(--bg-elevated)]'
              : 'border-[var(--border-subtle)] hover:border-[var(--border-default)]'
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <div className={`text-[var(--text-secondary)] ${file ? 'text-[var(--success)]' : ''}`}>
            {icon}
          </div>
          {file ? (
            <div>
              <p className="font-mono text-sm text-[var(--text-primary)] break-all">
                {file.name}
              </p>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                {formatFileSize(file.size)}
              </p>
            </div>
          ) : (
            <div>
              <p className="font-heading text-sm font-medium text-[var(--text-primary)]">
                {label}
              </p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                Drop file here or click to browse
              </p>
            </div>
          )}
        </div>
      </div>
      {showLargeWarning && (
        <p className="mt-2 text-xs text-[var(--text-muted)]" role="alert">
          Large files may cause processing to slow down or fail depending on your browser and available RAM.
        </p>
      )}
    </div>
  );
}
