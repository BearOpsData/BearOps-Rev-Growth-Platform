# Quick Start - Local Docker Testing

## Prerequisites

1. **Docker Desktop** installed and running
   - Download: https://www.docker.com/products/docker-desktop
   - Verify it's running (Docker icon in system tray)

## Fast Test (Recommended)

```bash
# Quick test script
./scripts/quick-test.sh

# Or using Makefile
make test-quick
```

This will:
- ✅ Check Docker is running
- ✅ Build the development image
- ✅ Start the container
- ✅ Verify the app responds

Then open **http://localhost:3000** in your browser.

## Manual Testing

### Development Mode

```bash
# Start development server
docker-compose up --build

# Or using Makefile
make dev-build
```

The app will be available at **http://localhost:3000**

### Production Mode

```bash
# Build and run production
docker-compose -f docker-compose.prod.yml up --build

# Or using Makefile
make prod
```

## Verify It Works

1. Open browser: **http://localhost:3000**
2. Check:
   - ✅ Header loads
   - ✅ Tabs are clickable
   - ✅ Framework tab shows content
   - ✅ No console errors

## View Logs

```bash
# Development
docker-compose logs -f

# Production
docker-compose -f docker-compose.prod.yml logs -f
```

## Stop Containers

```bash
# Development
docker-compose down

# Production
docker-compose -f docker-compose.prod.yml down

# Or using Makefile
make stop
```

## Troubleshooting

### Port 3000 in use?
```bash
# Find what's using it
lsof -i :3000

# Or change port in docker-compose.yml
# Change "3000:3000" to "3001:3000"
```

### Build fails?
```bash
# Clean and rebuild
docker-compose down -v
docker-compose build --no-cache
```

### Container won't start?
```bash
# Check logs
docker-compose logs

# Check if Docker is running
docker info
```

## Next Steps

Once local testing works:
1. ✅ App runs on localhost:3000
2. ✅ All features work
3. ✅ No errors

Then proceed to:
- Set up Hetzner Cloud server
- Install Coolify
- Deploy your app

