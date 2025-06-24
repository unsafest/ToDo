'use client'
import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Task } from '@/types/task'; 

const supabase = createClient();

export default function TaskForm() {
    const [task, setTask] = useState<Partial<Task>>({
        title: '',
        description: ''
    })

    const createTask = async (taskData: Partial<Task>) => {
    const { error } = await supabase
        .from('tasks')
        .insert([{
            title: taskData.title,
            description: taskData.description
        }])
        .single()
        if (error) {
            console.error('Error creating task: ', error);
            return;
        }
        setTask({title: '', description: ''})
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTask({ ...task, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createTask(task)
    }

    return (
        <form 
            className="grid grid-cols-1 gap-4 border border-gray-300 rounded-lg p-4 w-full max-w-md "
            onSubmit={handleSubmit}
        >
            <fieldset className=" gap-3 p-3">
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
            <button type="submit" className="rounded border-gray-300 bg-blue-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                Add Task
            </button>
        </form>
    )
}