'use client'
import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Task } from '@/types/task';
import TaskForm from './TaskForm';
import Tasks from './Tasks';
import type { User } from '@supabase/supabase-js';


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


    const [ user, setUser ] = useState<User | null>(null)
    
    useEffect(() => {
        const fetchUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error) {
                console.error('Error fetching user:', error);
            } else {
                setUser(data?.user);
            }
        };
        fetchUser();
    }, []);

    const addTask = async (newTask: Partial<Task>) => {
        if (!user?.id) {
            setError('User not loaded. Please try again.');
            return;
        }
        const { data, error } = await supabase
            .from('tasks')
            .insert([{
                title: newTask.title,
                description: newTask.description || '',
                completed: newTask.completed ?? false,
                user_id: user.id
            }])
            .select();
        if (error) {
            console.error('Error adding task:', error, { newTask, user });
            setError(error.message || 'Unknown error');
        } else if (data && data.length > 0) {
            setTasks([data[0], ...tasks]);
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