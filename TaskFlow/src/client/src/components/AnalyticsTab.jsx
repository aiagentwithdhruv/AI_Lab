import { useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from 'recharts'
import useStore from '../store/useStore'
import Spinner from './Spinner'

const STATUS_LABELS = { todo: 'To Do', in_progress: 'In Progress', review: 'Review', done: 'Done' }
const STATUS_COLORS = { todo: '#9ca3af', in_progress: '#3b82f6', review: '#eab308', done: '#22c55e' }

export default function AnalyticsTab({ projectId }) {
  const analytics = useStore((s) => s.analytics)
  const analyticsLoading = useStore((s) => s.analyticsLoading)
  const fetchAnalytics = useStore((s) => s.fetchAnalytics)

  useEffect(() => {
    fetchAnalytics(projectId)
  }, [projectId, fetchAnalytics])

  if (analyticsLoading) return <Spinner />
  if (!analytics) return <p className="text-gray-400 text-center py-8">No analytics data available</p>

  const statusData = analytics.tasksByStatus
    ? Object.entries(analytics.tasksByStatus).map(([key, value]) => ({
        name: STATUS_LABELS[key] || key,
        count: value,
        fill: STATUS_COLORS[key] || '#6366f1',
      }))
    : []

  const assigneeData = analytics.tasksByAssignee
    ? (Array.isArray(analytics.tasksByAssignee)
        ? analytics.tasksByAssignee
        : Object.entries(analytics.tasksByAssignee).map(([name, count]) => ({ name, count }))
      )
    : []

  const burndownData = analytics.burndown || []

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Tasks</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {statusData.reduce((sum, d) => sum + d.count, 0)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-3xl font-bold text-green-600 mt-1">
            {analytics.tasksByStatus?.done || 0}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-red-200 p-5 shadow-sm">
          <p className="text-sm text-gray-500">Overdue</p>
          <p className="text-3xl font-bold text-red-600 mt-1">
            {analytics.overdueCount ?? 0}
          </p>
        </div>
      </div>

      {/* Tasks by Status */}
      {statusData.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Tasks by Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Tasks by Assignee */}
      {assigneeData.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Tasks by Assignee</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={assigneeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Burndown */}
      {burndownData.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Burndown Chart</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={burndownData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="remaining" stroke="#6366f1" strokeWidth={2} dot={false} />
              {burndownData[0]?.ideal !== undefined && (
                <Line type="monotone" dataKey="ideal" stroke="#d1d5db" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Overdue Tasks Table */}
      {analytics.overdueTasks && analytics.overdueTasks.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Overdue Tasks</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Title</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Assignee</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Due Date</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Priority</th>
                </tr>
              </thead>
              <tbody>
                {analytics.overdueTasks.map((task) => (
                  <tr key={task.id} className="border-b border-gray-100">
                    <td className="py-2 px-3 text-gray-900">{task.title}</td>
                    <td className="py-2 px-3 text-gray-600">{task.assignee_name || 'Unassigned'}</td>
                    <td className="py-2 px-3 text-red-600">{task.due_date ? new Date(task.due_date).toLocaleDateString() : '-'}</td>
                    <td className="py-2 px-3 text-gray-600 capitalize">{task.priority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
