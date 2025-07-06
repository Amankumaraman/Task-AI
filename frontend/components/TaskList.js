'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { toast } from 'react-toastify';

const localizer = momentLocalizer(moment);

export default function TaskList({ onEditTask }) {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState({ category: '', status: '', priority: '' });
  const [showCalendar, setShowCalendar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickTask, setQuickTask] = useState({ title: '', deadline: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchTasks(), fetchCategories()]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filter]);

  const fetchTasks = async () => {
    const params = {};
    if (filter.category) params.category = filter.category;
    if (filter.status) params.status = filter.status;
    if (filter.priority) params.priority_score__gte = filter.priority;
    
    const response = await axios.get('https://task-ai-gpyr.onrender.com/api/tasks/', { params });
    setTasks(response.data);
  };

  const fetchCategories = async () => {
    const response = await axios.get('https://task-ai-gpyr.onrender.com/api/categories/');
    setCategories(response.data);
  };

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    if (!quickTask.title.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      setLoading(true);
      await axios.post('https://task-ai-gpyr.onrender.com/api/tasks/', {
        title: quickTask.title.trim(),
        deadline: quickTask.deadline || null,
        priority_score: 0.5,
        category_id: categories[0]?.id || null,
        status: 'PENDING',
      });
      toast.success('Task added successfully');
      setQuickTask({ title: '', deadline: '' });
      setShowQuickAdd(false);
      fetchTasks();
    } catch (error) {
      toast.error('Failed to add task');
      console.error('Quick add failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportTasks = async () => {
    try {
      const response = await axios.get('https://task-ai-gpyr.onrender.com/api/tasks/');
      const data = JSON.stringify(response.data, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'tasks-export.json';
      link.click();
      URL.revokeObjectURL(url);
      toast.success('Tasks exported successfully');
    } catch (error) {
      toast.error('Export failed');
      console.error('Export failed:', error);
    }
  };

  const importTasks = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const tasks = JSON.parse(e.target.result);
        for (const task of tasks) {
          await axios.post('https://task-ai-gpyr.onrender.com/api/tasks/', task);
        }
        fetchTasks();
        toast.success('Tasks imported successfully');
      } catch (error) {
        toast.error('Import failed');
        console.error('Import failed:', error);
      }
    };
    reader.readAsText(file);
  };

  const calendarEvents = tasks
    .filter(task => task.deadline)
    .map(task => ({
      title: task.title,
      start: new Date(task.deadline),
      end: new Date(task.deadline),
      allDay: true,
    }));

  const getPriorityClass = (score) => {
    if (score >= 0.7) return 'priority-high';
    if (score >= 0.4) return 'priority-medium';
    return 'priority-low';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gradient">Your Tasks</h2>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setShowQuickAdd(true)} 
              className="button button-primary px-4 py-2 rounded-xl transition-all duration-200 hover:bg-primary/90"
            >
              Quick Add Task
            </button>
            <button 
              onClick={() => setShowCalendar(!showCalendar)} 
              className="button button-outline px-4 py-2 rounded-xl transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
            </button>
            <button 
              onClick={exportTasks} 
              className="button button-secondary px-4 py-2 rounded-xl transition-all duration-200 hover:bg-secondary/90"
            >
              Export Tasks
            </button>
            <label className="button button-primary px-4 py-2 rounded-xl cursor-pointer transition-all duration-200 hover:bg-primary/90">
              Import Tasks
              <input
                type="file"
                accept=".json"
                onChange={importTasks}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <select
            className="select"
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          <select
            className="select"
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <select
            className="select"
            onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
          >
            <option value="">All Priorities</option>
            <option value="0.7">High (70%+)</option>
            <option value="0.4">Medium (40-70%)</option>
            <option value="0">Low (0-40%)</option>
          </select>
        </div>

        {showCalendar && (
          <div className="mb-8">
            <Calendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              className="rbc-calendar"
            />
          </div>
        )}

        {showQuickAdd && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="card glass max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-4 text-gradient">Quick Add Task</h3>
              <form onSubmit={handleQuickAdd} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={quickTask.title}
                    onChange={(e) => setQuickTask({ ...quickTask, title: e.target.value })}
                    placeholder="Task title"
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Deadline (optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={quickTask.deadline}
                    onChange={(e) => setQuickTask({ ...quickTask, deadline: e.target.value })}
                    className="input"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="button button-primary flex-1"
                  >
                    {loading ? 'Adding...' : 'Add Task'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowQuickAdd(false)}
                    className="button button-ghost"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No tasks found. Create one to get started!</p>
            </div>
          ) : (
            tasks.map(task => (
              <div
                key={task.id}
                className={`task-card ${getPriorityClass(task.priority_score)}`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{task.title}</h3>
                    <span className={`badge-${task.status === 'COMPLETED' ? 'success' : 'warning'}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                    {task.description || 'No description'}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      {task.category?.name || 'Uncategorized'}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      Priority: {(task.priority_score * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => onEditTask(task)}
                  className="button-ghost"
                >
                  Edit
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
