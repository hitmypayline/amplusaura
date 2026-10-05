import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { db } from "@/lib/db"
import { purchases } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

export async function POST(req: Request) {
  const body = await req.text()
  const headerPayload = await headers()
  const signature = headerPayload.get("stripe-signature")

  let event: any

  try {
    if (process.env.STRIPE_WEBHOOK_SECRET && signature) {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      )
    } else {
      event = JSON.parse(body)
    }
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook signature verification failed: ${err.message}` }, { status: 400 })
  }

  try {
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object
      const { userId, itemId, tier } = paymentIntent.metadata || {}

      if (userId && itemId) {
        const nextYear = new Date()
        nextYear.setFullYear(nextYear.getFullYear() + 1)

        const existing = await db
          .select()
          .from(purchases)
          .where(and(eq(purchases.userId, userId), eq(purchases.mediaItemId, itemId)))
          .limit(1)

        if (!existing.length) {
          await db.insert(purchases).values({
            userId,
            mediaItemId: itemId,
            tier: tier || "song_onetime",
            pricePaid: String((paymentIntent.amount / 100).toFixed(2)),
            stripePaymentIntentId: paymentIntent.id,
            autoRenew: tier === "yearly" || tier === "video_yearly",
            expiresAt: tier === "yearly" || tier === "video_yearly" ? nextYear : null,
          })
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Webhook processing failed" }, { status: 500 })
  }
}
