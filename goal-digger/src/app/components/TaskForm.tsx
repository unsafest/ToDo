'use client'
import React, { useState } from 'react';
import { Task } from '@/types/task'; 

interface TaskFormProps {
   readonly onAddTask: (task: Partial<Task>) => void
}

export default function TaskForm({ onAddTask }: TaskFormProps) {
    const [task, setTask] = useState<Partial<Task>>({
        title: '',
        description: ''
    })

    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTask({ ...task, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        onAddTask(task);
        setTask({ title: '', description: '' })
    }

    return (
        <form 
            className="grid grid-cols-1 gap-4 border border-gray-300 rounded-lg p-4 w-full max-w-md "
            onSubmit={handleSubmit}
        >
            <fieldset className=" flex flex-col gap-3 p-3">
                <legend>Create task</legend>
                <input
                    name="title" 
                    placeholder="Task title"
                    required
                    className="rounded-lg shadow-sm border-gray-300 w-full p-2"
                    value={task.title ?? ''}
                    onChange={handleChange}
                />
                <input
                    name="description"
                    placeholder="Task description (optional)" 
                    className="rounded-lg shadow-sm border-gray-300 w-full p-2"
                    value={task.description ?? ''}
                    onChange={handleChange}
                />
            </fieldset>
            <button 
                type="submit" 
                className="rounded border-gray-300 bg-blue-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
                Add Task
            </button>
        </form>
    )
}