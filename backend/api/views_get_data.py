import os
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Post, Profile, Like, Dislike, Comment, User, Category
from .serializers import PostSerializer, ProfileSerializer, LikeSerializer, DislikeSerializer, CommentSerializer, CategorySerializer

@api_view(['GET'])
def get_all_data(request):
    if not request.user.is_authenticated:
        return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

    user = request.user
    profile = Profile.objects.get(user=user)
    categories = Category.objects.all()
    posts = Post.objects.all()
    likes = Like.objects.filter(profile=profile)
    dislikes = Dislike.objects.filter(profile=profile)
    comments = Comment.objects.filter(profile=profile)

    data = {
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'profile_data': ProfileSerializer(profile).data,
            'total_likes': likes.count(),
            'total_dislikes': dislikes.count(),
            'total_comments': comments.count(),
            'isLoggedIn': True,
            'token': request.auth.key,
        },
        'categories': CategorySerializer(categories, many=True).data,
        'posts': PostSerializer(posts, many=True).data
    }

    return Response(data, status=status.HTTP_200_OK)
