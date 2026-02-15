# Connect Coolify to GitHub and Enable Auto-Deploy

This guide shows how to connect your GitHub repository to Coolify and enable automatic deployments when code is merged to `main`.

---

## Step 1: Generate GitHub Personal Access Token

### 1.1 Create Token on GitHub

**Important:** Since your repository is in the `BearOpsData` organization, you need organization access.

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. **Note:** `Coolify-BearOps-AutoDeploy`
4. **Expiration:** Choose appropriate (90 days, 1 year, or no expiration)
5. **Scopes:** Check these permissions:
   - ✅ `repo` (Full control of private repositories)
     - This includes: `repo:status`, `repo_deployment`, `public_repo`, `repo:invite`, `security_events`
   - ✅ `admin:repo_hook` (for webhook management)
   - ✅ `read:org` (Required for organization repositories)
6. Click **"Generate token"**
7. **Copy the token immediately** (you won't see it again!)
   - Save it securely (password manager, etc.)

**Note for Organization Repos:**
- The token must be created by a user who has access to the `BearOpsData` organization
- If you don't see the repository in Coolify after connecting, check:
  - Your GitHub account has access to `BearOpsData` organization
  - The token has `read:org` scope
  - Organization settings allow third-party access (if required)

---

## Step 2: Add GitHub as Source Provider in Coolify

### 2.1 Access Coolify Settings

1. Open Coolify: `http://YOUR_SERVER_IP:8000`
2. Login with your admin account
3. Click **"Settings"** (gear icon in top right)
4. Click **"Source Providers"** in the left sidebar

### 2.2 Add GitHub Provider

1. Click **"Add Source Provider"** or **"+"** button
2. Select **"GitHub"**
3. Fill in the form:
   - **Name:** `GitHub-BearOpsData`
   - **Personal Access Token:** Paste the token you generated
   - **Organization:** `BearOpsData` (enter your organization name)
4. Click **"Save"** or **"Add"**
5. You should see **"Connected"** status with a green checkmark

**Test the connection:**
- Coolify will verify the token and organization access
- If successful, you'll see organization repositories listed
- Look for `BearOpsData/BearOps-Rev-Growth-Platform` in the repository list
- If it fails, check:
  - Token has `read:org` scope
  - Your GitHub account has access to `BearOpsData` organization
  - Organization allows third-party access (check org settings)

---

## Step 3: Create Application in Coolify

### 3.1 Create New Application

1. In Coolify dashboard, click **"New Resource"**
2. Select **"Application"**
3. **Name:** `bearops-rev-growth-platform`
4. **Description:** `BearOps Revenue Growth Platform`
5. Click **"Create"**

### 3.2 Connect GitHub Repository

1. In your application, go to **"Source"** tab
2. **Source Provider:** Select `GitHub-BearOpsData`
3. **Repository:** Select `BearOpsData/BearOps-Rev-Growth-Platform`
   - **Note:** Since it's in an organization, it will appear as `BearOpsData/BearOps-Rev-Growth-Platform`
   - If you don't see it, check organization access and token permissions
4. **Branch:** `main`
5. Click **"Connect"** or **"Save"**

Coolify will now have access to your organization repository.

**Troubleshooting Organization Repos:**
- If repository doesn't appear: Verify token has `read:org` scope
- If connection fails: Check organization settings allow third-party access
- If webhook fails: Ensure you have admin access to the repository

---

## Step 4: Configure Build Settings

### 4.1 Set Build Pack

1. Go to **"Build Pack"** tab
2. **Build Pack:** Select **"Dockerfile"**
3. Coolify should auto-detect your `Dockerfile`
4. **Dockerfile Path:** `Dockerfile` (should be auto-detected)
5. **Docker Build Context:** `.` (root directory)
6. Click **"Save"**

### 4.2 Configure Ports

1. Go to **"Ports"** tab
2. **Port:** `3000` (Next.js default)
3. **Public Port:** Leave empty (Coolify will assign automatically)
4. Click **"Save"**

---

## Step 5: Enable Auto-Deploy

### 5.1 Enable Auto-Deploy in Coolify

1. Go to **"Source"** tab in your application
2. Find **"Auto Deploy"** section
3. Toggle **"Auto Deploy"** to **ON**
4. **Deploy on:** Select **"Push to branch"**
5. **Branch:** `main`
6. Click **"Save"**

### 5.2 Configure GitHub Webhook (Automatic)

Coolify will automatically:
- Generate a webhook URL
- Display it in the **"Source"** tab
- You'll see: `Webhook URL: https://your-coolify-instance.com/api/v1/webhooks/...`

**Note:** If you see the webhook URL, Coolify will try to set it up automatically. If not, proceed to Step 5.3.

### 5.3 Manually Add GitHub Webhook (If Needed)

If auto-setup doesn't work, add webhook manually:

1. **Copy the webhook URL** from Coolify (in Source tab)
2. Go to your GitHub repository: https://github.com/BearOpsData/BearOps-Rev-Growth-Platform
3. Click **"Settings"** → **"Webhooks"**
4. Click **"Add webhook"**
5. **Payload URL:** Paste the webhook URL from Coolify
6. **Content type:** `application/json`
7. **Events:** Select **"Just the push event"** (or "Let me select individual events" and check "Pushes")
8. **Active:** ✅ Checked
9. Click **"Add webhook"**

**Note for Organization Repos:**
- You need admin access to the repository to add webhooks
- If you don't have admin access, ask an organization owner to add the webhook
- Organization webhooks can also be configured at the organization level (Settings → Webhooks)

---

## Step 6: Test Auto-Deploy

### 6.1 Make a Test Change

1. Make a small change to your repository (e.g., update README)
2. Commit and push to `main`:
   ```bash
   git checkout main
   git pull
   # Make a small change
   git add .
   git commit -m "Test auto-deploy"
   git push origin main
   ```

### 6.2 Verify Deployment

1. Go to Coolify dashboard
2. Click on your application
3. Go to **"Deployments"** tab
4. You should see a new deployment starting automatically
5. Watch the logs to see the build progress

**Expected behavior:**
- ✅ Webhook triggers within seconds of push
- ✅ Coolify detects the push
- ✅ Build starts automatically
- ✅ Docker image rebuilds
- ✅ Application redeploys with new code

---

## Step 7: Configure Environment Variables

Before first deployment, set environment variables:

1. Go to **"Environment Variables"** tab
2. Add these variables:

```
# Database (from PostgreSQL you created)
DATABASE_URL=postgresql://bearops:YOUR_PASSWORD@bearops-postgres:5432/bearops?schema=public

# NextAuth
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=https://yourdomain.com

# Node Environment
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

3. Click **"Save"**

**Important:** 
- Replace `YOUR_PASSWORD` with your actual database password
- Generate `NEXTAUTH_SECRET` on your local machine: `openssl rand -base64 32`
- Update `NEXTAUTH_URL` after you set up your domain

---

## Step 8: Initial Deployment

### 8.1 Deploy Manually First

1. Go to **"Deployments"** tab
2. Click **"Deploy"** button
3. Watch the build logs
4. Wait for **"Deployed successfully"**

### 8.2 Initialize Database

After first deployment:

1. Go to **"Terminal"** or **"Execute Command"** tab
2. Run:
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   npm run create-admin
   ```

---

## Troubleshooting

### Webhook Not Triggering

**Check:**
1. Webhook URL is correct in GitHub
2. Webhook shows "Active" in GitHub
3. Recent deliveries show successful (green checkmarks)
4. Auto-deploy is enabled in Coolify

**Test webhook:**
- In GitHub webhook settings, click **"Recent Deliveries"**
- Click on a delivery to see the response
- Should show `200 OK` status

### Auto-Deploy Not Working

**Check:**
1. Auto-deploy is toggled ON in Coolify
2. Branch is set to `main`
3. Webhook is configured in GitHub
4. Check Coolify logs for errors

**Manual trigger:**
- You can always manually deploy from **"Deployments"** tab

### Build Fails

**Check:**
1. Dockerfile exists in repository
2. Environment variables are set correctly
3. Database is running and accessible
4. Check build logs in Coolify

---

## Workflow Summary

**Every time you merge to `main`:**

1. ✅ Code is pushed to GitHub
2. ✅ GitHub webhook triggers Coolify
3. ✅ Coolify detects the push
4. ✅ Build starts automatically
5. ✅ Docker image rebuilds
6. ✅ Application redeploys
7. ✅ New version is live!

**No manual steps needed!** 🎉

---

## Security Notes

✅ **GitHub token** is stored securely in Coolify
✅ **Webhook URL** is unique and secret
✅ **Auto-deploy** only triggers on `main` branch
✅ **Environment variables** are encrypted in Coolify

---

## Next Steps

- Set up domain and SSL (see deployment guide)
- Configure database backups
- Set up monitoring and alerts
- Configure staging environment (optional)

---

## Quick Reference

**GitHub Token Scopes (for Organization Repos):**
- `repo` (full control of repositories)
- `read:org` (required for organization access)
- `admin:repo_hook` (webhook management)

**Repository Location:**
- Organization: `BearOpsData`
- Repository: `BearOpsData/BearOps-Rev-Growth-Platform`

**Coolify Settings:**
- Source Provider: GitHub-BearOpsData
- Repository: BearOpsData/BearOps-Rev-Growth-Platform
- Branch: main
- Auto Deploy: ON

**Webhook Events:**
- Push events only (to main branch)

