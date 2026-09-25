"use client";

import { useRef, useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";

type AudioPlayerProps = {
  src: string;
};

export default function AudioPlayer({ src }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;

    const percentage =
      (audioRef.current.currentTime / audioRef.current.duration) * 100;

    setProgress(percentage);
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-3 rounded-full bg-[#FFF3EE] px-3 py-2 w-64">
      <audio
        ref={audioRef}
        src={src}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
          }
        }}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => {
          setIsPlaying(false);
          setProgress(0);
        }}
      />

      <button
        onClick={togglePlay}
        className="flex items-center justify-center w-9 h-9 rounded-full bg-orange-500 text-white shrink-0"
      >
        {isPlaying ? (
          <FaPause className="text-xs" />
        ) : (
          <FaPlay className="text-xs ml-0.5" />
        )}
      </button>

      <div className="flex-1 h-1.5 rounded-full bg-[#F4D9CF] overflow-hidden">
        <div
          className="h-full bg-orange-500 rounded-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      <span className="text-xs text-[#777] pr-1 min-w-[30px]">
        {formatTime(duration)}
      </span>
    </div>
  );
}
