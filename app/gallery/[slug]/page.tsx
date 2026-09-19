import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import { galleryAlbums } from "../../../data/gallery"
import { notFound } from "next/navigation"

export default async function GalleryAlbumPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const album = galleryAlbums.find(
    (item) => item.slug === slug && item.published
  )

  if (!album) {
    notFound()
  }

  return (
    <>
      <Header />

      <main className="gallery-album-page">
        <section className="gallery-album-header">
          <p className="eyebrow">{album.date}</p>
          <h1>{album.title}</h1>
        </section>

        <section className="gallery-photos">
          {album.photos.map((photo, index) => (
            <div className="gallery-photo" key={`${photo}-${index}`}>
              <img
                src={photo}
                alt={`${album.title} photo ${index + 1}`}
              />
            </div>
          ))}
        </section>

        <div className="gallery-back">
          <a href="/gallery">← Back to Gallery</a>
        </div>
      </main>

      <Footer />
    </>
  )
}