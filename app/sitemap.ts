import type { MetadataRoute } from "next"
import { createClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic"

const baseUrl = "https://stfrancis.is"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: {
        persistSession: false,
      },
    }
  )

  const [
    newsResult,
    eventsResult,
    galleryResult,
    parishResult,
  ] = await Promise.all([
    supabase
      .from("news")
      .select("slug, updated_at")
      .eq("published", true),

    supabase
      .from("events")
      .select("slug, updated_at")
      .eq("published", true),

    supabase
      .from("gallery_albums")
      .select("slug, updated_at")
      .eq("published", true),

    supabase
      .from("parish_pages")
      .select("slug, updated_at")
      .eq("published", true),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/mass-times`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/news`,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/events`,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gallery`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/live`,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]

  const newsRoutes: MetadataRoute.Sitemap =
    (newsResult.data ?? []).map((item) => ({
      url: `${baseUrl}/news/${item.slug}`,
      lastModified: item.updated_at
        ? new Date(item.updated_at)
        : undefined,
      changeFrequency: "monthly",
      priority: 0.7,
    }))

  const eventRoutes: MetadataRoute.Sitemap =
    (eventsResult.data ?? []).map((item) => ({
      url: `${baseUrl}/events/${item.slug}`,
      lastModified: item.updated_at
        ? new Date(item.updated_at)
        : undefined,
      changeFrequency: "weekly",
      priority: 0.7,
    }))

  const galleryRoutes: MetadataRoute.Sitemap =
    (galleryResult.data ?? []).map((item) => ({
      url: `${baseUrl}/gallery/${item.slug}`,
      lastModified: item.updated_at
        ? new Date(item.updated_at)
        : undefined,
      changeFrequency: "monthly",
      priority: 0.6,
    }))

  const parishRoutes: MetadataRoute.Sitemap =
    (parishResult.data ?? []).map((item) => ({
      url: `${baseUrl}/parish/${item.slug}`,
      lastModified: item.updated_at
        ? new Date(item.updated_at)
        : undefined,
      changeFrequency: "monthly",
      priority: 0.7,
    }))

  return [
    ...staticRoutes,
    ...newsRoutes,
    ...eventRoutes,
    ...galleryRoutes,
    ...parishRoutes,
  ]
}
