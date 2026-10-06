import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users, purchases } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { stripe } from "@/lib/stripe"
import { hashPassword, signAuthToken } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const { paymentIntentId, itemId, tier, email, password, price } = await req.json()

    if (!itemId || !tier || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const normalizedEmail = String(email).trim().toLowerCase()
    let userId: string

    const existingUsers = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1)

    if (existingUsers.length > 0) {
      userId = existingUsers[0].id
    } else {
      const defaultPassword = password && password.trim() ? password.trim() : "Member2026!"
      const passwordHash = await hashPassword(defaultPassword)

      const newUsers = await db
        .insert(users)
        .values({
          email: normalizedEmail,
          passwordHash,
        })
        .returning()

      userId = newUsers[0].id
    }

    if (paymentIntentId) {
      try {
        await stripe.paymentIntents.confirm(paymentIntentId, {
          payment_method: "pm_card_visa",
          return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}`,
        })
      } catch (stripeErr) {
        console.warn("Stripe confirm error:", stripeErr)
      }
    }

    const nextYear = new Date()
    nextYear.setFullYear(nextYear.getFullYear() + 1)

    const existingPurchase = await db
      .select()
      .from(purchases)
      .where(and(eq(purchases.userId, userId), eq(purchases.mediaItemId, itemId)))
      .limit(1)

    if (!existingPurchase.length) {
      await db.insert(purchases).values({
        userId,
        mediaItemId: itemId,
        tier,
        pricePaid: String(price || "29.00"),
        stripePaymentIntentId: paymentIntentId || null,
        autoRenew: tier === "yearly" || tier === "video_yearly",
        expiresAt: tier === "yearly" || tier === "video_yearly" ? nextYear : null,
      })
    }

    const userPurchases = await db
      .select()
      .from(purchases)
      .where(eq(purchases.userId, userId))

    const purchasedItemIds = userPurchases.map((p) => p.mediaItemId)

    const token = await signAuthToken({ userId, email: normalizedEmail })

    const response = NextResponse.json({
      success: true,
      purchasedItemIds,
      tier,
      activeUntil:
        tier === "yearly" || tier === "video_yearly"
          ? nextYear.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "Permanent Lifetime Access",
      autoRenew: tier === "yearly" || tier === "video_yearly",
    })

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    })

    return response
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to confirm purchase" }, { status: 500 })
  }
}