"use client";

interface AudioButtonProps {
  onPlay: () => void;
  onPause: () => void;
  isPlaying: boolean;
}

export default function AudioButton({
  onPlay,
  onPause,
  isPlaying,
}: AudioButtonProps) {
  const handleClick = () => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      {isPlaying ? "暂停" : "播放"}
    </button>
  );
}
