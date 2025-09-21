FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements first (so Docker caches it)
COPY backend/requirements.txt backend/requirements.txt

# Install dependencies
RUN pip install --no-cache-dir -r backend/requirements.txt && \
    pip install gunicorn python-dotenv

# Copy everything into the container
COPY . .

# Default environment variables
ENV APP_ENV=prod LOG_LEVEL=INFO

# Command to run the app with gunicorn
CMD ["gunicorn", "backend.wsgi:app", "--workers=2", "--threads=4", "--timeout=60", "--bind=0.0.0.0:8080"]
