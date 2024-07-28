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
    path('user/', views_get_data.get_user_data, name="user"),
    path('logout/', knox_views.LogoutView.as_view(), name="user"),
    path('all-posts/', views_get_data.allPosts, name="allPosts"),
    path('all-profiles/', views_get_data.allProfiles, name="allProfiles"),
    path('all-likes/', views_get_data.allLikes, name="allLikes"),
    path('all-dislikes/', views_get_data.allDislikes, name="allDislikes"),
    path('all-comments/', views_get_data.allComments, name="allComments"),
    path('all-categories/', views_get_data.allCategories, name="allCategories"),
    path('postData/', views_post_data.postData, name="postData"),
    path('like/', views_post_data.like, name="like"),
    path('dislike/', views_post_data.dislike, name="dislike"),
    path('addComment/', views_post_data.addComment, name="addComment"),
    path('new-post/', views_post_data.newPost, name="newPost"),
    path('follow/', views_post_data.follow, name="follow"),
    path('unfollow/', views_post_data.unfollow, name="unfollow"),
    path('delete-user-post/', views_post_data.delete_user_post, name='deleteUserPost'),
    path('user-categories/', views_get_data.get_user_categories, name='getUserCategories'),
    path('create-category/', views_post_data.create_category, name='createCategory'),
    path('delete-category/', views_post_data.delete_category, name='deleteCategory'),
    path('posts-by-user-id/', views_get_data.posts_by_user_id, name='postsByUserCategories'),
    path('profile-picture/<int:user_id>/', views_get_data.get_profile_picture, name='getProfilePicture'),
    path('change-profile-picture/', views_post_data.change_profile_picture, name='changeProfilePicture'),
    path('send-test-email/', views_post_email.send_test_email, name='sendTestEmail'),
    path('reset-user-password-email/', views_post_email.reset_user_password_email, name='resetUserPasswordEmail'),
    path('delete_comment/', views_post_data.delete_comment, name='deleteComment'),
    path('profile-picture-username/<str:username>/', views_get_data.get_profile_picture_by_username, name='getProfilePictureByUsername'),
    path('sse/categories/', views_sse.sse_categories, name='sse_categories'),
    path('sse/likes/', views_sse.sse_likes, name='sse_likes'),
    path('sse/dislikes/', views_sse.sse_dislikes, name='sse_dislikes'),
    path('sse/posts/', views_sse.sse_posts, name='sse_posts'),
    path('sse/comments/', views_sse.sse_comments, name='sse_comments'),
    path('sse/users/', views_sse.sse_users, name='sse_users'),
    path('sse/profiles/', views_sse.sse_profiles, name='sse_profiles'),
    path('total-likes-by-user/', views_get_data.total_likes_by_user, name='total-likes-by-user'),
    path('total-dislikes-by-user/', views_get_data.total_dislikes_by_user, name='total-dislikes-by-user'),
    path('total-comments-by-user/', views_get_data.total_comments_by_user, name='total-comments-by-user'),
    path('sse-total-likes/<int:user_id>/', views_sse.sse_total_likes, name='sse-total-likes'),
    path('sse-total-dislikes/<int:user_id>/', views_sse.sse_total_dislikes, name='sse-total-dislikes'),
    path('sse-total-comments/<int:user_id>/', views_sse.sse_total_comments, name='sse-total-comments'),
    path('edit-user-info/', views_post_data.edit_user_info, name='edit_user_info'),
    path('change-user-password/', views_post_data.change_user_password, name='change_user_password'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
