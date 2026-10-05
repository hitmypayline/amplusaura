"use client"

import { useState } from "react"
import { LogOut, Lock, Mail, Loader2 } from "lucide-react"
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
import { UserSubscription } from "./types"

interface MemberStatusModalProps {
  isOpen: boolean
  onClose: () => void
  subscription: UserSubscription
  onSignInSuccess: (sub: UserSubscription) => void
  onSignOut: () => void
}

export function MemberStatusModal({
  isOpen,
  onClose,
  subscription,
  onSignInSuccess,
  onSignOut,
}: MemberStatusModalProps) {
  const [inputEmail, setInputEmail] = useState("")
  const [inputPassword, setInputPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isSubscribed = subscription.tier !== "free" || !!subscription.email

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputEmail.trim() || !inputPassword.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inputEmail.trim(),
          password: inputPassword,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Login failed")
      }

      if (data?.subscription) {
        onSignInSuccess(data.subscription)
      }

      onClose()
    } catch (err: any) {
      setError(err?.message || "Invalid credentials")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOutClick = async () => {
    setIsLoading(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } catch {}
    onSignOut()
    setIsLoading(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[calc(100vw-1.5rem)] max-w-[calc(100vw-1.5rem)] sm:max-w-md p-4 sm:p-6 bg-black/80 backdrop-blur-2xl border-white/15 shadow-2xl rounded-xl overflow-hidden box-border">
        <DialogHeader className="space-y-1 text-left pr-7 min-w-0">
          <DialogTitle className="text-base sm:text-lg font-bold tracking-tight text-white">
            {isSubscribed ? "Member Account & Access" : "Sign In"}
          </DialogTitle>
          <DialogDescription className="text-xs text-white/70 leading-normal">
            {isSubscribed
              ? "Manage your active subscription and playback permissions."
              : "Enter your email and password to access your account."}
          </DialogDescription>
        </DialogHeader>

        {isSubscribed ? (
          <div className="space-y-4 py-2">
            <div className="p-3.5 rounded-lg border border-white/10 bg-white/5 space-y-2.5 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">Plan Status</span>
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
                <span className="text-white/60">Associated Email</span>
                <span className="font-mono text-white">
                  {subscription.email || "customer@icloud.com"}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60">Access Validity</span>
                <span className="font-medium text-white">
                  {subscription.tier === "lifetime"
                    ? "Permanent Lifetime Access"
                    : subscription.activeUntil || "Valid for 365 Days"}
                </span>
              </div>

              {subscription.tier === "yearly" && (
                <div className="flex items-center justify-between text-xs pt-1.5 border-t border-white/10">
                  <span className="text-white/60">Auto Renewal</span>
                  <span className="text-emerald-400 font-medium">
                    Enabled
                  </span>
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              disabled={isLoading}
              onClick={handleSignOutClick}
              className="w-full text-xs text-white/70 hover:text-red-400 bg-white/5 hover:bg-red-500/10 border border-white/10 h-8 gap-1.5 cursor-pointer backdrop-blur-md transition-all"
            >
              {isLoading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <LogOut className="size-3.5" />
              )}
              <span>Sign Out</span>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSignIn} className="space-y-4 pt-2 pb-1">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/90 flex items-center gap-1.5">
                <Mail className="size-3 text-white/60" />
                <span>Email Address</span>
              </label>
              <Input
                type="email"
                placeholder="youremail@domain.com"
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                required
                className="h-10 text-sm px-3 bg-white/5 border-white/15 text-white placeholder:text-white/30 backdrop-blur-md focus-visible:ring-white/30"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-white/90 flex items-center gap-1.5">
                  <Lock className="size-3 text-white/60" />
                  <span>Password</span>
                </label>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                required
                className="h-10 text-sm px-3 bg-white/5 border-white/15 text-white placeholder:text-white/30 backdrop-blur-md focus-visible:ring-white/30"
              />
            </div>

            {error && (
              <p className="text-xs text-red-400 font-medium bg-red-500/10 border border-red-500/20 p-2 rounded-md">
                {error}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="w-full text-xs h-10 font-medium cursor-pointer bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-md transition-all mt-2 flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="size-3.5 animate-spin" />}
              <span>Sign In</span>
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
