import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users, purchases } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { comparePassword, signAuthToken } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const normalizedEmail = String(email).trim().toLowerCase()
    const userList = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1)

    if (!userList.length) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const user = userList[0]
    const isMatch = await comparePassword(password, user.passwordHash)

    if (!isMatch) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const token = await signAuthToken({ userId: user.id, email: user.email })

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

    const response = NextResponse.json({
      success: true,
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

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    })

    return response
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
