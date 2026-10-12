import ParishPagesManager from "../../../../components/admin/ParishPagesManager"
import { createClient } from "../../../../lib/supabase/server"

export default async function AdminParishPagesPage() {
  const supabase = await createClient()

  const { data: pages, error } = await supabase
    .from("parish_pages")
    .select(`
      id,
      slug,
      title,
      eyebrow,
      intro,
      published,
      parish_page_sections (
        id,
        page_id,
        heading,
        text,
        sort_order
      )
    `)
    .order("title", { ascending: true })

  if (error) {
    return (
      <div>
        <h1>Parish Pages</h1>
        <p>Unable to load parish pages: {error.message}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">Parish content</p>
          <h1>Parish Pages</h1>
          <p>
            Edit the main informational pages of the parish website.
          </p>
        </div>
      </div>

      <ParishPagesManager initialPages={pages ?? []} />
    </div>
  )
}
