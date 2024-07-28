from rest_framework import serializers, validators
from .models import Post, Profile, Like, Dislike, Comment, User, Category, CategoryFollowers, PostCategories, ProfileCtgFollowing

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

class PostSerializer(serializers.ModelSerializer):
    creator = serializers.PrimaryKeyRelatedField(queryset=Profile.objects.all())
    categories = serializers.PrimaryKeyRelatedField(many=True, queryset=Category.objects.all(), source='postcategories_set')

    class Meta:
        model = Post
        fields = ('id', 'isStudent', 'creator', 'categories', 'title',
                  'content', 'timestamp', 'isActive')

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

    class Meta:
        model = Comment
        fields = ('id', 'timestamp', 'profile', 'post', 'content')

class CategorySerializer(serializers.ModelSerializer):
    followers = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ('id', 'name', 'followers')

    def get_followers(self, obj):
        followers = CategoryFollowers.objects.filter(category=obj).values_list('profile', flat=True)
        return list(followers)
