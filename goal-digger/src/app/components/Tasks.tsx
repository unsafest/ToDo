'use client';
import { createClient } from '@/utils/supabase/client';
import { useState, useEffect } from 'react';
import { Task } from '@/types/task'; 



export default function Tasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [error, setError] = useState<string | null>(null)
    const supabase = createClient();
    
    useEffect(() => {
        const fetchTasks = async () => {
            const { data, error } = await supabase.from('tasks').select('*');
            if (!error && data) setTasks(data);
        }
        fetchTasks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const togleTaskCompletion = async (taskId: number, completed: boolean) => {
        const { error } = await supabase
            .from('tasks')
            .update({ completed: !completed })
            .eq('task_id', taskId)
        if (error) {
            console.error('Error updating task: ', error)
            setError(error.message)
            return
        }
        
        setTasks(tasks.map((task) =>
            task.task_id === taskId ? {...task, completed: !completed} : task
        ))
    }
    
    const handleDeleteTask = async (taskId: number) => {
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('task_id', taskId)
        if (error) {
            console.error('Error deleting task: ', error)
            setError(error.message)
            return
        }
        setTasks(tasks.filter((task) => task.task_id !== taskId));
    }

    return (
        
        <ul className="grid grid-cols-1 gap-4 border border-gray-300 rounded-lg p-4 w-full max-w-md">
            {tasks.map((task) => (
                <li key={task.task_id} className="flex item-center gap-3 p-3 rounded-lg shadow-sm">
                    
                    <input 
                        id={`task-${task.task_id}`}
                        type="checkbox"
                        checked={task.completed}
                        onChange={()=>togleTaskCompletion(task.task_id, task.completed)}
                    />
                    <label htmlFor={`task-${task.task_id}`}>
                        {task. completed ? <del>{task.title}</del> : task.title}
                    </label>
                    {task.description && <p className="text-sm text-gray-500">{task.description}</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    <button
                        className="ml-auto"
                        onClick={ () => handleDeleteTask(task.task_id)}
                        aria-label="Delete task"
                    >
                        🗙
                    </button>
                </li>
            ))}
        </ul>
    )
}