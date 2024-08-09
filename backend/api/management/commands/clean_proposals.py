from django.core.management.base import BaseCommand
from api.models import CategoryProposal

class Command(BaseCommand):
    help = 'Delete category proposals older than 24 hours'

    def handle(self, *args, **kwargs):
        CategoryProposal.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('Successfully cleaned up old proposals'))
