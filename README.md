# 🧠 Smart Todo List with AI

A full-stack task management application with AI-powered features for task prioritization, deadline suggestions, and context-aware recommendations.

Built with **Next.js**, **Tailwind CSS**, **Django REST Framework**, and **Groq API** for AI integration.

---

## 🚀 Features

- ✅ **Task Management**: Create, edit, and filter tasks by category, status, and priority.
- ⚡ **Quick Add Task**: Add tasks quickly via modal with title and optional deadline.
- 🧠 **Context Input**: Add daily context (WhatsApp messages, emails, notes) and view history with AI-generated insights (sentiment + keywords).
- 🤖 **AI Integration**: 
  - Task prioritization, deadline suggestion, description enhancement.
  - Category recommendation.
  - Uses **Groq API** + **NLTK** for NLP tasks.
- 🗓️ **Calendar View**: Visualize task deadlines using `react-big-calendar`.
- 🌙 **Dark Mode**: Toggle between light/dark themes, saved in local storage.
- ⬆️⬇️ **Import/Export Tasks**: Easily export to/import from `.json` files.
- 🔔 **Feedback System**: Toast notifications using `react-toastify`.
- 🔄 **Auto Task Refresh**: Task list refreshes automatically after edits or adds.

---

## 📸 Screenshots

> Screenshots are located in the `screenshots/` folder.

- 📝 Task list with filters and quick add.
- ➕ Create/Edit task with AI suggestions.
- 💬 Context input and insights.
- 📆 Calendar view of deadlines.
- ⚡ Quick task creation modal.

---

## 🛠️ Setup Instructions

### ✅ Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL
- Groq API Key

---

## ⚙️ Backend Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Amankumaraman/Task-AI
   cd Task-AI/backend
````

2. **Create virtual environment & install dependencies**:

   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Create `.env` file**:

   ```env
   GROQ_API_KEY=<your-groq-api-key>
   DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<dbname>
   ```

4. **Run migrations**:

   ```bash
   python manage.py migrate
   ```

5. **Start server**:

   ```bash
   python manage.py runserver
   ```

---

## 🌐 Frontend Setup

1. **Navigate to frontend directory**:

   ```bash
   cd ../frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start development server**:

   ```bash
   npm run dev
   ```

---

## 🧪 Running the App

* Backend: [http://localhost:8000](http://localhost:8000)
* Frontend: [http://localhost:3000](http://localhost:3000)

---

## 📚 API Documentation

### 🧾 Task Endpoints

* `GET /api/tasks/` — List all tasks, supports filtering.
* `POST /api/tasks/` — Create a new task.
* `PUT /api/tasks/<id>/` — Update task by ID.

### 📂 Category

* `GET /api/categories/` — List all task categories.

### 💬 Context

* `POST /api/context-entries/` — Add a context entry.
* `GET /api/context-entries/` — List context entries with insights.

### 🤖 AI Suggestions

* `POST /api/tasks/ai_suggestions/` — Get AI-based suggestions:

  * Priority
  * Deadline
  * Enhanced description
  * Category

---

## 🧪 Sample Task + AI Suggestion

### Sample Input:

```json
{
  "title": "Prepare presentation",
  "description": "Create slides for Monday meeting",
  "context": "Need to prepare for Monday’s meeting urgently"
}
```

### AI Output:

```json
{
  "priority_score": 0.9,
  "deadline": "2025-07-07T12:00:00Z",
  "description": "Create slides for Monday meeting (urgent context)",
  "category": "Urgent"
}
```

---

## 📦 Dependencies

### 🔙 Backend

(See `requirements.txt`)

* `Django`: Web framework
* `djangorestframework`: REST APIs
* `nltk`: NLP tools for sentiment and keyword extraction
* `groq`: For AI suggestions

### 🔜 Frontend

(See `package.json`)

* `axios`: API calls
* `tailwindcss`: Styling
* `react-toastify`: Toast notifications
* `react-big-calendar`: Task calendar view
* `moment`: Date/time utilities

---

## 📝 Notes

* Ensure PostgreSQL is correctly configured in `.env`.
* The application uses Groq API + NLTK for AI insights.
* Task list refreshes after every add/edit.
* Toasts notify you of success or errors.
* Add screenshots of UI in `screenshots/` and update paths in this README.

---

## 👨‍💻 Author

**Aman Kumar**
GitHub: [@Amankumaraman](https://github.com/Amankumaraman)
LinkedIn: [Aman Kumar](https://linkedin.com/in/aman-kumar-here-for-you)
Portfolio: [devaiak.vercel.app](https://devaiak.vercel.app)

---

