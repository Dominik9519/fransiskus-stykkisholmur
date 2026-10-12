import Header from "../../components/Header"
import Footer from "../../components/Footer"
import { getContactSettings } from "../../lib/data/contact"
import { Mail, MapPin, Phone } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function ContactPage() {
  const contactInfo = await getContactSettings()

  const phoneLink = contactInfo.phone.replace(/[^\d+]/g, "")

  return (
    <>
      <Header />

      <main className="contact-page">
        <section className="contact-hero">
          <div className="contact-hero-inner">
            <p className="eyebrow">Get in touch</p>
            <h1>Contact</h1>
            <p>
              Contact {contactInfo.parish_name} Parish in Stykkishólmur.
            </p>
          </div>
        </section>

        <section className="contact-section">
          <div className="contact-grid">
            <div className="contact-card">
              <MapPin size={24} />

              <h2>Visit us</h2>

              <p>
                {contactInfo.address}
                <br />
                {contactInfo.postal_code}
              </p>

              {contactInfo.maps_url && (
                <a
                  href={contactInfo.maps_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open in Google Maps →
                </a>
              )}
            </div>

            <div className="contact-card">
              <Phone size={24} />

              <h2>Parish priest</h2>

              <p>
                {contactInfo.priest}
                <br />
                {contactInfo.phone}
              </p>

              <a href={`tel:${phoneLink}`}>
                Call →
              </a>
            </div>

            <div className="contact-card">
              <Mail size={24} />

              <h2>Email</h2>

              <p>{contactInfo.email}</p>

              <a href={`mailto:${contactInfo.email}`}>
                Send email →
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
