from django.test import TestCase


from django.test import TestCase
from datetime import datetime, timedelta
from .scoring import calculate_task_score

class ScoringAlgorithmTests(TestCase):

    def test_urgent_task_gets_higher_score(self):
        task = {
            "title": "Fix Login",
            "due_date": datetime.now().strftime("%Y-%m-%d"),
            "estimated_hours": 4,
            "importance": 5,
            "dependencies": []
        }
        score = calculate_task_score(task)
        self.assertGreater(score, 50)

    def test_high_importance_beats_low(self):
        high = {
            "title": "Critical Deployment",
            "due_date": "2025-12-20",
            "estimated_hours": 5,
            "importance": 10,
            "dependencies": []
        }
        low = {
            "title": "Minor typo fix",
            "due_date": "2025-12-20",
            "estimated_hours": 5,
            "importance": 2,
            "dependencies": []
        }
        self.assertGreater(calculate_task_score(high), calculate_task_score(low))

    def test_dependency_adds_boost(self):
        base = {
            "title": "Backend Integration",
            "due_date": "2025-12-15",
            "estimated_hours": 3,
            "importance": 6,
            "dependencies": [1,2,3]
        }
        score = calculate_task_score(base)
        self.assertGreater(score, 40)
