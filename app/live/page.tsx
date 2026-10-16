import type { Metadata } from "next"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import LivePlayer from "../../components/LivePlayer"
import {
  getLiveStreamSettings,
  getYouTubeId,
  formatLiveSchedule,
} from "../../lib/data/live"

export const metadata: Metadata = {
  title: "Live Stream",
  description:
    "Watch Holy Mass and parish broadcasts live from St. Francis of Assisi Parish in Stykkishólmur.",
  alternates: {
    canonical: "/live",
  },
}

export const dynamic = "force-dynamic"

export default async function LivePage() {
  const liveStream = await getLiveStreamSettings()
  const youtubeId = getYouTubeId(liveStream.youtube_url)
  const scheduled = formatLiveSchedule(liveStream.scheduled_at)

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

            {liveStream.live_now && youtubeId ? (
              <>
                <LivePlayer
                  youtubeId={youtubeId}
                  title={liveStream.title}
                />

                <a
                  className="button button-gold live-fullscreen-button"
                  href={liveStream.youtube_url || "#"}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open on YouTube
                </a>
              </>
            ) : (
              <div className="live-offline-box">
                <h2>There is no live Mass at the moment</h2>

                {scheduled ? (
                  <p>
                    Next scheduled broadcast: <strong>{scheduled}</strong>
                  </p>
                ) : (
                  <p>
                    Please check the Mass Times page for the next celebration.
                  </p>
                )}

                <a
                  className="button button-outline"
                  href="/mass-times"
                >
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
