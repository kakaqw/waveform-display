"use client";

import { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

interface WaveformProps {
  audioUrl: string;
  onReady?: (wavesurfer: WaveSurfer) => void;
  isOverview?: boolean;
}

export default function Waveform({
  audioUrl,
  onReady,
  isOverview = false,
}: WaveformProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    wavesurfer.current = WaveSurfer.create({
      container: containerRef.current,
      waveColor: isOverview ? "#8B8B8B" : "#4F4A85",
      progressColor: isOverview ? "#4B4B4B" : "#383351",
      cursorColor: isOverview ? "transparent" : "#383351",
      barWidth: isOverview ? 1 : 2,
      barRadius: 1,
      height: isOverview ? 80 : 200,
      normalize: true,
      minPxPerSec: isOverview ? 50 : 100,
      interact: !isOverview,
      mediaControls: !isOverview,
    });

    wavesurfer.current.load(audioUrl);

    wavesurfer.current.on("ready", () => {
      if (onReady && wavesurfer.current) {
        onReady(wavesurfer.current);
      }
    });

    const ws = wavesurfer.current;
    return () => {
      try {
        ws?.destroy();
      } catch (err) {
        console.log("Wavesurfer cleanup error:", err);
      }
    };
  }, [audioUrl, isOverview]);

  return (
    <div
      ref={containerRef}
      className={`border-2 border-gray-300 rounded-lg p-4 ${
        isOverview ? "mb-4" : ""
      }`}
    />
  );
}
