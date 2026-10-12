import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import GalleryLightbox from "../../../components/GalleryLightbox"
import {
  getPublishedGalleryAlbumBySlug,
  formatGalleryDate,
} from "../../../lib/data/gallery"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

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
