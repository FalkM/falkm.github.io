'use client'
import { useState } from 'react'
import { InviteRecord } from '@/model/invite-record'

export default function InvitePage() {
	const [email, setEmail] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [invites, setInvites] = useState<InviteRecord[]>([])

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

	return (
		<main className="p-8 max-w-2xl mx-auto">
			<h1 className="text-3xl font-bold mb-6">Invite User</h1>
			<div className="flex gap-2 mb-8">
				<input
					type="email"
					placeholder="user@email.com"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="border rounded px-3 py-2 text-sm flex-1"
					suppressHydrationWarning
				/>
				<button
					onClick={handleInvite}
					disabled={loading || !email}
					className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
				>
					{loading ? 'Sending...' : 'Send Invite'}
				</button>
			</div>
			{error && <p className="text-red-500 text-sm mb-4">{error}</p>}
			{invites.length > 0 && (
				<div className="grid gap-4">
					{invites.map((invite, i) => (
						<div key={i} className="border rounded-lg p-4 flex justify-between items-center">
							<span className="font-medium text-sm">{invite.email}</span>
							<span className="text-xs text-gray-400">
								Expires: {new Date(invite.expiresAt).toLocaleString()}
							</span>
						</div>
					))}
				</div>
			)}
		</main>
	)
}