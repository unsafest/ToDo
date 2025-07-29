'use client'
import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Task } from '@/types/task';
import { List } from '@/types/list';
import TaskForm from './TaskForm';
import Tasks from './Tasks';
import ListManager from './ListManager';
import TaskFilter from './TaskFilter';
import type { User } from '@supabase/supabase-js';


const supabase = createClient();

const TaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [lists, setLists] = useState<List[]>([])
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [showListManager, setShowListManager] = useState(false);

  // helper function to transform lists
  const availableLists = lists.map(list => ({
    id: String(list.list_id),
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
          .select('list_id, title, created_at, user_id')
          .eq('user_id', user.id);
        if (error) {
          console.error('Error fetching lists:', error);
          setError(error.message);
          return;
        }
        console.log('Fetched lists:', data); // debug
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
        due_date: newTask.due_date && newTask.due_date.trim() !== '' ? newTask.due_date : null
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

  const toggleTaskCompletion = async (taskId: string, completed: boolean) => {
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

  const handleDeleteTask = async (taskId: string) => {
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

  const handleEditTask = async (taskId: string) => {
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
        due_date: updatedTask.due_date && updatedTask.due_date.trim() !== '' ? updatedTask.due_date : null,
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

  // Filter tasks based on selected list
  const filteredTasks = selectedListId 
    ? selectedListId === 'no-list'
      ? tasks.filter(task => !task.list_id)
      : tasks.filter(task => task.list_id === selectedListId)
    : tasks;

  const handleListsChange = (newLists: List[]) => {
    setLists(newLists);
  };

  const handleFilterChange = (listId: string | null) => {
    setSelectedListId(listId);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full mx-auto px-4 sm:px-0">
      {/* Error display */}
      {error && (
        <div className="w-full p-3 bg-red-100 text-red-800 rounded-lg border border-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Button Row */}
      <div className="flex gap-2 sm:gap-3 w-full">
        <button
          onClick={() => {
            setShowModal(true)
            setError(null)
            setEditingTask(null)
          }}
          className="flex-1 px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm text-sm sm:text-base"
        >
          Create Task
        </button>
        
        <button
          onClick={() => setShowListManager(!showListManager)}
          className="px-3 sm:px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium shadow-sm text-sm sm:text-base whitespace-nowrap"
          title="Manage Lists"
        >
          📋 Lists
        </button>
      </div>

      {/* Expandable List Manager */}
      {showListManager && (
        <div className="w-full p-3 sm:p-4 border border-gray-200 rounded-lg bg-gray-50 transition-all duration-200 ease-in-out">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Manage Lists</h3>
            <button
              onClick={() => setShowListManager(false)}
              className="w-8 h-8 sm:w-6 sm:h-6 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors text-lg sm:text-base"
              title="Close"
            >
              ×
            </button>
          </div>
          <ListManager
            lists={lists}
            user={user}
            onListsChange={handleListsChange}
            onError={setError}
          />
        </div>
      )}
      
      {/* Task Filter Dropdown */}
      <TaskFilter
        lists={lists}
        selectedListId={selectedListId}
        onFilterChange={handleFilterChange}
      />
      
      {/* Tasks Display */}
      <Tasks 
        tasks={filteredTasks} 
        lists={lists}
        error={null} 
        onToggleTask={toggleTaskCompletion} 
        onDeleteTask={handleDeleteTask} 
        onEditTask={handleEditTask} 
      />

      {/* Show task form modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 sm:p-6">
          {/* Background overlay */}
          <div className="absolute inset-0 bg-opacity-50 backdrop-blur-sm"></div>
          
          {/* Modal content */}
          <div className="relative bg-white p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-md border border-gray-200 max-h-[90vh] overflow-y-auto">
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg border border-red-200 text-sm">
                {error}
              </div>
            )}
            <TaskForm
              onAddTask={editingTask ? updateTask : addTask}
              availableLists={availableLists}
              editingTask={editingTask}
              isEditing={!!editingTask}
            />
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 px-4 py-3 w-full bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium text-base"
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