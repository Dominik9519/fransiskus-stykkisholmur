'use client'

import { useState } from 'react'

type LivePlayerProps = {
  youtubeId: string
  title: string
}

export default function LivePlayer({
  youtubeId,
  title,
}: LivePlayerProps) {
  const [loaded, setLoaded] = useState(false)

  if (loaded) {
    return (
      <div className="live-player">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <div className="live-player live-player-privacy">
      <div className="live-player-privacy-inner">
        <span className="live-privacy-label">External content</span>

        <h3>Live stream ready to load</h3>

        <p>
          This live stream is provided by YouTube. The player is not
          loaded automatically to protect your privacy. Loading it will
          connect your browser to YouTube.
        </p>

        <button
          type="button"
          className="button button-gold"
          onClick={() => setLoaded(true)}
        >
          Load live stream
        </button>
      </div>
    </div>
  )
}
