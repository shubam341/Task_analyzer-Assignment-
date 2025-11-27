<div align="center">

# 🚀 TASK ANALYZER — Smart Task Prioritization System  
### AI-Powered Ranking • Deadline Awareness • Productivity Booster

#  Priority Scoring Algorithm
  ### The scoring engine of Task Analyzer is built to mimic real-world decision making where urgency, impact, effort, and dependencies influence which task should be done first. Instead of ranking based on a single factor, the algorithm evaluates each task using a weighted multi-factor formula.
</div>

---

## 📌 Overview

Task Analyzer is an AI-assisted task ranking system that analyzes work items based on:

| Factor | Details |
|-------|---------|
| ⭐ Importance | Critical impact level |
| ⏳ Due Date | Urgency + days left |
| ⚡ Estimated Hours | Time efficiency |
| 🔗 Dependencies | Blockers reduce score |

It automatically ranks tasks and highlights **the MOST important one to work on right now.**


 🔷Design Decisions & Trade-offs
    To balance simplicity, speed, and functionality, several intentional design decisions were made:

| Decision                                          | Reason                                                                |
| ------------------------------------------------- | --------------------------------------------------------------------- |
| Weighted scoring instead of single-factor sorting | Allows real-world priority behaviour instead of simple sorting        |
| Smart Balance as default                          | Best mix of urgency, effort & importance for normal workday decisions |
| Boost priority for dependency-heavy tasks         | Completing them unlocks future progress faster                        |
| Circular dependency detection                     | Prevent infinite scoring loops or biased scoring                      |
| Tailwind + Vanilla JS UI                          | Fast execution for assignment without heavy framework overhead        |
| JSON + Form input together                        | Allows developers & normal users both to test easily                  |

 Trade-off: A full React frontend or ML-based weighting system was avoided intentionally to stay within assignment scope and deliver speed + clarity over complexity.



 🔷 Development Time Breakdown (as required)
 | Work Item                             | Time Spent        |
| ------------------------------------- | ----------------- |
| Backend setup + scoring logic         | ~1 hr 30 mins     |
| Priority modes + dependency handling  | ~45 mins          |
| Frontend UI (form, cards, sorting UI) | ~1 hr             |
| Testing + debugging API flow          | ~30 mins          |
| README documentation                  | ~20 mins          |
| **Total Approx Work Time**            | **~3 hr 55 mins** |


---

<br>

# 🧠 Features

### 🔥 Backend — Django REST API
✔ Accept tasks via list or JSON  
✔ Computes priority score  
✔ Detects circular dependencies  
✔ Sort tasks dynamically  
✔ Generates "next best task" recommendation  

### 🎨 Frontend — Tailwind + JS
✔ Add tasks manually or via bulk JSON  
✔ Beautiful priority UI cards  
✔ Right panel recommendation highlight  
✔ Smart / Deadline / Impact / Fastest sorting  
✔ Dark + light theme toggler  

---

<br>

# 🏗 Tech Stack

| Layer | Technology |
|------|------------|
| Backend | **Django 5 + DRF** |
| Frontend | **HTML + Tailwind + Vanilla JS** |
| Format | JSON REST |
| Language | Python + JavaScript |

---

<br>

 Core Logic Used
 Each task is evaluated using:
 | Factor                    | Why It Matters                                |
| ------------------------- | --------------------------------------------- |
| ⏳ Urgency (Due Date)      | Tasks closer to deadline get higher score     |
| ⭐ Importance (1–10)       | Defines overall impact of task                |
| ⚡ Effort (Hours Required) | Lower effort tasks give faster progress boost |
| 🔗 Dependencies           | Tasks blocking others get priority boost      |


Scoring Formula:
 urgency_score = max(0, (10 - days_left)) * 1.5  
importance_score = importance * 2  
effort_score = 10 / (estimated_hours + 1) * 1.2  
dependency_score = len(dependencies) * 2  

final_score = urgency_score + importance_score + effort_score + dependency_score


Sorting Modes Logic
| Mode            | Logic                                             |
| --------------- | ------------------------------------------------- |
| Fastest Wins    | Sort by lowest estimated_hours first              |
| High Impact     | Sort by importance descending                     |
| Deadline Driven | Sorted by nearest due date                        |
| Smart Balance ⭐ | Uses final_score above (default recommended view) |

Smart Balance is the most optimal because it doesn’t focus on only one category — it dynamically balances effort, urgency, and impact to give the best next action.

Tasks past their due dates get urgency multiplier boost making them highly prioritized. Circular dependencies are detected by graph-traversal check and such tasks are flagged and excluded from priority bounce-loop to avoid infinite recursion.

This algorithm is flexible and can later support ML ranking, custom weights, work patterns, learning feedback etc.
---

<br>

# ⚙ Installation Guide

## 1️⃣ Clone Repository

```bash
git clone https://github.com/shubam341/Task_analyzer-Assignment-
cd task-analyzer

| OS        | Command                    |
| --------- | -------------------------- |
| Windows   | `venv\Scripts\activate`    |
| Mac/Linux | `source venv/bin/activate` |

Install dependencies:
pip install django djangorestframework corsheaders
Run server:
python manage.py runserver
API now live at:
http://127.0.0.1:8000

| Route                 | Method | Action                  |
| --------------------- | ------ | ----------------------- |
| `/api/tasks/analyze/` | POST   | Returns ranked tasks    |
| `/api/tasks/suggest/` | POST   | Top 3 recommended tasks |

[
  {
    "title": "UI Design Finalization",
    "due_date": "2025-12-04",
    "estimated_hours": 5,
    "importance": 9,
    "dependencies": [1,3]
  }
]

<br>
3️ Frontend Setup
No build, no npm — just open the file:
cd frontend
start index.html     # Windows
open index.html      # Mac

<br>
🧠 Usage Flow
| Step                               | Action |
| ---------------------------------- | ------ |
| ➊ Add tasks (or paste bulk JSON)   |        |
| ➋ Click **Analyze Tasks**          |        |
| ➌ Results appear as cards below    |        |
| ➍ 🔥 Top Task shows in right panel |        |
| ➎ Optional: change sorting mode    |        |

Example Output Preview
🔥 Next Task to Work On → "Complete Backend Logic"
⭐ Score: 92/100
⏳ 1 day left
⚡ Rated High Priority



# 📂 Folder Structure
   ├── backend/
│ ├── tasks/
│ │ ├── views.py # Analyze + Suggest endpoints
│ │ ├── serializers.py # Input data validation
│ │ ├── scoring.py # Score calculation logic
│ │ ├── urls.py # API route mapping
│ ├── task_analyzer/ # Core Django project
│ ├── manage.py
│
├── frontend/
│ ├── index.html # UI
│ ├── script.js # Brain of frontend
│ ├── style.css # Optional custom styling
│
└── README.md

Future Improvements
 ML-based ranking adapting user behaviour
 Eisenhower 2D Grid visualization (Urgent vs Important)
 Task reminder notification engine
 Weekend/holiday smart date calculation
 UI Kanban + drag-drop task flow



