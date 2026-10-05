import { pgTable, uuid, varchar, text, numeric, boolean, timestamp, jsonb } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

export const mediaItems = pgTable("media_items", {
  id: varchar("id", { length: 128 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  type: varchar("type", { length: 32 }).notNull(),
  duration: varchar("duration", { length: 32 }).notNull(),
  releaseDate: varchar("release_date", { length: 32 }).notNull(),
  isExclusive: boolean("is_exclusive").default(true).notNull(),
  genre: varchar("genre", { length: 128 }),
  bpm: varchar("bpm", { length: 64 }),
  tags: jsonb("tags").$type<string[]>().default([]),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  thumbnailUrl: text("thumbnail_url"),
  streamUrl: text("stream_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

export const purchases = pgTable("purchases", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  mediaItemId: varchar("media_item_id", { length: 128 })
    .references(() => mediaItems.id, { onDelete: "cascade" })
    .notNull(),
  tier: varchar("tier", { length: 64 }).notNull(),
  pricePaid: numeric("price_paid", { precision: 10, scale: 2 }).notNull(),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
  autoRenew: boolean("auto_renew").default(false).notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type MediaItemDb = typeof mediaItems.$inferSelect
export type NewMediaItemDb = typeof mediaItems.$inferInsert
export type Purchase = typeof purchases.$inferSelect
export type NewPurchase = typeof purchases.$inferInsert
