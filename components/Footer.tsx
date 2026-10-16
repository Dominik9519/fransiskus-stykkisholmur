import { MapPin, Clock3, Mail } from "lucide-react"
import { unstable_cache } from "next/cache"
import Mark from "./Mark"
import { getContactSettings } from "../lib/data/contact"

const getFooterContact = unstable_cache(
  async () => getContactSettings(),
  ["footer-contact"],
  {
    revalidate: 60,
    tags: ["homepage-data"],
  }
)

export default async function Footer() {
  const contact = await getFooterContact()

  const mapsUrl =
    contact.maps_url ||
    `https://maps.google.com/?q=${encodeURIComponent(
      `${contact.address}, ${contact.postal_code}`
    )}`

  const phoneHref = contact.phone.replace(/\s+/g, "")

  return (
    <footer id="hafa-samband">
      <div className="footer-main">
        <Mark compact />

        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
        >
          <MapPin size={19} />
          <span>
            {contact.address}
            <br />
            {contact.postal_code}
          </span>
        </a>

        <a href={`tel:${phoneHref}`}>
          <Clock3 size={19} />
          <span>
            {contact.priest}
            <br />
            {contact.phone}
          </span>
        </a>

        <a href={`mailto:${contact.email}`}>
          <Mail size={19} />
          <span>{contact.email}</span>
        </a>

        {contact.facebook_url && (
          <a
            className="social-link"
            href={contact.facebook_url}
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
          >
            <strong aria-hidden="true">f</strong>
          </a>
        )}
      </div>

      <div className="footer-legal">
        <a href="/privacy">Privacy &amp; Cookies</a>
      </div>
    </footer>
  )
}
