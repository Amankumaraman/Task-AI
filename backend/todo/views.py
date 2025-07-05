from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
import logging

logger = logging.getLogger(__name__)

from .models import Task, Category, ContextEntry
from .serializers import TaskSerializer, CategorySerializer, ContextEntrySerializer
from .ai_module import AIManager

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'description', 'category']

    @action(detail=False, methods=['post'])
    def ai_suggestions(self, request):
        ai_manager = AIManager()
        task_data = request.data.get('task', {})
        context_entries = request.data.get('context_entries', [])
        suggestions = ai_manager.get_ai_suggestions(task_data, context_entries)
        return Response(suggestions)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            logger.info(f"Task created successfully: {serializer.data}")
            return Response(serializer.data, status=201)
        except Exception as e:
            logger.error(f"Task creation failed: {str(e)}")
            return Response({'error': str(e)}, status=400)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)  # Enable partial updates for PATCH
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            logger.info(f"Task updated successfully: {serializer.data}")
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Task update failed: {str(e)}")
            return Response({'error': str(e)}, status=400)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ContextEntryViewSet(viewsets.ModelViewSet):
    queryset = ContextEntry.objects.all()
    serializer_class = ContextEntrySerializer