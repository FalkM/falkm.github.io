// app/page.tsx
import { Suspense } from 'react'
import { createClient } from './utils/supabase/server'

async function ItemList() {
  const supabase = await createClient()  // ← Add await here!
  const { data: items_from_supa } = await supabase.from('items').select('*')
  console.debug(`Items from supabase ${items_from_supa}`)
  let items = items_from_supa != null
    ? items_from_supa
    :  [
      { 
        id: 1, 
        name: '⚠️ No Database Connection', 
        description: 'Using fallback data - check your Supabase connection',
        isFallback: true 
      },
      { 
        id: 2, 
        name: 'Sample Item (Offline Mode)', 
        description: 'This is demo data while DB is unavailable',
        isFallback: true 
      }
    ]
  
  return (
    <div className="grid gap-4">
      {items?.map((item) => (
        <div key={item.id} className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold">{item.name}</h2>
          <p className="text-gray-600">{item.description}</p>
        </div>
      ))}
    </div>
  )
}

// Loading skeleton
function ItemSkeleton() {
  return (
    <div className="grid gap-4">
      {[1,2,3].map((i) => (
        <div key={i} className="border p-4 rounded-lg animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      ))}
    </div>
  )
}

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">My Live Demo App</h1>
      <Suspense fallback={<ItemSkeleton />}>
        <ItemList />
      </Suspense>
    </main>
  )
}