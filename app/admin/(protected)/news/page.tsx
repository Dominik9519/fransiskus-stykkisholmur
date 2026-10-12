import { createClient } from '../../../../lib/supabase/server'
import NewsManager from '../../../../components/admin/NewsManager'

export const dynamic = 'force-dynamic'

export default async function AdminNewsPage() {
  const supabase = await createClient()

  const { data: news, error } = await supabase
    .from('news')
    .select(
      'id, slug, title, excerpt, content, image_url, published_at, published, show_on_homepage'
    )
    .order('published_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (
    <>
      <div className="admin-heading">
        <h1>News</h1>
        <p>Create and manage parish news articles.</p>
      </div>

      <NewsManager initialNews={news ?? []} />
    </>
  )
}
