'use client'
import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Task } from '@/types/task';
import TaskForm from './TaskForm';
import Tasks from './Tasks';

const supabase = createClient();

const TaskMannager = () => {
    const [tasks, setTasks] = useState<Task[]>([])
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchTasks = async () => {
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
            if (error) {
                setError(error.message);
            } else {
                setTasks(data)
            }
        }
        fetchTasks()
    }, [])

    const addTask = async (newTask: Partial<Task>) => {
        const { data, error } = await supabase
            .from('tasks')
            .insert([{
                title: newTask.title,
                description: newTask.description
            }])
            .select()
        if (error) {
            console.error('Error adding task:', error);
            setError(error.message);
        } else {
            setTasks([data[0], ...tasks])
        }
    }

    const toggleTaskCompletion = async (taskId: number, completed: boolean) => {
        const { error } = await supabase
            .from('tasks')
            .update({ completed: !completed })
            .eq('task_id', taskId)
        if (error) {
            console.error('Error updating task: ', error)
        }
        if (!error) {
            setTasks(tasks.map((task) => 
                task.task_id === taskId ? {...task, completed: !completed } : task
            ))
        }
    }
    
    const handleDeleteTask = async (taskId: number) => {
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('task_id', taskId)
        if (error) {
            console.error('Error deleting task: ', error)
        }
        if (!error) {
            setTasks(tasks.filter((task) => task.task_id !== taskId))
        }
    }

    return (
        <div className="flex flex-col items-center gap-3 item-center w-full max-w-md">
            <TaskForm onAddTask={addTask} />
            <Tasks tasks={tasks} error={error} onToggleTask={toggleTaskCompletion} onDeleteTask={handleDeleteTask} />
        </div>
    )
}

export default TaskMannager;