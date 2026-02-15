# Quick Deploy Checklist

## Pre-Deployment

- [ ] Hetzner Cloud account created
- [ ] GitHub repository is ready (`BearOpsData/BearOps-Rev-Growth-Platform`)
- [ ] Domain name ready (optional)

## Server Setup (15 minutes)

1. **Create Hetzner Cloud Server**
   - Location: Nuremberg (NBG1)
   - Image: Ubuntu 22.04
   - Type: CPX32 (~€10-12/month) - Recommended
   - Note IP address

2. **Initial Server Setup**
   ```bash
   ssh root@YOUR_SERVER_IP
   apt update && apt upgrade -y
   apt install -y curl wget git ufw
   ufw allow 22/tcp && ufw allow 80/tcp && ufw allow 443/tcp && ufw enable
   ```

3. **Install Docker**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh
   ```

4. **Install Coolify**
   ```bash
   curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
   ```

## Coolify Setup (10 minutes)

1. **Access Coolify**
   - Open: `http://YOUR_SERVER_IP:8000`
   - Create admin account

2. **Connect GitHub**
   - Settings → Source Providers → Add GitHub
   - Generate GitHub Personal Access Token (repo scope)
   - Add token to Coolify

3. **Create Application**
   - New Resource → Application
   - Name: `bearops-rev-growth-platform`
   - Connect repository: `BearOpsData/BearOps-Rev-Growth-Platform`
   - Build Pack: Dockerfile
   - Port: 3000

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Get public URL

## Domain Setup (5 minutes)

1. **Add Domain in Coolify**
   - Domains tab → Add Domain
   - Enter your domain

2. **Configure DNS**
   - Add A record: `@` → `YOUR_SERVER_IP`
   - Wait for propagation

3. **Enable SSL**
   - Generate SSL in Coolify
   - Wait for certificate

## Done! 🎉

Your app is live at: `https://yourdomain.com`

## Auto-Deploy (Optional)

1. Enable Auto Deploy in Coolify
2. Copy webhook URL
3. Add to GitHub: Settings → Webhooks
4. Every push = automatic deployment

