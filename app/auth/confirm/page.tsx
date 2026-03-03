'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function ConfirmPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Supabase puts the token in the URL hash — it handles it automatically
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') router.push('/')
      if (event === 'PASSWORD_RECOVERY') router.push('/auth/reset-password')
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