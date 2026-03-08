'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { signOut } from '@/services/auth'

const navItems = [
  { label: 'Links', href: '/' },
]

const adminItems = [
  { label: 'Invite User', href: '/admin/invite' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setEmail(user.email ?? null)

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      setIsAdmin(profile?.role === 'admin')
    }
    load()
  }, [])

  const items = isAdmin ? [...adminItems, ...navItems] : navItems

  return (
    <aside className="w-56 min-h-screen border-r flex flex-col justify-between p-4">
      <div>
        <h2 className="text-lg font-bold mb-6">Link Manager</h2>
        <nav className="flex flex-col gap-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded text-sm hover:bg-gray-100 hover:text-gray-900 ${
				pathname === item.href 
					? 'bg-gray-700 text-white font-medium' 
					: 'text-gray-400'
				}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex flex-col gap-1">
        {email && <p className="text-xs text-gray-400 truncate px-3">{email}</p>}
        <button
          onClick={() => signOut().then(() => { 
            // force a full page reload, which ensures the proxy reads the cleared session cookie
            window.location.href = '/auth/login' 
          })}
          className="px-3 py-2 rounded text-sm text-left text-gray-600 hover:bg-gray-100"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}