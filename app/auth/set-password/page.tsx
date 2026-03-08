'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function SetPasswordPage() {
	const router = useRouter()
	const [password, setPassword] = useState('')
	const [confirm, setConfirm] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		async function check() {
			const { data: { user } } = await supabase.auth.getUser()
			if (!user) router.push('/auth/login')
		}
		check()
	}, [])

	async function handleSubmit() {
		if (password !== confirm) {
			setError('Passwords do not match')
			return
		}
		if (password.length < 8) {
			setError('Password must be at least 8 characters')
			return
		}

		setLoading(true)
		setError(null)

		try {
			const { error: updateError } = await supabase.auth.updateUser({
				password,
				data: { has_password: true }  // mark password as set
			})
			if (updateError) throw updateError
			router.push('/')
		} catch (e) {
			setError(e instanceof Error ? e.message : 'Unknown error')
		} finally {
			setLoading(false)
		}
	}

	return (
		<main className="p-8 max-w-sm mx-auto mt-20">
			<div className="border p-6 rounded-lg flex flex-col gap-4">
				<h1 className="text-2xl font-bold">Set Your Password</h1>
				<p className="text-sm text-gray-500">
					Choose a password to use for future logins.
				</p>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="border rounded px-3 py-2 text-sm"
					suppressHydrationWarning
				/>
				<input
					type="password"
					placeholder="Confirm password"
					value={confirm}
					onChange={(e) => setConfirm(e.target.value)}
					className="border rounded px-3 py-2 text-sm"
					suppressHydrationWarning
				/>
				{error && <p className="text-red-500 text-sm">{error}</p>}
				<button
					onClick={handleSubmit}
					disabled={loading || !password || !confirm}
					className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
				>
					{loading ? 'Saving...' : 'Set Password'}
				</button>
			</div>
		</main>
	)
}