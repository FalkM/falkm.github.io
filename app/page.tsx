'use client'

import { useEffect, useState } from 'react'
import { getLinks, Link } from '@/services/links'
import AddLinkForm from '../components/AddLinksForm'
import LinkSkeleton from '../components/LinkSkeleton'
import StatusBadge from '../components/StatusBadge'


export default function Home() {
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  async function fetchLinks() {
    try {
      const data = await getLinks()
      setLinks(data)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLinks()
  }, [])

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Link Manager</h1>
      <AddLinkForm onAdded={fetchLinks} />
      {loading && <LinkSkeleton />}
      {error && (
        <div className="border border-yellow-400 bg-yellow-50 p-4 rounded-lg text-yellow-800">
          ⚠️ Could not connect to database.
        </div>
      )}
      {!loading && !error && links.length === 0 && (
        <div className="border p-4 rounded-lg text-gray-500">
          No links yet. Add one to get started.
        </div>
      )}
      {!loading && !error && links.length > 0 && (
        <div className="grid gap-4">
          {links.map((link) => (
            <div key={link.id} className="border p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl font-semibold text-blue-600 hover:underline"
                >
                  {link.title ?? link.url}
                </a>
                <StatusBadge status={link.status} />
              </div>
              <p className="text-gray-400 text-sm mt-1">{link.url}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}