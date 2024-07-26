from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
from django.db import models, IntegrityError
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

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
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, default=1)
    followers = models.ManyToManyField("Profile", related_name="profileFollowing", blank=True)

    def __str__(self):
        return str(self.name)

class Profile(models.Model):
    id = models.IntegerField(primary_key=True)  # Explicitly define the id field
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="userProfile", null=True, blank=True)
    ctg_following = models.ManyToManyField("Category", related_name="categoriesFollowing", blank=True)
    isTeacher = models.BooleanField(default=False)

    def __str__(self):
        return str(self.user)

class Post(models.Model):
    id = models.IntegerField(primary_key=True)  # Explicitly define the id field
    isStudent = models.BooleanField(default=False)
    creator = models.ForeignKey("Profile", on_delete=models.PROTECT, related_name="postCreator", null=True, blank=True)
    categories = models.ManyToManyField("Category", related_name="postCategories", blank=True)
    title = models.CharField(max_length=100, default="")
    content = models.TextField(max_length=1000, default="")
    timestamp = models.DateTimeField(auto_now_add=True)
    isActive = models.BooleanField(default=True)

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
    
@receiver(post_save, sender=Comment)
@receiver(post_delete, sender=Comment)
def comment_change_handler(sender, instance, **kwargs):
    from .views import trigger_sse_update
    trigger_sse_update('comments')
