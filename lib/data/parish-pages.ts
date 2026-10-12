import { createClient } from '../supabase/server'

export type PublicParishSection = {
  id: string
  heading: string
  text: string
  sort_order: number
}

export type PublicParishPage = {
  id: string
  slug: string
  title: string
  eyebrow: string | null
  intro: string | null
  sections: PublicParishSection[]
}

export async function getPublishedParishPage(
  slug: string
): Promise<PublicParishPage | null> {
  const supabase = await createClient()

  const { data: page, error: pageError } = await supabase
    .from('parish_pages')
    .select(`
      id,
      slug,
      title,
      eyebrow,
      intro
    `)
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle()

  if (pageError) {
    throw new Error(
      `Unable to load parish page: ${pageError.message}`
    )
  }

  if (!page) {
    return null
  }

  const { data: sections, error: sectionsError } =
    await supabase
      .from('parish_page_sections')
      .select(`
        id,
        heading,
        text,
        sort_order
      `)
      .eq('page_id', page.id)
      .order('sort_order', { ascending: true })

  if (sectionsError) {
    throw new Error(
      `Unable to load parish page sections: ${sectionsError.message}`
    )
  }

  return {
    ...page,
    sections: sections ?? [],
  }
}
