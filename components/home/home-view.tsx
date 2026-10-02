"use client"

import { useState, useRef } from "react"
import { VideoBackground } from "./video-background"
import { HeroHeader } from "./hero-header"
import { MediaCatalog } from "./media-catalog"
import { SubscriptionModal } from "./subscription-modal"
import { MemberStatusModal } from "./member-status-modal"
import { AudioPlayerBar } from "./audio-player-bar"
import { VideoModal } from "./video-modal"
import { INITIAL_MEDIA_ITEMS } from "./mock-data"
import { MediaItem, SubscriptionTier, UserSubscription } from "./types"

export function HomeView() {
  const [subscription, setSubscription] = useState<UserSubscription>({
    tier: "free",
    email: null,
    activeUntil: null,
    autoRenew: true,
  })

  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false)
  const [selectedPaymentItem, setSelectedPaymentItem] = useState<MediaItem | null>(null)
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false)
  const [activeItem, setActiveItem] = useState<MediaItem | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [selectedVideoItem, setSelectedVideoItem] = useState<MediaItem | null>(null)

  const videoRef = useRef<HTMLVideoElement | null>(null)

  const handleToggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.muted = false
        videoRef.current.volume = 1.0
        videoRef.current.play().catch(() => {})
        setIsMuted(false)
      } else {
        videoRef.current.muted = true
        setIsMuted(true)
      }
    }
  }

  const handleWatchVideo = (item: MediaItem) => {
    if (isPlaying) {
      setIsPlaying(false)
    }
    if (videoRef.current) {
      videoRef.current.muted = true
      setIsMuted(true)
    }
    setSelectedVideoItem(item)
    setIsVideoModalOpen(true)
  }

  const handleTogglePlay = (item: MediaItem) => {
    if (item.type === "video") {
      const isPurchased = (subscription.purchasedItemIds ?? []).includes(item.id)
      const isUnlocked = !item.isExclusive || isPurchased
      if (isUnlocked) {
        handleWatchVideo(item)
      } else {
        handleOpenPayment(item)
      }
      return
    }

    if (activeItem?.id === item.id && isPlaying) {
      setIsPlaying(false)
    } else {
      setActiveItem(item)
      setIsPlaying(true)
      if (videoRef.current) {
        videoRef.current.muted = true
        setIsMuted(true)
      }
    }
  }

  const handleOpenPayment = (item: MediaItem) => {
    setSelectedPaymentItem(item)
    setIsSubscriptionModalOpen(true)
  }

  const handleSuccessfulSubscription = (
    tier: SubscriptionTier,
    email: string,
    itemId?: string
  ) => {
    const nextYear = new Date()
    nextYear.setFullYear(nextYear.getFullYear() + 1)

    setSubscription((prev) => {
      const updatedPurchased = itemId
        ? Array.from(new Set([...(prev.purchasedItemIds ?? []), itemId]))
        : prev.purchasedItemIds

      return {
        ...prev,
        tier: tier !== "free" ? tier : prev.tier,
        email,
        activeUntil:
          tier === "yearly"
            ? nextYear.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : prev.activeUntil,
        autoRenew: tier === "yearly",
        purchasedItemIds: updatedPurchased,
      }
    })
  }

  const handleSignInMock = (email: string, tier: SubscriptionTier) => {
    const nextYear = new Date()
    nextYear.setFullYear(nextYear.getFullYear() + 1)

    setSubscription({
      tier,
      email,
      activeUntil:
        tier === "yearly"
          ? nextYear.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : null,
      autoRenew: true,
    })
  }

  const handleSignOut = () => {
    setSubscription({
      tier: "free",
      email: null,
      activeUntil: null,
      autoRenew: true,
    })
  }

  return (
    <div className="relative min-h-screen flex flex-col w-full overflow-x-hidden">
      <VideoBackground ref={videoRef} isMuted={isMuted} />

      <HeroHeader
        subscription={subscription}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenMemberModal={() => setIsMemberModalOpen(true)}
      />

      <main
        id="vault-section"
        className="relative z-10 w-full min-w-full bg-transparent border-t border-white/10 flex flex-col items-center pt-8 sm:pt-10 overflow-x-hidden"
      >
        <MediaCatalog
          items={INITIAL_MEDIA_ITEMS}
          subscription={subscription}
          activePlayingId={isPlaying ? activeItem?.id ?? null : null}
          onTogglePlay={handleTogglePlay}
          onOpenPayment={handleOpenPayment}
          onWatchVideo={handleWatchVideo}
        />
      </main>

      <AudioPlayerBar
        item={activeItem}
        isPlaying={isPlaying}
        subscription={subscription}
        onTogglePlay={() => setIsPlaying((prev) => !prev)}
        onClose={() => {
          setIsPlaying(false)
          setActiveItem(null)
        }}
        onOpenSubscription={() => {
          if (activeItem) {
            handleOpenPayment(activeItem)
          }
        }}
      />

      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => {
          setIsSubscriptionModalOpen(false)
        }}
        item={selectedPaymentItem}
        onSuccessfulSubscription={handleSuccessfulSubscription}
      />

      <MemberStatusModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        subscription={subscription}
        onSignInMock={handleSignInMock}
        onSignOut={handleSignOut}
      />

      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => {
          setIsVideoModalOpen(false)
          setSelectedVideoItem(null)
        }}
        item={selectedVideoItem}
      />
    </div>
  )
}
