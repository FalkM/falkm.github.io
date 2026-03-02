import { supabase } from '../lib/supabase/client';

export type LinkStatus = 'pending' | 'downloaded' | 'not_downloadable';

export interface Link {
  id: string;
  url: string;
  title: string | null;
  status: LinkStatus;
  created_at: string;
  updated_at: string;
}

export async function addLink(url: string, title?: string): Promise<Link> {
  const { data, error } = await supabase
    .from('links')
    .insert({ url, title })
    .select()
    .single();

  if (error) throw error;
  return data as Link;
}

export async function getLinks(): Promise<Link[]> {
  const { data, error } = await supabase
    .from('links')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Link[];
}

export async function deleteLink(id: string): Promise<void> {
  const { error } = await supabase.from('links').delete().eq('id', id);
  if (error) throw error;
}