import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import Header from '../components/layout/Header'
import KanbanBoard from '../components/KanbanBoard'
import AnalyticsTab from '../components/AnalyticsTab'
import TeamTab from '../components/TeamTab'
import ActivityTab from '../components/ActivityTab'
import Spinner from '../components/Spinner'

const TABS = [
  { id: 'board', label: 'Board' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'team', label: 'Team' },
  { id: 'activity', label: 'Activity' },
]

export default function ProjectView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const fetchProject = useStore((s) => s.fetchProject)
  const fetchMembers = useStore((s) => s.fetchMembers)
  const currentProject = useStore((s) => s.currentProject)
  const projectsLoading = useStore((s) => s.projectsLoading)
  const updateProject = useStore((s) => s.updateProject)
  const deleteProject = useStore((s) => s.deleteProject)
  const user = useStore((s) => s.user)

  const [tab, setTab] = useState('board')
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setError('')
    fetchProject(id).catch((e) => setError(e.message))
    fetchMembers(id).catch(() => {})
  }, [id, fetchProject, fetchMembers])

  const isOwner = currentProject && user && (
    currentProject.owner_id === user.id ||
    currentProject.created_by === user.id
  )

  const handleEdit = () => {
    setEditName(currentProject.name)
    setEditDesc(currentProject.description || '')
    setEditing(true)
  }

  const handleSave = async () => {
    if (!editName.trim()) return
    setSaving(true)
    try {
      await updateProject(id, { name: editName.trim(), description: editDesc.trim() })
      setEditing(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this project and all its tasks?')) return
    try {
      await deleteProject(id)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    }
  }

  if (projectsLoading && !currentProject) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Spinner size="lg" />
      </div>
    )
  }

  if (error && !currentProject) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-6 py-12 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => { setError(''); fetchProject(id).catch((e) => setError(e.message)) }}
            className="text-indigo-600 underline text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Project Header */}
        <div className="mb-6">
          {editing ? (
            <div className="flex items-center gap-3 mb-2">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="text-xl font-bold border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleSave}
                disabled={saving}
                className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg disabled:opacity-50"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 mb-1">
              <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">{currentProject?.name}</h1>
              {isOwner && (
                <div className="flex gap-1">
                  <button
                    onClick={handleEdit}
                    className="text-gray-400 hover:text-gray-600 p-1"
                    title="Edit project"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="text-gray-400 hover:text-red-600 p-1"
                    title="Delete project"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}
          {editing ? (
            <textarea
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={2}
              placeholder="Project description"
            />
          ) : (
            currentProject?.description && (
              <p className="text-gray-500 text-sm ml-8">{currentProject.description}</p>
            )
          )}
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 text-sm px-4 py-2 rounded-lg mb-4 border border-red-200">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex gap-6">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                  tab === t.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {tab === 'board' && <KanbanBoard projectId={id} />}
        {tab === 'analytics' && <AnalyticsTab projectId={id} />}
        {tab === 'team' && <TeamTab projectId={id} isOwner={isOwner} />}
        {tab === 'activity' && <ActivityTab projectId={id} />}
      </main>
    </div>
  )
}
