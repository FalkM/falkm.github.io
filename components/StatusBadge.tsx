import { Link } from "@/services/links"

export default function StatusBadge({ status }: { status: Link['status'] }) {
  const styles: Record<Link['status'], string> = {
	pending:          'bg-gray-100 text-gray-600',
	downloaded:       'bg-green-100 text-green-700',
	not_downloadable: 'bg-red-100 text-red-700',
  }
  const labels: Record<Link['status'], string> = {
	pending:          '⏳ Pending',
	downloaded:       '✅ Downloaded',
	not_downloadable: '❌ Not downloadable',
  }
  return (
	<span className={`text-xs px-2 py-1 rounded-full font-medium ${styles[status]}`}>
	  {labels[status]}
	</span>
  )
}