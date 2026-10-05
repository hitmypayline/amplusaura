import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { users, purchases } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET() {
  try {
    const auth = await getCurrentUser()
    if (!auth) {
      return NextResponse.json({
        user: null,
        subscription: {
          tier: "free",
          email: null,
          activeUntil: null,
          autoRenew: false,
          purchasedItemIds: [],
        },
      })
    }

    const userList = await db.select().from(users).where(eq(users.id, auth.userId)).limit(1)
    if (!userList.length) {
      return NextResponse.json({
        user: null,
        subscription: {
          tier: "free",
          email: null,
          activeUntil: null,
          autoRenew: false,
          purchasedItemIds: [],
        },
      })
    }

    const user = userList[0]
    const userPurchases = await db
      .select()
      .from(purchases)
      .where(eq(purchases.userId, user.id))

    const purchasedItemIds = userPurchases.map((p) => p.mediaItemId)
    
    let tier = "free"
    let activeUntil: string | null = null
    let autoRenew = false

    const hasLifetime = userPurchases.some(
      (p) => p.tier === "lifetime" || p.tier === "video_lifetime"
    )
    const yearlyPurchase = userPurchases.find(
      (p) => p.tier === "yearly" || p.tier === "video_yearly"
    )

    if (hasLifetime) {
      tier = "lifetime"
      activeUntil = "Permanent Lifetime Access"
      autoRenew = false
    } else if (yearlyPurchase) {
      tier = "yearly"
      activeUntil = yearlyPurchase.expiresAt
        ? new Date(yearlyPurchase.expiresAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "Valid for 1 Year"
      autoRenew = true
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
      },
      subscription: {
        tier,
        email: user.email,
        activeUntil,
        autoRenew,
        purchasedItemIds,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user state" }, { status: 500 })
  }
}
