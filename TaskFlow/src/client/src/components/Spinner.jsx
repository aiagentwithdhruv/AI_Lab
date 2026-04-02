export default function Spinner({ size = 'md' }) {
  const sizeClass = size === 'sm' ? 'h-5 w-5' : size === 'lg' ? 'h-12 w-12' : 'h-8 w-8'
  return (
    <div className="flex items-center justify-center p-4">
      <div className={`${sizeClass} animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600`} />
    </div>
  )
}
