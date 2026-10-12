import type { Metadata } from "next"
import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import {
  getPublishedNewsBySlug,
  formatNewsDate,
} from "../../../lib/data/news"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = await getPublishedNewsBySlug(slug)

  if (!article) {
    return {
      title: "News",
    }
  }

  const canonical = `https://stfrancis.is/news/${article.slug}`

  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "article",
      url: canonical,
      title: article.title,
      description: article.excerpt,
      images: article.image_url
        ? [
            {
              url: article.image_url,
              alt: article.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: article.image_url
        ? [article.image_url]
        : undefined,
    },
  }
}

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

  const articleImage = article.image_url
    ? article.image_url.startsWith("http")
      ? article.image_url
      : `https://stfrancis.is${article.image_url}`
    : undefined

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.published_at,
    mainEntityOfPage: `https://stfrancis.is/news/${article.slug}`,
    image: articleImage ? [articleImage] : undefined,
    author: {
      "@type": "Organization",
      name: "St. Francis of Assisi Parish",
      url: "https://stfrancis.is",
    },
    publisher: {
      "@type": "Organization",
      name: "St. Francis of Assisi Parish",
      url: "https://stfrancis.is",
      logo: {
        "@type": "ImageObject",
        url: "https://stfrancis.is/fransiskus-logo.webp",
      },
    },
  }

  const paragraphs = article.content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
        }}
      />

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
