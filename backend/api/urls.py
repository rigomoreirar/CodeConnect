from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from knox import views as knox_views
from . import views_get_data
from . import views_post_data
from . import views_post_email
from . import views_sse

urlpatterns = [
    path('register/', views_post_data.register, name='register'),
    path('login/', views_post_data.login, name='login'),
    path('logout/', knox_views.LogoutView.as_view(), name='logout'),
    path('get-all-data/', views_get_data.get_all_data, name='getAllData'),
    path('send-test-email/', views_post_email.send_test_email, name='sendTestEmail'),
    path('reset-user-password-email/', views_post_email.reset_user_password_email, name='resetUserPasswordEmail'),
    path('edit-user-info/', views_post_data.edit_user_info, name='edit_user_info'),
    path('change-user-password/', views_post_data.change_user_password, name='change_user_password'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
