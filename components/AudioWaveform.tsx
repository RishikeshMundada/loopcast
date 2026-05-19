'use client';

import { useEffect, useRef } from 'react';

interface AudioWaveformProps {
  file: File;
  onDuration?: (seconds: number) => void;
}

export default function AudioWaveform({ file, onDuration }: AudioWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let ac: AudioContext | null = null;

    file.arrayBuffer().then(buf => {
      ac = new AudioContext();
      ac.decodeAudioData(buf, decoded => {
        onDuration?.(decoded.duration);

        const raw = decoded.getChannelData(0);
        const W = canvas.width;
        const H = canvas.height;
        const bars = 68;
        const step = Math.floor(raw.length / bars);
        const barW = Math.max(2, Math.floor((W / bars) * 0.62));
        const stride = W / bars;

        ctx.clearRect(0, 0, W, H);

        for (let i = 0; i < bars; i++) {
          let peak = 0;
          for (let j = 0; j < step; j++) {
            const v = Math.abs(raw[i * step + j] ?? 0);
            if (v > peak) peak = v;
          }
          const barH = Math.max(3, Math.round(peak * H * 0.88));
          const x = Math.round(i * stride);
          const y = Math.round((H - barH) / 2);

          ctx.fillStyle = '#4A7C59';
          ctx.beginPath();
          if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(x, y, barW, barH, 2);
          } else {
            ctx.rect(x, y, barW, barH);
          }
          ctx.fill();
        }

        ac?.close();
      });
    }).catch(() => null);

    return () => { ac?.close(); };
  }, [file, onDuration]);

  return (
    <canvas
      ref={canvasRef}
      width={560}
      height={96}
      className="w-full"
      style={{ height: 96 }}
    />
  );
}
