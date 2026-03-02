export default function LinkSkeleton() {
  return (
	<div className="grid gap-4">
	  {[1, 2, 3].map((i) => (
		<div key={i} className="border p-4 rounded-lg animate-pulse">
		  <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
		  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
		</div>
	  ))}
	</div>
  )
}