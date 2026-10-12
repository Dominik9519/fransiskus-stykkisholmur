import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import { getPublishedParishPage } from "../../../lib/data/parish-pages"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function ParishPage({
  params,
}: {
  params: Promise<{ page: string }>
}) {
  const { page } = await params

  const content = await getPublishedParishPage(page)

  if (!content) {
    notFound()
  }

  return (
    <>
      <Header />

      <main className="parish-page">
        <section className="parish-hero">
          <div className="parish-hero-inner">
            {content.eyebrow && (
              <p className="eyebrow">
                {content.eyebrow}
              </p>
            )}

            <h1>{content.title}</h1>

            {content.intro && (
              <p>{content.intro}</p>
            )}
          </div>
        </section>

        <section className="parish-content">
          {content.sections.map((section) => (
            <article
              className="parish-section"
              key={section.id}
            >
              <h2>{section.heading}</h2>
              <p>{section.text}</p>
            </article>
          ))}
        </section>
      </main>

      <Footer />
    </>
  )
}
