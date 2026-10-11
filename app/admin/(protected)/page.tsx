import {
  CalendarDays,
  Clock3,
  FileText,
  Images,
  Radio,
  Users,
} from 'lucide-react'

export default function AdminDashboard() {
  return (
    <>
      <div className="admin-heading">
        <h1>Dashboard</h1>
        <p>Manage the parish website from one place.</p>
      </div>

      <div className="admin-dashboard-grid">
        <a className="admin-dashboard-card" href="/admin/mass-times">
          <Clock3 size={25} />
          <strong>Mass Times</strong>
          <span>Manage weekly Mass schedule</span>
        </a>

        <a className="admin-dashboard-card" href="/admin/news">
          <FileText size={25} />
          <strong>News</strong>
          <span>Add and edit parish news</span>
        </a>

        <a className="admin-dashboard-card" href="/admin/events">
          <CalendarDays size={25} />
          <strong>Events</strong>
          <span>Manage upcoming events</span>
        </a>

        <a className="admin-dashboard-card" href="/admin/live">
          <Radio size={25} />
          <strong>Live Mass</strong>
          <span>Control the YouTube live stream</span>
        </a>

        <a className="admin-dashboard-card" href="/admin/gallery">
          <Images size={25} />
          <strong>Gallery</strong>
          <span>Create albums and upload photos</span>
        </a>

        <a className="admin-dashboard-card" href="/admin/users">
          <Users size={25} />
          <strong>Users & Access</strong>
          <span>Manage parish administrators</span>
        </a>
      </div>
    </>
  )
}
