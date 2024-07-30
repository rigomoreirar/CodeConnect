# views_post_email.py

import smtplib
import random
import string
from email.mime.text import MIMEText
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from rest_framework.authentication import BasicAuthentication
from rest_framework import status
import logging
from .models import User
from django.views.decorators.csrf import csrf_exempt

# Define a logger
logger = logging.getLogger(__name__)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([])  # This explicitly sets no authentication for this view
def reset_user_password_email(request):
    email = request.data.get('email')
    if not email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'This email is not associated with any user'}, status=status.HTTP_404_NOT_FOUND)

    # Generate new password
    def generate_random_password(length=8):
        """Generate a random password."""
        letters_and_digits = string.ascii_letters + string.digits
        return ''.join(random.choice(letters_and_digits) for i in range(length))

    new_password = generate_random_password()
    user.set_password(new_password)  # Use set_password to hash the password
    user.save()

    # Email credentials and configuration
    SMTP_SERVER = settings.ENV_SMTP_SERVER
    SMTP_PORT = 465
    SMTP_USER = settings.ENV_SMTP_USER
    SMTP_PASSWORD = settings.ENV_SMTP_PASS

    subject = 'Password Reset'
    body = f'Your new password is: {new_password}'
    sender = SMTP_USER
    recipients = [email]

    def send_email(subject, body, sender, recipients):
        msg = MIMEText(body)
        msg['Subject'] = subject
        msg['From'] = sender
        msg['To'] = ', '.join(recipients)

        try:
            with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT) as smtp_server:
                smtp_server.login(sender, SMTP_PASSWORD)
                smtp_server.sendmail(sender, recipients, msg.as_string())
            logger.info('Password reset email sent!')
        except Exception as e:
            logger.error(f"Error sending email: {str(e)}")
            raise

    try:
        send_email(subject, body, sender, recipients)
        return Response({'message': 'New password sent to your email address'}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error sending email: {str(e)}")
        return Response({'error': 'Error sending email'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    

@csrf_exempt
@api_view(['POST'])
def send_test_email(request):
    user_email = request.data.get('email')
    if not user_email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

    # Email credentials and configuration
    SMTP_SERVER = settings.ENV_SMTP_SERVER
    SMTP_PORT = 465
    SMTP_USER = settings.ENV_SMTP_USER
    SMTP_PASSWORD = settings.ENV_SMTP_PASS  

    subject = 'Email Subject'
    body = 'This is the body of the text message'
    sender = SMTP_USER
    recipients = [sender, user_email]

    def send_email(subject, body, sender, recipients):
        msg = MIMEText(body)
        msg['Subject'] = subject
        msg['From'] = sender
        msg['To'] = ', '.join(recipients)

        try:
            with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT) as smtp_server:
                smtp_server.login(sender, SMTP_PASSWORD)
                smtp_server.sendmail(sender, recipients, msg.as_string())
            logger.info('Message sent!')
        except Exception as e:
            logger.error(f"Error sending email: {str(e)}")
            raise

    try:
        send_email(subject, body, sender, recipients)
        return Response({'message': 'Test email sent successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error sending email: {str(e)}")
        return Response({'error': 'Error sending email'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)