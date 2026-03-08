'use client'

import AuthForm from '@/components/auth/auth-form'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function LoginPage() {
	const router = useRouter()

	useEffect(() => {
		async function handleInviteToken() {
			const hash = window.location.hash
			if (!hash) return

			const params = new URLSearchParams(hash.substring(1))
			const accessToken = params.get('access_token')
			const refreshToken = params.get('refresh_token')
			const type = params.get('type')

			if (accessToken && refreshToken && (type === 'invite' || type === 'signup')) {
				const { data, error } = await supabase.auth.setSession({
					access_token: accessToken,
					refresh_token: refreshToken,
				})

				if (error) {
					console.error('setSession error:', error.message)
					return
				}

				if (data.session) {
					const hasPassword = data.session.user.user_metadata?.has_password
					router.push(hasPassword ? '/' : '/auth/set-password')
				}
			}
		}

		handleInviteToken()
	}, [])

	return <AuthForm />
}