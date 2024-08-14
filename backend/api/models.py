from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.utils import timezone
from datetime import timedelta

class User(AbstractUser):
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_set',  # Change to a unique related_name
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_set',  # Change to a unique related_name
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

class Category(models.Model):
    id = models.IntegerField(primary_key=True)  # Explicitly define the id field
    name = models.CharField(max_length=280, default="")
    creator = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.name)

class Profile(models.Model):
    id = models.IntegerField(primary_key=True)  # Explicitly define the id field
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="userProfile", null=True, blank=True)
    isTeacher = models.BooleanField(default=False)
    ctg_following = models.ManyToManyField(Category, through='ProfileCtgFollowing', related_name='following_profiles')

    def __str__(self):
        return str(self.user)

class Post(models.Model):
    id = models.IntegerField(primary_key=True)  # Explicitly define the id field
    isStudent = models.BooleanField(default=False)
    creator = models.ForeignKey("Profile", on_delete=models.PROTECT, related_name="postCreator", null=True, blank=True)
    title = models.CharField(max_length=100, default="")
    content = models.TextField(max_length=1000, default="")
    timestamp = models.DateTimeField(auto_now_add=True)
    isActive = models.BooleanField(default=True)
    categories = models.ManyToManyField(Category, through='PostCategories', related_name='posts')

    def __str__(self):
        return f"post by {self.creator}: {self.title}"

class Like(models.Model):
    id = models.IntegerField(primary_key=True)  # Explicitly define the id field
    profile = models.ForeignKey("Profile", on_delete=models.PROTECT, related_name="profile_like")
    timestamp = models.DateTimeField(auto_now_add=True)
    post = models.ForeignKey("Post", on_delete=models.PROTECT, related_name="post_like")

    class Meta:
        unique_together = ('profile', 'post')

    def __str__(self):
        return f"liked by {self.profile} on {self.post}"

class Dislike(models.Model):
    id = models.IntegerField(primary_key=True)  # Explicitly define the id field
    profile = models.ForeignKey("Profile", on_delete=models.PROTECT, related_name="profile_dislike")
    timestamp = models.DateTimeField(auto_now_add=True)
    post = models.ForeignKey("Post", on_delete=models.PROTECT, related_name="post_dislike")

    class Meta:
        unique_together = ('profile', 'post')

    def __str__(self):
        return f"disliked by {self.profile} on {self.post}"

class Comment(models.Model):
    id = models.IntegerField(primary_key=True)  # Explicitly define the id field
    profile = models.ForeignKey("Profile", on_delete=models.PROTECT, related_name="profile_comment")
    timestamp = models.DateTimeField(auto_now_add=True)
    post = models.ForeignKey("Post", on_delete=models.PROTECT, related_name="post_comment")
    content = models.CharField(max_length=280, default="")

    def __str__(self):
        return f"commented by {self.profile} on {self.post}"

class CategoryFollowers(models.Model):
    id = models.IntegerField(primary_key=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='followers')
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)

class PostCategories(models.Model):
    id = models.IntegerField(primary_key=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

class ProfileCtgFollowing(models.Model):
    id = models.IntegerField(primary_key=True)
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)



from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from datetime import timedelta

class CategoryProposal(models.Model):
    name = models.CharField(max_length=255, unique=True)
    votes = models.JSONField(default=list)  # Array to hold usernames of voters
    created_by = models.CharField(max_length=255)  # Store creator's ID as a string
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    @classmethod
    def get_all_proposals(cls):
        return cls.objects.all()
