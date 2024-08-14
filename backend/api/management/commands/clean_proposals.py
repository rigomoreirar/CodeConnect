from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from api.models import CategoryProposal

class Command(BaseCommand):
    help = 'Delete category proposals older than 10 seconds (for testing)'

    def handle(self, *args, **kwargs):
        cutoff_time = timezone.now() - timedelta(hours=24)
        CategoryProposal.objects.filter(created_at__lt=cutoff_time).delete()
        self.stdout.write(self.style.SUCCESS('Successfully cleaned up old proposals'))
