import * as dotenv from "dotenv"
dotenv.config({ path: ".env.local" })
dotenv.config({ path: ".env" })

import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { mediaItems } from "./schema"

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql)

const INITIAL_MEDIA_ITEMS = [
  {
    id: "audio-1",
    title: "Penthouse Freestyle (VIP Master)",
    type: "song",
    duration: "3:42",
    releaseDate: "2026",
    isExclusive: true,
    genre: "Dark R&B / Trap",
    bpm: "97 BPM",
    tags: ["dark ambient", "trap beat"],
    price: "29.00",
    thumbnailUrl: "/avatar.jpg",
    streamUrl: "https://vj4vrdnd0iqz4pu3.private.blob.vercel-storage.com/songs/song1.mpeg",
  },
  {
    id: "audio-2",
    title: "Shadows in Amanda (Stems & Audio)",
    type: "song",
    duration: "2:58",
    releaseDate: "2026",
    isExclusive: true,
    genre: "Electronic",
    bpm: "117 BPM",
    tags: ["synthesizer", "club mix"],
    price: "29.00",
    thumbnailUrl: "/avatar.jpg",
    streamUrl: "https://vj4vrdnd0iqz4pu3.private.blob.vercel-storage.com/songs/song2.mpeg",
  },
  {
    id: "video-1",
    title: "Take Over (Pg County) - 4K Film",
    type: "video",
    duration: "17:06",
    releaseDate: "2026",
    isExclusive: true,
    genre: "4K Film",
    tags: ["4k visualizer", "studio session"],
    price: "29.00",
    thumbnailUrl: "/avatar.jpg",
    streamUrl: "https://vj4vrdnd0iqz4pu3.private.blob.vercel-storage.com/videos/Take%20Over%20(Pg%20County).mp4",
  },
  {
    id: "video-2",
    title: "Studio Live Jam & Production Breakdown",
    type: "video",
    duration: "18:22",
    releaseDate: "2026",
    isExclusive: true,
    genre: "Behind The Scenes",
    tags: ["exclusive film", "breakdown"],
    price: "29.00",
    thumbnailUrl: "/avatar.jpg",
  },
]

async function seed() {
  for (const item of INITIAL_MEDIA_ITEMS) {
    await db
      .insert(mediaItems)
      .values(item)
      .onConflictDoUpdate({
        target: mediaItems.id,
        set: item,
      })
  }
  console.log("Database updated successfully with Vercel Blob media items")
}

seed().catch(console.error)