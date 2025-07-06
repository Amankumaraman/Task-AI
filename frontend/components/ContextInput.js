'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function ContextInput() {
  const [context, setContext] = useState({
    content: '',
    source_type: 'NOTE',
  });
  const [contextEntries, setContextEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchContextEntries();
  }, []);

  const fetchContextEntries = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://task-ai-gpyr.onrender.com/api/context-entries/');
      setContextEntries(response.data);
    } catch (error) {
      toast.error('Failed to load context entries');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!context.content.trim()) {
      toast.error('Content is required');
      return;
    }

    try {
      setLoading(true);
      await axios.post('https://task-ai-gpyr.onrender.com/api/context-entries/', context);
      setContext({ content: '', source_type: 'NOTE' });
      fetchContextEntries();
      toast.success('Context entry added successfully');
    } catch (error) {
      toast.error('Failed to save context entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold mb-6 text-gradient">Add Context</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Content *
            </label>
            <textarea
              value={context.content}
              onChange={(e) => setContext({ ...context, content: e.target.value })}
              placeholder="Paste messages, emails, or notes here..."
              className="input min-h-[150px]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Source Type
            </label>
            <select
              value={context.source_type}
              onChange={(e) => setContext({ ...context, source_type: e.target.value })}
              className="select"
            >
              <option value="NOTE">Note</option>
              <option value="WHATSAPP">WhatsApp</option>
              <option value="EMAIL">Email</option>
              <option value="MEETING">Meeting</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="button-primary w-full"
          >
            {loading ? 'Saving...' : 'Add Context'}
          </button>
        </form>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gradient">Context History</h2>
          <button 
            onClick={fetchContextEntries}
            disabled={loading}
            className="button-ghost flex items-center gap-1"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : contextEntries.length === 0 ? (
          <p className="text-center py-8 text-gray-500 dark:text-gray-400">
            No context entries yet. Add one above to get started!
          </p>
        ) : (
          <div className="space-y-4">
            {contextEntries.map(entry => (
              <div key={entry.id} className="task-card">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`badge-${
                      entry.source_type === 'NOTE' ? 'primary' : 
                      entry.source_type === 'EMAIL' ? 'secondary' : 'warning'
                    }`}>
                      {entry.source_type}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(entry.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-2 whitespace-pre-line">
                    {entry.content}
                  </p>
                  {entry.processed_insights && (
                    <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                      <h4 className="font-medium text-sm mb-1">AI Insights:</h4>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        {Object.entries(entry.processed_insights).map(([key, value]) => (
                          <li key={key}>
                            <span className="font-medium">{key}:</span> {value}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
