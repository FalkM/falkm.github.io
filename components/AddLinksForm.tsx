'use client'

import { useState } from 'react'
import { addLink } from '@/services/links'

interface Props {
  onAdded: () => void
}

export default function AddLinkForm({ onAdded }: Props) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    if (!url) return
    setLoading(true)
    setError(null)
    try {
      await addLink(url, title || undefined)
      setUrl('')
      setTitle('')
      onAdded()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border p-4 rounded-lg mb-6 flex flex-col gap-3">
      <h2 className="font-semibold text-lg">Add a link</h2>
      <input
        type="url"
        placeholder="https://youtube.com/watch?v=..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="border rounded px-3 py-2 text-sm w-full"
      />
      <input
        type="text"
        placeholder="Title (optional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border rounded px-3 py-2 text-sm w-full"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        onClick={handleSubmit}
        disabled={loading || !url}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Adding...' : 'Add Link'}
      </button>
    </div>
  )
}