'use client'

import { useEffect, useState } from 'react'
import { getLinks } from '@/services/links'
import { Link } from '@/types/links'
import AddLinkForm from '@/components/links/AddLinksForm'
import LinkList from '@/components/links/link-list'
import LinkSkeleton from '@/components/links/LinkSkeleton'
import { supabase } from '@/lib/supabase/client'

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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') fetchLinks()
      if (event === 'SIGNED_OUT') setLinks([])
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) return <LinkSkeleton />

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <AddLinkForm onAdded={fetchLinks} />
      <LinkList links={links} error={error} />
    </main>
  )
}