'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import ThemeToggle from '../components/ThemeToggle';
import ContextInput from '../components/ContextInput';

export default function Home() {
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('tasks');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/categories/');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleTaskAdded = () => {
    setTaskToEdit(null);
  };

  return (
    <div className="container">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary text-gradient bg-clip-text">
            Smart Todo List
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Organize your tasks with AI assistance
          </p>
        </div>
        <ThemeToggle />
      </header>

      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'tasks' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 dark:text-gray-400'}`}
          onClick={() => setActiveTab('tasks')}
        >
          Tasks
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'context' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 dark:text-gray-400'}`}
          onClick={() => setActiveTab('context')}
        >
          Context
        </button>
      </div>

      {activeTab === 'tasks' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <TaskForm
              taskToEdit={taskToEdit}
              onTaskAdded={handleTaskAdded}
              categories={categories}
            />
          </div>
          <div className="lg:col-span-2">
            <TaskList onEditTask={setTaskToEdit} />
          </div>
        </div>
      ) : (
        <ContextInput />
      )}
    </div>
  );
}