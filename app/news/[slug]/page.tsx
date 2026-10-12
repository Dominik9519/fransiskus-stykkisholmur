import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import {
  getPublishedNewsBySlug,
  formatNewsDate,
} from "../../../lib/data/news"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const article = await getPublishedNewsBySlug(slug)

  if (!article) {
    notFound()
  }

  const paragraphs = article.content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  return (
    <>
      <Header />

      <main className="news-article-page">
        <article className="news-article">
          <p className="eyebrow">Parish news</p>

          <h1>{article.title}</h1>

          <p className="news-article-date">
            {formatNewsDate(article.published_at)}
          </p>

          {article.image_url && (
            <div className="news-article-image">
              <img
                src={article.image_url}
                alt={article.title}
              />
            </div>
          )}

          <div className="news-article-body">
            {paragraphs.map((paragraph, index) => (
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
