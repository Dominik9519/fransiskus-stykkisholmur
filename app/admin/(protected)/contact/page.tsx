import ContactManager from "../../../../components/admin/ContactManager"
import { createClient } from "../../../../lib/supabase/server"

export default async function AdminContactPage() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("contact_settings")
    .select("*")
    .eq("id", 1)
    .single()

  if (error) {
    return (
      <div>
        <h1>Contact</h1>
        <p>Unable to load contact settings: {error.message}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">Parish content</p>
          <h1>Contact</h1>
          <p>
            Manage parish contact details shown on the website.
          </p>
        </div>
      </div>

      <ContactManager initialSettings={data} />
    </div>
  )
}
