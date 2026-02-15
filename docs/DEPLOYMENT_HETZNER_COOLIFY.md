# Step-by-Step: Hetzner Cloud + Coolify Deployment Guide

Complete guide to deploy BearOps Revenue Growth Platform on Hetzner Cloud using Coolify.

## Prerequisites

- Hetzner Cloud account (https://www.hetzner.com/cloud)
- GitHub account with access to `BearOpsData/BearOps-Rev-Growth-Platform` repository
- Domain name (optional, but recommended)
- SSH key pair (we'll generate if needed)

---

## Step 1: Create Hetzner Cloud Server

### 1.1 Login to Hetzner Cloud Console
1. Go to https://console.hetzner.com/
2. Login with your Hetzner account
3. Click **"New Project"** (or select existing project)

### 1.2 Create Server
1. Click **"Add Server"** or **"Create Server"**
2. **Location:** Choose closest to your users (e.g., `Nuremberg (NBG1)`)
3. **Image:** Select **Ubuntu 22.04** (or latest LTS)
4. **Type:** Select **CPX32** (recommended) or **CPX22** (budget)
   - **CPX32** (~€10-12/month) - **Recommended:**
     - 4 vCPU
     - 8GB RAM
     - 160GB SSD
     - Perfect balance of performance and cost
     - Great for production with room to grow
     - Comfortable headroom for Coolify + Docker + Next.js
   - **CPX22** (~€5-7/month) - Budget option:
     - 2 vCPU
     - 4GB RAM
     - 80GB SSD
     - Sufficient for demo with 2 users
     - **Note:** 4GB RAM is tight for Coolify + Docker + Next.js
5. **SSH Keys:** 
   - If you have an SSH key, add it
   - If not, we'll set up password auth first (then add key)
6. **Name:** `bearops-production` (or your choice)
7. Click **"Create & Buy Now"**

### 1.3 Note Server Details
- **IP Address:** `xxx.xxx.xxx.xxx` (you'll see this)
- **Root Password:** Save this if you used password auth
- **SSH Access:** `ssh root@xxx.xxx.xxx.xxx`

---

## Step 2: Initial Server Setup

### 2.1 Connect to Server
```bash
# If you have SSH key
ssh root@YOUR_SERVER_IP

# If using password
ssh root@YOUR_SERVER_IP
# Enter password when prompted
```

### 2.2 Update System
```bash
# Update package list
apt update && apt upgrade -y

# Install essential tools
apt install -y curl wget git ufw fail2ban
```

### 2.3 Configure Firewall
```bash
# Allow SSH (port 22)
ufw allow 22/tcp

# Allow HTTP/HTTPS (for Coolify and your app)
ufw allow 80/tcp
ufw allow 443/tcp

# Allow Coolify (port 8000)
ufw allow 8000/tcp

# IMPORTANT: Do NOT allow PostgreSQL port 5432
# PostgreSQL will only be accessible via SSH tunnel
# This keeps your database secure

# Enable firewall
ufw enable

# Check status
ufw status
```

**Security Note:** PostgreSQL (port 5432) is intentionally NOT exposed. Access will be via SSH tunnel only. See `docs/DATABASE_SECURITY.md` for details.

### 2.4 Create Non-Root User (Recommended)
```bash
# Create user
adduser bearops
usermod -aG sudo bearops

# Switch to new user
su - bearops

# Generate SSH key (if needed)
ssh-keygen -t ed25519 -C "bearops-server"
```

---

## Step 3: Install Docker

Coolify requires Docker. Install it:

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Add your user to docker group (if not root)
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version

# Test Docker
sudo docker run hello-world
```

---

## Step 4: Install Coolify

### 4.1 Install Coolify
```bash
# Run Coolify installer
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash

# Follow the prompts:
# - Press Enter to continue
# - Choose installation directory (default: /data/coolify)
# - Wait for installation to complete
```

### 4.2 Access Coolify
1. Open browser: `http://YOUR_SERVER_IP:8000`
2. You'll see the Coolify setup page
3. **Create Admin Account:**
   - Email: `your-email@example.com`
   - Password: (create strong password)
   - Click **"Create Account"**

### 4.3 Initial Coolify Configuration
1. **Welcome Screen:** Click **"Get Started"**
2. **Server Setup:**
   - Server Name: `bearops-server`
   - Click **"Continue"**
3. **Docker Network:** Leave defaults, click **"Continue"**
4. **Finish Setup:** Click **"Finish"**

---

## Step 5: Configure GitHub Integration

### 5.1 Generate GitHub Personal Access Token
1. Go to GitHub: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. **Note:** `Coolify-BearOps-Deployment`
4. **Expiration:** Choose appropriate (90 days or custom)
5. **Scopes:** Check:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `read:org` (Required - repository is in BearOpsData organization)
   - ✅ `admin:repo_hook` (For webhook management)
6. Click **"Generate token"**
7. **Copy the token** (you won't see it again!)

**Important:** Since the repository is in the `BearOpsData` organization, `read:org` scope is required.

### 5.2 Add GitHub to Coolify
1. In Coolify dashboard, go to **"Settings"** → **"Source Providers"**
2. Click **"Add Source Provider"**
3. Select **"GitHub"**
4. **Name:** `GitHub-BearOpsData`
5. **Personal Access Token:** Paste your token
6. **Organization:** `BearOpsData` (enter your organization name)
7. Click **"Save"**
8. Verify connection shows **"Connected"**
9. Verify you can see `BearOpsData/BearOps-Rev-Growth-Platform` in repository list

---

## Step 6: Create PostgreSQL Database in Coolify

### 6.1 Create Database Resource
1. In Coolify dashboard, click **"New Resource"**
2. Select **"Database"**
3. **Database Type:** Select **"PostgreSQL"**
4. **Name:** `bearops-postgres`
5. **Version:** Select latest (e.g., `16` or `15`)
6. Click **"Create"**

### 6.2 Configure Database
1. **Database Name:** `bearops` (or your choice)
2. **Database User:** `bearops` (or your choice)
3. **Database Password:** Generate a strong password (save it!)
4. Click **"Save"**

### 6.3 Note Database Connection Details
After creation, Coolify will show:
- **Internal Host:** `bearops-postgres` (or similar)
- **Port:** `5432`
- **Database Name:** `bearops`
- **Username:** `bearops`
- **Password:** (the one you set)

**Connection String Format:**
```
postgresql://USERNAME:PASSWORD@HOST:5432/DATABASE_NAME?schema=public
```

Example:
```
postgresql://bearops:your-password@bearops-postgres:5432/bearops?schema=public
```

### 6.4 Wait for Database to Start
- Database will take 1-2 minutes to initialize
- Check status in Coolify dashboard
- Wait for status to show **"Running"**

---

## Step 7: Create Application in Coolify

### 6.1 Create New Resource
1. In Coolify dashboard, click **"New Resource"**
2. Select **"Application"**
3. **Name:** `bearops-rev-growth-platform`
4. **Description:** `BearOps Revenue Growth Platform`
5. Click **"Create"**

### 6.2 Connect Repository
1. In your application, click **"Source"** tab
2. **Source Provider:** Select `GitHub-BearOpsData`
3. **Repository:** Select `BearOpsData/BearOps-Rev-Growth-Platform`
4. **Branch:** `main` (or `DEV`/`STAGE` for testing)
5. Click **"Connect"**

### 6.3 Enable Auto-Deploy
1. In the **"Source"** tab, find **"Auto Deploy"** section
2. Toggle **"Auto Deploy"** to **ON**
3. **Deploy on:** Select **"Push to branch"**
4. **Branch:** `main`
5. Click **"Save"**

**Result:** Every merge to `main` will automatically trigger a rebuild and redeploy!

**📖 See `docs/COOLIFY_GITHUB_SETUP.md` for detailed auto-deploy configuration**

### 6.4 Configure Build Settings
1. Go to **"Build Pack"** tab
2. **Build Pack:** Select **"Dockerfile"**
3. Coolify should auto-detect your `Dockerfile`
4. **Dockerfile Path:** `Dockerfile` (should be auto-detected)
5. **Docker Build Context:** `.` (root directory)

### 6.5 Configure Ports
1. Go to **"Ports"** tab
2. **Port:** `3000` (Next.js default)
3. **Public Port:** Leave empty (Coolify will assign)
4. Click **"Save"**

### 7.5 Configure Environment Variables
1. Go to **"Environment Variables"** tab
2. Add the following **required** variables:
   ```
   # Database Connection (from Step 6)
   DATABASE_URL=postgresql://bearops:YOUR_PASSWORD@bearops-postgres:5432/bearops?schema=public
   
   # NextAuth Secret (generate with: openssl rand -base64 32)
   NEXTAUTH_SECRET=your-generated-secret-here
   
   # NextAuth URL (your app URL - update after deployment)
   NEXTAUTH_URL=https://yourdomain.com
   
   # Node Environment
   NODE_ENV=production
   NEXT_TELEMETRY_DISABLED=1
   ```
3. **Important:** 
   - Replace `YOUR_PASSWORD` with your actual database password
   - Replace `your-generated-secret-here` with a generated secret (see below)
   - Update `NEXTAUTH_URL` after you have your domain/URL
4. Click **"Save"**

### 7.6 Generate NextAuth Secret
Generate a secure secret for NextAuth:
```bash
# On your local machine or in Coolify terminal
openssl rand -base64 32
```
Copy the output and use it as `NEXTAUTH_SECRET`

---

## Step 8: Deploy Application

### 8.1 Initial Deployment
1. Go to **"Deployments"** tab
2. Click **"Deploy"**
3. Coolify will:
   - Clone your repository
   - Build Docker image
   - Start container
4. Watch the logs for progress
5. Wait for **"Deployed successfully"**

### 8.2 Get Application URL
1. After deployment, go to **"General"** tab
2. Find **"Public URL"** or **"FQDN"**
3. It will be something like: `http://xxx-xxx-xxx.coolify.app`
4. Click the URL to test your app!

---

## Step 9: Initialize Database and Create Admin User

### 9.1 Run Database Migrations
After first deployment, you need to initialize the database:

1. In Coolify, go to your application
2. Click **"Terminal"** or **"Execute Command"** tab
3. Run database migrations:
   ```bash
   npx prisma migrate deploy
   ```
   Or if using dev mode:
   ```bash
   npx prisma db push
   ```

### 9.2 Generate Prisma Client
In the same terminal, generate Prisma client:
```bash
npx prisma generate
```

### 9.3 Create Admin User
Create your first admin user:
```bash
npm run create-admin
```

Follow the prompts:
- **Email:** Enter admin email (e.g., `admin@bearops.com`)
- **Password:** Enter secure password (min 8 characters)
- **Name:** Enter name (optional)

**Note:** You can also create users via Prisma Studio:
```bash
npx prisma studio
```
This opens a web interface at `http://localhost:5555` (you'll need to port-forward or access via Coolify)

---

## Step 10: Configure Domain (Optional but Recommended)

### 10.1 Add Domain in Coolify
1. Go to **"Domains"** tab in your application
2. Click **"Add Domain"**
3. **Domain:** `yourdomain.com` (or subdomain like `app.yourdomain.com`)
4. Click **"Save"**

### 10.2 Configure DNS
1. Go to your domain registrar (e.g., Cloudflare, Namecheap)
2. Add DNS record:
   - **Type:** `A`
   - **Name:** `@` (or `app` for subdomain)
   - **Value:** `YOUR_SERVER_IP`
   - **TTL:** `3600`
3. Save DNS record
4. Wait 5-10 minutes for DNS propagation

### 10.3 SSL Certificate
1. In Coolify, go to **"Domains"** tab
2. Click **"Generate SSL"** next to your domain
3. Coolify will automatically:
   - Request Let's Encrypt certificate
   - Configure SSL
   - Enable HTTPS
4. Wait 1-2 minutes for certificate generation
5. Your app will be available at `https://yourdomain.com`

---

## Step 11: Configure Auto-Deploy (Optional)

### 11.1 Enable Webhooks
1. In Coolify, go to **"Source"** tab
2. Enable **"Auto Deploy"**
3. Copy the **Webhook URL**

### 9.2 Add Webhook to GitHub
1. Go to your GitHub repository
2. **Settings** → **Webhooks** → **Add webhook**
3. **Payload URL:** Paste Coolify webhook URL
4. **Content type:** `application/json`
5. **Events:** Select **"Just the push event"**
6. Click **"Add webhook"**

Now every push to your branch will automatically trigger a deployment!

---

## Step 10: Verify Deployment

### 10.1 Test Application
1. Open your application URL
2. Verify:
   - ✅ Home page loads
   - ✅ All tabs work
   - ✅ Process pages load (click Framework tab links)
   - ✅ Playbook pages load
   - ✅ No console errors
   - ✅ Styling is correct

### 10.2 Check Logs
1. In Coolify, go to **"Logs"** tab
2. Check for any errors
3. Monitor resource usage

### 10.3 Monitor Resources
1. In Coolify dashboard, check server resources
2. Verify:
   - CPU usage is reasonable
   - Memory usage is acceptable
   - Disk space is sufficient

---

## Troubleshooting

### Issue: Can't connect to server
```bash
# Check if server is running
ping YOUR_SERVER_IP

# Check firewall
sudo ufw status

# Verify SSH is allowed
sudo ufw allow 22/tcp
```

### Issue: Coolify won't start
```bash
# Check Docker
sudo systemctl status docker
sudo systemctl start docker

# Check Coolify logs
sudo docker logs coolify

# Restart Coolify
cd /data/coolify
sudo docker-compose restart
```

### Issue: Build fails
1. Check **"Logs"** tab in Coolify
2. Common issues:
   - Missing dependencies (check `package.json`)
   - Dockerfile errors
   - Memory limits (upgrade server if needed)

### Issue: Application won't start
1. Check container logs in Coolify
2. Verify environment variables
3. Check port configuration
4. Verify Dockerfile is correct

### Issue: Domain not working
1. Check DNS propagation: https://dnschecker.org/
2. Verify A record points to server IP
3. Check firewall allows port 80/443
4. Wait for DNS propagation (can take up to 48 hours)

---

## Maintenance

### Update Application
1. Push changes to GitHub
2. If auto-deploy enabled, it deploys automatically
3. If not, go to **"Deployments"** → **"Deploy"**

### Update Coolify
```bash
cd /data/coolify
sudo docker-compose pull
sudo docker-compose up -d
```

### Backup
1. Coolify has built-in backup
2. Go to **"Settings"** → **"Backups"**
3. Configure automatic backups

### Monitor Server
```bash
# Check disk space
df -h

# Check memory
free -h

# Check CPU
htop

# Check Docker containers
sudo docker ps
```

---

## Security Checklist

- [ ] Firewall configured (UFW)
- [ ] Fail2ban installed and running
- [ ] SSH key authentication (disable password auth)
- [ ] Non-root user created
- [ ] SSL certificate installed
- [ ] Regular updates scheduled
- [ ] Backups configured
- [ ] Environment variables secured
- [ ] GitHub token has minimal permissions

---

## Quick Reference

### Server IP
```
YOUR_SERVER_IP
```

### Coolify URL
```
http://YOUR_SERVER_IP:8000
```

### Application URL
```
https://yourdomain.com
```

### SSH Access
```bash
ssh root@YOUR_SERVER_IP
# or
ssh bearops@YOUR_SERVER_IP
```

### Useful Commands
```bash
# Restart Coolify
cd /data/coolify && sudo docker-compose restart

# View Coolify logs
sudo docker logs coolify -f

# Check Docker containers
sudo docker ps

# View application logs in Coolify
# (Use Coolify dashboard → Your App → Logs)
```

---

## Next Steps

1. ✅ Server is running
2. ✅ Coolify is installed
3. ✅ Application is deployed
4. ✅ Domain is configured (optional)
5. ✅ SSL is enabled (if domain added)

Your BearOps Revenue Growth Platform is now live! 🚀

---

## Support

- **Coolify Docs:** https://coolify.io/docs
- **Hetzner Docs:** https://docs.hetzner.com/
- **Coolify Discord:** https://discord.gg/coolify
