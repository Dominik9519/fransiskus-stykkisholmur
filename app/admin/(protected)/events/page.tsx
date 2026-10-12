import EventsManager from "../../../../components/admin/EventsManager"
import { createClient } from "../../../../lib/supabase/server"

export default async function AdminEventsPage() {
  const supabase = await createClient()

  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true })
    .order("event_time", { ascending: true })

  if (error) {
    return (
      <div>
        <h1>Events</h1>
        <p>Unable to load events: {error.message}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">Parish content</p>
          <h1>Events</h1>
          <p>
            Create and manage parish events shown on the website.
          </p>
        </div>
      </div>

      <EventsManager initialEvents={events ?? []} />
    </div>
  )
}
