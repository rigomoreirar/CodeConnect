from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from knox import views as knox_views
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('user/', views.get_user_data, name="user"),
    path('logout/', knox_views.LogoutView.as_view(), name="user"),
    path('all-posts/', views.allPosts, name="allPosts"),
    path('all-profiles/', views.allProfiles, name="allProfiles"),
    path('all-likes/', views.allLikes, name="allLikes"),
    path('all-dislikes/', views.allDislikes, name="allDislikes"),
    path('', views.index, name="index"),
    path('all-comments/', views.allComments, name="allComments"),
    path('all-categories/', views.allCategories, name="allCategories"),
    path('postData/', views.postData, name="postData"),
    path('like/', views.like, name="like"),
    path('dislike/', views.dislike, name="dislike"),
    path('addComment/', views.addComment, name="addComment"),
    path('new-post/', views.newPost, name="newPost"),
    path('follow/', views.follow, name="follow"),
    path('unfollow/', views.unfollow, name="unfollow"),
    path('delete-user-post/', views.delete_user_post, name='deleteUserPost'),
    path('user-categories/', views.get_user_categories, name='getUserCategories'),
    path('create-category/', views.create_category, name='createCategory'),
    path('delete-category/', views.delete_category, name='deleteCategory'),
    path('posts-by-user-id/', views.posts_by_user_id, name='postsByUserCategories'),
    path('profile-picture/<int:user_id>/', views.get_profile_picture, name='getProfilePicture'),
    path('change-profile-picture/', views.change_profile_picture, name='changeProfilePicture'),
    path('send-test-email/', views.send_test_email, name='sendTestEmail'),
    path('reset-user-password-email/', views.reset_user_password_email, name='resetUserPasswordEmail'),
    path('delete_comment/', views.delete_comment, name='deleteComment'),
    path('profile-picture-username/<str:username>/', views.get_profile_picture_by_username, name='getProfilePictureByUsername'),
    path('sse/categories/', views.sse_categories, name='sse_categories'),
    path('sse/likes/', views.sse_likes, name='sse_likes'),
    path('sse/dislikes/', views.sse_dislikes, name='sse_dislikes'),
    path('sse/posts/', views.sse_posts, name='sse_posts'),
    path('sse/comments/', views.sse_comments, name='sse_comments'),
    path('sse/users/', views.sse_users, name='sse_users'),
    path('sse/profiles/', views.sse_profiles, name='sse_profiles'),
    path('total-likes-by-user/', views.total_likes_by_user, name='total-likes-by-user'),
    path('total-dislikes-by-user/', views.total_dislikes_by_user, name='total-dislikes-by-user'),
    path('total-comments-by-user/', views.total_comments_by_user, name='total-comments-by-user'),
    path('sse-total-likes/<int:user_id>/', views.sse_total_likes, name='sse-total-likes'),
    path('sse-total-dislikes/<int:user_id>/', views.sse_total_dislikes, name='sse-total-dislikes'),
    path('sse-total-comments/<int:user_id>/', views.sse_total_comments, name='sse-total-comments'),
    path('edit-user-info/', views.edit_user_info, name='edit_user_info'),
    path('change-user-password/', views.change_user_password, name='change_user_password'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
