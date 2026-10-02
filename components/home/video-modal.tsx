"use client"

import { useEffect, useRef } from "react"
import { Film, Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { MediaItem } from "./types"

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
  item: MediaItem | null
}

export function VideoModal({ isOpen, onClose, item }: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0
          videoRef.current.play().catch(() => {})
        }
      }, 150)
      return () => clearTimeout(timer)
    } else {
      if (videoRef.current) {
        videoRef.current.pause()
      }
    }
  }, [isOpen, item])

  if (!item) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[calc(100vw-1.5rem)] max-w-[calc(100vw-1.5rem)] sm:max-w-3xl p-3 sm:p-5 bg-black/85 backdrop-blur-2xl border-white/15 shadow-2xl rounded-xl overflow-hidden box-border">
        <DialogHeader className="space-y-1.5 text-left pr-7 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="default" className="text-[10px] sm:text-xs font-semibold gap-1">
              <Film className="size-3" />
              <span>4K Vault Video</span>
            </Badge>
            <Badge variant="secondary" className="text-[10px] sm:text-xs">
              {item.duration}
            </Badge>
            <Badge variant="outline" className="text-[10px] sm:text-xs text-emerald-500 border-emerald-500/30">
              <Check className="size-3 mr-1" />
              Unlocked Access
            </Badge>
          </div>
          <DialogTitle className="text-base sm:text-lg font-bold tracking-tight truncate">
            {item.title}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Exclusive studio visualizer by swagsxn • {item.genre ?? "4K Film"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-1">
          <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black border border-border/50 shadow-inner">
            <video
              ref={videoRef}
              src="/video.mp4"
              controls
              autoPlay
              playsInline
              preload="auto"
              className="size-full object-contain"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-muted-foreground pt-1 border-t border-border/40">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">swagsxn</span>
              <span>•</span>
              <span>{item.releaseDate} Master</span>
              {item.genre && (
                <>
                  <span>•</span>
                  <span>{item.genre}</span>
                </>
              )}
            </div>
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
