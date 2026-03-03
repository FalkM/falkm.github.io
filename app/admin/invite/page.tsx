'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface InviteRecord {
  email: string
  link: string
  expiresAt: string
  createdAt: string
}

export default function InvitePage() {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [invites, setInvites] = useState<InviteRecord[]>([])
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/'); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') { router.push('/'); return }
      setAuthorized(true)
    }
    checkAdmin()
  }, [])

  async function handleInvite() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)

      setInvites(prev => [{
        email,
        link: json.link,
        expiresAt: json.expiresAt,
        createdAt: new Date().toISOString()
      }, ...prev])
      setEmail('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  async function copyLink(link: string, index: number) {
    await navigator.clipboard.writeText(link)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  if (!authorized) return null

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Invite User</h1>

      {/* Input */}
      <div className="flex gap-2 mb-8">
        <input
          type="email"
          placeholder="user@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded px-3 py-2 text-sm flex-1"
        />
        <button
          onClick={handleInvite}
          disabled={loading || !email}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
        >
          {loading ? 'Generating...' : 'Generate Link'}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {/* Invite table */}
      {invites.length > 0 && (
        <div className="grid gap-4">
          {invites.map((invite, i) => (
            <div key={i} className="border rounded-lg p-4 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm">{invite.email}</span>
                <span className="text-xs text-gray-400">
                  Expires: {new Date(invite.expiresAt).toLocaleString()}
                </span>
              </div>
              <div className="flex gap-2 items-center bg-gray-50 border rounded px-3 py-2">
                <span className="text-xs text-gray-600 truncate flex-1">{invite.link}</span>
                <button
                  onClick={() => copyLink(invite.link, i)}
                  className="text-xs text-blue-600 hover:underline shrink-0"
                >
                  {copiedIndex === i ? '✅ Copied' : 'Copy'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}