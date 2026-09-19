import Header from "@/components/Header"
import { massTimes } from "@/data/mass-times"
import Footer from "@/components/Footer"

export default function MassTimesPage() {
  return (
    <>
      <Header />

      <main className="mass-times-page">
      <section className="mass-times-hero">
        <div className="mass-times-hero-inner">
          <p className="eyebrow">Worship with us</p>

          <h1>Mass Times</h1>

          <p className="mass-times-intro">
            Join us for Holy Mass at St. Francis of Assisi Parish
            in Stykkishólmur.
          </p>
        </div>
      </section>

      <section className="mass-times-section">
        <div className="mass-times-grid">
          {massTimes.map((day) => (
            <article className="mass-day-card" key={day.day}>
              <h2>{day.day}</h2>

              {day.services.map((service, index) => (
                <div className="mass-service" key={index}>
                  <div className="mass-time">
                    {service.time}
                  </div>

                  <div className="mass-details">
                    <strong>{service.church}</strong>
                    <span>{service.location}</span>
                    <small>{service.language}</small>
                  </div>
                </div>
              ))}
            </article>
          ))}
        </div>
      </section>
    </main>
  <Footer />
    </>
  )
}