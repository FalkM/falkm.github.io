'use client'

import AuthForm from '@/components/auth/auth-form'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function LoginPage() {
	const router = useRouter()

	useEffect(() => {
		console.log('LOGIN PAGE URL:', window.location.href)
		async function handleInviteToken() {
			const hash = window.location.hash
			console.log('HAS HASH:', !!hash)
			console.log('HASH TYPE:', hash ? new URLSearchParams(hash.substring(1)).get('type') : 'none')
			if (!hash) return

			const params = new URLSearchParams(hash.substring(1))
			const accessToken = params.get('access_token')
			const refreshToken = params.get('refresh_token')
			const type = params.get('type')

			if (accessToken && refreshToken && (type === 'invite' || type === 'signup')) {
				console.log('CALLING SET SESSION')
				const { error } = await supabase.auth.setSession({
					access_token: accessToken,
					refresh_token: refreshToken,
				})
				console.log('SET SESSION ERROR:', error?.message ?? 'none')
			}
		}

		handleInviteToken()

		const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
			console.log('AUTH EVENT:', event)
			console.log('HAS SESSION:', !!session)
			console.log('HAS PASSWORD:', session?.user?.user_metadata?.has_password)
			if (event === 'SIGNED_IN' && session?.user) {
				const hasPassword = session.user.user_metadata?.has_password
				router.push(hasPassword ? '/' : '/auth/set-password')
			}
		})

		return () => subscription.unsubscribe()
	}, [])

	return <AuthForm />
}