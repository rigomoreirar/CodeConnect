import json
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
import time
from django.http import StreamingHttpResponse
from django.db import IntegrityError, transaction
from django.db import transaction

# Define a logger
logger = logging.getLogger(__name__)

@csrf_exempt
def sse_total_likes(request, user_id):
    def event_stream():
        while True:
            time.sleep(5)
            user = User.objects.get(id=user_id)
            profile = Profile.objects.get(user=user)
            posts = Post.objects.filter(creator=profile)
            total_likes = Like.objects.filter(post__in=posts).count()
            yield f"data: {json.dumps({'total_likes': total_likes})}\n\n"
    return StreamingHttpResponse(event_stream(), content_type='text/event-stream')

@csrf_exempt
def sse_total_dislikes(request, user_id):
    def event_stream():
        while True:
            time.sleep(5)
            user = User.objects.get(id=user_id)
            profile = Profile.objects.get(user=user)
            posts = Post.objects.filter(creator=profile)
            total_dislikes = Dislike.objects.filter(post__in=posts).count()
            yield f"data: {json.dumps({'total_dislikes': total_dislikes})}\n\n"
    return StreamingHttpResponse(event_stream(), content_type='text/event-stream')

@csrf_exempt
def sse_total_comments(request, user_id):
    def event_stream():
        while True:
            time.sleep(5)
            user = User.objects.get(id=user_id)
            profile = Profile.objects.get(user=user)
            posts = Post.objects.filter(creator=profile)
            total_comments = Comment.objects.filter(post__in=posts).count()
            yield f"data: {json.dumps({'total_comments': total_comments})}\n\n"
    return StreamingHttpResponse(event_stream(), content_type='text/event-stream')

@csrf_exempt
def sse_events(queryset, serializer_class):
    def event_stream():
        while True:
            time.sleep(1)  # Reduce time interval for faster updates
            data = serializer_class(queryset.all(), many=True).data
            yield f'data: {json.dumps(data)}\n\n'
    return event_stream()

@csrf_exempt
def sse_comments(request):
    queryset = Comment.objects.all()
    return StreamingHttpResponse(sse_events(queryset, CommentSerializer), content_type='text/event-stream')

def trigger_sse_update(event_type):
    if event_type == 'comments':
        queryset = Comment.objects.all()
        data = CommentSerializer(queryset, many=True).data
    # Other event types can be handled similarly
    print(f"data: {json.dumps(data)}\n\n")


@csrf_exempt
def sse_likes(request):
    queryset = Like.objects.all()
    return StreamingHttpResponse(sse_events(queryset, LikeSerializer), content_type='text/event-stream')
@csrf_exempt
def sse_categories(request):
    queryset = Category.objects.all()
    return StreamingHttpResponse(sse_events(queryset, CategorySerializer), content_type='text/event-stream')
@csrf_exempt
def sse_dislikes(request):
    queryset = Dislike.objects.all()
    return StreamingHttpResponse(sse_events(queryset, DislikeSerializer), content_type='text/event-stream')
@csrf_exempt
def sse_posts(request):
    queryset = Post.objects.all()
    return StreamingHttpResponse(sse_events(queryset, PostSerializer), content_type='text/event-stream')

@csrf_exempt
def sse_users(request):
    queryset = User.objects.all()
    return StreamingHttpResponse(sse_events(queryset, RegisterSerializers), content_type='text/event-stream')
@csrf_exempt
def sse_profiles(request):
    queryset = Profile.objects.all()
    return StreamingHttpResponse(sse_events(queryset, ProfileSerializer), content_type='text/event-stream')
