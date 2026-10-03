"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Eye,
  CheckCircle2,
  User,
  ChevronDown,
  Volume2,
  VolumeX,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProfileAvatar } from "./profile-avatar"
import { UserSubscription } from "./types"

interface HeroHeaderProps {
  subscription: UserSubscription
  isMuted: boolean
  onToggleMute: () => void
  onOpenMemberModal: () => void
}

export function HeroHeader({
  subscription,
  isMuted,
  onToggleMute,
  onOpenMemberModal,
}: HeroHeaderProps) {
  const [viewCount, setViewCount] = useState(1918)

  useEffect(() => {
    const timer = setInterval(() => {
      setViewCount((prev) => prev + (Math.random() > 0.6 ? 1 : 0))
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  const isSubscribed = subscription.tier !== "free"

  return (
    <header className="relative w-full min-h-[100dvh] flex flex-col justify-between items-center px-4 pt-6 pb-6 z-10">
      <div className="w-full max-w-2xl flex items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleMute}
          aria-label={isMuted ? "Unmute video sound" : "Mute video sound"}
          className="size-8.5 rounded-full cursor-pointer bg-transparent hover:bg-white/10 border border-white/25 text-white shadow-xs flex items-center justify-center transition-all"
        >
          {isMuted ? (
            <VolumeX className="size-3.5 text-white/80" />
          ) : (
            <Volume2 className="size-3.5 text-white/80" />
          )}
        </Button>

        <div className="flex items-center gap-2">
          {isSubscribed ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenMemberModal}
              className="gap-1.5 cursor-pointer text-xs rounded-full bg-transparent hover:bg-white/10 border border-white/25 text-white shadow-xs"
            >
              <CheckCircle2 className="size-3 text-emerald-400" />
              <span className="capitalize">{subscription.tier} Member</span>
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenMemberModal}
              className="gap-1.5 cursor-pointer text-xs rounded-full bg-transparent hover:bg-white/10 border border-white/25 text-white shadow-xs"
            >
              <User className="size-3.5 text-white/80" />
              <span>Sign In</span>
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center text-center space-y-4 max-w-md w-full">
        <ProfileAvatar size={96} />

        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              swagsxn
            </h1>
            <Badge
              variant="outline"
              className="text-[10px] py-0 px-1.5 h-4 bg-transparent text-white border-white/25"
            >
              PRO
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2 py-1">
          <Link
            href="mailto:contact@swagsxn.art"
            aria-label="Email"
            className="group relative p-1.5 rounded-full bg-transparent hover:bg-white/10  transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center"
          >
            <Image
              src="/icons/diamond-email.png"
              alt="Email"
              width={32}
              height={32}
              className="size-10 object-contain drop-shadow-[0_2px_8px_rgba(255,255,255,0.3)] transition-transform duration-300 group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]"
            />
          </Link>
          <Link
            href="https://youtube.com"
            target="_blank"
            rel="noreferrer"
            aria-label="YouTube"
            className="group relative p-1.5 rounded-full bg-transparent hover:bg-white/10  transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center"
          >
            <Image
              src="/icons/diamond-youtube.png"
              alt="YouTube"
              width={32}
              height={32}
              className="size-10 object-contain drop-shadow-[0_2px_8px_rgba(255,255,255,0.3)] transition-transform duration-300 group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]"
            />
          </Link>
          <Link
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="group relative p-1.5 rounded-full bg-transparent hover:bg-white/10  transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center"
          >
            <Image
              src="/icons/diamond-instagram.png"
              alt="Instagram"
              width={32}
              height={32}
              className="size-10 object-contain drop-shadow-[0_2px_8px_rgba(255,255,255,0.3)] transition-transform duration-300 group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]"
            />
          </Link>
          <Link
            href="https://tiktok.com"
            target="_blank"
            rel="noreferrer"
            aria-label="TikTok"
            className="group relative p-1.5 rounded-full bg-transparent hover:bg-white/10  transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center"
          >
            <Image
              src="/icons/diamond-tiktok.png"
              alt="TikTok"
              width={32}
              height={32}
              className="size-10 object-contain drop-shadow-[0_2px_8px_rgba(255,255,255,0.3)] transition-transform duration-300 group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]"
            />
          </Link>
          <Link
            href="https://spotify.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Spotify"
            className="group relative p-1.5 rounded-full bg-transparent hover:bg-white/10  transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center"
          >
            <Image
              src="/icons/diamond-spotify.png"
              alt="Spotify"
              width={32}
              height={32}
              className="size-10 object-contain drop-shadow-[0_2px_8px_rgba(255,255,255,0.3)] transition-transform duration-300 group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]"
            />
          </Link>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-white/90 bg-transparent px-3 py-1 rounded-full border border-white/20">
          <Eye className="size-3.5" />
          <span className="font-mono">{viewCount.toLocaleString()}</span>
          <span>views</span>
        </div>
      </div>

      <button
        onClick={() => {
          const el = document.getElementById("media-catalog-section")
          el?.scrollIntoView({ behavior: "smooth" })
        }}
        className="group flex flex-col items-center gap-1.5 text-xs text-white/80 hover:text-white transition-colors cursor-pointer pb-2"
      >
        <span className="font-medium tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
          Scroll to unlock vault
        </span>
        <ChevronDown className="size-4 animate-bounce text-white/70 group-hover:text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]" />
      </button>
    </header>
  )
}
