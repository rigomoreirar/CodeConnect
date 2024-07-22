import os
import smtplib
import random
import string
from email.mime.text import MIMEText
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.authtoken.serializers import AuthTokenSerializer
from knox.auth import AuthToken
from rest_framework import status
import logging
from .models import Post, Profile, Like, Dislike, Comment, User, Category
from .serializers import PostSerializer, ProfileSerializer, LikeSerializer, DislikeSerializer, CommentSerializer, RegisterSerializers, CategorySerializer
import mimetypes
from django.http import HttpResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate


# Define the directory for profile pictures
PROFILE_PICTURE_DIR = os.path.join(settings.BASE_DIR, 'assets', 'profile-pictures')

# Ensure the directory exists
os.makedirs(PROFILE_PICTURE_DIR, exist_ok=True)

# Define the directory for profile pictures
PROFILE_PICTURE_DIR = os.path.join(settings.BASE_DIR, 'assets', 'profile-pictures')

# Ensure the directory exists
os.makedirs(PROFILE_PICTURE_DIR, exist_ok=True)

# Define a logger
logger = logging.getLogger(__name__)

# Register API
@api_view(["POST"])
def register(request):
    serializer = RegisterSerializers(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    _, token = AuthToken.objects.create(user)

    profile = Profile(user=user)
    profile.save()

    # Handle profile picture upload
    if 'profile_picture' in request.FILES:
        profile_picture = request.FILES['profile_picture']
        file_ext = profile_picture.name.split('.')[-1].lower()

        if file_ext not in ['png', 'jpg', 'jpeg']:
            return Response({'error': 'Invalid file extension. Only png, jpg, and jpeg are allowed.'}, status=status.HTTP_400_BAD_REQUEST)

        profile_picture_path = os.path.join(PROFILE_PICTURE_DIR, f"{user.id}.{file_ext}")

        with open(profile_picture_path, 'wb') as f:
            for chunk in profile_picture.chunks():
                f.write(chunk)

    return Response({
        'user_info': {
            'id': user.id,
            'username': user.username,
            'email': user.email
        },
        'token': token
    })


@api_view(["POST"])
def login(request):
    serializer = AuthTokenSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.validated_data['user']

    if user:
        _, token = AuthToken.objects.create(user)
        return Response({
            'user_info': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            },
            'token': token
        })
    else:
        return Response({'error': 'Invalid login details'}, status=status.HTTP_400_BAD_REQUEST)


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

@api_view(['GET'])
def index(request):
    return Response({"Hello": "World!"})

@api_view(['GET'])
def allPosts(request):
    posts = Post.objects.all()
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def allCategories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def postData(request):
    data = request.data
    likes = Like.objects.filter(post=data["post_id"])
    likes = LikeSerializer(likes, many=True).data

    dislikes = Dislike.objects.filter(post=data["post_id"])
    dislikes = DislikeSerializer(dislikes, many=True).data

    comments = Comment.objects.filter(post=data["post_id"])
    comments = CommentSerializer(comments, many=True).data

    return Response({
        "likes": likes,
        "dislikes": dislikes,
        "comments": comments
    })

@api_view(['GET'])
def allProfiles(request):
    profiles = Profile.objects.all()
    serializer = ProfileSerializer(profiles, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def allLikes(request):
    likes = Like.objects.all()
    serializer = LikeSerializer(likes, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def allDislikes(request):
    dislikes = Dislike.objects.all()
    serializer = DislikeSerializer(dislikes, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def allComments(request):
    comments = Comment.objects.all()
    serializer = CommentSerializer(comments, many=True)
    return Response(serializer.data)

@api_view(["POST"])
def like(request):
    data = request.data
    unlike = data["unlike"]
    post = Post.objects.get(id=data["post"]["id"])
    user = User.objects.get(id=data["user"]["id"])
    profile = Profile.objects.get(user=user)

    if unlike:
        like = Like.objects.get(post=post, profile=profile)
        like.delete()
    else:
        Like.objects.create(profile=profile, post=post)
    return Response(request.data)

@api_view(["POST"])
def dislike(request):
    data = request.data
    undislike = data["undislike"]
    post = Post.objects.get(id=data["post"]["id"])
    user = User.objects.get(id=data["user"]["id"])
    profile = Profile.objects.get(user=user)

    if undislike:
        dislike = Dislike.objects.get(post=post, profile=profile)
        dislike.delete()
    else:
        Dislike.objects.create(profile=profile, post=post)
    return Response(request.data)

@api_view(["POST"])
def addComment(request):
    data = request.data
    post = Post.objects.get(id=data["post"]["id"])
    user = User.objects.get(id=data["profile"]["id"])
    profile = Profile.objects.get(user=user)

    Comment.objects.create(profile=profile, post=post, content=data["content"])
    return Response(request.data)

@api_view(["POST"])
def newPost(request):
    data = request.data
    user = User.objects.get(id=data["creator"]["id"])
    profile = Profile.objects.get(user=user)

    new_post = Post.objects.create(
        isStudent=data["isStudent"],
        creator=profile,
        title=data["question"],
        content=data["content"]
    )

    for category in data["categories"]:
        db_category = Category.objects.get(pk=category["id"])
        new_post.categories.add(db_category)

    print("New post created:", new_post)
    return Response(data)

@api_view(["POST"])
def follow(request):
    data = request.data
    db_category = Category.objects.get(pk=data["id"])
    user = User.objects.get(id=data["user"]["id"])
    profile = Profile.objects.get(user=user)

    profile.ctg_following.add(db_category)
    db_category.followers.add(profile)

    profile.save()
    db_category.save()

    updated_category = Category.objects.get(pk=db_category.pk)
    serializer = CategorySerializer(updated_category)
    return Response(serializer.data)

@api_view(["POST"])
def unfollow(request):
    data = request.data
    db_category = Category.objects.get(pk=data["id"])
    user = User.objects.get(id=data["user"]["id"])
    profile = Profile.objects.get(user=user)

    profile.ctg_following.remove(db_category)
    db_category.followers.remove(profile)

    profile.save()
    db_category.save()

    updated_category = Category.objects.get(pk=db_category.pk)
    serializer = CategorySerializer(updated_category)
    return Response(serializer.data)

logger = logging.getLogger(__name__)

@api_view(["POST"])
def delete_user_post(request):
    data = request.data
    post_id = data["post"]["id"]
    user_id = data["user"]["id"]

    try:
        post = Post.objects.get(id=post_id)
        user = User.objects.get(id=user_id)

        if post.creator.user.id == user.id:
            Like.objects.filter(post=post).delete()
            Dislike.objects.filter(post=post).delete()
            Comment.objects.filter(post=post).delete()

            post.delete()
            return Response({"message": "Post deleted successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "You are not authorized to delete this post"}, status=status.HTTP_403_FORBIDDEN)

    except Post.DoesNotExist:
        logger.error(f"Post with id {post_id} does not exist.")
        return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)
    except User.DoesNotExist:
        logger.error(f"User with id {user_id} does not exist.")
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error deleting post: {str(e)}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def create_category(request):
    user_id = request.data.get('user_id')
    name = request.data.get('name')
    if not name:
        return Response({'error': 'Category name is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    category = Category(name=name, creator=user)
    category.save()

    return Response({'message': 'Category created successfully'}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def delete_category(request):
    category_id = request.data.get('id')
    try:
        category = Category.objects.get(id=category_id)
        category.delete()
        return Response({'message': 'Category deleted successfully'}, status=status.HTTP_200_OK)
    except Category.DoesNotExist:
        return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)

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

@api_view(['GET'])
def posts_by_user_categories(request):
    user_id = request.query_params.get('user_id')
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    categories = Category.objects.filter(creator=user)
    category_ids = categories.values_list('id', flat=True)
    posts = Post.objects.filter(categories__id__in=category_ids).distinct()
    serializer = PostSerializer(posts, many=True)
    
    return Response(serializer.data, status=status.HTTP_200_OK)


# Define the directory for profile pictures
PROFILE_PICTURE_DIR = os.path.join(settings.BASE_DIR, 'assets', 'profile-pictures')

# Ensure the directory exists
os.makedirs(PROFILE_PICTURE_DIR, exist_ok=True)

# Define a logger
logger = logging.getLogger(__name__)

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

@api_view(["POST"])
def change_profile_picture(request):
    user = request.user

    if not user.is_authenticated:
        return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

    if 'profile_picture' not in request.FILES:
        return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)

    profile_picture = request.FILES['profile_picture']
    file_ext = profile_picture.name.split('.')[-1].lower()

    if file_ext not in ['png', 'jpg', 'jpeg']:
        return Response({'error': 'Invalid file extension. Only png, jpg, and jpeg are allowed.'}, status=status.HTTP_400_BAD_REQUEST)

    # Delete existing profile picture
    possible_extensions = ['jpg', 'jpeg', 'png']
    for ext in possible_extensions:
        existing_picture_path = os.path.join(PROFILE_PICTURE_DIR, f"{user.id}.{ext}")
        if os.path.exists(existing_picture_path):
            os.remove(existing_picture_path)

    # Save new profile picture
    profile_picture_path = os.path.join(PROFILE_PICTURE_DIR, f"{user.id}.{file_ext}")
    with open(profile_picture_path, 'wb') as f:
        for chunk in profile_picture.chunks():
            f.write(chunk)

    return Response({'message': 'Profile picture updated successfully'}, status=status.HTTP_200_OK)

@api_view(['POST'])
def send_test_email(request):
    user_email = request.data.get('email')
    if not user_email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

    # Email credentials and configuration
    SMTP_SERVER = settings.ENV_SMTP_SERVER
    SMTP_PORT = 465
    SMTP_USER = settings.ENV_SMTP_USER
    SMTP_PASSWORD = settings.ENV_SMTP_PASS  

    subject = 'Email Subject'
    body = 'This is the body of the text message'
    sender = SMTP_USER
    recipients = [sender, user_email]

    def send_email(subject, body, sender, recipients):
        msg = MIMEText(body)
        msg['Subject'] = subject
        msg['From'] = sender
        msg['To'] = ', '.join(recipients)

        try:
            with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT) as smtp_server:
                smtp_server.login(sender, SMTP_PASSWORD)
                smtp_server.sendmail(sender, recipients, msg.as_string())
            logger.info('Message sent!')
        except Exception as e:
            logger.error(f"Error sending email: {str(e)}")
            raise

    try:
        send_email(subject, body, sender, recipients)
        return Response({'message': 'Test email sent successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error sending email: {str(e)}")
        return Response({'error': 'Error sending email'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['POST'])
def reset_user_password(request):
    email = request.data.get('email')
    if not email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'This email is not associated with any user'}, status=status.HTTP_404_NOT_FOUND)

    # Generate new password
    def generate_random_password(length=8):
        """Generate a random password."""
        letters_and_digits = string.ascii_letters + string.digits
        return ''.join(random.choice(letters_and_digits) for i in range(length))

    new_password = generate_random_password()
    user.set_password(new_password)  # Use set_password to hash the password
    user.save()

    # Email credentials and configuration
    SMTP_SERVER = settings.ENV_SMTP_SERVER
    SMTP_PORT = 465
    SMTP_USER = settings.ENV_SMTP_USER
    SMTP_PASSWORD = settings.ENV_SMTP_PASS

    subject = 'Password Reset'
    body = f'Your new password is: {new_password}'
    sender = SMTP_USER
    recipients = [email]

    def send_email(subject, body, sender, recipients):
        msg = MIMEText(body)
        msg['Subject'] = subject
        msg['From'] = sender
        msg['To'] = ', '.join(recipients)

        try:
            with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT) as smtp_server:
                smtp_server.login(sender, SMTP_PASSWORD)
                smtp_server.sendmail(sender, recipients, msg.as_string())
            logger.info('Password reset email sent!')
        except Exception as e:
            logger.error(f"Error sending email: {str(e)}")
            raise

    try:
        send_email(subject, body, sender, recipients)
        return Response({'message': 'New password sent to your email address'}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error sending email: {str(e)}")
        return Response({'error': 'Error sending email'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)