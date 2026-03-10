# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
# Force non-interactive package installation
ENV DEBIAN_FRONTEND=noninteractive

# Set the working directory in the container
WORKDIR /app

# Install system dependencies (TeX Live and compilation tools)
# We install texlive-latex-base, texlive-fonts-recommended, texlive-fonts-extra, and texlive-latex-extra 
# to ensure packages like fontawesome5, titlesec, enumitem, xcolor, etc., are available.
RUN apt-get update && apt-get install -y --no-install-recommends \
    texlive-latex-base \
    texlive-fonts-recommended \
    texlive-fonts-extra \
    texlive-latex-extra \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file into the container
COPY requirements.txt /app/

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt
# Install flask-cors explicitly as it's needed for the decoupled frontend
RUN pip install --no-cache-dir flask-cors

# Copy the rest of the application code into the container
COPY . /app/

# Create the output directory and ensure it is writable
RUN mkdir -p /app/output && chmod 777 /app/output

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Run gunicorn standardly instead of flask run for production
# Gunicorn handles multiple requests better than Flask's built-in server
RUN pip install --no-cache-dir gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--timeout", "120", "app:app"]
