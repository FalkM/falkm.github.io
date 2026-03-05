'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function ConfirmPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Check if user has no password set (first login via magic link)
        const isFirstLogin = !session.user.user_metadata?.has_password
        if (isFirstLogin) {
          router.push('/auth/set-password')
        } else {
          router.push('/')
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <main className="p-8 max-w-sm mx-auto mt-20 text-center">
      {error
        ? <p className="text-red-500">{error}</p>
        : <p className="text-gray-500">Confirming your account...</p>
      }
    </main>
  )
}