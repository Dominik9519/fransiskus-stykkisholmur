import type { Metadata } from "next"
import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import {
  getPublishedEventBySlug,
  formatEventDate,
  formatEventTime,
} from "../../../lib/data/events"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const event = await getPublishedEventBySlug(slug)

  if (!event) {
    return {
      title: "Events",
    }
  }

  const canonical = `https://stfrancis.is/events/${event.slug}`

  return {
    title: event.title,
    description: event.excerpt || undefined,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "article",
      url: canonical,
      title: event.title,
      description: event.excerpt || undefined,
      images: event.image_url
        ? [
            {
              url: event.image_url,
              alt: event.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description: event.excerpt || undefined,
      images: event.image_url
        ? [event.image_url]
        : undefined,
    },
  }
}

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

  const eventImage = event.image_url
    ? event.image_url.startsWith("http")
      ? event.image_url
      : `https://stfrancis.is${event.image_url}`
    : undefined

  const eventStartDate = event.event_time
    ? `${event.event_date}T${formatEventTime(event.event_time)}:00Z`
    : event.event_date

  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.excerpt || undefined,
    startDate: eventStartDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode:
      "https://schema.org/OfflineEventAttendanceMode",
    url: `https://stfrancis.is/events/${event.slug}`,
    image: eventImage ? [eventImage] : undefined,
    location: event.location
      ? {
          "@type": "Place",
          name: event.location,
          address: {
            "@type": "PostalAddress",
            addressLocality: "Stykkishólmur",
            addressCountry: "IS",
          },
        }
      : undefined,
    organizer: {
      "@type": "Organization",
      name: "St. Francis of Assisi Parish",
      url: "https://stfrancis.is",
    },
  }

  const paragraphs = (event.content || "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(eventJsonLd).replace(/</g, "\\u003c"),
        }}
      />

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
