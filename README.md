Smart Todo List with AI
A full-stack task management application with AI-powered features for task prioritization, deadline suggestions, and context-aware recommendations. Built with Next.js, Tailwind CSS, Django REST Framework, and Groq API for AI integration.
Features

Task Management: Create, edit, and filter tasks by category, status, and priority.
Quick Add Task: Add tasks quickly via a modal with title and optional deadline fields, with automatic task list updates.
Context Input: Add daily context (e.g., WhatsApp messages, emails, notes) and view history with AI-generated insights (sentiment and keywords).
AI Integration: Uses Groq API for task prioritization, deadline suggestions, category recommendations, and description enhancement. Integrates NLTK for sentiment analysis and keyword extraction from context entries.
Calendar View: Visualize task deadlines using a calendar interface powered by react-big-calendar.
Dark Mode: Toggle between light and dark themes, with preferences saved in local storage.
Export/Import Tasks: Export tasks to a JSON file and import tasks from JSON files.
User-Friendly Feedback: Displays toast notifications for success and error messages using react-toastify.
Automatic Task List Updates: Task list refreshes automatically after adding or updating tasks via the quick add modal or task form.

Screenshots
(In screenshots folder in the repository)

 - Task list with filters and quick add button.
 - Form for creating/editing tasks with AI suggestions.
 - Interface for adding and viewing context entries.
 - Calendar view of task deadlines.
 - Modal for rapid task creation.

Setup Instructions
Prerequisites

Python 3.8+
Node.js 16+
PostgreSQL database
Groq API key

Backend Setup

Clone the repository:git clone https://github.com/Amankumaraman/Task-AI
cd Task-AI/backend


Create a virtual environment and install dependencies:python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt


Set up environment variables in a .env file:GROQ_API_KEY=<your-groq-api-key>
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<dbname>


Run database migrations:python manage.py migrate


Start the Django server:python manage.py runserver



Frontend Setup

Navigate to the frontend directory:cd Task-AI/frontend


Install dependencies:npm install


Start the Next.js app:npm run dev



Running the Application

Ensure the backend server is running at http://localhost:8000.
Access the frontend at http://localhost:3000.

API Documentation

GET /api/tasks/: Retrieve all tasks, with optional filtering by category, status, and priority_score__gte.
POST /api/tasks/: Create a new task with fields like title, description, deadline, category, and priority.
PUT /api/tasks//: Update an existing task.
GET /api/categories/: Retrieve all task categories.
POST /api/context-entries/: Add a new context entry (e.g., WhatsApp message, email, note).
GET /api/context-entries/: Retrieve all context entries with processed insights.
POST /api/tasks/ai_suggestions/: Get AI-generated suggestions (priority, deadline, description, category) based on task details and context entries.

Sample Task and AI Suggestions
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

Backend: See requirements.txt for full list. Key dependencies:
django: Web framework.
djangorestframework: API framework.
nltk: For sentiment analysis and keyword extraction.
groq: For AI-powered task suggestions.


Frontend: See package.json for full list. Key dependencies:
react-toastify: For toast notifications.
react-big-calendar: For calendar visualization.
axios: For API requests.
moment: For date handling in the calendar.
tailwindcss: For styling.



Notes

The application uses the Groq API for AI features, with NLTK for context analysis (sentiment and keyword extraction).
Ensure the PostgreSQL database is configured correctly in the .env file.
The task list updates automatically after adding or updating tasks, and toast notifications provide immediate feedback for user actions.
To add screenshots, capture images of the UI (dashboard, task form, context input, calendar, quick add modal) and place them in a screenshots/ folder. Update the README.md with the correct file paths.
