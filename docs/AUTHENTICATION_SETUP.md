# Authentication Setup Guide

This guide explains how to set up user authentication for the BearOps Revenue Growth Platform.

## Overview

The application uses:
- **NextAuth.js** for authentication
- **PostgreSQL** for user database (via Prisma)
- **bcryptjs** for password hashing
- **JWT** for session management

## Features

- ✅ Email/password authentication
- ✅ Protected routes (all pages require login)
- ✅ User management (create, update users)
- ✅ Secure password hashing
- ✅ Session management

---

## Local Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up PostgreSQL Database

**Option A: Local PostgreSQL**
```bash
# Install PostgreSQL (macOS)
brew install postgresql@16
brew services start postgresql@16

# Create database
createdb bearops
```

**Option B: Docker PostgreSQL**
```bash
docker run --name bearops-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=bearops \
  -p 5432:5432 \
  -d postgres:16
```

### 3. Configure Environment Variables

Create `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bearops?schema=public"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Node Environment
NODE_ENV="development"
```

**Generate NextAuth Secret:**
```bash
openssl rand -base64 32
```

### 4. Initialize Database

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push
```

### 5. Create Admin User

```bash
npm run create-admin
```

Follow the prompts:
- Email: `admin@bearops.com`
- Password: (min 8 characters)
- Name: (optional)

### 6. Start Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

You'll be redirected to `/login` if not authenticated.

---

## Production Deployment

See `docs/DEPLOYMENT_HETZNER_COOLIFY.md` for complete deployment guide.

### Key Steps:

1. **Create PostgreSQL database in Coolify**
2. **Set environment variables:**
   - `DATABASE_URL` (from Coolify database)
   - `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)
   - `NEXTAUTH_URL` (your production URL)
3. **Run migrations after deployment:**
   ```bash
   npx prisma migrate deploy
   ```
4. **Create admin user:**
   ```bash
   npm run create-admin
   ```

---

## User Management

### Create Users

**Via Script:**
```bash
npm run create-admin
```

**Via Prisma Studio:**
```bash
npm run db:studio
```
Opens web interface at http://localhost:5555

**Via Code:**
```typescript
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

const hashedPassword = await bcrypt.hash('password123', 10)

await prisma.user.create({
  data: {
    email: 'user@example.com',
    password: hashedPassword,
    name: 'User Name',
  },
})
```

### Update User Password

```typescript
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

const hashedPassword = await bcrypt.hash('newpassword123', 10)

await prisma.user.update({
  where: { email: 'user@example.com' },
  data: { password: hashedPassword },
})
```

### Delete User

```typescript
import { prisma } from '@/lib/db'

await prisma.user.delete({
  where: { email: 'user@example.com' },
})
```

---

## Security Considerations

### Password Requirements

- Minimum 8 characters (enforced in create script)
- Stored as bcrypt hash (10 rounds)
- Never stored in plain text

### Session Security

- JWT tokens (30-day expiration)
- Secure cookies (HTTPS in production)
- CSRF protection (NextAuth built-in)

### Environment Variables

**Never commit these to git:**
- `DATABASE_URL` (contains password)
- `NEXTAUTH_SECRET` (session encryption key)

**Use `.env` for local, Coolify env vars for production**

---

## Troubleshooting

### "Invalid email or password"

- Check user exists in database
- Verify password is correct
- Check database connection

### "Database connection failed"

- Verify `DATABASE_URL` is correct
- Check PostgreSQL is running
- Verify network connectivity (for remote DB)

### "NEXTAUTH_SECRET is missing"

- Generate secret: `openssl rand -base64 32`
- Add to `.env` file
- Restart development server

### "Prisma Client not generated"

```bash
npm run db:generate
```

### "Migration failed"

```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Or push schema directly
npm run db:push
```

---

## API Routes

### Authentication Endpoints

- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get current session
- `GET /api/auth/csrf` - Get CSRF token

### Usage in Components

```typescript
'use client'

import { useSession, signIn, signOut } from 'next-auth/react'

export default function MyComponent() {
  const { data: session, status } = useSession()

  if (status === 'loading') return <p>Loading...</p>
  if (status === 'unauthenticated') return <p>Not signed in</p>

  return (
    <div>
      <p>Signed in as {session?.user?.email}</p>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  )
}
```

---

## Next Steps

- Add user roles/permissions
- Add password reset functionality
- Add email verification
- Add 2FA (two-factor authentication)
- Add user profile management

