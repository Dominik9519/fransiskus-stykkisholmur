import { createClient } from '../../../../lib/supabase/server'
import MassTimesManager from '../../../../components/admin/MassTimesManager'

export const dynamic = 'force-dynamic'

export default async function AdminMassTimesPage() {
  const supabase = await createClient()

  const { data: masses, error } = await supabase
    .from('mass_times')
    .select(
      'id, day_of_week, day_name, time, church, location, language, published, sort_order'
    )
    .order('day_of_week')
    .order('time')

  if (error) {
    throw new Error(error.message)
  }

  return (
    <>
      <div className="admin-heading">
        <h1>Mass Times</h1>
        <p>Manage the weekly Mass schedule shown on the parish website.</p>
      </div>

      <MassTimesManager initialMasses={masses ?? []} />
    </>
  )
}
