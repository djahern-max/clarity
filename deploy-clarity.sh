#!/bin/bash
# Configuration variables
LOCAL_DIR="/Users/ryze.ai/Desktop/BUILDING_AGENTS/ryze-agent-creator/clarity"
SSH_KEY="/Users/ryze.ai/DESKTOP/BUILDING_AGENTS/SSH_KEYS/ryze_digital_ocean"
SERVER_USER="root"
SERVER_IP="64.23.234.142"
REMOTE_DIR="/var/www/clarity.ryze.ai/frontend"

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting deployment for Clarity...${NC}"

# Install dependencies if needed
echo -e "${YELLOW}Checking dependencies...${NC}"
cd "$LOCAL_DIR"
npm install

# Build the React application
echo -e "${YELLOW}Building React application...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed. Fix errors and try again.${NC}"
    exit 1
fi
echo -e "${GREEN}Build successful.${NC}"

# Deploy the new files
echo -e "${YELLOW}Deploying to server...${NC}"
ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" "mkdir -p $REMOTE_DIR"
ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" "rm -rf $REMOTE_DIR/*"
scp -i "$SSH_KEY" -r "$LOCAL_DIR/build/"* "$SERVER_USER@$SERVER_IP:$REMOTE_DIR/"
if [ $? -ne 0 ]; then
    echo -e "${RED}Deployment failed.${NC}"
    exit 1
fi

echo -e "${GREEN}Deployment completed! Clarity is live at https://clarity.ryze.ai${NC}"
exit 0
