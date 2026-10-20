'use client'

import MuxPlayer from '@mux/mux-player-react'
import { useEffect, useState } from 'react'

type PlaybackData = {
  playbackId: string
  tokens: { playback: string; thumbnail: string; storyboard: string }
}

export function SecureVideoPlayer({ lessonID, title }: { lessonID: string; title: string }) {
  const [playback, setPlayback] = useState<PlaybackData | null>(null)
  const [message, setMessage] = useState('Preparing secure playback…')

  useEffect(() => {
    const controller = new AbortController()
    fetch(`/api/video-token/${encodeURIComponent(lessonID)}`, {
      credentials: 'include',
      cache: 'no-store',
      signal: controller.signal,
    })
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.message || 'Video playback is unavailable.')
        return data as PlaybackData
      })
      .then((data) => setPlayback(data))
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === 'AbortError') return
        setMessage(error instanceof Error ? error.message : 'Video playback is unavailable.')
      })

    return () => controller.abort()
  }, [lessonID])

  if (!playback) return <div className="lesson-media-placeholder" role="status">{message}</div>

  return <MuxPlayer
    playbackId={playback.playbackId}
    tokens={playback.tokens}
    metadata={{ video_title: title }}
    streamType="on-demand"
    accentColor="#465640"
    style={{ width: '100%', aspectRatio: '16 / 9' }}
  />
}
