import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import { eventsItems } from "../../../data/events"
import { notFound } from "next/navigation"

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const event = eventsItems.find(
    (item) => item.slug === slug && item.published
  )

  if (!event) {
    notFound()
  }

  return (
    <>
      <Header />

      <main className="event-article-page">
        <article className="event-article">
          <p className="eyebrow">{event.type}</p>

          <h1>{event.title}</h1>

          <div className="event-meta">
            <span>{event.date}</span>
            <span>{event.time}</span>
            <span>{event.location}</span>
          </div>

          <div className="event-article-image">
            <img src={event.image} alt={event.title} />
          </div>

          <div className="event-article-body">
            {event.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <a className="event-back-link" href="/events">
            ← Back to Events
          </a>
        </article>
      </main>

      <Footer />
    </>
  )
}