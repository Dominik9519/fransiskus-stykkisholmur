import LiveStreamManager from "../../../../components/admin/LiveStreamManager"
import { createClient } from "../../../../lib/supabase/server"

export default async function AdminLivePage() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("live_stream_settings")
    .select("*")
    .eq("id", 1)
    .single()

  if (error) {
    return (
      <div>
        <h1>Live Mass</h1>
        <p>Unable to load live stream settings: {error.message}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">Parish content</p>
          <h1>Live Mass</h1>
          <p>
            Manage the parish live stream and upcoming broadcast.
          </p>
        </div>
      </div>

      <LiveStreamManager initialSettings={data} />
    </div>
  )
}
