'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

const TaskForm = ({ taskToEdit, onTaskAdded, categories }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    category: categories[0]?.id || '',
    priority_score: 0.5,
  });
  const [suggestions, setSuggestions] = useState(null);
  const [contextEntries, setContextEntries] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title || '',
        description: taskToEdit.description || '',
        deadline: taskToEdit.deadline || '',
        category: taskToEdit.category?.id || categories[0]?.id || '',
        priority_score: taskToEdit.priority_score || 0.5,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        deadline: '',
        category: categories[0]?.id || '',
        priority_score: 0.5,
      });
    }
  }, [taskToEdit, categories]);

  useEffect(() => {
    const fetchContext = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/context-entries/');
        setContextEntries(response.data);
      } catch (error) {
        console.error('Error fetching context:', error);
      }
    };
    fetchContext();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGetSuggestions = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:8000/api/tasks/ai_suggestions/', {
        task: { title: formData.title, description: formData.description },
        context_entries: contextEntries,
      });
      setSuggestions(response.data);
      if (response.data) {
        setFormData(prev => ({
          ...prev,
          deadline: response.data.deadline || prev.deadline,
          description: response.data.description || prev.description,
          category: categories.find(c => c.name === response.data.category)?.id || prev.category,
          priority_score: response.data.priority_score || prev.priority_score,
        }));
      }
    } catch (error) {
      console.error('Error getting suggestions:', error);
      setError('Failed to get AI suggestions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setLoading(true);
      const taskData = {
        title: formData.title.trim(),
        description: formData.description,
        deadline: formData.deadline,
        category_id: formData.category,
        priority_score: parseFloat(formData.priority_score),
      };

      if (taskToEdit) {
        await axios.put(`http://localhost:8000/api/tasks/${taskToEdit.id}/`, taskData);
      } else {
        await axios.post('http://localhost:8000/api/tasks/', taskData);
      }
      
      onTaskAdded();
    } catch (error) {
      console.error('Error saving task:', error);
      setError(error.response?.data?.error || 'Failed to save task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card glass">
      <h2 className="text-2xl font-bold mb-6 text-gradient">
        {taskToEdit ? 'Edit Task' : 'Create New Task'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-danger/10 text-danger rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="What needs to be done?"
            className="input"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add details..."
            className="input min-h-[100px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Deadline *
            </label>
            <input
              type="datetime-local"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="select"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Priority: {(formData.priority_score * 100).toFixed(0)}%
          </label>
          <input
            type="range"
            name="priority_score"
            min="0"
            max="1"
            step="0.1"
            value={formData.priority_score}
            onChange={handleChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>Low</span>
            <span>Medium</span>
            <span>High</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
  {/* AI Suggestions Button */}
  <button
    type="button"
    onClick={handleGetSuggestions}
    disabled={loading}
    className={`button button-outline flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200
      ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
    `}
  >
    {loading ? (
      <>
        <svg className="animate-spin h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-sm">Processing...</span>
      </>
    ) : (
      <>
        <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span className="text-sm">AI Suggestions</span>
      </>
    )}
  </button>

  {/* Submit Button */}
  <button
    type="submit"
    disabled={loading}
    className={`button button-primary flex-1 px-4 py-2 rounded-xl transition-all duration-200
      ${loading ? 'bg-gray-400 cursor-not-allowed' : ''}
    `}
  >
    {loading ? 'Saving...' : taskToEdit ? 'Update Task' : 'Create Task'}
  </button>

  {/* Cancel Button */}
  {taskToEdit && (
    <button
      type="button"
      onClick={onTaskAdded}
      className="button button-ghost px-4 py-2 rounded-xl transition-all duration-200"
    >
      Cancel
    </button>
  )}
</div>

      </form>

      {suggestions && (
        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
          <h3 className="font-semibold mb-2">AI Suggestions</h3>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Description:</span> {suggestions.description}</p>
            <p><span className="font-medium">Deadline:</span> {suggestions.deadline}</p>
            <p><span className="font-medium">Category:</span> {suggestions.category}</p>
            <p><span className="font-medium">Priority:</span> {(suggestions.priority_score * 100).toFixed(0)}%</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskForm;