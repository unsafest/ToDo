'use client';
import { createClient } from '@/utils/supabase/client';
import { useState, useEffect } from 'react';

interface Task {
    task_id: number;
    title: string;
    description?: string;
    completed: boolean;
    created_at: string;
}

export default function Tasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const supabase = createClient();
    
    useEffect(() => {
        const fetchTasks = async () => {
            const { data, error } = await supabase.from('tasks').select('*');
            if (!error && data) setTasks(data);
        }
        fetchTasks();
    });
    
    return (
        <ul className="grid grid-cols-3 gap-4 border border-gray-300 rounded-lg p-4 w-full max-w-md">
            {tasks.map((task) => (
                <li key={task.task_id} className="task">
                    
                    <input 
                        type="checkbox"
                        checked={task.completed}
                        readOnly
                    />
                    <label htmlFor={`task-${task.task_id}`}>
                        {task.completed ? '✓' : ''}
                    </label>

                    <h3>{task.title}</h3>
                </li>
            ))}
        </ul>
    )
}