from venv import logger
from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.models import CategoryProposal

@api_view(['POST'])
def create_proposal(request):
    name = request.data.get('name')
    created_by = request.data.get('created_by')  # Reading directly from request.data

    if CategoryProposal.objects.filter(name=name).exists():
        return Response({'message': 'Proposal with this name already exists'}, status=status.HTTP_400_BAD_REQUEST)
    
    proposal = CategoryProposal.objects.create(name=name, created_by=created_by)
    
    return Response({'message': 'Proposal created', 'id': proposal.id}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def vote(request):
    username = request.data.get('username')
    proposal_name = request.data.get('proposal_name')

    if not username or not proposal_name:
        return Response({'error': 'Username and proposal name are required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        proposal = CategoryProposal.objects.get(name=proposal_name)
    except CategoryProposal.DoesNotExist:
        return Response({'error': 'Proposal not found.'}, status=status.HTTP_404_NOT_FOUND)

    if username not in proposal.votes:
        proposal.votes.append(username)
        proposal.save()
        return Response({'message': 'Proposal voted', 'votes': proposal.votes}, status=status.HTTP_200_OK)
    
    return Response({'message': 'Already voted'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def unvote(request):
    username = request.data.get('username')
    proposal_name = request.data.get('proposal_name')

    if not username or not proposal_name:
        return Response({'error': 'Username and proposal name are required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        proposal = CategoryProposal.objects.get(name=proposal_name)
    except CategoryProposal.DoesNotExist:
        return Response({'error': 'Proposal not found.'}, status=status.HTTP_404_NOT_FOUND)

    if username in proposal.votes:
        proposal.votes.remove(username)
        proposal.save()
        return Response({'message': 'Proposal unvoted', 'votes': proposal.votes}, status=status.HTTP_200_OK)
    
    return Response({'message': 'Not voted'}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['POST'])  # Change from DELETE to POST
def delete_proposal(request, proposal_id):
    proposal = get_object_or_404(CategoryProposal, id=proposal_id)
    
    user_id = str(request.data.get('user_id'))  # Get user_id from the POST data
    creator_id = str(request.data.get('creator_id'))  # Get creator_id from the POST data

    # Log the incoming data for debugging
    logger.info(f"User ID: {user_id}, Creator ID: {creator_id}, Proposal Created By: {proposal.created_by}")

    # Check if the user is the moderator, creator, or the authenticated user
    if (
        user_id == str(request.user.id) or 
        proposal.created_by == creator_id or 
        user_id == settings.MODERATOR_HASHED_ID
    ):
        proposal.delete()
        return Response({'message': 'Proposal deleted'}, status=status.HTTP_200_OK)
    
    return Response({'message': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)

