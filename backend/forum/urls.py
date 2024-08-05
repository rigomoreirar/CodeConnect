# urls.py

from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from views_sse import sse_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include("api.urls")),
    # re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),  # Serve React app
    
    # Server-Sent Events Endpoint
    path('sse/', sse_view, name='sse'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
