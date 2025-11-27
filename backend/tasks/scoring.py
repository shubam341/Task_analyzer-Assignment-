from datetime import datetime

def calculate_task_score(task, all_tasks):
    today = datetime.today().date()

    # Urgency score
    days_left = (task['due_date'] - today).days
    if days_left <= 0:
        urgency_score = 40  
    else:
        urgency_score = max(5, 40 - days_left)

    #Importance score 
    importance_score = task['importance'] * 3 

    # Effort score 
    effort_score = max(1, 10 - task['estimated_hours'])

    # Dependency score 
    dependency_score = 0
    for t in all_tasks:
        if task['id'] in t.get('dependencies', []):
            dependency_score += 10 

    # FINAL SCORE
    final_score = urgency_score + importance_score + effort_score + dependency_score

    return final_score
