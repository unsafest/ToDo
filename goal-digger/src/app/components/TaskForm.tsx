//import { useState } from 'react';

export default function TaskForm() {

    return (
        <form className="grid grid-cols-1 gap-4 border border-gray-300 rounded-lg p-4 w-full max-w-md ">
            <fieldset className=" gap-3 p-3">
                <legend>Create task</legend>
                <input 
                    placeholder="Task title"
                    required
                    className="rounded-lg shadow-sm border-gray-300 w-full p-2"
                />
                <input
                    placeholder="Task description (optional)" 
                    required
                    className="rounded-lg shadow-sm border-gray-300 w-full p-2"
                />
            </fieldset>
            <button type="submit" className="rounded border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                Add Task
            </button>
        </form>
    )
}