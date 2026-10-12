import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import {
  getPublishedEventBySlug,
  formatEventDate,
  formatEventTime,
} from "../../../lib/data/events"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const event = await getPublishedEventBySlug(slug)

  if (!event) {
    notFound()
  }

  const paragraphs = (event.content || "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  return (
    <>
      <Header />

      <main className="event-article-page">
        <article className="event-article">
          <p className="eyebrow">
            {event.type || "Parish event"}
          </p>

          <h1>{event.title}</h1>

          <div className="event-meta">
            <span>{formatEventDate(event.event_date)}</span>

            {event.event_time && (
              <span>{formatEventTime(event.event_time)}</span>
            )}

            {event.location && (
              <span>{event.location}</span>
            )}
          </div>

          {event.image_url && (
            <div className="event-article-image">
              <img
                src={event.image_url}
                alt={event.title}
              />
            </div>
          )}

          <div className="event-article-body">
            {paragraphs.map((paragraph, index) => (
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
