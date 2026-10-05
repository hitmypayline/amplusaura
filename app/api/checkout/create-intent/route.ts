import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { hashPassword, signAuthToken, getCurrentUser } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const { email, password, itemId, tier, price } = await req.json()

    if (!email || !itemId || !price) {
      return NextResponse.json({ error: "Missing required checkout parameters" }, { status: 400 })
    }

    const normalizedEmail = String(email).trim().toLowerCase()
    let userId: string

    const existingUsers = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1)

    if (existingUsers.length > 0) {
      userId = existingUsers[0].id
    } else {
      const defaultPassword = password && password.trim() ? password.trim() : "Member2026!"
      const passwordHash = await hashPassword(defaultPassword)

      const customer = await stripe.customers.create({
        email: normalizedEmail,
      })

      const newUsers = await db
        .insert(users)
        .values({
          email: normalizedEmail,
          passwordHash,
          stripeCustomerId: customer.id,
        })
        .returning()

      userId = newUsers[0].id
    }

    const amountInCents = Math.round(Number(price) * 100)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId,
        itemId,
        tier: tier || "song_onetime",
        email: normalizedEmail,
      },
    })

    const token = await signAuthToken({ userId, email: normalizedEmail })

    const response = NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      userId,
      amount: amountInCents,
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
    return NextResponse.json({ error: error?.message || "Failed to create payment intent" }, { status: 500 })
  }
}
