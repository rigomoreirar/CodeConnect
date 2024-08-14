# urls.py

from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from knox import views as knox_views
from . import views_get_data
from . import views_post_data
from . import views_post_email
from . import views_proposals

urlpatterns = [
    # Authentication and User Endpoints
    path('register/', views_post_data.register, name='register'),
    path('login/', views_post_data.login, name='login'),
    path('logout/', views_post_data.logout, name='logout'),
    path('edit-user-info/', views_post_data.edit_user_info, name='editUserInfo'),
    path('change-user-password/', views_post_data.change_user_password, name='change_user_password'),

    # Data Retrieval Endpoints
    path('get-all-data/', views_get_data.get_all_data, name='getAllData'),
    path('profile-picture/<int:user_id>/', views_get_data.get_profile_picture, name='getProfilePicture'),
    path('profile-picture-username/<str:username>/', views_get_data.get_profile_picture_by_username, name='get_profile_picture_by_username'),
    path('categories-by-user/<int:user_id>/', views_get_data.get_categories_by_user, name='getCategoriesByUser'),

    # Email Endpoints
    path('send-test-email/', views_post_email.send_test_email, name='sendTestEmail'),
    path('reset-user-password-email/', views_post_email.reset_user_password_email, name='resetUserPasswordEmail'),

    # Like and Dislike Endpoints
    path('create-like/', views_post_data.create_like, name='createLike'),
    path('create-dislike/', views_post_data.create_dislike, name='createDislike'),

    # Comment Endpoints
    path('add-comment/', views_post_data.add_comment, name='addComment'),
    path('delete-comment/', views_post_data.delete_comment, name='deleteComment'),

    # Post Endpoints
    path('create-post/', views_post_data.create_post, name='createPost'),
    path('delete-post/', views_post_data.delete_post, name='deletePost'),

    # Category Endpoints
    path('create-category/', views_post_data.create_category, name='createCategory'),
    path('delete-category/', views_post_data.delete_category, name='deleteCategory'),
    path('follow-category/', views_post_data.follow_category, name='followCategory'),
    path('unfollow-category/', views_post_data.unfollow_category, name='unfollowCategory'),

    # Profile Picture Endpoint
    path('change-profile-picture/', views_post_data.change_profile_picture, name='changeProfilePicture'),
    path('get_profile_picture/', views_get_data.get_profile_picture, name='getProfilePicture'),

    # Proposal Endpoints
    path('proposals/', views_proposals.create_proposal, name='create_proposal'),
    path('proposals/vote/', views_proposals.vote, name='like_proposal'),
    path('proposals/<int:proposal_id>/delete/', views_proposals.delete_proposal, name='delete_proposal'),

    # For creating default users
    path('create-default-users/', views_post_data.create_default_users, name='create_default_users'),
    

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
