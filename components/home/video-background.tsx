"use client"

import { forwardRef } from "react"

interface VideoBackgroundProps {
  isMuted?: boolean
}

export const VideoBackground = forwardRef<HTMLVideoElement, VideoBackgroundProps>(
  function VideoBackground({ isMuted = true }, ref) {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <video
          ref={ref}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/video.mp4" type="video/mp4" />
        </video>
      </div>
    )
  }
)