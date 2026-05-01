# LoopCast

Loop any video to the length of any audio — **entirely in your browser**. No uploads, no servers, no cloud storage.

## Overview

LoopCast is a client-side video production tool that uses FFmpeg compiled to WebAssembly. Upload a short looping video (e.g., cinemagraph, B-roll) and a long audio track (e.g., podcast, lecture), and LoopCast produces a single MP4 where the video loops seamlessly to match the audio duration.

**Everything happens locally in your browser.**

## Features

- **100% client-side** — zero server involvement, no API, no database
- **Seamless video looping** — uses `-stream_loop -1` for infinite looping
- **Fast processing** — video codec is copied (`-c:v copy`), no re-encoding
- **Multi-format audio support** — MP3, WAV, M4A, OGG, FLAC, AAC
- **Real-time progress tracking**
- **Large file warnings** for files over 500MB
- **Responsive layout** — works on desktop and mobile
- **Dark theme** — precision-focused, no distractions

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v3 |
| Media Processing | `@ffmpeg/ffmpeg` v0.12.x + `@ffmpeg/util` |
| Drag and Drop | `react-dropzone` |
| Icons | `lucide-react` |
| Fonts | Syne (headings), Inter (body), Space Mono (mono) |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
cd loopcast
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## How It Works

1. **FFmpeg loads** from CDN as WebAssembly (takes ~10-30 seconds on first load)
2. **You upload** a video file and an audio file via drag-and-drop
3. **Click Generate** — FFmpeg runs in a Web Worker inside your browser
4. **Download** the resulting `loopcast-output.mp4`

The FFmpeg command used under the hood:

```
-stream_loop -1 -i video.mp4 -i audio.<ext> -c:v copy -c:a aac -map 0:v:0 -map 1:a:0 -shortest output.mp4
```

## Project Structure

```
loopcast/
├── app/
│   ├── layout.tsx          # Root layout with fonts and COOP/COEP meta
│   ├── page.tsx            # Main single-page application
│   └── globals.css         # Tailwind + CSS variables
├── components/
│   ├── Dropzone.tsx        # Drag-and-drop file upload
│   ├── ProgressBar.tsx     # Animated progress indicator
│   └── DownloadCard.tsx    # Post-processing download UI
├── hooks/
│   └── useFFmpeg.ts        # FFmpeg WASM initialization and processing
├── next.config.js          # COOP/COEP headers for SharedArrayBuffer
├── tailwind.config.ts      # Extended theme with CSS variables
├── tsconfig.json           # Strict TypeScript config
└── package.json
```

## Important Notes

### Cross-Origin Isolation

FFmpeg.wasm requires `SharedArrayBuffer`, which is only available in cross-origin isolated contexts. The app sets these headers via `next.config.js`:

- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: require-corp`

### File Size Limits

Processing happens in browser memory. Files that are too large may cause failures:

- **Video files** over 100MB may slow down processing
- **Audio files** over 500MB may cause out-of-memory errors

If processing fails, try shorter files.

### Browser Compatibility

Works in modern browsers that support `SharedArrayBuffer` and WebAssembly (Chrome, Edge, Firefox, Safari).

## License

ISC
