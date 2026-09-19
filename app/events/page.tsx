import Header from "../../components/Header"
import Footer from "../../components/Footer"
import { eventsItems } from "../../data/events"

export default function EventsPage() {
  const publishedEvents = eventsItems.filter((item) => item.published)

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
                  <div className="events-list-image">
                    <img src={item.image} alt={item.title} />
                  </div>

                  <div className="events-list-content">
                    <p className="events-type">{item.type}</p>
                    <h2>{item.title}</h2>

                    <div className="events-meta">
                      <span>{item.date}</span>
                      <span>{item.time}</span>
                      <span>{item.location}</span>
                    </div>

                    <p>{item.excerpt}</p>

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