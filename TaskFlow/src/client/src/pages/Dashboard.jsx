import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import Header from '../components/layout/Header'
import Spinner from '../components/Spinner'

export default function Dashboard() {
  const projects = useStore((s) => s.projects)
  const projectsLoading = useStore((s) => s.projectsLoading)
  const fetchProjects = useStore((s) => s.fetchProjects)
  const createProject = useStore((s) => s.createProject)
  const navigate = useNavigate()

  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [formError, setFormError] = useState('')
  const [creating, setCreating] = useState(false)
  const [fetchError, setFetchError] = useState('')

  useEffect(() => {
    fetchProjects().catch((e) => setFetchError(e.message))
  }, [fetchProjects])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!name.trim()) { setFormError('Project name is required'); return }
    setCreating(true)
    setFormError('')
    try {
      await createProject({ name: name.trim(), description: description.trim() })
      setName('')
      setDescription('')
      setShowForm(false)
    } catch (err) {
      setFormError(err.message)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            {showForm ? 'Cancel' : '+ New Project'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6 space-y-3">
            {formError && <div className="text-red-600 text-sm">{formError}</div>}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Project name"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Optional description"
                rows={2}
              />
            </div>
            <button
              type="submit"
              disabled={creating}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create Project'}
            </button>
          </form>
        )}

        {fetchError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 text-sm">{fetchError}</p>
            <button
              onClick={() => { setFetchError(''); fetchProjects().catch((e) => setFetchError(e.message)) }}
              className="text-red-600 underline text-sm mt-1"
            >
              Retry
            </button>
          </div>
        )}

        {projectsLoading ? (
          <Spinner />
        ) : projects.length === 0 && !fetchError ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <h3 className="text-gray-600 font-medium">No projects yet</h3>
            <p className="text-gray-400 text-sm mt-1">Create your first project to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => navigate(`/projects/${project.id}`)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 cursor-pointer hover:shadow-md hover:border-indigo-200 transition-all group"
              >
                <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {project.name}
                </h3>
                {project.description && (
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">{project.description}</p>
                )}
                <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {project.memberCount ?? project.member_count ?? 0} members
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    {project.taskCount ?? project.task_count ?? 0} tasks
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
