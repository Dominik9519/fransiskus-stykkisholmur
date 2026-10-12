import GalleryManager from "../../../../components/admin/GalleryManager"
import { createClient } from "../../../../lib/supabase/server"

export default async function AdminGalleryPage() {
  const supabase = await createClient()

  const { data: albums, error } = await supabase
    .from("gallery_albums")
    .select(`
      id,
      slug,
      title,
      album_date,
      cover_image_url,
      published,
      gallery_photos (
        id,
        album_id,
        image_url,
        caption,
        sort_order,
        created_at
      )
    `)
    .order("album_date", { ascending: false })

  if (error) {
    return (
      <div>
        <h1>Gallery</h1>
        <p>Unable to load gallery: {error.message}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">Parish content</p>
          <h1>Gallery</h1>
          <p>
            Create photo albums and manage parish photos.
          </p>
        </div>
      </div>

      <GalleryManager initialAlbums={albums ?? []} />
    </div>
  )
}
