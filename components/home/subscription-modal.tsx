"use client"

import { useState } from "react"
import { Check, Loader2, Music, Film, Mail, Lock } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { MediaItem, SubscriptionTier } from "./types"

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  item?: MediaItem | null
  currentEmail?: string | null
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
  currentEmail,
  onSuccessfulSubscription,
}: SubscriptionModalProps) {
  const [selectedVideoTier, setSelectedVideoTier] = useState<"yearly" | "lifetime">("yearly")
  const [isProcessing, setIsProcessing] = useState(false)
  const [activePaymentMethod, setActivePaymentMethod] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  if (!item) return null

  const isAudioItem = item.type === "song"
  const isLoggedIn = !!currentEmail

  const effectiveEmail = isLoggedIn ? currentEmail : email.trim()

  const handlePayment = async (method: string) => {
    setError(null)

    if (!isLoggedIn && !email.trim()) {
      setError("Please enter your email to create or access your account.")
      return
    }

    if (!isLoggedIn && !password.trim()) {
      setError("Please set a password for your account.")
      return
    }

    const price = isAudioItem
      ? item.price.toFixed(2)
      : selectedVideoTier === "yearly"
      ? "29.00"
      : "79.00"

    const tierToSave: SubscriptionTier = isAudioItem ? "yearly" : selectedVideoTier

    setActivePaymentMethod(method)
    setIsProcessing(true)

    try {
      const intentRes = await fetch("/api/checkout/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: effectiveEmail,
          password: password.trim() || undefined,
          itemId: item.id,
          tier: isAudioItem ? "song_onetime" : `video_${selectedVideoTier}`,
          price,
        }),
      })

      const intentData = await intentRes.json()

      if (!intentRes.ok) {
        throw new Error(intentData.error || "Failed to initialize payment")
      }

      const confirmRes = await fetch("/api/checkout/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId: intentData.clientSecret?.split("_secret")[0],
          itemId: item.id,
          tier: isAudioItem ? "song_onetime" : `video_${selectedVideoTier}`,
          email: effectiveEmail,
          password: password.trim() || undefined,
          price,
        }),
      })

      const confirmData = await confirmRes.json()

      if (!confirmRes.ok) {
        throw new Error(confirmData.error || "Failed to confirm purchase")
      }

      onSuccessfulSubscription(tierToSave, effectiveEmail, item.id)
      onClose()
    } catch (err: any) {
      setError(err?.message || "Payment could not be completed.")
    } finally {
      setIsProcessing(false)
      setActivePaymentMethod(null)
    }
  }

  const appleButtonLabel = isAudioItem
    ? `Pay $${item.price.toFixed(2)} with Apple Pay`
    : selectedVideoTier === "yearly"
    ? "Subscribe $29/yr with Apple Pay"
    : "Buy $79 Lifetime with Apple Pay"

  const googleButtonLabel = isAudioItem
    ? `Pay $${item.price.toFixed(2)} with Google Pay`
    : selectedVideoTier === "yearly"
    ? "Subscribe $29/yr with Google Pay"
    : "Buy $79 Lifetime with Google Pay"

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[calc(100vw-1.5rem)] max-w-[calc(100vw-1.5rem)] sm:max-w-md p-4 sm:p-5 bg-black/80 backdrop-blur-2xl border-white/15 shadow-2xl rounded-xl overflow-hidden box-border max-h-[92dvh] overflow-y-auto">
        <DialogHeader className="space-y-1 text-left pr-7 min-w-0">
          <div className="flex items-center gap-1.5">
            {isAudioItem ? (
              <Music className="size-4 text-white/80 shrink-0" />
            ) : (
              <Film className="size-4 text-white/80 shrink-0" />
            )}
            <DialogTitle className="text-base sm:text-lg font-bold tracking-tight text-white truncate">
              {isAudioItem ? "Unlock Master Song" : "Subscribe to Visualizer"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-white/70 leading-normal">
            {isAudioItem
              ? "Direct purchase for lifetime streaming and download."
              : selectedVideoTier === "yearly"
              ? "1-year access to all 4K videos."
              : "Permanent lifetime VIP access to all 4K videos."}
          </DialogDescription>
        </DialogHeader>

        <div className="p-3 my-2 rounded-lg border border-white/15 bg-white/5 space-y-2 backdrop-blur-md">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <Badge
                variant="outline"
                className="text-[10px] px-1 py-0 h-4 uppercase tracking-wider font-semibold shrink-0 text-white border-white/25"
              >
                {isAudioItem ? "Lifetime Audio" : "4K Studio Video"}
              </Badge>
              {item.genre && (
                <span className="text-xs text-white/60 truncate">
                  {item.genre}
                </span>
              )}
            </div>
            <div className="text-right shrink-0">
              <span className="text-base font-bold text-white">
                ${isAudioItem ? item.price.toFixed(2) : selectedVideoTier === "yearly" ? "29.00" : "79.00"}
              </span>
              <span className="text-[10px] text-white/60 ml-1">
                {isAudioItem ? "one-time" : selectedVideoTier === "yearly" ? "/ yr" : "one-time"}
              </span>
            </div>
          </div>

          <div className="min-w-0 space-y-0.5 pt-0.5">
            <p className="text-sm font-semibold text-white truncate">
              {item.title}
            </p>
            <p className="text-[11px] text-white/60 leading-normal">
              {isAudioItem
                ? "Instant playback & lifetime streaming"
                : "Includes high definition 4K studio footage"}
            </p>
          </div>
        </div>

        {!isAudioItem && (
          <div className="grid grid-cols-2 gap-2 my-2">
            <button
              type="button"
              onClick={() => setSelectedVideoTier("yearly")}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                selectedVideoTier === "yearly"
                  ? "border-white/50 bg-white/15 text-white ring-1 ring-white/30"
                  : "border-white/15 bg-transparent text-white/70 hover:border-white/30 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-white">
                  Yearly
                </span>
                <Badge
                  variant={selectedVideoTier === "yearly" ? "default" : "outline"}
                  className="text-[9px] py-0 px-1 h-4 bg-transparent text-white border-white/25"
                >
                  Annual
                </Badge>
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-base font-bold text-white">$29</span>
                <span className="text-[10px] text-white/60">/ year</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedVideoTier("lifetime")}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                selectedVideoTier === "lifetime"
                  ? "border-white/50 bg-white/15 text-white ring-1 ring-white/30"
                  : "border-white/15 bg-transparent text-white/70 hover:border-white/30 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-white">
                  Lifetime
                </span>
                <Badge
                  variant={selectedVideoTier === "lifetime" ? "default" : "secondary"}
                  className="text-[9px] py-0 px-1 h-4 bg-transparent text-white border-white/25"
                >
                  VIP
                </Badge>
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-base font-bold text-white">$79</span>
                <span className="text-[10px] text-white/60">one-time</span>
              </div>
            </button>
          </div>
        )}

        <div className="space-y-2.5 my-2">
          {isLoggedIn ? (
            <div className="p-2.5 rounded-lg bg-white/5 border border-white/15 flex items-center justify-between text-xs">
              <span className="text-white/60">Logged in as</span>
              <span className="font-mono text-white font-medium truncate max-w-[200px]">
                {currentEmail}
              </span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-white/90 flex items-center gap-1.5">
                  <Mail className="size-3 text-white/60" />
                  <span>Account Email</span>
                </label>
                <Input
                  type="email"
                  placeholder="youremail@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-9 text-xs px-2.5 bg-white/5 border-white/15 text-white placeholder:text-white/30 backdrop-blur-md"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-white/90 flex items-center gap-1.5">
                  <Lock className="size-3 text-white/60" />
                  <span>Account Password</span>
                </label>
                <Input
                  type="password"
                  placeholder="Create password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-9 text-xs px-2.5 bg-white/5 border-white/15 text-white placeholder:text-white/30 backdrop-blur-md"
                />
              </div>
            </div>
          )}

          {error && (
            <p className="text-xs text-red-400 font-medium bg-red-500/10 border border-red-500/20 p-2 rounded-md">
              {error}
            </p>
          )}
        </div>

        <div className="space-y-2 pt-2 border-t border-white/15">
          <Button
            type="button"
            variant="default"
            size="lg"
            disabled={isProcessing}
            onClick={() => handlePayment("apple")}
            className="w-full h-10 bg-transparent hover:bg-white/10 border border-white/30 hover:border-white/50 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 rounded-lg cursor-pointer transition-all shadow-xs"
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
            onClick={() => handlePayment("google")}
            className="w-full h-10 bg-transparent hover:bg-white/10 border border-white/30 hover:border-white/50 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 rounded-lg cursor-pointer transition-all shadow-xs"
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

        <p className="text-[11px] text-white/50 text-center pt-1">
          Instant account setup & permanent access restoration
        </p>
      </DialogContent>
    </Dialog>
  )
}
