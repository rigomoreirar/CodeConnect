from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.models import CategoryProposal

@api_view(['POST'])
def create_proposal(request):
    name = request.data.get('name')
    created_by = request.data.get('created_by')  # Update to read from request.data

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

    if username in proposal.votes:
        # If the username exists in the votes array, remove it (unvote)
        proposal.votes.remove(username)
        proposal.save()
        return Response({'message': 'Unvoted this proposal'}, status=status.HTTP_200_OK)
    else:
        # If the username does not exist in the votes array, add it (vote)
        proposal.votes.append(username)
        proposal.save()
        return Response({'message': 'Proposal voted'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def delete_proposal(request, proposal_id):
    proposal = get_object_or_404(CategoryProposal, id=proposal_id)
    user_id = request.headers.get('user_id') == settings.MODERATOR_HASHED_ID
    creator_id = request.headers.get('creator_id')

    if not user_id or proposal.created_by == creator_id:
        proposal.delete()
        return Response({'message': 'Proposal deleted'}, status=status.HTTP_200_OK)
    return Response({'message': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)

