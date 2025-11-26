from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import TaskSerializer
from .scoring import calculate_task_score
from datetime import datetime

@api_view(['POST'])
def analyze_tasks(request):
    serializer = TaskSerializer(data=request.data, many=True)

    if not serializer.is_valid():
        return Response({"error": serializer.errors}, status=400)

    tasks = serializer.validated_data

    # Convert due_date string → date format
    for task in tasks:
        if isinstance(task['due_date'], str):
            task['due_date'] = datetime.strptime(task['due_date'], "%Y-%m-%d").date()

    # Score calculation
    for task in tasks:
        task['score'] = calculate_task_score(task, tasks)

    sorted_tasks = sorted(tasks, key=lambda x: x['score'], reverse=True)

    return Response(sorted_tasks, status=200)


@api_view(['POST'])
def suggest_tasks(request):
    serializer = TaskSerializer(data=request.data, many=True)

    if not serializer.is_valid():
        return Response({"error": serializer.errors}, status=400)

    tasks = serializer.validated_data

    for task in tasks:
        task['score'] = calculate_task_score(task, tasks)

    sorted_tasks = sorted(tasks, key=lambda x: x['score'], reverse=True)

    suggestions = []
    for task in sorted_tasks[:3]:
        reason = []
        if task['importance'] >= 8:
            reason.append("high importance")
        if task['estimated_hours'] <= 3:
            reason.append("quick win")
        if task['score'] > 70:
            reason.append("overall high priority score")

        suggestions.append({
            "title": task["title"],
            "score": task["score"],
            "reason": ", ".join(reason) if reason else "ranked high overall"
        })

    return Response(suggestions, status=200)
