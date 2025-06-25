'use client';
import { Task } from '@/types/task'; 

interface TasksProps {
    readonly tasks: Task[]
    readonly error: string | null
    readonly onToggleTask: (taskId: number, completed: boolean) => void
    readonly onDeleteTask: (taskId: number) => void
}

export default function Tasks({ tasks, error, onToggleTask, onDeleteTask}: TasksProps) { 

    return (
        
        <ul className="grid grid-cols-1 gap-4 border border-gray-300 rounded-lg p-4 w-full max-w-md">
            {tasks.map((task) => (
                <li 
                    key={task.task_id} 
                    className="flex items-center gap-3 p-3 rounded-lg shadow-sm max-w-full"
                >   
                    <input 
                        id={`task-${task.task_id}`}
                        type="checkbox"
                        checked={task.completed}
                        onChange={()=>onToggleTask(task.task_id, task.completed)}
                        className="w-4 h-4"
                        
                    />
                <div className="flex flex-col flex-1 min-w-0"> 
                    <label 
                        htmlFor={`task-${task.task_id}`}
                        className="font-medium truncate block max-w-full"
                        title={task.title}
                    >
                        {task. completed ? <del>{task.title}</del> : task.title}
                    </label>
                    {task.description && (
                        <p 
                            className="text-sm text-gray-500 max-h-20 overflow-auto mt-1 custom-scrollbar"
                            style={{ wordBreak: 'break-word' }}
                        >
                            {task.description}
                        </p>
                    )}
                    {error && <p className="text-red-500">{error}</p>}
                </div>
                    <button
                        className="ml-auto"
                        onClick={ () => onDeleteTask(task.task_id)}
                        aria-label="Delete task"
                    >
                        🗙
                    </button>
                </li>
            ))}
        </ul>
    )
}