"use client"

import { useState, useEffect } from "react"
import { Play, Pause, X, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MediaItem, UserSubscription } from "./types"

interface AudioPlayerBarProps {
  item: MediaItem | null
  isPlaying: boolean
  subscription: UserSubscription
  onTogglePlay: () => void
  onClose: () => void
  onOpenSubscription: () => void
}

export function AudioPlayerBar({
  item,
  isPlaying,
  subscription,
  onTogglePlay,
  onClose,
  onOpenSubscription,
}: AudioPlayerBarProps) {
  const [progress, setProgress] = useState(15)

  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1))
    }, 400)
    return () => clearInterval(interval)
  }, [isPlaying])

  if (!item) return null

  const isPurchased = (subscription.purchasedItemIds ?? []).includes(item.id)
  const isUnlocked = !item.isExclusive || isPurchased
  const isPreview = !isUnlocked

  return (
    <div className="fixed bottom-4 inset-x-0 mx-auto max-w-xl px-4 z-40 animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="bg-black/60 backdrop-blur-2xl border border-white/20 rounded-xl p-3 shadow-2xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="default"
            size="icon"
            onClick={onTogglePlay}
            className="size-9 rounded-full shrink-0 bg-transparent hover:bg-white/15 text-white border border-white/30 cursor-pointer transition-all shadow-xs"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="size-4" />
            ) : (
              <Play className="size-4 ml-0.5" />
            )}
          </Button>

          <div className="min-w-0 space-y-0.5">
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold text-foreground truncate">
                {item.title}
              </p>
              {isPreview ? (
                <Badge variant="outline" className="text-[9px] px-1 py-0 h-3.5">
                  Preview
                </Badge>
              ) : (
                <Badge
                  variant="secondary"
                  className="text-[9px] px-1 py-0 h-3.5 text-emerald-500"
                >
                  Unlocked
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="w-28 sm:w-44 h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white/90 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground font-mono">
                {item.duration}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {isPreview && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenSubscription}
              className="text-xs h-7 gap-1 bg-transparent hover:bg-white/15 border border-white/30 text-white cursor-pointer transition-all"
            >
              <Lock className="size-3" />
              <span>{item.type === "song" ? "Buy $29" : "Subscribe"}</span>
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onClose}
            aria-label="Close player"
            className="text-white/60 hover:text-white hover:bg-white/10 size-7 cursor-pointer"
          >
            <X className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
