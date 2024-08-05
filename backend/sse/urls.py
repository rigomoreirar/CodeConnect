# sse/urls.py

from django.urls import path
from .views import sse_view

urlpatterns = [
    path('sse/', sse_view, name='sse'),
]
