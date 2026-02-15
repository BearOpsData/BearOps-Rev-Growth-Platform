# What to Set Up - Quick Guide

## Overview

You need to set up **3 main things**:

1. **Hetzner Cloud Server** (the computer that runs your app)
2. **Coolify** (the tool that deploys your app)
3. **Connect GitHub to Coolify** (so Coolify can deploy from your repo)

---

## Step-by-Step Setup

### 1️⃣ Hetzner Cloud Server (5 minutes)

**What:** A virtual server in the cloud where your app will run.

**How:**
1. Go to https://console.hetzner.com/
2. Login (or create account)
3. Click **"Add Server"**
4. Choose:
   - **Location:** Nuremberg (or closest to you)
   - **Image:** Ubuntu 22.04
   - **Type:** **CPX32** (4 vCPU, 8GB RAM, 160GB SSD) - ~€10-12/month
   - **Name:** `bearops-production`
5. Click **"Create & Buy Now"**
6. **Save your server IP address** (you'll see it after creation)

**Result:** You have a server running Ubuntu Linux.

---

### 2️⃣ Server Setup (10 minutes)

**What:** Install Docker and Coolify on your server.

**How:**
1. **Connect to your server:**
   ```bash
   ssh root@YOUR_SERVER_IP
   ```
   (Use the IP from step 1)

2. **Run the automated setup script:**
   ```bash
   # Download and run the setup script
   curl -fsSL https://raw.githubusercontent.com/BearOpsData/BearOps-Rev-Growth-Platform/main/scripts/setup-hetzner-server.sh | bash
   ```
   
   OR manually:
   ```bash
   # Update system
   apt update && apt upgrade -y
   
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   
   # Install Coolify
   curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
   
   # Configure firewall
   ufw allow 22/tcp
   ufw allow 80/tcp
   ufw allow 443/tcp
   ufw allow 8000/tcp
   # PostgreSQL (5432) is NOT allowed - secured via SSH tunnel only
   ufw enable
   ```

**Result:** Docker and Coolify are installed on your server.

### 2.5 Secure Database Access (Optional but Recommended)

**What:** Lock down PostgreSQL so it's only accessible via SSH from your IP.

**How:**
```bash
# Run the security script
curl -fsSL https://raw.githubusercontent.com/BearOpsData/BearOps-Rev-Growth-Platform/main/scripts/secure-database.sh | bash

# OR manually configure:
# Optionally restrict SSH to your IP
# ufw allow from YOUR_IP_ADDRESS to any port 22 proto tcp
```

**Result:** PostgreSQL is secured - only accessible via SSH tunnel.

---

### 3️⃣ Coolify Setup (10 minutes)

**What:** Configure Coolify to manage your app.

**How:**
1. **Access Coolify:**
   - Open browser: `http://YOUR_SERVER_IP:8000`
   - Create admin account (email + password)

2. **Connect GitHub:**
   - In Coolify: **Settings** → **Source Providers** → **Add GitHub**
   - You'll need a GitHub Personal Access Token:
     - Go to: https://github.com/settings/tokens
     - Click **"Generate new token (classic)"**
     - Name: `Coolify-BearOps-AutoDeploy`
     - Scopes: Check:
       - **`repo`** (full control of private repositories)
       - **`read:org`** (required - repo is in BearOpsData organization)
       - **`admin:repo_hook`** (for webhook management)
     - Click **"Generate token"**
     - **Copy the token** (you won't see it again!)
   - Back in Coolify: 
     - Name: `GitHub-BearOpsData`
     - Paste token
     - **Organization:** `BearOpsData` (enter organization name)
     - Save

**Result:** Coolify can now access your GitHub repository.

**📖 See `docs/COOLIFY_GITHUB_SETUP.md` for detailed auto-deploy setup**

---

### 4️⃣ Create PostgreSQL Database (5 minutes)

**What:** Create a database for user authentication.

**How:**
1. In Coolify: Click **"New Resource"** → **"Database"**
2. **Configure:**
   - **Database Type:** PostgreSQL
   - **Name:** `bearops-postgres`
   - **Version:** Latest (16 or 15)
   - **Database Name:** `bearops`
   - **Username:** `bearops`
   - **Password:** Generate strong password (save it!)
3. Click **"Create"**
4. Wait for database to start (~1-2 minutes)
5. **Note the connection details** (you'll need them)

**Result:** Database is ready for user authentication.

---

### 5️⃣ Deploy Your App (5 minutes)

**What:** Tell Coolify to deploy your Next.js app.

**How:**
1. In Coolify: Click **"New Resource"** → **"Application"**
2. **Configure:**
   - **Name:** `bearops-rev-growth-platform`
   - **Repository:** Select `BearOpsData/BearOps-Rev-Growth-Platform`
   - **Branch:** `main` (or `dev` if you want)
   - **Build Pack:** Select **"Dockerfile"**
   - **Port:** `3000`
3. **Environment Variables** (IMPORTANT):
   - Go to **"Environment Variables"** tab
   - Add these variables:
     ```
     DATABASE_URL=postgresql://bearops:YOUR_PASSWORD@bearops-postgres:5432/bearops?schema=public
     NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
     NEXTAUTH_URL=https://yourdomain.com (or http://YOUR_SERVER_IP:PORT)
     NODE_ENV=production
     ```
   - Replace `YOUR_PASSWORD` with your database password
   - Generate `NEXTAUTH_SECRET`: Run `openssl rand -base64 32` on your local machine
4. Click **"Deploy"**
5. Wait for build to complete (~5-10 minutes)
6. **Get your app URL** from Coolify dashboard

**Result:** Your app is deployed! 🎉

---

### 6️⃣ Initialize Database & Create Admin User (5 minutes)

**What:** Set up the database tables and create your first user.

**How:**
1. In Coolify, go to your application
2. Click **"Terminal"** or **"Execute Command"** tab
3. Run these commands:
   ```bash
   # Initialize database
   npx prisma migrate deploy
   npx prisma generate
   
   # Create admin user
   npm run create-admin
   ```
4. Follow prompts:
   - **Email:** Your email (e.g., `admin@bearops.com`)
   - **Password:** Strong password (min 8 characters)
   - **Name:** Your name (optional)

**Result:** Database is initialized and you have an admin account!

---

## Summary Checklist

- [ ] Create Hetzner Cloud account
- [ ] Create CPX32 server (save IP address)
- [ ] SSH into server: `ssh root@YOUR_SERVER_IP`
- [ ] Install Docker and Coolify (run setup script)
- [ ] Access Coolify: `http://YOUR_SERVER_IP:8000`
- [ ] Create Coolify admin account
- [ ] Generate GitHub Personal Access Token
- [ ] Connect GitHub to Coolify
- [ ] **Create PostgreSQL database in Coolify**
- [ ] **Note database connection details**
- [ ] Create new Application in Coolify
- [ ] Connect repository: `BearOpsData/BearOps-Rev-Growth-Platform`
- [ ] **Set environment variables (DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL)**
- [ ] Deploy!
- [ ] **Run database migrations: `npx prisma migrate deploy`**
- [ ] **Create admin user: `npm run create-admin`**
- [ ] **Secure database access (restrict to SSH tunnel)**

---

## Optional: Domain & SSL (10 minutes)

If you have a domain name:

1. **Add domain in Coolify:**
   - Application → **Domains** tab
   - Add your domain (e.g., `bearops.com`)

2. **Configure DNS:**
   - In your domain registrar (GoDaddy, Namecheap, etc.)
   - Add **A record:** `@` → `YOUR_SERVER_IP`

3. **Enable SSL:**
   - In Coolify: Click **"Generate SSL"**
   - Wait for certificate (automatic via Let's Encrypt)

**Result:** Your app is accessible at `https://yourdomain.com`

---

## Troubleshooting

**Can't SSH into server?**
- Check firewall allows port 22
- Verify IP address is correct
- Try password auth if SSH key doesn't work

**Coolify not accessible?**
- Check firewall allows port 8000: `ufw allow 8000/tcp`
- Verify Coolify is running: `docker ps`

**Build fails?**
- Check Coolify logs
- Verify Dockerfile exists in repo
- Check GitHub token has `repo` scope

---

## Need Help?

- Full guide: `docs/DEPLOYMENT_HETZNER_COOLIFY.md`
- Server specs: `docs/SERVER_SPECS.md`
- Quick checklist: `docs/QUICK_DEPLOY.md`

