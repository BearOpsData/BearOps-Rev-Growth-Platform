# Local Deployment Testing Guide

This guide helps you test the Docker deployment locally before deploying to Hetzner Cloud with Coolify.

## Prerequisites

1. **Docker Desktop** installed and running
   - Download: https://www.docker.com/products/docker-desktop
   - Verify: `docker --version`

2. **Docker Compose** (usually included with Docker Desktop)
   - Verify: `docker-compose --version`

## Quick Start

### 1. Test Development Build

```bash
# Build and start development container
docker-compose up --build

# Or using Makefile
make dev-build
```

The app will be available at: **http://localhost:3000**

### 2. Test Production Build

```bash
# Build production image
docker build -t bearops-rev-growth-platform:latest .

# Run production container
docker run -d -p 3000:3000 --name bearops-test bearops-rev-growth-platform:latest

# Or using docker-compose
docker-compose -f docker-compose.prod.yml up --build
```

### 3. Verify It Works

1. Open browser: http://localhost:3000
2. Check that:
   - ✅ Header loads correctly
   - ✅ Tabs are clickable
   - ✅ Framework tab shows content
   - ✅ Images load
   - ✅ No console errors

## Testing Checklist

### Development Mode
- [ ] Container builds successfully
- [ ] App starts on http://localhost:3000
- [ ] Hot reload works (edit a file, see changes)
- [ ] All tabs work
- [ ] Images load correctly
- [ ] No errors in browser console
- [ ] No errors in Docker logs

### Production Mode
- [ ] Production image builds successfully
- [ ] Container starts without errors
- [ ] App loads on http://localhost:3000
- [ ] All functionality works
- [ ] Performance is acceptable
- [ ] Security headers are present (check Network tab)

## Common Issues & Solutions

### Issue: Port 3000 already in use
```bash
# Find what's using port 3000
lsof -i :3000

# Kill the process or change port in docker-compose.yml
# Change: "3000:3000" to "3001:3000"
```

### Issue: Build fails
```bash
# Clean Docker cache
docker system prune -a

# Rebuild from scratch
docker-compose build --no-cache
```

### Issue: Container won't start
```bash
# Check logs
docker-compose logs

# Check if image exists
docker images | grep bearops

# Remove and rebuild
docker-compose down
docker-compose up --build
```

### Issue: Changes not reflecting
```bash
# Rebuild container
docker-compose up --build

# Or restart
docker-compose restart
```

## Testing Commands

### View Logs
```bash
# Development
docker-compose logs -f

# Production
docker-compose -f docker-compose.prod.yml logs -f

# Specific container
docker logs bearops-rev-growth-platform -f
```

### Stop Containers
```bash
# Development
docker-compose down

# Production
docker-compose -f docker-compose.prod.yml down

# Stop all
docker stop $(docker ps -q)
```

### Clean Up
```bash
# Remove containers
docker-compose down -v

# Remove images
docker rmi bearops-rev-growth-platform:latest

# Full cleanup
docker system prune -a
```

### Check Container Status
```bash
# List running containers
docker ps

# List all containers
docker ps -a

# Container resource usage
docker stats bearops-rev-growth-platform
```

## Production Build Testing

### Test Production Build Locally

```bash
# 1. Build production image
docker build -t bearops-rev-growth-platform:prod .

# 2. Run production container
docker run -d \
  -p 3000:3000 \
  --name bearops-prod-test \
  --env NODE_ENV=production \
  bearops-rev-growth-platform:prod

# 3. Test the app
curl http://localhost:3000

# 4. Check logs
docker logs bearops-prod-test

# 5. Clean up
docker stop bearops-prod-test
docker rm bearops-prod-test
```

### Verify Production Features

- [ ] App loads correctly
- [ ] Security headers present (check browser DevTools > Network)
- [ ] No development tools exposed
- [ ] Performance is good
- [ ] Static assets load correctly
- [ ] No source maps in production

## Health Check

### Manual Health Check
```bash
# Check if container is running
docker ps | grep bearops

# Check if app responds
curl http://localhost:3000

# Check container health
docker inspect bearops-rev-growth-platform | grep Health
```

### Automated Test Script
```bash
# Run the test script
./scripts/test-deployment.sh
```

## Performance Testing

### Check Resource Usage
```bash
# Monitor container resources
docker stats bearops-rev-growth-platform

# Check image size
docker images bearops-rev-growth-platform
```

### Load Testing (Optional)
```bash
# Install Apache Bench (if available)
# ab -n 1000 -c 10 http://localhost:3000/
```

## Security Testing

### Check Security Headers
1. Open http://localhost:3000 in browser
2. Open DevTools > Network tab
3. Reload page
4. Click on the main request
5. Check Response Headers for:
   - `X-Frame-Options`
   - `X-Content-Type-Options`
   - `Strict-Transport-Security`
   - `Content-Security-Policy`

### Test HTTPS Redirect (if configured)
```bash
# Should redirect to HTTPS in production
curl -I http://localhost:3000
```

## Next Steps

Once local testing passes:

1. ✅ All tests pass
2. ✅ Production build works
3. ✅ No errors in logs
4. ✅ Performance is acceptable
5. ✅ Security headers present

Then proceed to:
- Set up Hetzner Cloud server
- Install Coolify
- Deploy using Coolify

## Troubleshooting

### Docker not running
```bash
# Start Docker Desktop
# On Mac: Open Docker Desktop app
# On Linux: sudo systemctl start docker
```

### Permission denied
```bash
# Add user to docker group (Linux)
sudo usermod -aG docker $USER
# Log out and back in
```

### Out of disk space
```bash
# Clean up Docker
docker system prune -a --volumes
```

## Success Criteria

Your local deployment is ready when:
- ✅ Development container runs without errors
- ✅ Production container runs without errors
- ✅ App is accessible on http://localhost:3000
- ✅ All features work correctly
- ✅ No console errors
- ✅ Security headers present
- ✅ Performance is acceptable

