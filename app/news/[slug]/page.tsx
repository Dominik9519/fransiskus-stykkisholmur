import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import { newsItems } from "../../../data/news"
import { notFound } from "next/navigation"

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const article = newsItems.find(
    (item) => item.slug === slug && item.published
  )

  if (!article) {
    notFound()
  }

  return (
    <>
      <Header />

      <main className="news-article-page">
        <article className="news-article">
          <p className="eyebrow">Parish news</p>
          <h1>{article.title}</h1>
          <p className="news-article-date">{article.date}</p>

          <div className="news-article-image">
            <img src={article.image} alt="" />
          </div>

          <div className="news-article-body">
            {article.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <a className="news-back-link" href="/news">
            ← Back to News
          </a>
        </article>
      </main>

      <Footer />
    </>
  )
}