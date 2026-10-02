export type MediaType = "song" | "video"

export interface MediaItem {
  id: string
  title: string
  type: MediaType
  duration: string
  releaseDate: string
  isExclusive: boolean
  genre?: string
  bpm?: string
  tags?: string[]
  price: number
  thumbnailUrl?: string
}

export type SubscriptionTier = "free" | "yearly" | "lifetime"

export interface UserSubscription {
  tier: SubscriptionTier
  email: string | null
  activeUntil: string | null
  autoRenew: boolean
  purchasedItemIds?: string[]
}

