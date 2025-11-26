from datetime import datetime

def calculate_task_score(task, all_tasks):
    today = datetime.today().date()

    # 1) Urgency score (0–40)
    days_left = (task['due_date'] - today).days
    if days_left <= 0:
        urgency_score = 40  # overdue task = high priority
    else:
        urgency_score = max(5, 40 - days_left)

    # 2) Importance score (0–30)
    importance_score = task['importance'] * 3  # convert scale 1–10 to 3–30

    # 3) Effort score (0–10)
    effort_score = max(1, 10 - task['estimated_hours'])  # quick wins

    # 4) Dependency score (0–20)
    dependency_score = 0
    for t in all_tasks:
        if task['id'] in t.get('dependencies', []):
            dependency_score += 10  # if other tasks depend on this

    # FINAL SCORE
    final_score = urgency_score + importance_score + effort_score + dependency_score

    return final_score
