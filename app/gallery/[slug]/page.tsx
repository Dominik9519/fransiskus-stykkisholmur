import type { Metadata } from "next"
import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import GalleryLightbox from "../../../components/GalleryLightbox"
import {
  getPublishedGalleryAlbumBySlug,
  formatGalleryDate,
} from "../../../lib/data/gallery"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const album = await getPublishedGalleryAlbumBySlug(slug)

  if (!album) {
    return {
      title: "Gallery",
    }
  }

  const canonical = `https://stfrancis.is/gallery/${album.slug}`
  const description =
    `Photos from ${album.title} at St. Francis of Assisi Parish in Stykkishólmur.`

  return {
    title: album.title,
    description,

    alternates: {
      canonical,
    },

    openGraph: {
      type: "website",
      url: canonical,
      title: album.title,
      description,
      images: album.cover_image_url
        ? [
            {
              url: album.cover_image_url,
              alt: album.title,
            },
          ]
        : undefined,
    },

    twitter: {
      card: "summary_large_image",
      title: album.title,
      description,
      images: album.cover_image_url
        ? [album.cover_image_url]
        : undefined,
    },
  }
}

export default async function GalleryAlbumPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const album = await getPublishedGalleryAlbumBySlug(slug)

  if (!album) {
    notFound()
  }

  return (
    <>
      <Header />

      <main className="gallery-album-page">
        <section className="gallery-album-header">
          <p className="eyebrow">
            {formatGalleryDate(album.album_date)}
          </p>

          <h1>{album.title}</h1>
        </section>

        <GalleryLightbox
          photos={album.photos}
          title={album.title}
        />

        <div className="gallery-back">
          <a href="/gallery">
            ← Back to Gallery
          </a>
        </div>
      </main>

      <Footer />
    </>
  )
}
