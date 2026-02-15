# Docker Setup Guide

This application is fully containerized and can run in Docker for both development and production.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+

## Development

### Using Docker Compose (Recommended)

1. **Start the development container:**
   ```bash
   docker-compose up
   ```

2. **Start in detached mode (background):**
   ```bash
   docker-compose up -d
   ```

3. **View logs:**
   ```bash
   docker-compose logs -f
   ```

4. **Stop the container:**
   ```bash
   docker-compose down
   ```

5. **Rebuild after dependency changes:**
   ```bash
   docker-compose up --build
   ```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Using Docker directly

1. **Build the development image:**
   ```bash
   docker build -f Dockerfile.dev -t bearops-rev-growth-platform:dev .
   ```

2. **Run the container:**
   ```bash
   docker run -p 3000:3000 -v $(pwd):/app -v /app/node_modules bearops-rev-growth-platform:dev
   ```

## Production

### Using Docker Compose

1. **Build and start production container:**
   ```bash
   docker-compose -f docker-compose.prod.yml up --build
   ```

2. **Start in detached mode:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   ```

3. **Stop production container:**
   ```bash
   docker-compose -f docker-compose.prod.yml down
   ```

### Using Docker directly

1. **Build the production image:**
   ```bash
   docker build -t bearops-rev-growth-platform:latest .
   ```

2. **Run the production container:**
   ```bash
   docker run -p 3000:3000 --name bearops-app bearops-rev-growth-platform:latest
   ```

3. **Run in detached mode:**
   ```bash
   docker run -d -p 3000:3000 --name bearops-app --restart unless-stopped bearops-rev-growth-platform:latest
   ```

## Deployment to Server

### Option 1: Docker Compose on Server

1. **Copy files to server:**
   ```bash
   scp -r . user@your-server:/path/to/app
   ```

2. **SSH into server:**
   ```bash
   ssh user@your-server
   cd /path/to/app
   ```

3. **Start production container:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   ```

### Option 2: Docker Registry

1. **Build and tag image:**
   ```bash
   docker build -t your-registry/bearops-rev-growth-platform:latest .
   ```

2. **Push to registry:**
   ```bash
   docker push your-registry/bearops-rev-growth-platform:latest
   ```

3. **Pull and run on server:**
   ```bash
   docker pull your-registry/bearops-rev-growth-platform:latest
   docker run -d -p 3000:3000 --name bearops-app --restart unless-stopped your-registry/bearops-rev-growth-platform:latest
   ```

## Environment Variables

Create a `.env` file for environment-specific configuration:

```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.example.com
```

Then update docker-compose files to include:
```yaml
environment:
  - NODE_ENV=production
env_file:
  - .env
```

## Health Checks

The production setup includes health checks. Monitor with:

```bash
docker ps
docker inspect --format='{{.State.Health.Status}}' bearops-rev-growth-platform-prod
```

## Troubleshooting

### Container won't start
- Check logs: `docker-compose logs`
- Verify port 3000 is available: `lsof -i :3000`
- Check Docker is running: `docker ps`

### Changes not reflecting
- Rebuild: `docker-compose up --build`
- Clear Next.js cache: `docker-compose exec app rm -rf .next`

### Permission issues
- Check file ownership: `ls -la`
- Fix permissions: `sudo chown -R $USER:$USER .`

## Useful Commands

```bash
# View running containers
docker ps

# View all containers
docker ps -a

# View logs
docker logs bearops-rev-growth-platform

# Execute command in container
docker exec -it bearops-rev-growth-platform sh

# Remove all containers and images
docker-compose down -v
docker system prune -a
```

