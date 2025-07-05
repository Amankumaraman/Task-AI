import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ContextPage() {
  const [context, setContext] = useState({ content: '', source_type: 'NOTE' });
  const [contextList, setContextList] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContext();
  }, []);

  const fetchContext = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/context-entries/');
      setContextList(response.data);
    } catch (error) {
      console.error('Error fetching context:', error);
    }
  };

  const handleChange = (e) => {
    setContext({ ...context, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/context-entries/', context);
      setContext({ content: '', source_type: 'NOTE' });
      fetchContext();
    } catch (error) {
      console.error('Error saving context:', error);
      setError('Failed to save context.');
    }
  };

  const handleProcessWithAI = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/tasks/ai_suggestions/', {
        task: { title: '', description: context.content },
        context_entries: [{ content: context.content, source_type: context.source_type }],
      });
      console.log('AI Suggestions:', response.data);
    } catch (error) {
      console.error('Error processing with AI:', error);
      setError('Failed to process with AI.');
    }
  };

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-4">Add Daily Context</h1>
      <form onSubmit={handleSubmit} className="card space-y-4">
        <textarea
          name="content"
          value={context.content}
          onChange={handleChange}
          placeholder="Enter context (e.g., messages, notes)"
          className="input"
          required
        />
        <select name="source_type" value={context.source_type} onChange={handleChange} className="input">
          <option value="NOTE">Note</option>
          <option value="WHATSAPP">WhatsApp</option>
          <option value="EMAIL">Email</option>
        </select>
        <button type="submit" className="button">Save Context</button>
        <button type="button" onClick={handleProcessWithAI} className="button ml-2">Process with AI</button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Context History</h2>
        <ul className="list-disc pl-5">
          {contextList.map((entry) => (
            <li key={entry.id} className="task-card">
              {entry.content} ({entry.source_type}) - {new Date(entry.created_at).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}