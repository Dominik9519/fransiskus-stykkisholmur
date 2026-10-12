import Header from "../../components/Header"
import Footer from "../../components/Footer"
import {
  getPublishedEvents,
  formatEventDate,
  formatEventTime,
} from "../../lib/data/events"

export const dynamic = "force-dynamic"

export default async function EventsPage() {
  const publishedEvents = await getPublishedEvents()

  return (
    <>
      <Header />

      <main className="events-page">
        <section className="events-hero">
          <div className="events-hero-inner">
            <p className="eyebrow">Parish life</p>
            <h1>Events</h1>
            <p>
              Upcoming events and gatherings at St. Francis of Assisi Parish
              in Stykkishólmur.
            </p>
          </div>
        </section>

        <section className="events-list-section">
          <div className="events-list-grid">
            {publishedEvents.map((item) => (
              <article className="events-list-card" key={item.slug}>
                <a href={`/events/${item.slug}`}>
                  {item.image_url && (
                    <div className="events-list-image">
                      <img
                        src={item.image_url}
                        alt={item.title}
                      />
                    </div>
                  )}

                  <div className="events-list-content">
                    <p className="events-type">
                      {item.type || "Event"}
                    </p>

                    <h2>{item.title}</h2>

                    <div className="events-meta">
                      <span>{formatEventDate(item.event_date)}</span>

                      {item.event_time && (
                        <span>{formatEventTime(item.event_time)}</span>
                      )}

                      {item.location && (
                        <span>{item.location}</span>
                      )}
                    </div>

                    {item.excerpt && <p>{item.excerpt}</p>}

                    <span className="events-read-more">
                      View event →
                    </span>
                  </div>
                </a>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
