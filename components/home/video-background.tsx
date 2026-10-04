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
          <source src="https://wck2rhqn5tmgiskj.public.blob.vercel-storage.com/Video%20Apr%2003%202026%2C%2011%2007%2048%20Pm.mp4" type="video/mp4" />
        </video>
      </div>
    )
  }
)