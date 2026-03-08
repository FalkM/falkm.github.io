import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseAdmin = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
	const { email } = await req.json()
	if (!email) {
		return NextResponse.json({ error: 'Email is required' }, { status: 400 })
	}

	const { error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
		redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/set-password`,
	})

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 })
	}

	return NextResponse.json({
		success: true,
		expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
	})
}