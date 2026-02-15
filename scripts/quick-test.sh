#!/bin/bash

# Quick Local Test Script
# Fast test to verify Docker setup works

echo "🔍 Quick Docker Test"
echo "==================="

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker Desktop."
    exit 1
fi

if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop."
    exit 1
fi

echo "✅ Docker is available"

# Test build
echo "Building development image..."
if docker-compose build --quiet; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi

# Start container
echo "Starting container..."
docker-compose up -d

# Wait and test
sleep 5
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ App is running on http://localhost:3000"
    echo ""
    echo "Open http://localhost:3000 in your browser to test"
    echo "View logs: docker-compose logs -f"
    echo "Stop: docker-compose down"
else
    echo "⚠️  App may still be starting. Check logs: docker-compose logs"
fi

