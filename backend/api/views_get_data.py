import logging
import mimetypes
import os
from django.conf import settings
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Post, Profile, Like, Dislike, Comment, User, Category
from .serializers import PostSerializer, ProfileSerializer, LikeSerializer, DislikeSerializer, CommentSerializer, CategorySerializer
from django.views.decorators.csrf import csrf_exempt

# Define the directory for profile pictures
PROFILE_PICTURE_DIR = os.path.join(settings.BASE_DIR, 'assets', 'profile-pictures')

# Define a logger
logger = logging.getLogger(__name__)

@csrf_exempt
@api_view(['GET'])
def get_all_data(request):
    if not request.user.is_authenticated:
        return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

    user = request.user
    profile = Profile.objects.get(user=user)
    categories = Category.objects.all()
    posts = Post.objects.all()

    data = {
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'profile_data': ProfileSerializer(profile).data,
            'total_likes': Like.objects.filter(profile=profile).count(),
            'total_dislikes': Dislike.objects.filter(profile=profile).count(),
            'total_comments': Comment.objects.filter(profile=profile).count(),
            'isLoggedIn': True,
        },
        'categories': CategorySerializer(categories, many=True).data,
        'posts': PostSerializer(posts, many=True).data
    }

    return Response(data, status=status.HTTP_200_OK)

@csrf_exempt
@api_view(['GET'])
def get_profile_picture(request, user_id):
    logger.info(f"Received request for user ID: {user_id}")
    possible_extensions = ['png', 'jpg', 'jpeg', 'heic', 'heif', 'bmp', 'tiff', 'webp']
    for ext in possible_extensions:
        profile_picture_path = os.path.join(PROFILE_PICTURE_DIR, f"{user_id}.{ext}")
        if os.path.exists(profile_picture_path):
            logger.info(f"Serving profile picture for user ID: {user_id}")
            mime_type, _ = mimetypes.guess_type(profile_picture_path)
            with open(profile_picture_path, 'rb') as f:
                return HttpResponse(f.read(), content_type=mime_type)
    
    # Serve default profile picture if no specific one exists
    default_picture_path = os.path.join(PROFILE_PICTURE_DIR, 'no-profile-picture.webp')
    logger.info(f"Serving default profile picture for user ID: {user_id}")
    mime_type, _ = mimetypes.guess_type(default_picture_path)
    with open(default_picture_path, 'rb') as f:
        return HttpResponse(f.read(), content_type=mime_type)

@csrf_exempt
@api_view(['GET'])
def get_categories_by_user(request, user_id):
    logger.info(f"Received request for categories by user ID: {user_id}")
    
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    categories = Category.objects.filter(creator=user)
    serialized_categories = CategorySerializer(categories, many=True).data

    return Response(serialized_categories, status=status.HTTP_200_OK)


@csrf_exempt
@api_view(['GET'])
def get_profile_picture_by_username(request, username):
    logger.info(f"Received request for username: {username}")
    
    try:
        user = User.objects.get(username=username)
        user_id = user.id
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    possible_extensions = ['png', 'jpg', 'jpeg', 'heic', 'heif', 'bmp', 'tiff', 'webp']
    for ext in possible_extensions:
        profile_picture_path = os.path.join(PROFILE_PICTURE_DIR, f"{user_id}.{ext}")
        if os.path.exists(profile_picture_path):
            logger.info(f"Serving profile picture for user ID: {user_id}")
            mime_type, _ = mimetypes.guess_type(profile_picture_path)
            with open(profile_picture_path, 'rb') as f:
                return HttpResponse(f.read(), content_type=mime_type)
    
    # Serve default profile picture if no specific one exists
    default_picture_path = os.path.join(PROFILE_PICTURE_DIR, 'no-profile-picture.webp')
    logger.info(f"Serving default profile picture for user ID: {user_id}")
    mime_type, _ = mimetypes.guess_type(default_picture_path)
    with open(default_picture_path, 'rb') as f:
        return HttpResponse(f.read(), content_type=mime_type)

