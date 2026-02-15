# PostgreSQL Database Security Setup

This guide explains how to secure your PostgreSQL database so it's only accessible via SSH from your IP address.

## Security Strategy

✅ **PostgreSQL listens only on localhost** (not exposed to internet)
✅ **Firewall blocks external PostgreSQL access** (port 5432)
✅ **Access via SSH tunnel** (secure connection)
✅ **IP whitelist** (optional extra layer)

---

## Step 1: Configure PostgreSQL in Coolify

### 1.1 Create Database with Internal Network

When creating the PostgreSQL database in Coolify:
1. **Network:** Use internal Docker network (default)
2. **Port:** 5432 (internal only)
3. **Do NOT expose port publicly**

The database will be accessible:
- ✅ From other Docker containers (your app)
- ❌ NOT from the internet

### 1.2 Verify Database Configuration

In Coolify, check your database:
- **Public Port:** Should be empty or not exposed
- **Internal Host:** `bearops-postgres` (or your database name)
- **Internal Port:** `5432`

---

## Step 2: Configure Server Firewall

### 2.1 SSH into Your Server

```bash
ssh -i ~/.ssh/id_ed25519_bearops root@YOUR_SERVER_IP
```

### 2.2 Configure UFW Firewall

```bash
# Allow SSH (port 22) - ALREADY ALLOWED
ufw allow 22/tcp

# Allow HTTP/HTTPS (for your app)
ufw allow 80/tcp
ufw allow 443/tcp

# Allow Coolify (port 8000)
ufw allow 8000/tcp

# BLOCK PostgreSQL from internet (default deny)
# PostgreSQL port 5432 should NOT be in allowed list

# Enable firewall
ufw enable

# Check status
ufw status
```

**Expected output:**
```
Status: active

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
443/tcp                    ALLOW       Anywhere
8000/tcp                   ALLOW       Anywhere
```

**Note:** Port 5432 should NOT appear in the allowed list.

---

## Step 3: Optional - IP Whitelist for SSH

If you want to restrict SSH to only your IP address:

### 3.1 Find Your IP Address

```bash
# On your local machine
curl ifconfig.me
```

This shows your public IP address.

### 3.2 Restrict SSH to Your IP

```bash
# On the server
# Remove general SSH rule
ufw delete allow 22/tcp

# Allow SSH only from your IP
ufw allow from YOUR_IP_ADDRESS to any port 22 proto tcp

# Example:
# ufw allow from 123.45.67.89 to any port 22 proto tcp
```

**Warning:** Make sure you have console access (Hetzner Cloud console) in case you lock yourself out!

---

## Step 4: Access Database via SSH Tunnel

### 4.1 Create SSH Tunnel

**On your local machine:**

```bash
# Create SSH tunnel
ssh -i ~/.ssh/id_ed25519_bearops \
  -L 5432:bearops-postgres:5432 \
  -N root@YOUR_SERVER_IP
```

**Explanation:**
- `-L 5432:bearops-postgres:5432` - Forward local port 5432 to database
- `-N` - Don't execute commands, just forward ports
- Keep this terminal open while using the database

### 4.2 Connect to Database

**In a new terminal:**

```bash
# Connect via localhost (tunneled through SSH)
psql -h localhost -p 5432 -U bearops -d bearops

# Or using connection string
psql "postgresql://bearops:YOUR_PASSWORD@localhost:5432/bearops"
```

### 4.3 Alternative: Use Prisma Studio via Tunnel

```bash
# 1. Create SSH tunnel (in one terminal)
ssh -i ~/.ssh/id_ed25519_bearops \
  -L 5555:localhost:5555 \
  -L 5432:bearops-postgres:5432 \
  -N root@YOUR_SERVER_IP

# 2. In another terminal, SSH into server and run Prisma Studio
ssh -i ~/.ssh/id_ed25519_bearops root@YOUR_SERVER_IP
cd /path/to/your/app
npx prisma studio

# 3. Access Prisma Studio at http://localhost:5555
```

---

## Step 5: Verify Security

### 5.1 Test External Access (Should Fail)

**From your local machine (without SSH tunnel):**

```bash
# This should FAIL (connection refused or timeout)
psql -h YOUR_SERVER_IP -p 5432 -U bearops -d bearops
```

**Expected:** Connection refused or timeout (good!)

### 5.2 Test Internal Access (Should Work)

**Via SSH tunnel:**

```bash
# This should WORK
psql -h localhost -p 5432 -U bearops -d bearops
```

**Expected:** Connected successfully!

---

## Step 6: Application Connection (Internal)

Your Next.js application connects to the database via Docker's internal network:

```env
# This works because both containers are on the same Docker network
DATABASE_URL=postgresql://bearops:PASSWORD@bearops-postgres:5432/bearops?schema=public
```

**No SSH tunnel needed** - Docker handles internal networking.

---

## Quick Reference

### Create SSH Tunnel

```bash
ssh -i ~/.ssh/id_ed25519_bearops \
  -L 5432:bearops-postgres:5432 \
  -N root@YOUR_SERVER_IP
```

### Connect to Database

```bash
psql -h localhost -p 5432 -U bearops -d bearops
```

### Check Firewall Status

```bash
ufw status
```

### View Active Connections

```bash
# On server
netstat -tulpn | grep 5432
```

---

## Security Checklist

- [ ] PostgreSQL not exposed to internet (no public port)
- [ ] Firewall blocks port 5432 from external access
- [ ] SSH access restricted (or at least secured with keys)
- [ ] Database password is strong
- [ ] SSH tunnel used for local access
- [ ] Application uses internal Docker network

---

## Troubleshooting

### "Connection refused" when accessing externally

✅ **This is correct!** The database is secured.

### "Connection refused" via SSH tunnel

**Check:**
1. Is SSH tunnel running? (keep terminal open)
2. Is database container running? (`docker ps` in Coolify)
3. Is internal hostname correct? (`bearops-postgres`)

### "Permission denied" for database user

**Fix:**
```sql
-- Connect as postgres superuser
ALTER USER bearops WITH PASSWORD 'new_password';
GRANT ALL PRIVILEGES ON DATABASE bearops TO bearops;
```

### Can't create SSH tunnel

**Check:**
1. SSH key has correct permissions: `chmod 600 ~/.ssh/id_ed25519_bearops`
2. SSH connection works: `ssh -i ~/.ssh/id_ed25519_bearops root@YOUR_SERVER_IP`
3. Port 5432 not already in use locally: `lsof -i :5432`

---

## Advanced: Multiple IP Addresses

If you need access from multiple IPs:

```bash
# Allow SSH from multiple IPs
ufw allow from 123.45.67.89 to any port 22 proto tcp
ufw allow from 98.76.54.32 to any port 22 proto tcp
```

Or use a VPN and allow only VPN IP range.

---

## Best Practices

✅ **Never expose PostgreSQL to the internet**
✅ **Always use SSH tunnels for database access**
✅ **Use strong database passwords**
✅ **Rotate passwords regularly**
✅ **Monitor database access logs**
✅ **Keep PostgreSQL updated**

---

## Summary

Your PostgreSQL database is now secured:
- ✅ Only accessible via SSH tunnel
- ✅ Not exposed to the internet
- ✅ Application connects via internal Docker network
- ✅ Firewall blocks external access

**Access pattern:**
1. SSH into server (with your key)
2. Create SSH tunnel
3. Connect to database via localhost
4. Database is secure! 🔒

