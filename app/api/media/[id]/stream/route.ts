import { get } from "@vercel/blob"
import { INITIAL_MEDIA_ITEMS } from "@/components/home/mock-data"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const item = INITIAL_MEDIA_ITEMS.find((m) => m.id === id)

    if (!item || !item.streamUrl) {
      return new Response("Media not found", { status: 404 })
    }

    const range = req.headers.get("range")
    const getOptions: any = {
      token: process.env.BLOB_READ_WRITE_TOKEN,
      access: "private",
    }
    if (range) {
      getOptions.headers = { range }
    }

    const result = await get(item.streamUrl, getOptions)

    if (!result) {
      return new Response("Media stream not available", { status: 404 })
    }

    const responseHeaders = new Headers()
    for (const [key, value] of result.headers.entries()) {
      responseHeaders.set(key, value)
    }

    const contentType = item.type === "video" ? "video/mp4" : "audio/mpeg"
    responseHeaders.set("Content-Type", contentType)
    responseHeaders.set("Accept-Ranges", "bytes")

    const hasContentRange = responseHeaders.has("content-range")
    const status = (range || hasContentRange) ? 206 : (result.statusCode || 200)

    return new Response(result.stream as any, {
      status,
      headers: responseHeaders,
    })
  } catch (error: any) {
    console.error("Stream route error:", error)
    return new Response(error?.message || "Failed to stream media", { status: 500 })
  }
}