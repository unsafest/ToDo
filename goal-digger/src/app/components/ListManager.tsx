'use client'
import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { List } from '@/types/list';
import type { User } from '@supabase/supabase-js';

const supabase = createClient();

interface ListManagerProps {
  lists: List[];
  user: User | null;
  onListsChange: (lists: List[]) => void;
  onError: (error: string) => void;
}

const ListManager = ({ lists, user, onListsChange, onError }: ListManagerProps) => {
  const [newListTitle, setNewListTitle] = useState('');
  const [editingList, setEditingList] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !newListTitle.trim()) return;

    const { data, error } = await supabase
      .from('lists')
      .insert([{
        title: newListTitle.trim(),
        user_id: user.id
      }])
      .select('*');

    if (error) {
      onError(error.message);
    } else if (data && data.length > 0) {
      onListsChange([...lists, data[0]]);
      setNewListTitle('');
      setIsCreating(false);
    }
  };

  const handleUpdateList = async (listId: string) => {
    if (!editTitle.trim()) return;

    const { data, error } = await supabase
      .from('lists')
      .update({ title: editTitle.trim() })
      .eq('list_id', listId)
      .select('*');

    if (error) {
      onError(error.message);
    } else if (data && data.length > 0) {
      onListsChange(lists.map(list => 
        list.list_id === listId ? data[0] : list
      ));
      setEditingList(null);
      setEditTitle('');
    }
  };

  const handleDeleteList = async (listId: string) => {
    if (!confirm('Are you sure you want to delete this list? Tasks in this list will not be deleted.')) {
      return;
    }

    const { error } = await supabase
      .from('lists')
      .delete()
      .eq('list_id', listId);

    if (error) {
      onError(error.message);
    } else {
      onListsChange(lists.filter(list => list.list_id !== listId));
    }
  };

  const startEditing = (list: List) => {
    setEditingList(list.list_id);
    setEditTitle(list.title);
  };

  const cancelEditing = () => {
    setEditingList(null);
    setEditTitle('');
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">My Lists</h3>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium shadow-sm"
        >
          {isCreating ? 'Cancel' : '+ New List'}
        </button>
      </div>

      {/* Create new list form - Fixed height container to prevent layout shift */}
      <div className="mb-4" style={{ minHeight: isCreating ? 'auto' : '0' }}>
        {isCreating && (
          <form onSubmit={handleCreateList} className="p-4 border border-gray-200 rounded-lg bg-white transition-all duration-200 ease-in-out">
            <input
              type="text"
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
              placeholder="Enter list name"
              className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              autoFocus
              required
            />
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setNewListTitle('');
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium shadow-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Lists display */}
      <div className="space-y-3">
        {lists.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No lists created yet</p>
        ) : (
          lists.map((list) => (
            <div key={list.list_id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white">
              {editingList === list.list_id ? (
                <div className="flex-1 flex gap-3">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    autoFocus
                  />
                  <button
                    onClick={() => handleUpdateList(list.list_id)}
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium shadow-sm"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <h4 className="font-semibold text-gray-800">{list.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Created: {new Date(list.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditing(list)}
                      className="px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteList(list.list_id)}
                      className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ListManager;
