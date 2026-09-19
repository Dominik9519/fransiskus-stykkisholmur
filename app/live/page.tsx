import Header from "../../components/Header"
import Footer from "../../components/Footer"
import { liveStream } from "../../data/live"

export default function LivePage() {
  return (
    <>
      <Header />

      <main className="live-page">
        <section className="live-hero">
          <div className="live-hero-inner">
            <p className="eyebrow">Watch online</p>
            <h1>Live Stream</h1>
            <p>{liveStream.description}</p>
          </div>
        </section>

        <section className="live-section">
          <div className="live-card">
            <h2>{liveStream.title}</h2>

{liveStream.active ? (
  <>
    <div className="live-player">
      <iframe
        src={`https://www.youtube.com/embed/${liveStream.youtubeId}`}
        title={liveStream.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>

    <a
      className="button button-gold live-fullscreen-button"
      href={`https://www.youtube.com/watch?v=${liveStream.youtubeId}`}
      target="_blank"
      rel="noreferrer"
    >
      Open on YouTube
    </a>
  </>
) : (
  <div className="live-offline-box">
    <h2>There is no live Mass at the moment</h2>

    <p>
      Please check the Mass Times page for the next celebration.
    </p>

    <a className="button button-outline" href="/mass-times">
      View Mass Times
    </a>
  </div>
)}
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}