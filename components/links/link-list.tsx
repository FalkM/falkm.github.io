import { Link } from '@/types/links'
import StatusBadge from './StatusBadge'

interface Props {
  links: Link[]
  error: boolean
}

export default function LinkList({ links, error }: Props) {
  if (error) {
    return (
      <div className="border border-yellow-400 bg-yellow-50 p-4 rounded-lg text-yellow-800">
        ⚠️ Could not connect to database.
      </div>
    )
  }

  if (links.length === 0) {
    return (
      <div className="border p-4 rounded-lg text-gray-500">
        No links yet. Add one to get started.
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {links.map((link) => (
        <div key={link.id} className="border p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl font-semibold text-blue-600 hover:underline"
            >
              {link.title ?? link.url}
            </a>
            <StatusBadge status={link.status} />
          </div>
          <p className="text-gray-400 text-sm mt-1">{link.url}</p>
        </div>
      ))}
    </div>
  )
}