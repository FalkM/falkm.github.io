import { supabase } from '@/lib/supabase/client'
import { Link } from '@/model/links'

export async function addLink(url: string, title?: string): Promise<Link> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('links')
    .insert({ url, title, user_id: user.id })
    .select()
    .single()

  if (error) throw error
  return data as Link
}

export async function getLinks(): Promise<Link[]> {
  const { data, error } = await supabase
    .from('links')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Link[]
}

export async function deleteLink(id: string): Promise<void> {
  const { error } = await supabase.from('links').delete().eq('id', id)
  if (error) throw error
}