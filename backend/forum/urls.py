# forum/urls.py

from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include("api.urls")),
    path('sse/', include("sse.urls")),  # Include the sse app URLs
    # re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),  # Serve React app
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
