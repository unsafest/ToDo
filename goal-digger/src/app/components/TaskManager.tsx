/* 'use client'
import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Task } from '@/types/task';
import TaskForm from './TaskForm';
import Tasks from './Tasks';

const supabase = createClient();

export default function TaskManager() {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        const fetchTasks = async () => {
            const { data } = await supabase.from('tasks').select('*');
            if (data) setTasks(data);
        };
        fetchTasks();
    }, []);

    // Add this function to pass to TaskForm
    const addTask = (task: Task) => {
        setTasks(prev => [...prev, task]);
    };

    return (
        <div>
            <TaskForm onTaskCreated={addTask} />
            <Tasks tasks={tasks} setTasks={setTasks} />
        </div>
    );
} */