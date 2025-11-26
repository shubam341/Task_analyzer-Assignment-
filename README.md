Task Analyzer — Backend (Django + REST API + Priority Algorithm)

A backend system that intelligently analyzes tasks based on urgency, importance, effort & dependencies, helping users decide which tasks should be completed first.

This backend is built as per assignment requirements, focusing on priority scoring + smart task ranking.

🚀 Tech Stack

Django REST Framework

Python 3.8+

Custom scoring algorithm

Unit-tested priority logic

No authentication / No permanent DB storage (as required)

🧠 Core Features
Feature	Method	Endpoint	Auth	Status
Analyze & return prioritized tasks	POST	/api/tasks/analyze/	❌	✔
Get top 3 recommended tasks	POST	/api/tasks/suggest/	❌	✔
Bulk JSON task processing	—	Supported	❌	✔
Custom weighted priority scoring	—	—	—	🔥
Unit tests for algorithm behavior	—	tests.py	—	🧪
📡 API Endpoints & Usage
🔹 1. Analyze & Score Tasks

Returns all tasks sorted by priority score.

POST /api/tasks/analyze/

Example Request
[
  {
    "id": 1,
    "title": "Fix login bug",
    "due_date": "2025-11-30",
    "estimated_hours": 3,
    "importance": 8,
    "dependencies": []
  }
]

Response
[
  {
    "id": 1,
    "title": "Fix login bug",
    "due_date": "2025-11-30",
    "estimated_hours": 3,
    "importance": 8,
    "dependencies": [],
    "score": 82.5
  }
]

🔹 2. Suggest Top 3 Tasks

Returns best 3 with explanation for each.

POST /api/tasks/suggest/

Example Response
[
  {
    "title": "Fix login bug",
    "score": 92.0,
    "reason": "High importance, approaching deadline"
  },
  {
    "title": "Optimize DB query",
    "score": 79.0,
    "reason": "Quick win, low effort"
  }
]

🧩 Priority Scoring System
Factor	Weight	Meaning
Urgency	0–40	Based on deadline, overdue = max priority
Importance	0–30	Direct scale ×3
Quick Win (Effort)	0–10	Fewer hours = more score
Dependencies	0–20	If other tasks depend on it → boost

📌 Final formula:

score = urgency + importance + effort_bonus + dependency_weight

🧪 Unit Testing

Run all test cases:

python manage.py test


Test coverage includes:

✔ Urgency influence
✔ Quick task preference
✔ Dependency weighting
✔ Balanced scoring outcome

🛠 Setup Instructions
cd task-analyzer/backend
venv\Scripts\activate          # or source venv/bin/activate
pip install -r requirements.txt
python manage.py runserver


Server runs at:

http://127.0.0.1:8000/
