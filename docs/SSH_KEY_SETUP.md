# SSH Key Setup for Hetzner Cloud

## ✅ SSH Key Generated

Your SSH key has been created:
- **Private key:** `~/.ssh/id_ed25519_bearops`
- **Public key:** `~/.ssh/id_ed25519_bearops.pub`

## Your Public Key

Copy this entire line:

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAICe8d/4lbMWwE4EYTS9w80JXs5iCQ3UGGH0Q+13E3a8l bearops-hetzner
```

---

## Step 1: Add SSH Key to Hetzner Cloud

### Option A: Add Before Creating Server (Recommended)

1. Go to https://console.hetzner.com/
2. Click **"Security"** → **"SSH Keys"** (in left sidebar)
3. Click **"Add SSH Key"**
4. **Name:** `bearops-hetzner` (or any name you like)
5. **Public Key:** Paste the key above
6. Click **"Add SSH Key"**

**Now when you create a server, you can select this SSH key!**

### Option B: Add to Existing Server

1. SSH into your server (using password):
   ```bash
   ssh root@YOUR_SERVER_IP
   ```

2. Add your public key:
   ```bash
   # Create .ssh directory if it doesn't exist
   mkdir -p ~/.ssh
   chmod 700 ~/.ssh
   
   # Add your public key
   echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAICe8d/4lbMWwE4EYTS9w80JXs5iCQ3UGGH0Q+13E3a8l bearops-hetzner" >> ~/.ssh/authorized_keys
   
   # Set correct permissions
   chmod 600 ~/.ssh/authorized_keys
   ```

3. Test connection:
   ```bash
   # Exit server
   exit
   
   # Try connecting with key
   ssh root@YOUR_SERVER_IP
   # Should connect without password!
   ```

---

## Step 2: Test Your SSH Key

Once you've added the key to Hetzner and created a server:

```bash
# Connect to your server
ssh root@YOUR_SERVER_IP

# Or if you added the SSH config entry:
ssh hetzner-bearops@YOUR_SERVER_IP
```

You should connect **without entering a password**!

---

## Troubleshooting

### "Permission denied (publickey)"

**Check:**
1. Did you add the public key to Hetzner?
2. Did you select the key when creating the server?
3. Is the key in `~/.ssh/authorized_keys` on the server?

**Fix:**
```bash
# On your local machine, verify key exists
ls -la ~/.ssh/id_ed25519_bearops*

# On server, check authorized_keys
ssh root@YOUR_SERVER_IP
cat ~/.ssh/authorized_keys
```

### "Host key verification failed"

**Fix:**
```bash
# Remove old host key
ssh-keygen -R YOUR_SERVER_IP

# Try connecting again
ssh root@YOUR_SERVER_IP
```

### Still asking for password?

**Check SSH agent:**
```bash
# Add key to SSH agent
ssh-add ~/.ssh/id_ed25519_bearops

# Verify it's added
ssh-add -l
```

---

## Security Best Practices

✅ **Keep your private key secure:**
- Never share `~/.ssh/id_ed25519_bearops` (private key)
- Only share the `.pub` file (public key)

✅ **Use passphrase for production:**
- If you want extra security, regenerate with passphrase:
  ```bash
  ssh-keygen -t ed25519 -C "bearops-hetzner" -f ~/.ssh/id_ed25519_bearops
  # Enter passphrase when prompted
  ```

✅ **Backup your keys:**
- Keep a secure backup of your private key
- Store in password manager or encrypted storage

---

## Next Steps

1. ✅ SSH key created
2. ⬜ Add key to Hetzner Cloud
3. ⬜ Create Hetzner server (select your SSH key)
4. ⬜ Test connection: `ssh root@YOUR_SERVER_IP`
5. ⬜ Proceed with server setup

---

## Quick Reference

**Your Public Key:**
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAICe8d/4lbMWwE4EYTS9w80JXs5iCQ3UGGH0Q+13E3a8l bearops-hetzner
```

**Connect to server:**
```bash
ssh root@YOUR_SERVER_IP
```

**View your public key again:**
```bash
cat ~/.ssh/id_ed25519_bearops.pub
```

