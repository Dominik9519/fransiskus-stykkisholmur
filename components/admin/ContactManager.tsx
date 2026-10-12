'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'

type ContactSettings = {
  id: number
  parish_name: string
  address: string
  postal_code: string
  priest: string
  phone: string
  email: string
  facebook_url: string | null
  maps_url: string | null
}

export default function ContactManager({
  initialSettings,
}: {
  initialSettings: ContactSettings
}) {
  const router = useRouter()
  const supabase = createClient()

  const [parishName, setParishName] = useState(
    initialSettings.parish_name
  )

  const [address, setAddress] = useState(
    initialSettings.address
  )

  const [postalCode, setPostalCode] = useState(
    initialSettings.postal_code
  )

  const [priest, setPriest] = useState(
    initialSettings.priest
  )

  const [phone, setPhone] = useState(
    initialSettings.phone
  )

  const [email, setEmail] = useState(
    initialSettings.email
  )

  const [facebookUrl, setFacebookUrl] = useState(
    initialSettings.facebook_url || ''
  )

  const [mapsUrl, setMapsUrl] = useState(
    initialSettings.maps_url || ''
  )

  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  async function save(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setLoading(true)
    setSaved(false)
    setError('')

    try {
      const { error } = await supabase
        .from('contact_settings')
        .update({
          parish_name: parishName.trim(),
          address: address.trim(),
          postal_code: postalCode.trim(),
          priest: priest.trim(),
          phone: phone.trim(),
          email: email.trim(),
          facebook_url: facebookUrl.trim() || null,
          maps_url: mapsUrl.trim() || null,
        })
        .eq('id', 1)

      if (error) throw error

      setSaved(true)
      router.refresh()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to save contact settings.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      className="admin-live-form"
      onSubmit={save}
    >
      {error && (
        <div className="admin-error">{error}</div>
      )}

      {saved && (
        <div className="admin-success">
          Contact details saved.
        </div>
      )}

      <div className="admin-field">
        <label htmlFor="contact-parish-name">
          Parish name
        </label>

        <input
          id="contact-parish-name"
          value={parishName}
          onChange={(event) =>
            setParishName(event.target.value)
          }
          required
        />
      </div>

      <div className="admin-field">
        <label htmlFor="contact-address">
          Address
        </label>

        <input
          id="contact-address"
          value={address}
          onChange={(event) =>
            setAddress(event.target.value)
          }
          required
        />
      </div>

      <div className="admin-field">
        <label htmlFor="contact-postal">
          Postal code / city
        </label>

        <input
          id="contact-postal"
          value={postalCode}
          onChange={(event) =>
            setPostalCode(event.target.value)
          }
          required
        />
      </div>

      <div className="admin-field">
        <label htmlFor="contact-priest">
          Parish priest
        </label>

        <input
          id="contact-priest"
          value={priest}
          onChange={(event) =>
            setPriest(event.target.value)
          }
          required
        />
      </div>

      <div className="admin-field">
        <label htmlFor="contact-phone">
          Phone
        </label>

        <input
          id="contact-phone"
          value={phone}
          onChange={(event) =>
            setPhone(event.target.value)
          }
          required
        />
      </div>

      <div className="admin-field">
        <label htmlFor="contact-email">
          Email
        </label>

        <input
          id="contact-email"
          type="email"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          required
        />
      </div>

      <div className="admin-field">
        <label htmlFor="contact-maps">
          Google Maps link
        </label>

        <input
          id="contact-maps"
          type="url"
          value={mapsUrl}
          onChange={(event) =>
            setMapsUrl(event.target.value)
          }
        />
      </div>

      <div className="admin-field">
        <label htmlFor="contact-facebook">
          Facebook link
        </label>

        <input
          id="contact-facebook"
          type="url"
          value={facebookUrl}
          onChange={(event) =>
            setFacebookUrl(event.target.value)
          }
        />
      </div>

      <div style={{ marginTop: '24px' }}>
        <button
          type="submit"
          className="admin-button admin-button-auto"
          disabled={loading}
        >
          {loading
            ? 'Saving…'
            : 'Save Contact Details'}
        </button>
      </div>
    </form>
  )
}
