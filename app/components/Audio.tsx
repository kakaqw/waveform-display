"use client";

import { useRef, useState, useEffect } from "react";
import Waveform from "./Wavesufer";
import AudioButton from "./AudioButton";
import WaveSurfer from "wavesurfer.js";

export default function Audio() {
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      setIsPlaying(false);
    }
  };

  const handleDownloadWaveform = () => {
    if (wavesurferRef.current) {
      // 获取波形图的 canvas 元素
      const canvas = wavesurferRef.current.getWrapper().querySelector("canvas");
      if (canvas) {
        // 将 canvas 转换为图片 URL
        const imageUrl = canvas.toDataURL("image/png");
        // 创建下载链接
        const a = document.createElement("a");
        a.href = imageUrl;
        a.download = "waveform.png"; // 下载的文件名
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }
  };

  const handleReady = (wavesurfer: WaveSurfer) => {
    wavesurferRef.current = wavesurfer;

    wavesurfer.on("finish", () => {
      setIsPlaying(false);
    });
  };

  const handlePlay = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSendWaveform = async () => {
    if (wavesurferRef.current) {
      const canvas = wavesurferRef.current.getWrapper().querySelector("canvas");
      if (canvas) {
        const imageUrl = canvas.toDataURL("image/png");
        try {
          const response = await fetch("http://localhost:3001/api/waveform", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              waveform: imageUrl,
            }),
          });

          if (response.ok) {
            alert("波形图发送成功！");
          } else {
            throw new Error("发送失败");
          }
        } catch (error) {
          console.error("发送波形图时出错:", error);
          alert("发送波形图失败");
        }
      }
    }
  };

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  return (
    <div className="w-full">
      <div className="flex justify-center mb-4">
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileUpload}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>
      {audioUrl && (
        <>
          <Waveform audioUrl={audioUrl} isOverview={true} />
          <Waveform audioUrl={audioUrl} onReady={handleReady} />
          <div className="flex justify-center gap-4 mt-4">
            <AudioButton
              onPlay={handlePlay}
              onPause={handlePause}
              isPlaying={isPlaying}
            />
            <button
              onClick={handleDownloadWaveform}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              下载波形图
            </button>
            <button
              onClick={handleSendWaveform}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              发送波形图
            </button>
          </div>
        </>
      )}
    </div>
  );
}
