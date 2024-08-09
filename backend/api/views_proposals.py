from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.models import CategoryProposal

@api_view(['POST'])
def create_proposal(request):
    name = request.data.get('name')
    created_by = request.headers.get('creator_id')
    if CategoryProposal.objects.filter(name=name).exists():
        return Response({'message': 'Proposal with this name already exists'}, status=status.HTTP_400_BAD_REQUEST)
    proposal = CategoryProposal.objects.create(name=name, created_by=created_by)
    return Response({'message': 'Proposal created', 'id': proposal.id}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def like_proposal(request, proposal_id):
    proposal = get_object_or_404(CategoryProposal, id=proposal_id)
    proposal.likes += 1
    proposal.save()
    return Response({'message': 'Liked'}, status=status.HTTP_200_OK)

@api_view(['POST'])
def dislike_proposal(request, proposal_id):
    proposal = get_object_or_404(CategoryProposal, id=proposal_id)
    proposal.dislikes += 1
    proposal.save()
    return Response({'message': 'Disliked'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def delete_proposal(request, proposal_id):
    proposal = get_object_or_404(CategoryProposal, id=proposal_id)
    user_id = request.headers.get('user_id') == settings.MODERATOR_HASHED_ID
    creator_id = request.headers.get('creator_id')

    if not user_id or proposal.created_by == creator_id:
        proposal.delete()
        return Response({'message': 'Proposal deleted'}, status=status.HTTP_200_OK)
    return Response({'message': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)

@api_view(['GET'])
def get_proposals(request):
    proposals = CategoryProposal.get_all_proposals()
    return Response({'proposals': [{'id': p.id, 'name': p.name, 'likes': p.likes, 'dislikes': p.dislikes} for p in proposals]}, status=status.HTTP_200_OK)
