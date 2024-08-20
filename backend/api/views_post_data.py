import os
from PIL import Image
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.authtoken.serializers import AuthTokenSerializer
from knox.auth import AuthToken
from rest_framework import status
import logging
from .models import Post, Profile, Like, Dislike, Comment, ProfileCtgFollowing, User, Category, PostCategories
from .serializers import LikeSerializer, DislikeSerializer, CommentSerializer, RegisterSerializers, CategorySerializer, PostSerializer
from django.views.decorators.csrf import csrf_exempt
from django.db import IntegrityError, transaction
import io
import json

# Define a logger
logger = logging.getLogger(__name__)

# Function to generate a unique ID
def generate_unique_id(model):
    last_instance = model.objects.order_by('-id').first()
    return last_instance.id + 1 if last_instance else 1

# Define the directory for profile pictures
PROFILE_PICTURE_DIR = os.path.join(settings.BASE_DIR, 'assets', 'profile-pictures')

# Convert images to webp for better performance, and resize them
def resize_image(image, size=(300, 300)):
    return image.resize(size, Image.LANCZOS)

def convert_image_to_webp(image):
    output = io.BytesIO()
    image.save(output, format='WEBP', quality=80)
    output.seek(0)
    return output


@csrf_exempt
@api_view(["POST"])
def register(request):
    serializer = RegisterSerializers(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        _, token = AuthToken.objects.create(user)
        
        profile_id = generate_unique_id(Profile)
        profile = Profile(id=profile_id, user=user)
        profile.save()

        # Handle profile picture upload
        if 'profile_picture' in request.FILES:
            profile_picture = request.FILES['profile_picture']
            file_ext = profile_picture.name.split('.')[-1].lower()

            if file_ext not in ['png', 'jpg', 'jpeg', 'heic', 'heif', 'bmp', 'tiff', 'webp']:
                return Response({'error': 'Invalid file extension. Only png, jpg, jpeg, heic, heif, bmp, webp, and tiff are allowed.'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                image = Image.open(profile_picture)
                image = resize_image(image)
                webp_image = convert_image_to_webp(image)
                profile_picture_path = os.path.join(PROFILE_PICTURE_DIR, f"{user.id}.webp")
                with open(profile_picture_path, 'wb') as f:
                    f.write(webp_image.read())
            except Exception as e:
                return Response({'error': f'Image processing failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            'user_info': {
                'id': str(user.id),
                'username': user.username,
                'email': user.email
            },
            'token': token
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["POST"])
def login(request):
    serializer = AuthTokenSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({'error': 'Invalid login details'}, status=status.HTTP_400_BAD_REQUEST)
    
    user = serializer.validated_data['user']
    if user:
        token = AuthToken.objects.create(user)[1]
        return Response({
            'user_info': {
                'id': str(user.id),
                'username': user.username,
                'email': user.email
            },
            'token': token
        })
    return Response({'error': 'Invalid login details'}, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@api_view(["POST"])
def logout(request):
    try:
        request._auth.delete()
        return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["POST"])
@transaction.atomic
def create_dislike(request):
    data = request.data
    undislike = data.get("undislike", False)  # No need to convert, it's already a boolean
    post = Post.objects.get(id=str(data.get("post", {}).get("id")))
    user = User.objects.get(id=str(data.get("user", {}).get("id")))
    profile = Profile.objects.get(user=user)

    if undislike:
        Dislike.objects.filter(post=post, profile=profile).delete()
    else:
        if Like.objects.filter(post=post, profile=profile).exists():
            Like.objects.filter(post=post, profile=profile).delete()
        Dislike.objects.get_or_create(profile=profile, post=post)

    return Response({"message": "Dislike action processed successfully."}, status=status.HTTP_200_OK)


@csrf_exempt
@api_view(["POST"])
@transaction.atomic
def create_like(request):
    data = request.data
    unlike = data.get("unlike", False)  # No need to convert, it's already a boolean
    post = Post.objects.get(id=str(data.get("post", {}).get("id")))
    user = User.objects.get(id=str(data.get("user", {}).get("id")))
    profile = Profile.objects.get(user=user)

    if unlike:
        Like.objects.filter(post=post, profile=profile).delete()
    else:
        if Dislike.objects.filter(post=post, profile=profile).exists():
            Dislike.objects.filter(post=post, profile=profile).delete()
        Like.objects.get_or_create(profile=profile, post=post)

    return Response({"message": "Like action processed successfully."}, status=status.HTTP_200_OK)



@csrf_exempt
@api_view(["POST"])
@transaction.atomic
def add_comment(request):
    data = request.data
    post = Post.objects.get(id=str(data.get("post")))
    user = User.objects.get(id=str(data.get("profile")))
    profile = Profile.objects.get(user=user)

    comment_id = generate_unique_id(Comment)
    comment = Comment.objects.create(id=comment_id, profile=profile, post=post, content=data.get("content"))

    return Response({
        'id': str(comment.id),
        'profile': profile.user.username,
        'post': str(post.id),
        'content': comment.content,
        'timestamp': comment.timestamp
    })


@csrf_exempt
@api_view(["POST"])
@transaction.atomic
def delete_comment(request):
    data = request.data
    comment_id = str(data.get("comment_id"))
    user_id = str(data.get("user_id"))

    try:
        comment = Comment.objects.get(id=comment_id)
        user = User.objects.get(id=user_id)
        profile = Profile.objects.get(user=user)

        # Allow deletion if user_id is '1' (moderator) or if the user is the owner of the comment
        if user_id == "1" or comment.profile == profile:
            comment.delete()
            with open('sse_notifications.txt', 'w') as f:
                f.write(json.dumps({'message': 'refetch', 'route': 'get-all-data'}))

            return Response({"message": "Comment deleted successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "You are not authorized to delete this comment"}, status=status.HTTP_403_FORBIDDEN)

    except Comment.DoesNotExist:
        return Response({"error": "Comment not found"}, status=status.HTTP_404_NOT_FOUND)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@csrf_exempt
@api_view(["POST"])
@transaction.atomic
def create_post(request):
    data = request.data

    try:
        user = User.objects.get(id=str(data.get("creator", {}).get("id")))
        profile = Profile.objects.get(user=user)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Profile.DoesNotExist:
        return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

    post_id = generate_unique_id(Post)
    new_post = Post.objects.create(
        id=post_id,
        isStudent=data.get("isStudent"),
        creator=profile,
        title=data.get("title"),
        content=data.get("content")
    )

    categories_added = []
    for category in data.get("categories", []):
        try:
            db_category = Category.objects.get(pk=str(category.get("id")))
            PostCategories.objects.create(post=new_post, category=db_category)
            categories_added.append(db_category.id)
        except Category.DoesNotExist:
            return Response({'error': f'Category with id {category.get("id")} not found'}, status=status.HTTP_404_NOT_FOUND)

    post_serializer = PostSerializer(new_post)

    return Response({
        'message': 'Post created successfully',
        'post': post_serializer.data,
        'categories_added': categories_added
    }, status=status.HTTP_201_CREATED)


@csrf_exempt
@api_view(["POST"])
@transaction.atomic
def delete_post(request):
    data = request.data
    post_id = str(data.get("post_id"))
    user_id = str(data.get("user_id"))

    try:
        post = Post.objects.get(id=post_id)
        user = User.objects.get(id=user_id)

        # Allow deletion if user_id is '1' (moderator) or if the user is the creator of the post
        if user_id == "1" or str(post.creator.user.id) == user_id:
            Like.objects.filter(post=post).delete()
            Dislike.objects.filter(post=post).delete()
            Comment.objects.filter(post=post).delete()
            post.delete()

            with open('sse_notifications.txt', 'w') as f:
                f.write(json.dumps({'message': 'refetch', 'route': 'get-all-data'}))

            return Response({"message": "Post and associated comments deleted successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "You are not authorized to delete this post"}, status=status.HTTP_403_FORBIDDEN)

    except Post.DoesNotExist:
        return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@csrf_exempt
@api_view(["POST"])
@transaction.atomic
def follow_category(request):
    data = request.data
    try:
        category_id = str(data.get("id"))
        user_id = str(data.get("user", {}).get("id"))
        if not category_id or not user_id:
            return Response({'error': 'Missing category id or user id'}, status=status.HTTP_400_BAD_REQUEST)
        
        db_category = Category.objects.get(pk=category_id)
        user = User.objects.get(id=user_id)
        profile = Profile.objects.get(user=user)

        if not ProfileCtgFollowing.objects.filter(profile=profile, category=db_category).exists():
            ProfileCtgFollowing.objects.create(profile=profile, category=db_category)

        updated_category = Category.objects.get(pk=db_category.pk)
        serializer = CategorySerializer(updated_category)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error following category: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@csrf_exempt
@api_view(["POST"])
@transaction.atomic
def unfollow_category(request):
    data = request.data
    try:
        category_id = str(data.get("id"))
        user_id = str(data.get("user", {}).get("id"))
        if not category_id or not user_id:
            return Response({'error': 'Missing category id or user id'}, status=status.HTTP_400_BAD_REQUEST)
        
        db_category = Category.objects.get(pk=category_id)
        user = User.objects.get(id=user_id)
        profile = Profile.objects.get(user=user)

        ProfileCtgFollowing.objects.filter(profile=profile, category=db_category).delete()

        updated_category = Category.objects.get(pk=db_category.pk)
        serializer = CategorySerializer(updated_category)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error unfollowing category: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@csrf_exempt
@api_view(["POST"])
@transaction.atomic
def create_category(request):
    user_id = str(request.data.get('user_id'))
    name = request.data.get('name')
    if not name:
        return Response({'error': 'Category name is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    category_id = generate_unique_id(Category)
    category = Category(id=category_id, name=name, creator=user)
    category.save()

    return Response({'message': 'Category created successfully'}, status=status.HTTP_201_CREATED)


@csrf_exempt
@api_view(["POST"])
@transaction.atomic
def delete_category(request):
    category_id = str(request.data.get('id'))
    try:
        category = Category.objects.get(id=category_id)
        posts = Post.objects.filter(categories=category)
        
        for post in posts:
            Like.objects.filter(post=post).delete()
            Dislike.objects.filter(post=post).delete()
            Comment.objects.filter(post=post).delete()
            post.delete()
        
        category.delete()

        with open('sse_notifications.txt', 'w') as f:
            f.write(json.dumps({'message': 'refetch', 'route': 'get-all-data'}))

        return Response({'message': 'Category and associated posts and comments deleted successfully'}, status=status.HTTP_200_OK)
    except Category.DoesNotExist:
        return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@csrf_exempt
@api_view(['POST'])
def edit_user_info(request):
    user = request.user

    if not user.is_authenticated:
        return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

    data = request.data
    new_username = data.get('username')
    new_email = data.get('email')
    new_first_name = data.get('first_name')
    new_last_name = data.get('last_name')

    try:
        if new_username and User.objects.filter(username=new_username).exclude(id=str(user.id)).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

        if new_email and User.objects.filter(email=new_email).exclude(id=str(user.id)).exists():
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

        if new_username:
            user.username = new_username
        if new_email:
            user.email = new_email
        if new_first_name:
            user.first_name = new_first_name
        if new_last_name:
            user.last_name = new_last_name

        user.save()
        return Response({'message': 'User information updated successfully'}, status=status.HTTP_200_OK)
    
    except IntegrityError as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@csrf_exempt
@api_view(['POST'])
def change_user_password(request):
    user = request.user

    if not user.is_authenticated:
        return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

    data = request.data
    current_password = data.get('current_password')
    new_password = data.get('new_password')

    if not user.check_password(current_password):
        return Response({'error': 'Current password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)

    if new_password:
        user.set_password(new_password)
        user.save()
        return Response({'message': 'Password updated successfully'}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'New password is required'}, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["POST"])
def change_profile_picture(request):
    user = request.user

    if not user.is_authenticated:
        return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

    if 'profile_picture' not in request.FILES:
        return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)

    profile_picture = request.FILES['profile_picture']
    file_ext = profile_picture.name.split('.')[-1].lower()

    if file_ext not in ['png', 'jpg', 'jpeg', 'heic', 'heif', 'bmp', 'tiff', 'webp']:
        return Response({'error': 'Invalid file extension. Only png, jpg, jpeg, heic, heif, bmp, webp, and tiff are allowed.'}, status=status.HTTP_400_BAD_REQUEST)

    possible_extensions = ['jpg', 'jpeg', 'png', 'webp']
    for ext in possible_extensions:
        existing_picture_path = os.path.join(PROFILE_PICTURE_DIR, f"{user.id}.{ext}")
        if os.path.exists(existing_picture_path):
            os.remove(existing_picture_path)

    try:
        image = Image.open(profile_picture)
        image = resize_image(image)
        webp_image = convert_image_to_webp(image)
        profile_picture_path = os.path.join(PROFILE_PICTURE_DIR, f"{user.id}.webp")
        with open(profile_picture_path, 'wb') as f:
            f.write(webp_image.read())
    except Exception as e:
        return Response({'error': f'Image processing failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({'message': 'Profile picture updated successfully'}, status=status.HTTP_200_OK)


# @api_view(['POST'])
# def create_default_users(request):
#     try:
#         # Moderator data
#         moderator_data = {
#             'username': settings.MODERATOR_USERNAME,
#             'password': settings.MODERATOR_PASSWORD,
#             'email': settings.MODERATOR_EMAIL,
#             'first_name': settings.MODERATOR_FIRST_NAME,
#             'last_name': settings.MODERATOR_LAST_NAME
#         }

#         # User data
#         user_data = {
#             'username': settings.USER_USERNAME,
#             'password': settings.USER_PASSWORD,
#             'email': settings.USER_EMAIL,
#             'first_name': settings.USER_FIRST_NAME,
#             'last_name': settings.USER_LAST_NAME
#         }

#         # Create the moderator
#         moderator_serializer = RegisterSerializers(data=moderator_data)
#         if moderator_serializer.is_valid():
#             moderator = moderator_serializer.save()
#             moderator_profile_id = generate_unique_id(Profile)
#             moderator_profile = Profile(id=moderator_profile_id, user=moderator)
#             moderator_profile.save()
#             _, moderator_token = AuthToken.objects.create(moderator)
#             moderator_created = True
#         else:
#             moderator_created = False

#         # Create the regular user
#         user_serializer = RegisterSerializers(data=user_data)
#         if user_serializer.is_valid():
#             user = user_serializer.save()
#             user_profile_id = generate_unique_id(Profile)
#             user_profile = Profile(id=user_profile_id, user=user)
#             user_profile.save()
#             _, user_token = AuthToken.objects.create(user)
#             user_created = True
#         else:
#             user_created = False

#         return Response({
#             'message': 'Default users processed successfully',
#             'moderator_created': moderator_created,
#             'user_created': user_created,
#             'moderator_errors': moderator_serializer.errors if not moderator_created else None,
#             'user_errors': user_serializer.errors if not user_created else None,
#         }, status=status.HTTP_201_CREATED)

#     except Exception as e:
#         return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
