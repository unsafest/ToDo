'use client'
import React, { useState, useEffect } from 'react';
import { Task } from '@/types/task';

interface TaskFormProps {
   readonly onAddTask: (task: Partial<Task>) => void
   readonly availableLists?: Array<{ id: number, name: string }>
   readonly editingTask?: Task | null
   readonly isEditing?: boolean
}

export default function TaskForm({ onAddTask, availableLists = [], editingTask, isEditing }: TaskFormProps) {
    const [task, setTask] = useState<Partial<Task>>({
        title: '',
        description: '',
        created_at: '',
        list_id: undefined
    })

    // Use effect to populate form fields when editing a task
    useEffect(() => {
        if (isEditing && editingTask) {
            setTask({
                title: editingTask.title,
                description: editingTask.description ?? '',
                due_date: editingTask.due_date ?? '',
                list_id: editingTask.list_id ?? undefined
            });
        } else {
            // Reset task state when not editing
            setTask({
                title: '',
                description: '',
                due_date: '',
                list_id: undefined
            })
        }
    }, [isEditing, editingTask]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTask({ ...task, [e.target.name]: e.target.value })
    }
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value === '' ? undefined : Number(e.target.value)
        setTask({ ...task, [e.target.name]: value })
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        onAddTask(task);
        setTask({ title: '', description: '', due_date: '', list_id: undefined })
    }

    return (
        <form 
            className="grid grid-cols-1 gap-4 border border-gray-300 rounded-lg p-4 w-full max-w-md "
            onSubmit={handleSubmit}
        >
            <fieldset className=" flex flex-col gap-3 p-3">
                <legend>{isEditing ? 'Edit task' : 'Create task'}</legend>
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
                <input
                    name="due_date"
                    type="date"
                    className="rounded-lg shadow-sm border-gray-300 w-full p-2"
                    value={task.due_date ?? ''}
                    onChange={handleChange}
                />
                <select
                    name="list_id"
                    className="rounded-lg shadow-sm border-gray-300 w-full p-2"
                    value={task.list_id ?? ''}
                    onChange={handleSelectChange}
                >
                    <option value="">No list selected (Optional)</option>
                    {availableLists.map(list => (
                        <option key={list.id} value={list.id}>
                            {list.name}
                        </option>
                    ))}
                </select>
            </fieldset>
            <button 
                type="submit" 
                className="rounded border-gray-300 bg-blue-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
                {isEditing ? 'Update Task' : 'Add Task'}
            </button>
        </form>
    )
}