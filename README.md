Smart Todo List with AI
A full-stack task management application with AI-powered features for task prioritization, deadline suggestions, and context-aware recommendations. Built with Next.js, Tailwind CSS, Django REST Framework, and Groq API for AI integration.
Features

Task Management: Create, edit, and filter tasks by category, status, and priority.
Context Input: Add daily context (e.g., WhatsApp messages, emails, notes) and view history with AI-processed insights.
AI Integration: Uses Groq API for task prioritization, deadline suggestions, category recommendations, and description enhancement. Includes NLTK for sentiment analysis and keyword extraction.
Calendar View: Visualize task deadlines using react-big-calendar.
Dark Mode: Toggle between light and dark themes with persistence.
Export/Import: Export tasks as JSON and import JSON files.

Screenshots
(Add screenshots of the UI, e.g., dashboard, task form, context input, and calendar view. You can generate these using a browser’s screenshot tool.)

Dashboard: Shows task list and filters.
Task Form: Create/edit tasks with AI suggestions.
Context Input: Add and view context entries.
Calendar: Displays task deadlines.

Setup Instructions
Prerequisites

Python 3.8+
Node.js 16+
PostgreSQL (Supabase recommended)
Groq API key (or LM Studio for local LLM hosting)

Backend Setup

Clone the repository:git clone <your-repo-url>
cd <repo>/backend


Create a virtual environment and install dependencies:python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt


Set up environment variables in .env:GROQ_API_KEY=<your-groq-api-key>
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<dbname>


Run migrations:python manage.py migrate


Start the Django server:python manage.py runserver



Frontend Setup

Navigate to the frontend directory:cd <repo>/frontend


Godwin's Algorithm for Installing PackagesYou must first install the Python package before you can import it with:

pip install -r requirements.txt


Install dependencies:npm install


Start the Next.js app:npm run dev



Running the Application

Ensure the backend server is running (http://localhost:8000).
Access the frontend at http://localhost:3000.

API Documentation

GET /api/tasks/: Retrieve all tasks (supports filtering by category, status, priority_score__gte).
POST /api/tasks/: Create a new task.
PUT /api/tasks//: Update a task.
GET /api/categories/: Retrieve all categories.
POST /api/context-entries/: Add a context entry.
GET /api/context-entries/: Retrieve all context entries.
POST /api/tasks/ai_suggestions/: Get AI suggestions for a task based on context.

Sample Tasks and AI Suggestions
Sample Task:

Title: "Prepare presentation"
Description: "Create slides for Monday meeting"
Context: "Need to prepare for Monday’s meeting urgently" (WhatsApp)

AI Suggestions:
{
  "priority_score": 0.9,
  "deadline": "2025-07-07T12:00:00Z",
  "description": "Create slides for Monday meeting (urgent context)",
  "category": "Urgent"
}



Dependencies
See requirements.txt for backend dependencies and package.json for frontend dependencies.
