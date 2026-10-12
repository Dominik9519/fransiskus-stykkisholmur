import type { Metadata } from "next"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import {
  getPublishedNews,
  formatNewsDate,
} from "../../lib/data/news"

export const metadata: Metadata = {
  title: "News",
  description:
    "Latest parish news and announcements from St. Francis of Assisi Parish in Stykkishólmur, Iceland.",
  alternates: {
    canonical: "/news",
  },
}

export const dynamic = "force-dynamic"

export default async function NewsPage() {
  const publishedNews = await getPublishedNews()

  return (
    <>
      <Header />

      <main className="news-page">
        <section className="news-hero">
          <div className="news-hero-inner">
            <p className="eyebrow">Parish updates</p>
            <h1>News</h1>
            <p>
              Latest news and announcements from St. Francis of Assisi Parish
              in Stykkishólmur.
            </p>
          </div>
        </section>

        <section className="news-list-section">
          <div className="news-list-grid">
            {publishedNews.map((item) => (
              <article className="news-list-card" key={item.slug}>
                <a href={`/news/${item.slug}`}>
                  <div className="news-list-image">
                    {item.image_url ? (
                      <img src={item.image_url} alt="" />
                    ) : (
                      <div className="news-image-placeholder" />
                    )}
                  </div>

                  <div className="news-list-content">
                    <p className="news-date">
                      {formatNewsDate(item.published_at)}
                    </p>

                    <h2>{item.title}</h2>
                    <p>{item.excerpt}</p>

                    <span className="news-read-more">
                      Read more →
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
