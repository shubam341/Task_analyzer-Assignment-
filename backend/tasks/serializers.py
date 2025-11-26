from rest_framework import serializers

class TaskSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=False)  # optional for input
    title = serializers.CharField(max_length=255)
    due_date = serializers.DateField()
    estimated_hours = serializers.FloatField()
    importance = serializers.IntegerField(min_value=1, max_value=10)
    dependencies = serializers.ListField(child=serializers.IntegerField(), required=False)
    score = serializers.FloatField(required=False)  # will be added in response
