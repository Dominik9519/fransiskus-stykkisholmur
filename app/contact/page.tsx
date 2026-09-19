import Header from "../../components/Header"
import Footer from "../../components/Footer"
import { contactInfo } from "../../data/contact"
import { Mail, MapPin, Phone } from "lucide-react"

export default function ContactPage() {
  return (
    <>
      <Header />

      <main className="contact-page">
        <section className="contact-hero">
          <div className="contact-hero-inner">
            <p className="eyebrow">Get in touch</p>
            <h1>Contact</h1>
            <p>
              Contact St. Francis of Assisi Parish in Stykkishólmur.
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
                {contactInfo.postalCode}
              </p>

              <a
                href="https://maps.google.com/?q=Austurgata+7,+340+Stykkisholmur"
                target="_blank"
                rel="noreferrer"
              >
                Open in Google Maps →
              </a>
            </div>

            <div className="contact-card">
              <Phone size={24} />

              <h2>Parish priest</h2>

              <p>
                {contactInfo.priest}
                <br />
                {contactInfo.phone}
              </p>

              <a href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}>
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