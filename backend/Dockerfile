# Use an official Python runtime as a parent image
FROM python:3.8-slim-buster

# Install dependencies
RUN apt-get update && apt-get install -y \
    python3-tk \
    && apt-get clean

# Set environment variables
ARG SECRET_KEY
ENV SECRET_KEY=${SECRET_KEY}
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /code

# Install pip dependencies
COPY requirements.txt /code/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy the backend code
COPY . /code/

# Copy the React build into the Django static files directory
COPY ./frontend/build /code/frontend/build

# Run migrations
RUN python manage.py makemigrations
RUN python manage.py migrate

# Collect static files
RUN python manage.py collectstatic --noinput

# Expose port
EXPOSE 8000

# Run the application
CMD ["gunicorn", "forum.wsgi:application", "--bind", "0.0.0.0:8000"]