// app/utils/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    // If either is missing, throw to catch block
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing credentials')
    }
    
    // Try to create real client
    return createBrowserClient(supabaseUrl, supabaseKey)
  } catch (error) {
    console.warn('⚠️ Using mock Supabase client - add credentials to connect to real database')
    
    // Return mock client that won't crash
    return {
      from: () => ({
        select: () => Promise.resolve({ 
          data: [
            { 
              id: 'demo-1', 
              name: '⚠️ Demo Mode', 
              description: 'Supabase not configured - showing sample data',
              demo: true 
            },
            { 
              id: 'demo-2', 
              name: 'How to fix', 
              description: 'Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment',
              demo: true 
            }
          ], 
          error: null 
        }),
        insert: () => Promise.resolve({ data: null, error: null })
      })
    } as any
  }
}