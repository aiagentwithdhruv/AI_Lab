import { useEffect, useCallback } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import useStore from '../store/useStore'
import Spinner from './Spinner'
import TaskModal from './TaskModal'

const COLUMNS = [
  { id: 'todo', label: 'To Do', color: 'border-gray-400', bg: 'bg-gray-50' },
  { id: 'in_progress', label: 'In Progress', color: 'border-blue-400', bg: 'bg-blue-50' },
  { id: 'review', label: 'Review', color: 'border-yellow-400', bg: 'bg-yellow-50' },
  { id: 'done', label: 'Done', color: 'border-green-400', bg: 'bg-green-50' },
]

const PRIORITY_STYLES = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
}

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
}

function formatDate(d) {
  if (!d) return null
  const date = new Date(d)
  const now = new Date()
  const diff = date - now
  const days = Math.ceil(diff / 86400000)
  if (days < 0) return { text: `${Math.abs(days)}d overdue`, overdue: true }
  if (days === 0) return { text: 'Today', overdue: false }
  if (days === 1) return { text: 'Tomorrow', overdue: false }
  return { text: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), overdue: false }
}

export default function KanbanBoard({ projectId }) {
  const tasks = useStore((s) => s.tasks)
  const tasksLoading = useStore((s) => s.tasksLoading)
  const fetchTasks = useStore((s) => s.fetchTasks)
  const moveTask = useStore((s) => s.moveTask)
  const filters = useStore((s) => s.filters)
  const setFilter = useStore((s) => s.setFilter)
  const clearFilters = useStore((s) => s.clearFilters)
  const showTaskModal = useStore((s) => s.showTaskModal)
  const openTaskModal = useStore((s) => s.openTaskModal)
  const members = useStore((s) => s.members)

  const loadTasks = useCallback(() => {
    fetchTasks(projectId, filters)
  }, [projectId, filters, fetchTasks])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    const taskId = Number(draggableId)
    const newStatus = destination.droppableId
    const position = destination.index

    // Optimistic update
    useStore.setState((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === taskId ? { ...t, status: newStatus, position } : t
      ),
    }))

    try {
      await moveTask(projectId, taskId, newStatus, position)
    } catch {
      loadTasks()
    }
  }

  const tasksByColumn = COLUMNS.reduce((acc, col) => {
    acc[col.id] = tasks
      .filter((t) => t.status === col.id)
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    return acc
  }, {})

  const hasFilters = filters.status || filters.assignee_id || filters.priority || filters.search

  return (
    <div>
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => setFilter('search', e.target.value)}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48"
        />
        <select
          value={filters.priority}
          onChange={(e) => setFilter('priority', e.target.value)}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
        <select
          value={filters.assignee_id}
          onChange={(e) => setFilter('assignee_id', e.target.value)}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Assignees</option>
          {members.map((m) => (
            <option key={m.id || m.user_id} value={m.id || m.user_id}>
              {m.name || m.email}
            </option>
          ))}
        </select>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Clear filters
          </button>
        )}
        <div className="flex-1" />
        <button
          onClick={() => openTaskModal()}
          className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          + Add Task
        </button>
      </div>

      {/* Board */}
      {tasksLoading ? (
        <Spinner />
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {COLUMNS.map((col) => (
              <div key={col.id} className={`rounded-xl ${col.bg} border-t-4 ${col.color} p-3 min-h-[200px]`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm text-gray-700">{col.label}</h3>
                  <span className="text-xs text-gray-400 bg-white px-2 py-0.5 rounded-full">
                    {tasksByColumn[col.id].length}
                  </span>
                </div>
                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`space-y-2 min-h-[100px] rounded-lg transition-colors ${
                        snapshot.isDraggingOver ? 'bg-white/60' : ''
                      }`}
                    >
                      {tasksByColumn[col.id].map((task, index) => (
                        <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                          {(prov, snap) => (
                            <div
                              ref={prov.innerRef}
                              {...prov.draggableProps}
                              {...prov.dragHandleProps}
                              onClick={() => openTaskModal(task)}
                              className={`bg-white rounded-lg p-3 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow ${
                                snap.isDragging ? 'shadow-lg ring-2 ring-indigo-300' : ''
                              }`}
                            >
                              <p className="text-sm font-medium text-gray-900 mb-2">{task.title}</p>
                              <div className="flex items-center justify-between">
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium}`}>
                                  {task.priority}
                                </span>
                                <div className="flex items-center gap-2">
                                  {task.due_date && (() => {
                                    const d = formatDate(task.due_date)
                                    return (
                                      <span className={`text-xs ${d.overdue ? 'text-red-600 font-medium' : 'text-gray-400'}`}>
                                        {d.text}
                                      </span>
                                    )
                                  })()}
                                  {(task.assignee_name || task.assignee_id) && (
                                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-medium" title={task.assignee_name}>
                                      {getInitials(task.assignee_name)}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {tasksByColumn[col.id].length === 0 && (
                        <p className="text-xs text-gray-400 text-center py-6">No tasks</p>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      )}

      {showTaskModal && <TaskModal projectId={projectId} />}
    </div>
  )
}
