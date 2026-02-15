#!/bin/bash

# Hetzner Cloud Server Setup Script
# Run this on your fresh Hetzner Cloud server

set -e

echo "🚀 Setting up Hetzner Cloud Server for BearOps + Coolify"
echo "========================================================"
echo ""
echo "Recommended server: CPX32 (4 vCPU, 8GB RAM, 160GB SSD)"
echo "Alternative: CPX22 (2 vCPU, 4GB RAM, 80GB SSD) - budget option"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root (use sudo)"
    exit 1
fi

echo -e "\n${YELLOW}Step 1: Updating system...${NC}"
apt update && apt upgrade -y

echo -e "\n${YELLOW}Step 2: Installing essential tools...${NC}"
apt install -y curl wget git ufw fail2ban htop

echo -e "\n${YELLOW}Step 3: Configuring firewall...${NC}"
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
echo -e "${GREEN}✅ Firewall configured${NC}"

echo -e "\n${YELLOW}Step 4: Installing Docker...${NC}"
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    echo -e "${GREEN}✅ Docker installed${NC}"
else
    echo -e "${GREEN}✅ Docker already installed${NC}"
fi

# Install Docker Compose
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    echo -e "${GREEN}✅ Docker Compose installed${NC}"
else
    echo -e "${GREEN}✅ Docker Compose already installed${NC}"
fi

echo -e "\n${YELLOW}Step 5: Verifying Docker installation...${NC}"
docker --version
docker-compose --version
docker run --rm hello-world > /dev/null 2>&1
echo -e "${GREEN}✅ Docker is working${NC}"

echo -e "\n${YELLOW}Step 6: Installing Coolify...${NC}"
if [ ! -d "/data/coolify" ]; then
    curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
    echo -e "${GREEN}✅ Coolify installed${NC}"
else
    echo -e "${GREEN}✅ Coolify already installed${NC}"
fi

echo -e "\n${YELLOW}Step 7: Setting up fail2ban...${NC}"
systemctl enable fail2ban
systemctl start fail2ban
echo -e "${GREEN}✅ fail2ban configured${NC}"

echo -e "\n${GREEN}========================================================"
echo "✅ Server setup complete!"
echo "========================================================${NC}"
echo ""
echo "Next steps:"
echo "1. Access Coolify at: http://$(hostname -I | awk '{print $1}'):8000"
echo "2. Create admin account in Coolify"
echo "3. Connect your GitHub repository"
echo "4. Deploy your application"
echo ""
echo "Server IP: $(hostname -I | awk '{print $1}')"
echo ""
echo "Useful commands:"
echo "  - Check Docker: docker ps"
echo "  - Check Coolify: cd /data/coolify && docker-compose ps"
echo "  - View logs: docker logs coolify"
echo ""

