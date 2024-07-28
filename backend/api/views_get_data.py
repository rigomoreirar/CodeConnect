import os
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
import logging
from .models import Post, Profile, Like, Dislike, Comment, User, Category
from .serializers import PostSerializer, ProfileSerializer, LikeSerializer, DislikeSerializer, CommentSerializer, CategorySerializer
import mimetypes
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

# Define a logger
logger = logging.getLogger(__name__)

# Define the directory for profile pictures
PROFILE_PICTURE_DIR = os.path.join(settings.BASE_DIR, 'assets', 'profile-pictures')

# Ensure the directory exists
os.makedirs(PROFILE_PICTURE_DIR, exist_ok=True)

@csrf_exempt
@api_view(['GET'])
def get_user_data(request):
    user = request.user

    if user.is_authenticated:
        profile_raw = Profile.objects.get(user=user)
        profile = ProfileSerializer(profile_raw)

        dislikes = Dislike.objects.filter(profile=profile_raw)
        dislikes = DislikeSerializer(dislikes, many=True).data

        likes = Like.objects.filter(profile=profile_raw)
        likes = LikeSerializer(likes, many=True).data

        comments = Comment.objects.filter(profile=profile_raw)
        comments = CommentSerializer(comments, many=True).data

        return Response({
            'user_info': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'profile_data': profile.data,
                'likes': likes,
                'dislikes': dislikes,
                'comments': comments,
            },
        })
    return Response({'error': "not authenticated"}, status=400)

@csrf_exempt
@api_view(['GET'])
def allPosts(request):
    posts = Post.objects.all()
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

@csrf_exempt
@api_view(['GET'])
def allCategories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

@csrf_exempt
@api_view(['GET'])
def allProfiles(request):
    profiles = Profile.objects.all()
    serializer = ProfileSerializer(profiles, many=True)
    return Response(serializer.data)

@csrf_exempt
@api_view(['GET'])
def allLikes(request):
    likes = Like.objects.all()
    serializer = LikeSerializer(likes, many=True)
    return Response(serializer.data)

@csrf_exempt
@api_view(['GET'])
def allDislikes(request):
    dislikes = Dislike.objects.all()
    serializer = DislikeSerializer(dislikes, many=True)
    return Response(serializer.data)

@csrf_exempt
@api_view(['GET'])
def allComments(request):
    comments = Comment.objects.all()
    serializer = CommentSerializer(comments, many=True)
    return Response(serializer.data)

@csrf_exempt
@api_view(['GET'])
def get_user_categories(request):
    user_id = request.query_params.get('user_id')
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    categories = Category.objects.filter(creator=user)
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@csrf_exempt
@api_view(['GET'])
def posts_by_user_id(request):
    user_id = request.query_params.get('user_id')
    try:
        user = User.objects.get(id=user_id)
        profile = Profile.objects.get(user=user)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Profile.DoesNotExist:
        return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
    
    posts = Post.objects.filter(creator=profile)
    serializer = PostSerializer(posts, many=True)
    
    return Response(serializer.data, status=status.HTTP_200_OK)

@csrf_exempt
@api_view(['GET'])
def get_profile_picture(request, user_id):
    logger.info(f"Received request for user ID: {user_id}")
    possible_extensions = ['jpg', 'jpeg', 'png']
    for ext in possible_extensions:
        profile_picture_path = os.path.join(PROFILE_PICTURE_DIR, f"{user_id}.{ext}")
        if os.path.exists(profile_picture_path):
            logger.info(f"Serving profile picture for user ID: {user_id}")
            mime_type, _ = mimetypes.guess_type(profile_picture_path)
            with open(profile_picture_path, 'rb') as f:
                return HttpResponse(f.read(), content_type=mime_type)
    
    # Serve default profile picture if no specific one exists
    default_picture_path = os.path.join(PROFILE_PICTURE_DIR, 'no-profile-picture.png')
    logger.info(f"Serving default profile picture for user ID: {user_id}")
    mime_type, _ = mimetypes.guess_type(default_picture_path)
    with open(default_picture_path, 'rb') as f:
        return HttpResponse(f.read(), content_type=mime_type)

@csrf_exempt
@api_view(['GET'])
def get_profile_picture_by_username(request, username):
    logger.info(f"Received request for username: {username}")
    try:
        user = User.objects.get(username=username)
        possible_extensions = ['jpg', 'jpeg', 'png']
        for ext in possible_extensions:
            profile_picture_path = os.path.join(PROFILE_PICTURE_DIR, f"{user.id}.{ext}")
            if os.path.exists(profile_picture_path):
                logger.info(f"Serving profile picture for username: {username}")
                mime_type, _ = mimetypes.guess_type(profile_picture_path)
                with open(profile_picture_path, 'rb') as f:
                    return HttpResponse(f.read(), content_type=mime_type)
    except User.DoesNotExist:
        logger.error(f"User with username {username} does not exist.")
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    # Serve default profile picture if no specific one exists
    default_picture_path = os.path.join(PROFILE_PICTURE_DIR, 'no-profile-picture.png')
    logger.info(f"Serving default profile picture for username: {username}")
    mime_type, _ = mimetypes.guess_type(default_picture_path)
    with open(default_picture_path, 'rb') as f:
        return HttpResponse(f.read(), content_type=mime_type)

@csrf_exempt
@api_view(['GET'])
def total_likes_by_user(request):
    user_id = request.query_params.get('user_id')
    try:
        user = User.objects.get(id=user_id)
        profile = Profile.objects.get(user=user)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Profile.DoesNotExist:
        return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
    
    posts = Post.objects.filter(creator=profile)
    total_likes = Like.objects.filter(post__in=posts).count()
    
    return Response({'total_likes': total_likes}, status=status.HTTP_200_OK)

@csrf_exempt
@api_view(['GET'])
def total_dislikes_by_user(request):
    user_id = request.query_params.get('user_id')
    try:
        user = User.objects.get(id=user_id)
        profile = Profile.objects.get(user=user)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Profile.DoesNotExist:
        return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
    
    posts = Post.objects.filter(creator=profile)
    total_dislikes = Dislike.objects.filter(post__in=posts).count()
    
    return Response({'total_dislikes': total_dislikes}, status=status.HTTP_200_OK)

@csrf_exempt
@api_view(['GET'])
def total_comments_by_user(request):
    user_id = request.query_params.get('user_id')
    try:
        user = User.objects.get(id=user_id)
        profile = Profile.objects.get(user=user)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Profile.DoesNotExist:
        return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
    
    posts = Post.objects.filter(creator=profile)
    total_comments = Comment.objects.filter(post__in=posts).count()
    
    return Response({'total_comments': total_comments}, status=status.HTTP_200_OK)
