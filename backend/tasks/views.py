from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import TaskSerializer
from .scoring import calculate_task_score
from datetime import datetime, date

@api_view(['POST'])
def analyze_tasks(request):
    incoming = request.data if isinstance(request.data, list) else request.data.get("tasks", [])

    serializer = TaskSerializer(data=incoming, many=True)
    serializer.is_valid(raise_exception=True)

    tasks = serializer.validated_data
    today = date.today()

    for idx, task in enumerate(tasks):

        task["id"] = idx + 1 if "id" not in task else task["id"]
        if isinstance(task["due_date"], str):
            task["due_date"] = datetime.strptime(task["due_date"], "%Y-%m-%d").date()

        task["days_until_due"] = (task["due_date"] - today).days

        # Score calculation
        task["score"] = calculate_task_score(task, tasks)

    sorted_tasks = sorted(tasks, key=lambda x: x["score"], reverse=True)

    return Response({"analyzed_tasks": sorted_tasks}, status=200)


@api_view(['POST'])
def suggest_tasks(request):
    incoming = request.data if isinstance(request.data, list) else request.data.get("tasks", [])

    serializer = TaskSerializer(data=incoming, many=True)
    serializer.is_valid(raise_exception=True)

    tasks = serializer.validated_data

    for task in tasks:
        task["score"] = calculate_task_score(task, tasks)

    sorted_tasks = sorted(tasks, key=lambda x: x["score"], reverse=True)

    recommendations = []
    for task in sorted_tasks[:3]:
        reason = []
        if task["importance"] >= 8:
            reason.append("High importance")
        if task["estimated_hours"] <= 3:
            reason.append("Quick to complete")
        if task["score"] > 70:
            reason.append("Strong overall priority")

        recommendations.append({
            "title": task["title"],
            "score": task["score"],
            "reason": ", ".join(reason) if reason else "General high priority"
        })

    return Response({"top_tasks": recommendations}, status=200)
