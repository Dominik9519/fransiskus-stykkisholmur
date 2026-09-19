import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import { parishPages } from "../../../data/parish"
import { notFound } from "next/navigation"

type ParishPageKey = keyof typeof parishPages

export default async function ParishPage({
  params,
}: {
  params: Promise<{ page: string }>
}) {
  const { page } = await params

  if (!(page in parishPages)) {
    notFound()
  }

  const content = parishPages[page as ParishPageKey]

  return (
    <>
      <Header />

      <main className="parish-page">
        <section className="parish-hero">
          <div className="parish-hero-inner">
            <p className="eyebrow">{content.eyebrow}</p>
            <h1>{content.title}</h1>
            <p>{content.intro}</p>
          </div>
        </section>

        <section className="parish-content">
          {content.sections.map((section, index) => (
            <article className="parish-section" key={index}>
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