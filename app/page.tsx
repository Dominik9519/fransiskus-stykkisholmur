import Header from "../components/Header";
import Footer from "../components/Footer";
import { newsItems } from "../data/news";
import { eventsItems } from "../data/events";
import { massTimes } from "../data/mass-times";

import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Mail,
  MapPin,
  Menu,
  Play,
  Search,
  X,
} from "lucide-react";



function SectionArrow() {
  return <ArrowRight aria-hidden="true" size={15} strokeWidth={1.8} />;
}

export default function Home() {
  const homepageNews = newsItems.find(
    (item) => item.published && item.showOnHomepage
  );

  const homepageEvents = eventsItems.filter(
  (item) => item.published && item.showOnHomepage
  );

  const homepageMasses = massTimes.flatMap((day) =>
  day.services.map((service) => ({
    day: day.day,
    ...service,
  }))
);

  return (
    <>
      <Header />

      <main>


      <section className="hero" id="heim">
        <img className="hero-image" src="/fransiskus-hero-v4.webp" alt="Church of Saint Francis of Assisi in Stykkishólmur" />
        <div className="hero-veil" />
        <div className="hero-content">
          <p className="eyebrow">Faith <span>·</span> Community <span>·</span> Snæfellsnes</p>
          <h1>
  Welcome to Our Parish<br />
  in Stykkishólmur
</h1>
          <p className="hero-lead">A living faith, a vibrant community and an open heart<br className="desktop-break" /> by Breiðafjörður.</p>
          <div className="hero-actions">
            <a className="button button-gold" href="/mass-times">
  View Mass Times
</a>
            <a className="button button-outline" href="#utsending"><Play size={15} fill="currentColor" /> Live stream</a>
          </div>
        </div>
      </section>

      <section className="content-grid" aria-label="Key information">
<article className="info-card mass-card" id="messur">
  <div className="card-heading">
    <h2>
      <CalendarDays size={20} />
      Upcoming Masses
    </h2>

    <a href="/mass-times">
      View all <SectionArrow />
    </a>
  </div>

  <div className="mass-list">
    {homepageMasses.slice(0, 3).map((mass, index) => (
      <div className="mass-row" key={`${mass.day}-${mass.time}-${index}`}>
        <strong>{mass.day}</strong>
        <span>{mass.time}</span>
        <span>
          {mass.language}
        </span>
      </div>
    ))}
  </div>
</article>

<article className="info-card news-card" id="frettir">
  <div className="card-heading">
    <h2>
      <svg
        className="news-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 5.5h11.5A1.5 1.5 0 0 1 18 7v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5.5Z" />
        <path d="M18 8h1a1 1 0 0 1 1 1v8a2 2 0 0 1-2 2" />
        <path d="M8 9h5" />
        <path d="M8 12h7" />
        <path d="M8 15h7" />
      </svg>

      News
    </h2>

    <a href="/news">
      View all <SectionArrow />
    </a>
  </div>

  {homepageNews && (
    <a href={`/news/${homepageNews.slug}`}>
      <div className="news-photo-wrap">
        <img
          src={homepageNews.image}
          alt={homepageNews.title}
        />
      </div>

      <h3>{homepageNews.title}</h3>
      <p>{homepageNews.date}</p>
    </a>
  )}
</article>

        <article className="info-card events-card" id="vidburdir">
  <div className="card-heading">
    <h2>
      <CalendarDays size={20} />
      Events
    </h2>

    <a href="/events">
      View all <SectionArrow />
    </a>
  </div>

  <div className="event-list">
    {homepageEvents.slice(0, 3).map((event) => (
      <a
        className="event-row"
        key={event.slug}
        href={`/events/${event.slug}`}
      >
        <strong>{event.date}</strong>

        <span>
          {event.title}
          <small>{event.type}</small>
        </span>
      </a>
    ))}
  </div>

  <a className="inline-link" href="/events">
    See more events <SectionArrow />
  </a>
</article>

        <article className="info-card live-card" id="utsending">
          <div className="card-heading"><h2><span className="live-dot" /> Live stream</h2></div>
          <a className="video-poster" href="#watch-live" aria-label="Watch the live stream">
            <span className="poster-cross" aria-hidden="true">✝</span><span className="play-button"><Play size={20} fill="currentColor" /></span><span className="poster-glow" />
          </a>
          <h3>Live from the chapel</h3><p>Watch Masses and parish events live.</p>
        </article>
      </section>

      <section className="quote-band" id="snaefellsnes">
        <img src="/stykkisholmur-panorama.jpg" alt="View over Stykkishólmur" />
        <div className="quote-panel"><blockquote>“Peace be with you.”</blockquote><p>— Luke 24:36</p><span /></div>
      </section>

    </main>
  <Footer />
  </>
  );
}
