# Quick Guide: Accessing Your Secure PostgreSQL Database

## Overview

Your PostgreSQL database is secured and only accessible via SSH tunnel from your IP address.

---

## Quick Access Steps

### 1. Create SSH Tunnel

**On your local machine:**

```bash
ssh -i ~/.ssh/id_ed25519_bearops \
  -L 5432:bearops-postgres:5432 \
  -N root@YOUR_SERVER_IP
```

**Keep this terminal open** while you need database access.

### 2. Connect to Database

**In a new terminal:**

```bash
# Connect using psql
psql -h localhost -p 5432 -U bearops -d bearops

# Or with connection string
psql "postgresql://bearops:YOUR_PASSWORD@localhost:5432/bearops"
```

### 3. Run Queries

```sql
-- List all users
SELECT id, email, name, "createdAt" FROM "User";

-- Create new user (via Prisma, not SQL - passwords are hashed)
-- Use: npm run create-admin

-- Exit
\q
```

### 4. Close SSH Tunnel

Press `Ctrl+C` in the tunnel terminal when done.

---

## Using Prisma Studio (Web UI)

### 1. Create SSH Tunnel with Two Ports

```bash
ssh -i ~/.ssh/id_ed25519_bearops \
  -L 5555:localhost:5555 \
  -L 5432:bearops-postgres:5432 \
  -N root@YOUR_SERVER_IP
```

### 2. SSH into Server and Run Prisma Studio

**In another terminal:**

```bash
# SSH into server
ssh -i ~/.ssh/id_ed25519_bearops root@YOUR_SERVER_IP

# Navigate to app directory (if needed)
cd /data/coolify/apps/bearops-rev-growth-platform

# Run Prisma Studio
npx prisma studio
```

### 3. Access Prisma Studio

Open browser: `http://localhost:5555`

You'll see a web interface to manage your database!

---

## Common Commands

### List All Tables

```sql
\dt
```

### Describe Table Structure

```sql
\d "User"
```

### View All Users

```sql
SELECT id, email, name, "createdAt" FROM "User";
```

### Change Password (via Prisma, not SQL)

Use the create-admin script:
```bash
npm run create-admin
```

---

## Troubleshooting

### "Connection refused" via SSH tunnel

**Check:**
1. Is SSH tunnel still running? (keep terminal open)
2. Is database container running? (check in Coolify)
3. Is internal hostname correct? (`bearops-postgres`)

### "Connection refused" from external IP

✅ **This is correct!** The database is secured and should NOT be accessible externally.

### Can't create SSH tunnel

**Check:**
1. SSH key permissions: `chmod 600 ~/.ssh/id_ed25519_bearops`
2. SSH connection works: `ssh -i ~/.ssh/id_ed25519_bearops root@YOUR_SERVER_IP`
3. Port 5432 not in use locally: `lsof -i :5432`

---

## Security Notes

✅ **Database is NOT exposed to the internet**
✅ **Only accessible via SSH tunnel**
✅ **Firewall blocks external PostgreSQL access**
✅ **Application connects via internal Docker network** (secure)

---

## Summary

**Access Pattern:**
1. Create SSH tunnel (keeps connection secure)
2. Connect to `localhost:5432` (tunneled through SSH)
3. Database is secure! 🔒

**Your app connects differently:**
- Uses Docker internal network
- No SSH tunnel needed
- Still secure (internal only)

