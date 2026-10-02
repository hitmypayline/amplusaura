"use client"

import { useState } from "react"
import { LogOut } from "lucide-react"
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
import { SubscriptionTier, UserSubscription } from "./types"

interface MemberStatusModalProps {
  isOpen: boolean
  onClose: () => void
  subscription: UserSubscription
  onSignInMock: (email: string, tier: SubscriptionTier) => void
  onSignOut: () => void
}

export function MemberStatusModal({
  isOpen,
  onClose,
  subscription,
  onSignInMock,
  onSignOut,
}: MemberStatusModalProps) {
  const [inputEmail, setInputEmail] = useState("")
  const [selectedDemoTier, setSelectedDemoTier] = useState<SubscriptionTier>("yearly")

  const isSubscribed = subscription.tier !== "free"

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputEmail.trim()) return
    onSignInMock(inputEmail.trim(), selectedDemoTier)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[calc(100vw-1.5rem)] max-w-[calc(100vw-1.5rem)] sm:max-w-md p-4 sm:p-6 bg-black/80 backdrop-blur-2xl border-white/15 shadow-2xl rounded-xl overflow-hidden box-border">
        <DialogHeader className="space-y-1 text-left pr-7 min-w-0">
          <DialogTitle className="text-base sm:text-lg font-bold tracking-tight">
            {isSubscribed ? "Member Account & Access" : "Customer Sign In"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-normal">
            {isSubscribed
              ? "Manage your active subscription and playback permissions."
              : "Enter your payment email to restore your yearly or lifetime access."}
          </DialogDescription>
        </DialogHeader>

        {isSubscribed ? (
          <div className="space-y-4 py-2">
            <div className="p-3.5 rounded-lg border border-white/10 bg-white/5 space-y-2.5 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Plan Status</span>
                <Badge
                  variant={
                    subscription.tier === "lifetime" ? "default" : "secondary"
                  }
                  className="capitalize text-xs font-semibold"
                >
                  {subscription.tier} Pass
                </Badge>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Associated Email</span>
                <span className="font-mono text-foreground">
                  {subscription.email || "customer@icloud.com"}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Access Validity</span>
                <span className="font-medium text-foreground">
                  {subscription.tier === "lifetime"
                    ? "Permanent Lifetime Access"
                    : subscription.activeUntil || "Valid for 365 Days"}
                </span>
              </div>

              {subscription.tier === "yearly" && (
                <div className="flex items-center justify-between text-xs pt-1.5 border-t border-border/40">
                  <span className="text-muted-foreground">Auto Renewal</span>
                  <span className="text-emerald-500 font-medium">
                    Enabled
                  </span>
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onSignOut()
                onClose()
              }}
              className="w-full text-xs text-white/70 hover:text-red-400 bg-white/5 hover:bg-red-500/10 border border-white/10 h-8 gap-1.5 cursor-pointer backdrop-blur-md transition-all"
            >
              <LogOut className="size-3.5" />
              <span>Sign Out</span>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSignIn} className="space-y-5 pt-3 pb-1">
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground block">
                Account Email
              </label>
              <Input
                type="email"
                placeholder="youremail@icloud.com"
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                required
                className="h-10 text-sm px-3 bg-white/5 border-white/15 text-white placeholder:text-white/40 backdrop-blur-md"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground block">
                Restore Plan Tier
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="default"
                  onClick={() => setSelectedDemoTier("yearly")}
                  className={`text-xs h-9 cursor-pointer transition-all ${
                    selectedDemoTier === "yearly"
                      ? "bg-white/20 text-white border-white/40 ring-1 ring-white/30"
                      : "bg-white/5 text-white/70 border-white/15 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  Yearly Member
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="default"
                  onClick={() => setSelectedDemoTier("lifetime")}
                  className={`text-xs h-9 cursor-pointer transition-all ${
                    selectedDemoTier === "lifetime"
                      ? "bg-white/20 text-white border-white/40 ring-1 ring-white/30"
                      : "bg-white/5 text-white/70 border-white/15 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  Lifetime VIP
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full text-xs h-10 font-medium cursor-pointer bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-md transition-all"
            >
              Sign In with Magic Link
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
