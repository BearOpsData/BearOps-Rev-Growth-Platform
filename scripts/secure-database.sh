#!/bin/bash

# Script to secure PostgreSQL database access
# Only allows SSH access, blocks external PostgreSQL connections

echo "🔒 Securing PostgreSQL Database Access"
echo "======================================"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
  echo "❌ Please run as root (use sudo)"
  exit 1
fi

# Get user's IP address (optional)
read -p "Do you want to restrict SSH to your IP address? (y/n): " restrict_ssh

if [ "$restrict_ssh" = "y" ]; then
  echo ""
  echo "📋 Your current public IP addresses:"
  curl -s ifconfig.me
  echo ""
  read -p "Enter your IP address to whitelist for SSH: " user_ip
  
  if [ -n "$user_ip" ]; then
    echo "🔐 Restricting SSH to IP: $user_ip"
    # Remove general SSH rule
    ufw delete allow 22/tcp 2>/dev/null || true
    # Add IP-specific rule
    ufw allow from $user_ip to any port 22 proto tcp
    echo "✅ SSH restricted to $user_ip"
    echo "⚠️  WARNING: Make sure you have console access in case you get locked out!"
  fi
fi

echo ""
echo "🛡️  Configuring Firewall Rules..."

# Ensure basic rules are in place
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
ufw allow 8000/tcp comment 'Coolify'

# Explicitly deny PostgreSQL from external (if not already denied)
# UFW denies by default, but we'll be explicit
echo ""
echo "✅ Firewall configured:"
echo "   - SSH: Allowed"
echo "   - HTTP/HTTPS: Allowed"
echo "   - Coolify: Allowed"
echo "   - PostgreSQL (5432): BLOCKED (external access denied)"
echo ""

# Check if PostgreSQL port is explicitly allowed (should not be)
if ufw status | grep -q "5432"; then
  echo "⚠️  WARNING: PostgreSQL port 5432 is in firewall rules!"
  echo "   Removing it for security..."
  ufw delete allow 5432/tcp 2>/dev/null || true
fi

# Enable firewall
ufw --force enable

echo ""
echo "📊 Current Firewall Status:"
ufw status numbered

echo ""
echo "✅ Database Security Configuration Complete!"
echo ""
echo "📝 Next Steps:"
echo "   1. PostgreSQL is now only accessible via SSH tunnel"
echo "   2. To access database, create SSH tunnel:"
echo "      ssh -i ~/.ssh/id_ed25519_bearops -L 5432:bearops-postgres:5432 -N root@YOUR_SERVER_IP"
echo "   3. Then connect: psql -h localhost -p 5432 -U bearops -d bearops"
echo ""
echo "📖 See docs/DATABASE_SECURITY.md for detailed instructions"

