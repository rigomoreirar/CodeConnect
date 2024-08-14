import re
from rest_framework import serializers, validators
from .models import CategoryProposal, Post, Profile, Like, Dislike, Comment, User, Category, CategoryFollowers, PostCategories, ProfileCtgFollowing

class RegisterSerializers(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'first_name', 'last_name')

        extra_kwargs = {
            "password": {"write_only": True},
            "email": {
                "required": True,
                "validators": [
                    validators.UniqueValidator(
                        queryset=User.objects.all(), message="A user with that Email already exists"
                    )
                ]
            }
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        return user

class PostCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PostCategories
        fields = ('category',)

class PostSerializer(serializers.ModelSerializer):
    creator = serializers.PrimaryKeyRelatedField(queryset=Profile.objects.all())
    categories = serializers.SerializerMethodField()
    likes = serializers.SerializerMethodField()
    dislikes = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()
    formatted_content = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ('id', 'title', 'content', 'formatted_content', 'likes', 'dislikes', 'comments', 'categories', 'creator')

    def get_categories(self, obj):
        return [category.id for category in obj.categories.all()]

    def get_likes(self, obj):
        return LikeSerializer(obj.post_like.all(), many=True).data

    def get_dislikes(self, obj):
        return DislikeSerializer(obj.post_dislike.all(), many=True).data

    def get_comments(self, obj):
        return CommentSerializer(obj.post_comment.all(), many=True).data

    def get_formatted_content(self, obj):
        content = obj.content
        # Convert URLs in content to HTML links
        content = re.sub(r'(https?://\S+)', r'<a href="\1" target="_blank">\1</a>', content)
        return content


class ProfileSerializer(serializers.ModelSerializer):
    ctg_following = serializers.PrimaryKeyRelatedField(many=True, queryset=Category.objects.all())

    class Meta:
        model = Profile
        fields = ('id', 'user', 'ctg_following', 'isTeacher')

class LikeSerializer(serializers.ModelSerializer):
    profile = serializers.ReadOnlyField(source='profile.user.username')

    class Meta:
        model = Like
        fields = ('id', 'timestamp', 'profile', 'post')

class DislikeSerializer(serializers.ModelSerializer):
    profile = serializers.ReadOnlyField(source='profile.user.username')

    class Meta:
        model = Dislike
        fields = ('id', 'timestamp', 'profile', 'post')

class CommentSerializer(serializers.ModelSerializer):
    profile = serializers.ReadOnlyField(source='profile.user.username')
    total_likes = serializers.SerializerMethodField()
    total_dislikes = serializers.SerializerMethodField()
    total_comments = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ('id', 'timestamp', 'profile', 'post', 'content', 'total_likes', 'total_dislikes', 'total_comments')

    def get_total_likes(self, obj):
        profile_posts = Post.objects.filter(creator=obj.profile)
        return Like.objects.filter(post__in=profile_posts).count()

    def get_total_dislikes(self, obj):
        profile_posts = Post.objects.filter(creator=obj.profile)
        return Dislike.objects.filter(post__in=profile_posts).count()

    def get_total_comments(self, obj):
        profile_posts = Post.objects.filter(creator=obj.profile)
        return Comment.objects.filter(post__in=profile_posts).count()

class CategorySerializer(serializers.ModelSerializer):
    followers = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ('id', 'name', 'followers')

    def get_followers(self, obj):
        followers = CategoryFollowers.objects.filter(category=obj).values_list('profile', flat=True)
        return list(followers)

class CategoryProposalSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryProposal
        fields = ('id', 'name', 'votes', 'created_by', 'created_at')