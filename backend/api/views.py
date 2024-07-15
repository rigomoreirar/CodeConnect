from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.authtoken.serializers import AuthTokenSerializer
from knox.auth import AuthToken
from rest_framework import status
import logging
from .models import Post, Profile, Like, Dislike, Comment, User, Category
from .serializers import PostSerializer, ProfileSerializer, LikeSerializer, DislikeSerializer, CommentSerializer, RegisterSerializers, CategorySerializer


# Register API
@api_view(["POST"])
def register(request):
    serializer = RegisterSerializers(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    _, token = AuthToken.objects.create(user)

    profile = Profile(user=user)
    profile.save()

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

    _, token = AuthToken.objects.create(user)
    return Response({
        'user_info': {
            'id': user.id,
            'username': user.username,
            'email': user.email
        },
        'token': token
    })


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