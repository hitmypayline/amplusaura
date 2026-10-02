"use client"

import { useState } from "react"
import { Check, Loader2, Music, Film } from "lucide-react"
import { FaApple, FaGoogle } from "react-icons/fa6"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MediaItem, SubscriptionTier } from "./types"

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  item?: MediaItem | null
  onSuccessfulSubscription: (
    tier: SubscriptionTier,
    email: string,
    itemId?: string
  ) => void
}

export function SubscriptionModal({
  isOpen,
  onClose,
  item,
  onSuccessfulSubscription,
}: SubscriptionModalProps) {
  const [selectedVideoTier, setSelectedVideoTier] = useState<"yearly" | "lifetime">("yearly")
  const [isProcessing, setIsProcessing] = useState(false)
  const [activePaymentMethod, setActivePaymentMethod] = useState<string | null>(null)

  if (!item) return null

  const isAudioItem = item.type === "song"

  const handleSimulatePayment = (method: string) => {
    setActivePaymentMethod(method)
    setIsProcessing(true)

    setTimeout(() => {
      setIsProcessing(false)
      setActivePaymentMethod(null)
      const mockEmail =
        method === "apple"
          ? "customer@icloud.com"
          : "customer@gmail.com"
      const tier: SubscriptionTier = isAudioItem ? "lifetime" : selectedVideoTier
      onClose()
      onSuccessfulSubscription(tier, mockEmail, item.id)
    }, 1000)
  }

  const appleButtonLabel = isAudioItem
    ? `Pay $${item.price.toFixed(2)} with Apple Pay`
    : selectedVideoTier === "yearly"
    ? "Subscribe with Apple Pay ($29/yr)"
    : "Pay $79 with Apple Pay"

  const googleButtonLabel = isAudioItem
    ? `Pay $${item.price.toFixed(2)} with Google Pay`
    : selectedVideoTier === "yearly"
    ? "Subscribe with Google Pay ($29/yr)"
    : "Pay $79 with Google Pay"

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[calc(100vw-1.5rem)] max-w-[calc(100vw-1.5rem)] sm:max-w-md p-4 sm:p-6 bg-black/80 backdrop-blur-2xl border-white/15 shadow-2xl rounded-xl overflow-hidden box-border">
        <DialogHeader className="space-y-1 text-left pr-7 min-w-0">
          <DialogTitle className="text-base sm:text-lg font-bold tracking-tight flex items-center gap-2 min-w-0">
            {isAudioItem ? (
              <>
                <Music className="size-4.5 text-primary shrink-0" />
                <span className="truncate">Buy Audio • Lifetime Access</span>
              </>
            ) : (
              <>
                <Film className="size-4.5 text-primary shrink-0" />
                <span className="truncate">Subscribe to Video Vault</span>
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed break-words">
            {isAudioItem
              ? "Direct one-time purchase for permanent lifetime streaming and download."
              : selectedVideoTier === "yearly"
              ? "Annual subscription for unlimited 1-year access to all 4K videos."
              : "Permanent one-time VIP pass for lifetime access to all 4K videos."}
          </DialogDescription>
        </DialogHeader>

        <div className="p-3 sm:p-3.5 my-2 rounded-lg border border-white/15 bg-transparent space-y-2">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <Badge
                variant="outline"
                className="text-[10px] px-1 py-0 h-4 uppercase tracking-wider font-semibold shrink-0"
              >
                {isAudioItem ? "Lifetime Audio" : "4K Studio Video"}
              </Badge>
              {item.genre && (
                <span className="text-xs text-muted-foreground truncate">
                  {item.genre}
                </span>
              )}
            </div>
            <div className="text-right shrink-0">
              <span className="text-base sm:text-lg font-bold text-foreground">
                ${isAudioItem ? item.price.toFixed(2) : selectedVideoTier === "yearly" ? "29.00" : "79.00"}
              </span>
              <span className="text-[10px] text-muted-foreground ml-1">
                {isAudioItem ? "one-time" : selectedVideoTier === "yearly" ? "/ yr" : "one-time"}
              </span>
            </div>
          </div>

          <div className="min-w-0 space-y-0.5 pt-0.5">
            <p className="text-sm font-semibold text-foreground truncate">
              {item.title}
            </p>
            <p className="text-[11px] text-muted-foreground leading-normal">
              {isAudioItem
                ? "Instant MP3/WAV download & lifetime streaming"
                : "All current and upcoming 4K studio videos included"}
            </p>
          </div>
        </div>

        {!isAudioItem && (
          <div className="grid grid-cols-2 gap-2 sm:gap-2.5 my-2.5">
            <button
              type="button"
              onClick={() => setSelectedVideoTier("yearly")}
              className={`p-2.5 sm:p-3 rounded-lg border text-left transition-all cursor-pointer ${
                selectedVideoTier === "yearly"
                  ? "border-white/50 bg-white/10 text-white ring-1 ring-white/30 shadow-xs"
                  : "border-white/20 bg-transparent text-white/70 hover:border-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-white">
                  Yearly
                </span>
                <Badge
                  variant={selectedVideoTier === "yearly" ? "default" : "outline"}
                  className="text-[9px] sm:text-[10px] py-0 px-1 h-4 bg-transparent text-white border-white/25"
                >
                  Annual
                </Badge>
              </div>
              <div className="mt-1.5 flex items-baseline gap-1">
                <span className="text-base sm:text-lg font-bold text-white">$29</span>
                <span className="text-[10px] sm:text-xs text-white/60">/ year</span>
              </div>
              <p className="text-[10px] text-white/60 mt-0.5 leading-tight">
                1-year access to all videos
              </p>
            </button>

            <button
              type="button"
              onClick={() => setSelectedVideoTier("lifetime")}
              className={`p-2.5 sm:p-3 rounded-lg border text-left transition-all cursor-pointer ${
                selectedVideoTier === "lifetime"
                  ? "border-white/50 bg-white/10 text-white ring-1 ring-white/30 shadow-xs"
                  : "border-white/20 bg-transparent text-white/70 hover:border-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-white">
                  Lifetime
                </span>
                <Badge
                  variant={selectedVideoTier === "lifetime" ? "default" : "secondary"}
                  className="text-[9px] sm:text-[10px] py-0 px-1 h-4 bg-transparent text-white border-white/25"
                >
                  VIP
                </Badge>
              </div>
              <div className="mt-1.5 flex items-baseline gap-1">
                <span className="text-base sm:text-lg font-bold text-white">$79</span>
                <span className="text-[10px] sm:text-xs text-white/60">one-time</span>
              </div>
              <p className="text-[10px] text-white/60 mt-0.5 leading-tight">
                Permanent lifetime pass
              </p>
            </button>
          </div>
        )}

        <div className="space-y-1.5 py-1 text-xs text-muted-foreground">
          <div className="flex items-start gap-2">
            <Check className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
            <span className="leading-tight">
              {isAudioItem
                ? "Instant lifetime access immediately upon checkout"
                : selectedVideoTier === "yearly"
                ? "Instant 1-year access to all 4K videos upon checkout"
                : "Instant permanent lifetime access to all 4K videos upon checkout"}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
            <span className="leading-tight">Encrypted 256-bit secure transaction</span>
          </div>
        </div>

        <div className="space-y-2 pt-2.5 sm:pt-3 border-t border-white/15">
          <Button
            type="button"
            variant="default"
            size="lg"
            disabled={isProcessing}
            onClick={() => handleSimulatePayment("apple")}
            className="w-full h-10 sm:h-11 bg-transparent hover:bg-white/10 border border-white/30 hover:border-white/50 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 rounded-lg cursor-pointer transition-all shadow-xs"
          >
            {isProcessing && activePaymentMethod === "apple" ? (
              <>
                <Loader2 className="size-4 animate-spin shrink-0" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <FaApple className="size-4 shrink-0" />
                <span className="truncate">{appleButtonLabel}</span>
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={isProcessing}
            onClick={() => handleSimulatePayment("google")}
            className="w-full h-10 sm:h-11 bg-transparent hover:bg-white/10 border border-white/30 hover:border-white/50 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 rounded-lg cursor-pointer transition-all shadow-xs"
          >
            {isProcessing && activePaymentMethod === "google" ? (
              <>
                <Loader2 className="size-4 animate-spin shrink-0" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <FaGoogle className="size-4 shrink-0" />
                <span className="truncate">{googleButtonLabel}</span>
              </>
            )}
          </Button>
        </div>

        <p className="pt-1 text-[11px] text-muted-foreground/80 text-center">
          Account created automatically with payment email
        </p>
      </DialogContent>
    </Dialog>
  )
}
