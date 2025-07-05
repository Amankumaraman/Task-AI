import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
from nltk.tokenize import word_tokenize
import requests
import json
from datetime import datetime, timedelta

# Download NLTK data (run once)
nltk.download('vader_lexicon')
nltk.download('punkt')

class AIManager:
    def __init__(self):
        self.sia = SentimentIntensityAnalyzer()
        self.groq_api_key = ''  # Hardcoded API key
        if not self.groq_api_key:
            raise ValueError("GROQ_API_KEY is not set")

    def analyze_context(self, context_entries):
        """Analyze sentiment and extract keywords from context entries."""
        all_text = " ".join(entry['content'] for entry in context_entries)
        sentiment = self.sia.polarity_scores(all_text)
        keywords = self.extract_keywords(all_text)
        return {
            'sentiment': sentiment['compound'],
            'keywords': keywords,
            'urgency': self.detect_urgency(keywords)
        }

    def extract_keywords(self, text):
        """Extract key phrases using NLTK tokenization."""
        tokens = word_tokenize(text.lower())
        common_keywords = ['urgent', 'asap', 'today', 'tomorrow', 'meeting', 'deadline']
        return [word for word in tokens if word in common_keywords]

    def detect_urgency(self, keywords):
        """Detect urgency based on keywords."""
        urgency_keywords = {'urgent': 0.9, 'asap': 0.9, 'today': 0.7, 'tomorrow': 0.5, 'meeting': 0.6, 'deadline': 0.8}
        urgency_score = max((urgency_keywords.get(k, 0) for k in keywords), default=0)
        return urgency_score

    def suggest_deadline(self, task_complexity, context_analysis, user_preferences=None):
        """Suggest a realistic deadline based on complexity and urgency."""
        base_days = max(1, int(task_complexity * 5))
        urgency_factor = context_analysis['urgency']
        work_hours_per_week = (user_preferences.get('preferred_work_hours') if user_preferences else 40) or 40
        available_days = work_hours_per_week / 8
        adjustment = base_days * (1 - urgency_factor) / available_days
        deadline = datetime.now() + timedelta(days=base_days + adjustment)
        return deadline.strftime('%Y-%m-%dT%H:%M:%SZ')

    def get_ai_suggestions(self, task, context_entries, user_preferences=None):
        """Get AI-powered suggestions using Groq Cloud AI."""
        if not context_entries:
            context_entries = [{'content': '', 'source_type': 'NOTE'}]

        context_analysis = self.analyze_context(context_entries)

        system_prompt = """
        You are an AI assistant for a task management system. Based on the task details and context, provide:
        - A prioritized urgency score (0-1, where 1 is most urgent).
        - A suggested deadline in ISO format (e.g., 2025-07-07T12:00:00Z).
        - An enhanced description incorporating context keywords.
        - A suggested category from ["Work", "Personal", "Urgent"].
        Respond in JSON format with keys: "priority_score", "deadline", "description", "category".
        """

        user_prompt = f"""
        Task: {json.dumps(task)}
        Context Analysis: {json.dumps(context_analysis)}
        User Preferences: {json.dumps(user_preferences or {})}
        """

        headers = {
            'Authorization': f'Bearer {self.groq_api_key}',
            'Content-Type': 'application/json'
        }
        payload = {
            'model': 'llama3-70b-8192',
            'messages': [
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': user_prompt}
            ],
            'temperature': 0.7,
            'max_tokens': 500
        }

        try:
            print(f"Sending request to https://api.groq.com/openai/v1/chat/completions with payload: {payload}")  # Debug
            response = requests.post(
                'https://api.groq.com/openai/v1/chat/completions',
                headers=headers,
                json=payload,
                timeout=10
            )
            response.raise_for_status()
            result = response.json()
            print(f"Received response: {result}")  # Debug
            ai_response = result['choices'][0]['message']['content']
            suggestions = json.loads(ai_response)

            # Validate and set defaults
            if not all(key in suggestions for key in ['priority_score', 'deadline', 'description', 'category']):
                raise ValueError("Incomplete AI response from Groq")
            if not 0 <= suggestions['priority_score'] <= 1:
                suggestions['priority_score'] = context_analysis['urgency']
            if not isinstance(suggestions['deadline'], str) or not suggestions['deadline'].endswith('Z'):
                suggestions['deadline'] = self.suggest_deadline(0.5, context_analysis, user_preferences)

            return suggestions

        except requests.exceptions.RequestException as e:
            print(f"Groq API error: {e.response.text if e.response else str(e)}")  # Detailed error message
            return {
                'priority_score': context_analysis['urgency'],
                'deadline': self.suggest_deadline(0.5, context_analysis, user_preferences),
                'description': task.get('description', '') + ' (enhanced with context)',
                'category': 'Work'
            }
        except (json.JSONDecodeError, ValueError) as e:
            print(f"Response parsing error: {str(e)}")
            return {
                'priority_score': context_analysis['urgency'],
                'deadline': self.suggest_deadline(0.5, context_analysis, user_preferences),
                'description': task.get('description', '') + ' (enhanced with context)',
                'category': 'Work'
            }

if __name__ == "__main__":
    task = {'title': 'Prepare presentation', 'description': 'Create slides'}
    context_entries = [{'content': 'Need to prepare for Monday\'s meeting urgently', 'source_type': 'WhatsApp'}]
    user_preferences = {'preferred_work_hours': 40, 'high_priority_categories': ['Urgent']}

    ai_manager = AIManager()
    suggestions = ai_manager.get_ai_suggestions(task, context_entries, user_preferences)
    print("AI Suggestions:", json.dumps(suggestions, indent=2))