#!/bin/bash

# Local Deployment Test Script
# Tests Docker deployment before deploying to production

set -e

echo "🚀 Starting Local Deployment Test"
echo "=================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is running
echo -e "\n${YELLOW}Checking Docker...${NC}"
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker Desktop.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker is running${NC}"

# Check if port 3000 is available
echo -e "\n${YELLOW}Checking port 3000...${NC}"
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo -e "${YELLOW}⚠️  Port 3000 is in use. Stopping existing containers...${NC}"
    docker-compose down 2>/dev/null || true
    sleep 2
fi

# Clean up any existing containers
echo -e "\n${YELLOW}Cleaning up...${NC}"
docker-compose down -v 2>/dev/null || true
docker rm -f bearops-rev-growth-platform 2>/dev/null || true

# Test Development Build
echo -e "\n${YELLOW}Testing Development Build...${NC}"
echo "Building development container..."
if docker-compose build; then
    echo -e "${GREEN}✅ Development build successful${NC}"
else
    echo -e "${RED}❌ Development build failed${NC}"
    exit 1
fi

# Start development container in background
echo -e "\n${YELLOW}Starting development container...${NC}"
docker-compose up -d

# Wait for container to be ready
echo -e "\n${YELLOW}Waiting for app to start...${NC}"
sleep 10

# Check if container is running
if docker ps | grep -q bearops-rev-growth-platform; then
    echo -e "${GREEN}✅ Container is running${NC}"
else
    echo -e "${RED}❌ Container failed to start${NC}"
    docker-compose logs
    exit 1
fi

# Test if app responds
echo -e "\n${YELLOW}Testing HTTP response...${NC}"
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ App is responding on http://localhost:3000${NC}"
else
    echo -e "${RED}❌ App is not responding${NC}"
    echo "Container logs:"
    docker-compose logs
    exit 1
fi

# Check logs for errors
echo -e "\n${YELLOW}Checking for errors in logs...${NC}"
if docker-compose logs | grep -i "error" | grep -v "node_modules" | head -5; then
    echo -e "${YELLOW}⚠️  Some errors found in logs (check above)${NC}"
else
    echo -e "${GREEN}✅ No critical errors in logs${NC}"
fi

# Test Production Build
echo -e "\n${YELLOW}Testing Production Build...${NC}"
echo "Building production image..."
if docker build -t bearops-rev-growth-platform:test .; then
    echo -e "${GREEN}✅ Production build successful${NC}"
else
    echo -e "${RED}❌ Production build failed${NC}"
    exit 1
fi

# Summary
echo -e "\n${GREEN}=================================="
echo "✅ Local Deployment Test Complete!"
echo "==================================${NC}"
echo ""
echo "Development server: http://localhost:3000"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop: docker-compose down"
echo ""
echo "Next steps:"
echo "1. Open http://localhost:3000 in your browser"
echo "2. Test all functionality"
echo "3. Check browser console for errors"
echo "4. Once satisfied, proceed to Coolify deployment"

