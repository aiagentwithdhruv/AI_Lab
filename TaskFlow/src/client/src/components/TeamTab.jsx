import { useState } from 'react'
import useStore from '../store/useStore'

export default function TeamTab({ projectId, isOwner }) {
  const members = useStore((s) => s.members)
  const user = useStore((s) => s.user)
  const addMember = useStore((s) => s.addMember)
  const removeMember = useStore((s) => s.removeMember)

  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [adding, setAdding] = useState(false)
  const [removingId, setRemovingId] = useState(null)

  const handleInvite = async (e) => {
    e.preventDefault()
    if (!email.trim()) { setError('Email is required'); return }
    setAdding(true)
    setError('')
    try {
      await addMember(projectId, email.trim())
      setEmail('')
    } catch (err) {
      setError(err.message)
    } finally {
      setAdding(false)
    }
  }

  const handleRemove = async (memberId) => {
    if (!confirm('Remove this member?')) return
    setRemovingId(memberId)
    try {
      await removeMember(projectId, memberId)
    } catch (err) {
      setError(err.message)
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <div className="max-w-2xl">
      {isOwner && (
        <form onSubmit={handleInvite} className="flex gap-2 mb-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Invite by email..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={adding}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {adding ? 'Inviting...' : 'Invite'}
          </button>
        </form>
      )}
      {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
        {members.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No members yet</p>
        ) : (
          members.map((m) => {
            const memberId = m.user_id || m.id
            const isCurrentUser = user && (memberId === user.id)
            return (
              <div key={memberId} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-medium">
                    {(m.name || m.email || '?')[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">{m.name || 'Unknown'}</p>
                      {isCurrentUser && (
                        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">You</span>
                      )}
                      {m.role === 'owner' && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Owner</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">{m.email}</p>
                  </div>
                </div>
                {isOwner && !isCurrentUser && m.role !== 'owner' && (
                  <button
                    onClick={() => handleRemove(memberId)}
                    disabled={removingId === memberId}
                    className="text-red-500 hover:text-red-700 text-sm disabled:opacity-50"
                  >
                    {removingId === memberId ? 'Removing...' : 'Remove'}
                  </button>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
