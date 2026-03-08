import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config({ path: '.env.test' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

async function setup() {
  const { data: existingUsers } = await supabase.auth.admin.listUsers()
  const emails = existingUsers.users.map(u => u.email)

  // Only create if they don't exist
  if (!emails.includes('user@test.com')) {
    await supabase.auth.admin.createUser({
      email: 'user@test.com',
      password: 'password123',
      email_confirm: true,
    })
  }

  if (!emails.includes('admin@test.com')) {
    const { data } = await supabase.auth.admin.createUser({
      email: 'admin@test.com',
      password: 'password123',
      email_confirm: true,
    })

    if (data.user) {
      await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', data.user.id)
    }
  }

  console.log('Test users ready')
}

setup()