import { useEffect, useState } from 'react'
import useStore from '../store/useStore'
import Spinner from './Spinner'

function timeAgo(dateStr) {
  const date = new Date(dateStr)
  const now = new Date()
  const seconds = Math.floor((now - date) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return date.toLocaleDateString()
}

const ACTION_ICONS = {
  created: (
    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  ),
  updated: (
    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  deleted: (
    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  moved: (
    <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  ),
}

function getIcon(action) {
  const key = Object.keys(ACTION_ICONS).find((k) => action?.toLowerCase().includes(k))
  return ACTION_ICONS[key] || ACTION_ICONS.updated
}

export default function ActivityTab({ projectId }) {
  const activities = useStore((s) => s.activities)
  const activitiesLoading = useStore((s) => s.activitiesLoading)
  const hasMoreActivities = useStore((s) => s.hasMoreActivities)
  const fetchActivities = useStore((s) => s.fetchActivities)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    fetchActivities(projectId, 0)
  }, [projectId, fetchActivities])

  const loadMore = async () => {
    setLoadingMore(true)
    try {
      await fetchActivities(projectId, activities.length)
    } finally {
      setLoadingMore(false)
    }
  }

  if (activitiesLoading && activities.length === 0) return <Spinner />

  return (
    <div className="max-w-2xl">
      {activities.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No activity yet</p>
      ) : (
        <div className="space-y-1">
          {activities.map((item, idx) => (
            <div key={item.id || idx} className="flex items-start gap-3 bg-white rounded-lg px-4 py-3 border border-gray-100">
              <div className="mt-0.5 flex-shrink-0">
                {getIcon(item.action)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">{item.user_name || 'Someone'}</span>{' '}
                  {item.action || item.description || 'performed an action'}
                  {item.entity_type && (
                    <span className="text-gray-500"> on {item.entity_type}</span>
                  )}
                  {item.entity_name && (
                    <span className="font-medium text-gray-700"> "{item.entity_name}"</span>
                  )}
                </p>
              </div>
              <span className="text-xs text-gray-400 flex-shrink-0 whitespace-nowrap">
                {timeAgo(item.created_at || item.timestamp)}
              </span>
            </div>
          ))}
        </div>
      )}
      {hasMoreActivities && activities.length > 0 && (
        <div className="text-center mt-4">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium disabled:opacity-50"
          >
            {loadingMore ? 'Loading...' : 'Load more'}
          </button>
        </div>
      )}
    </div>
  )
}
