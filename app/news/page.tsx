import Header from "../../components/Header"
import Footer from "../../components/Footer"
import { newsItems } from "../../data/news"

export default function NewsPage() {
  const publishedNews = newsItems.filter((item) => item.published)

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
                    <img src={item.image} alt="" />
                  </div>

                  <div className="news-list-content">
                    <p className="news-date">{item.date}</p>
                    <h2>{item.title}</h2>
                    <p>{item.excerpt}</p>
                    <span className="news-read-more">Read more →</span>
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