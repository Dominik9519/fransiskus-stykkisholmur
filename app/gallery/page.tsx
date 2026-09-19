import Header from "../../components/Header"
import Footer from "../../components/Footer"
import { galleryAlbums } from "../../data/gallery"

export default function GalleryPage() {
  const albums = galleryAlbums.filter((album) => album.published)

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
                <div className="gallery-cover">
                  <img src={album.cover} alt={album.title} />
                </div>

                <div className="gallery-card-content">
                  <p>{album.date}</p>
                  <h2>{album.title}</h2>
                  <span>{album.photos.length} photos →</span>
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