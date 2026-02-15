# BearOps Revenue Growth Platform

Full-stack Node.js web application built with Next.js for revenue infrastructure and sales enablement.

## Getting Started

### Option 1: Docker (Recommended)

**Prerequisites:**
- Docker Engine 20.10+
- Docker Compose 2.0+

**Quick Start:**
```bash
# Start development server
make dev
# or
docker-compose up

# Start in background
make dev-detached
# or
docker-compose up -d
```

The application will be available at [http://localhost:3000](http://localhost:3000)

**Production:**
```bash
make prod
# or
docker-compose -f docker-compose.prod.yml up -d --build
```

See [DOCKER.md](./DOCKER.md) for detailed Docker instructions.

### Option 2: Local Development

**Prerequisites:**
- Node.js 18.0.0 or higher
- npm 9.0.0 or higher

**Installation:**
1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
bearops-rev-growth-platform/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Header.tsx
│   ├── TabNavigation.tsx
│   └── tabs/             # Tab components
├── public/                # Static assets
│   └── images/           # Images
├── lib/                   # Utility functions
├── styles/               # Additional styles
└── package.json
```

## Available Scripts

### Local Development
- `npm run dev` - Start development server on localhost:3000
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report

### Docker Commands (via Makefile)
- `make dev` - Start development server with Docker
- `make prod` - Start production server with Docker
- `make stop` - Stop all containers
- `make logs` - View container logs
- `make shell` - Open shell in container
- `make clean` - Remove all containers and images
- `make test` - Run tests in Docker container
- `make test-local` - Test Docker deployment locally (full test)
- `make test-quick` - Quick local Docker test

See [Makefile](./Makefile) for all available commands.

## Local Deployment Testing

Before deploying to production, test locally with Docker:

### Quick Test
```bash
# Fast test to verify Docker works
make test-quick
# or
./scripts/quick-test.sh
```

### Full Test
```bash
# Complete deployment test
make test-local
# or
./scripts/test-deployment.sh
```

### Manual Testing
```bash
# Development mode
docker-compose up --build

# Production mode
docker-compose -f docker-compose.prod.yml up --build
```

See [QUICK_START_DOCKER.md](./QUICK_START_DOCKER.md) for quick start guide or [LOCAL_DEPLOYMENT_TEST.md](./docs/LOCAL_DEPLOYMENT_TEST.md) for detailed testing instructions.

## Testing

This project includes comprehensive unit, integration, and regression tests. See [TESTING.md](./TESTING.md) and [REGRESSION_TESTING.md](./docs/REGRESSION_TESTING.md) for details.

### Quick Test Commands
```bash
# Run all tests
npm test

# Run regression tests (before merging)
npm run test:regression

# Run merge validation (critical tests)
npm run test:merge-validation

# Run snapshot tests
npm run test:snapshot

# Generate coverage report
npm run test:coverage

# Full CI test suite
npm run test:ci
```

### Before Merging
Always run:
```bash
npm run test:merge-validation
```

## Features

- ✅ Next.js 14 with App Router
- ✅ React 18
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Component-based architecture
- ✅ Responsive design

## Development

The application runs on `localhost:3000` by default. Hot reload is enabled for development.

## Deployment

### Hetzner Cloud + Coolify

Complete deployment guide: [DEPLOYMENT_HETZNER_COOLIFY.md](./docs/DEPLOYMENT_HETZNER_COOLIFY.md)

Quick checklist: [QUICK_DEPLOY.md](./docs/QUICK_DEPLOY.md)

**Quick Start:**
1. Create Hetzner Cloud CPX21 server (Ubuntu 22.04)
2. Run setup script: `bash <(curl -s https://raw.githubusercontent.com/BearOpsData/BearOps-Rev-Growth-Platform/main/scripts/setup-hetzner-server.sh)`
3. Access Coolify: `http://YOUR_SERVER_IP:8000`
4. Connect GitHub repository
5. Deploy!

## License

MIT

