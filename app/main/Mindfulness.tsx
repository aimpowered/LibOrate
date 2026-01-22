"use client";

import "../css/Mindfulness.css";
import videos from "@/data/videos.json";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface VideoPlayerProps {
  name: string;
  videoId: string;
  label: string;
  alt: string;
  onPlay?: (videoId: string, name: string) => void;
  onPause?: (videoId: string, name: string) => void;
  onEnd?: (videoId: string, name: string) => void;
}

function VideoPlayer({
  name,
  videoId,
  label,
  alt,
  onPlay,
  onPause,
  onEnd,
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YT.Player | null>(null);

  useEffect(() => {
    const initPlayer = () => {
      if (!containerRef.current || playerRef.current) return;

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          mute: 1,
          modestbranding: 1,
          rel: 0,
          enablejsapi: 1,
          origin: window.location.origin,
          showinfo: 0,
        },
        events: {
          onStateChange: (event: YT.OnStateChangeEvent) => {
            switch (event.data) {
              case window.YT.PlayerState.PLAYING:
                onPlay?.(videoId, name);
                break;
              case window.YT.PlayerState.PAUSED:
                onPause?.(videoId, name);
                break;
              case window.YT.PlayerState.ENDED:
                onEnd?.(videoId, name);
                break;
            }
          },
        },
      });
    };

    if (!window.YT) {
      // Load YouTube IFrame API script dynamically
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = initPlayer;
    } else {
      initPlayer();
    }

    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [videoId, name, onPlay, onPause, onEnd]);

  return (
    <div className="video-wrapper" key={label}>
      <div ref={containerRef} className="video" aria-label={alt}></div>
    </div>
  );
}

export interface MindfulnessProps {
  onPlay?: (videoId: string, name: string) => void;
  onPause?: (videoId: string, name: string) => void;
  onEnd?: (videoId: string, name: string) => void;
}

function Mindfullness({ onPlay, onPause, onEnd }: MindfulnessProps) {
  return (
    <div className="tab-container">
      <h2 className="tab-title">Mindfulness</h2>
      {videos.map((video) => (
        <div key={video.name}>
          <h3 className="video-title">{video.name}</h3>
          <VideoPlayer
            name={video.name}
            videoId={video.youtubeId}
            label={video.label}
            alt={video.alt}
            onPlay={onPlay}
            onPause={onPause}
            onEnd={onEnd}
          />
        </div>
      ))}
    </div>
  );
}

export default Mindfullness;
