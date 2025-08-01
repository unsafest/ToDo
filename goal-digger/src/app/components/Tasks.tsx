'use client';
import { Task } from '@/types/task';
import { List } from '@/types/list';
import { useState, useEffect } from 'react';

interface TasksProps {
  readonly tasks: Task[]
  readonly lists: List[]
  readonly error: string | null
  readonly onToggleTask: (taskId: string, completed: boolean) => void
  readonly onDeleteTask: (taskId: string) => void
  readonly onEditTask: (taskId: string) => void
}

export default function Tasks({ tasks, lists, error, onToggleTask, onDeleteTask, onEditTask }: TasksProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const toggleDropdown = (taskId: string) => {
    setOpenDropdown(openDropdown === taskId ? null : taskId)
  }

  // Helper function to get list name by ID
  const getListName = (listId?: string) => {
    if (!listId) return null;
    const list = lists.find(list => list.list_id === listId);
    return list ? list.title : null;
  }

  // Close dropdown when clicking outside
  // This effect runs once when the component mounts
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is outside any dropdown
      const clickedElement = event.target as HTMLElement
      if (!clickedElement.closest('[data-dropdown]')) {
        setOpenDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <ul className="grid grid-cols-1 gap-4 border border-gray-300 rounded-lg p-4 w-full">
      {tasks.length === 0 ? (
        <li className="text-center text-gray-400 py-8">
          Your tasks will appear here.
        </li>
      ) : (
        tasks.map((task) => (
          <li
            key={task.task_id}
            className="flex items-center gap-3 p-3 rounded-lg shadow-sm max-w-full"
          >
            <input
              id={`task-${task.task_id}`}
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleTask(task.task_id, task.completed)}
              className="w-4 h-4"
            />
            <div className="flex flex-col flex-1 min-w-0">
              <label
                htmlFor={`task-${task.task_id}`}
                className="font-medium truncate block max-w-full"
                title={task.title}
              >
                {task.completed ? <del>{task.title}</del> : task.title}
              </label>
              {task.description && (
                <p
                  className="text-sm text-gray-500 max-h-20 overflow-auto mt-1 custom-scrollbar"
                  style={{ wordBreak: 'break-word' }}
                >
                  {task.description}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                Created: {new Date(task.created_at).toLocaleDateString()}
                {task.due_date && ` — Due: ${new Date(task.due_date).toLocaleDateString()}`}
                {getListName(task.list_id) && (
                  <span className="inline-block ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    📋 {getListName(task.list_id)}
                  </span>
                )}
              </p>
              {error && <p className="text-red-500">{error}</p>}
            </div>
            <div className="relative ml-auto" data-dropdown>
              <button
                className="p-1 rounded-full hover:bg-gray-100"
                onClick={() => toggleDropdown(task.task_id)}
                aria-label="Task options, edit or delete task"
              >
                ⋮
              </button>

              {openDropdown === task.task_id && (
                <div className="absolute left-1/2 transform -translate-x-1/2 top-8 w-32 bg-transparent rounded-lg flex flex-col gap-1 z-20">
                  <button
                    onClick={() => onEditTask(task.task_id)}
                    className="w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                    aria-label={`Edit task ${task.title}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteTask(task.task_id)}
                    className="w-full px-3 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-red-600"
                    aria-label={`Delete task ${task.title}`}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </li>
        ))
      )}
    </ul>
  )
}