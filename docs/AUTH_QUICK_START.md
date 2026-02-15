# Authentication Quick Start

## What Was Added

✅ **NextAuth.js** - Authentication library
✅ **PostgreSQL** - User database (via Prisma)
✅ **Login Page** - Beautiful login UI at `/login`
✅ **Protected Routes** - All pages require authentication
✅ **User Management** - Script to create admin users

---

## Quick Setup (After Deployment)

### 1. Create PostgreSQL Database in Coolify
- Go to Coolify → New Resource → Database → PostgreSQL
- Name: `bearops-postgres`
- Save connection details

### 2. Set Environment Variables in Coolify
```
DATABASE_URL=postgresql://user:pass@bearops-postgres:5432/bearops?schema=public
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=https://yourdomain.com
```

### 3. After First Deployment
Run in Coolify terminal:
```bash
npx prisma migrate deploy
npx prisma generate
npm run create-admin
```

### 4. Access Your App
- Visit your app URL
- You'll be redirected to `/login`
- Log in with the admin credentials you created

---

## For Your Colleague

**Simple URL access:**
1. Share the app URL (e.g., `https://app.bearops.com`)
2. They'll see a login page
3. Give them their email/password
4. They can log in and access the app

**No technical knowledge needed!** Just a URL and login credentials.

---

## Firewall Note

**Application-level authentication is better than IP restrictions:**
- ✅ Works from anywhere (home, office, travel)
- ✅ Easy to add/remove users
- ✅ No IP management needed
- ✅ Better user experience

The firewall on the server still protects against unauthorized access, but the app itself handles user authentication.

---

## Next Steps

See `docs/AUTHENTICATION_SETUP.md` for detailed documentation.

