'use client'

import { useEffect, useState } from 'react'
import { getLinks } from '@/services/links'
import { getUser, signOut } from '@/services/auth'
import { User } from '@supabase/supabase-js'
import { Link } from '@/types/links'
import AddLinkForm from '@/components/links/AddLinksForm'
import LinkList from '@/components/links/link-list'
import LinkSkeleton from '@/components/links/LinkSkeleton'
import AuthForm from '@/components/auth/auth-form'
import { supabase } from '@/lib/supabase/client'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
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

  async function fetchUser() {
    const u = await getUser()
    setUser(u)
    if (u) fetchLinks()
    else setLoading(false)
  }

  useEffect(() => {
    fetchUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null)
        setLinks([])
        setLoading(false)
      }
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user)
        fetchLinks()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) return <LinkSkeleton />
  if (!user) return <AuthForm onSuccess={fetchUser} />

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Link Manager</h1>
      </div>
      <AddLinkForm onAdded={fetchLinks} />
      {!loading && <LinkList links={links} error={error} />}
    </main>
  )
}