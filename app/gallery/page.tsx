import Header from "../../components/Header"
import Footer from "../../components/Footer"
import {
  getPublishedGalleryAlbums,
  formatGalleryDate,
} from "../../lib/data/gallery"

export const dynamic = "force-dynamic"

export default async function GalleryPage() {
  const albums = await getPublishedGalleryAlbums()

  return (
    <>
      <Header />

      <main className="gallery-page">
        <section className="gallery-hero">
          <div className="gallery-hero-inner">
            <p className="eyebrow">Parish moments</p>
            <h1>Gallery</h1>
            <p>
              Photos from parish life, celebrations and community events
              in Stykkishólmur.
            </p>
          </div>
        </section>

        <section className="gallery-section">
          <div className="gallery-grid">
            {albums.map((album) => (
              <a
                className="gallery-card"
                href={`/gallery/${album.slug}`}
                key={album.slug}
              >
                {album.cover_image_url && (
                  <div className="gallery-cover">
                    <img
                      src={album.cover_image_url}
                      alt={album.title}
                    />
                  </div>
                )}

                <div className="gallery-card-content">
                  <p>{formatGalleryDate(album.album_date)}</p>
                  <h2>{album.title}</h2>

                  <span>
                    {album.gallery_photos.length}{" "}
                    {album.gallery_photos.length === 1
                      ? "photo"
                      : "photos"}{" "}
                    →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
