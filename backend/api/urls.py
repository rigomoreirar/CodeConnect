from django.urls import path
from knox import views as knox_views
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('user/', views.get_user_data, name="user"),
    path('logout/', knox_views.LogoutView.as_view(), name="user"),
    # API's
    path('', views.index, name="index"),
    path('all-posts/', views.allPosts, name="allPosts"),
    path('all-profiles/', views.allProfiles, name="allProfiles"),
    path('all-likes/', views.allLikes, name="allLikes"),
    path('all-dislikes/', views.allDislikes, name="allDislikes"),
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
    # New route for fetching posts by user categories
    path('posts-by-user-categories/', views.posts_by_user_categories, name='postsByUserCategories'),
]
