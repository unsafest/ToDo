'use client'
import React from 'react';
import { List } from '@/types/list';

interface TaskFilterProps {
  lists: List[];
  selectedListId: string | null;
  onFilterChange: (listId: string | null) => void;
}

const TaskFilter = ({ lists, selectedListId, onFilterChange }: TaskFilterProps) => {
  return (
    <div className="w-full mb-4">
      <label htmlFor="list-filter" className="block text-sm font-semibold text-gray-800 mb-2">
        Filter by List:
      </label>
      <div className="relative">
        <select
          id="list-filter"
          value={selectedListId || ''}
          onChange={(e) => onFilterChange(e.target.value || null)}
          className="w-full p-3 pr-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-medium text-base appearance-none"
        >
          <option value="">All Tasks</option>
          <option value="no-list">Tasks without a list</option>
          {lists.map((list) => (
            <option key={list.list_id} value={list.list_id}>
              {list.title}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default TaskFilter;
