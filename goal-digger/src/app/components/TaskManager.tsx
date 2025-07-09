'use client'
import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Task } from '@/types/task';
import { List } from '@/types/list';
import TaskForm from './TaskForm';
import Tasks from './Tasks';
import type { User } from '@supabase/supabase-js';


const supabase = createClient();

const TaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [lists, setLists] = useState<List[]>([])
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // helper function to transform lists
  const availableLists = lists.map(list => ({
    id: list.list_id,
    name: list.title
  }));


  // Fetch user on mount
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


  useEffect(() => {
    if (!user?.id) return;

    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user?.id)
      if (error) {
        setError(error.message);
      } else {
        setTasks(data || [])
      }
    }
    fetchTasks()
  }, [user])

  useEffect(() => {
    if (!user?.id) return;

    const fetchLists = async () => {
      try {
        const { data, error } = await supabase
          .from('lists')
          .select('list_id, title, created_at')
          .eq('user_id', user.id);
        if (error) {
          console.error('Error fetching lists:', error);
          setError(error.message);
          return;
        }
        setLists(data || [])

      } catch (error) {
        console.error('Error fetching lists:', error);
        setError('Failed to load lists');
      }
    };
    fetchLists();
  }, [user]);

  const addTask = async (newTask: Partial<Task>) => {
    if (!user?.id) {
      setError('User not loaded. Please try again.');
      return;
    }
    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        title: newTask.title,
        description: newTask.description ?? '',
        completed: newTask.completed ?? false,
        user_id: user.id,
        list_id: newTask.list_id ?? null,
        due_date: newTask.due_date ?? null
      }])
      .select('*')
    if (error) {
      console.error('Error adding task:', error, { newTask, user });
      setError(error.message || 'Unknown error');
    } else if (data && data.length > 0) {
      setTasks([data[0], ...tasks])
      setShowModal(false)
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
        task.task_id === taskId ? { ...task, completed: !completed } : task
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

  const handleEditTask = async (taskId: number) => {
    const taskToEdit = tasks.find(task => task.task_id === taskId)
    if (taskToEdit) {
      setEditingTask(taskToEdit)
      setShowModal(true)
    }
  }

  const updateTask = async (updatedTask: Partial<Task>) => {
    if (!editingTask) return

    const { data, error } = await supabase
      .from('tasks')
      .update({
        title: updatedTask.title,
        description: updatedTask.description ?? '',
        due_date: updatedTask.due_date ?? null,
        list_id: updatedTask.list_id ?? null
      })
      .eq('task_id', editingTask.task_id)
      .select('*')

    if (error) {
      console.error('Error updating task: ', error)
      setError(error.message || 'Unknown error')
    } else if (data && data.length > 0) {
      setTasks(tasks.map(task =>
        task.task_id === editingTask.task_id ? data[0] : task
      ))
      setShowModal(false)
      setEditingTask(null)
    }
  }

  return (
    <div className="flex flex-col items-center gap-3 item-center w-full max-w-md">
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 w-full bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-lg"
      >
        Create Task
      </button>
      <Tasks tasks={tasks} error={error} onToggleTask={toggleTaskCompletion} onDeleteTask={handleDeleteTask} onEditTask={handleEditTask} />

      {/* Show task form */}
      {showModal && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <TaskForm
              onAddTask={editingTask ? updateTask : addTask}
              availableLists={availableLists}
              editingTask={editingTask}
              isEditing={!!editingTask}
            />
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 px-3 py-2 w-full bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskManager;