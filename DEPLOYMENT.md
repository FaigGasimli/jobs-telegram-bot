# 🚢 Deployment Guide

This guide covers deploying your Azerbaijan Jobs Bot to various hosting platforms.

## Prerequisites

Before deploying:

1. ✅ Bot tested locally and working
2. ✅ Telegram bot token from @BotFather
3. ✅ Code pushed to GitHub (optional but recommended)

## Deployment Options Comparison

| Platform | Cost | Ease | Best For |
|----------|------|------|----------|
| Railway | Free tier | ⭐⭐⭐⭐⭐ Easy | Beginners |
| Render | Free tier | ⭐⭐⭐⭐ Easy | Simple deploys |
| Heroku | Paid only | ⭐⭐⭐ Medium | Legacy projects |
| VPS | $5+/month | ⭐⭐ Advanced | Full control |

---

## 🚄 Railway (Recommended for Beginners)

**Pros:** Easy setup, automatic deployments, free tier
**Free Tier:** $5 credit/month (enough for small bots)

### Steps:

1. **Create Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure**
   - Railway auto-detects Node.js
   - Add environment variable:
     - Key: `TELEGRAM_BOT_TOKEN`
     - Value: Your bot token

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Bot starts automatically!

5. **View Logs**
   - Click on your service
   - Go to "Logs" tab
   - Verify bot is running

### Auto-Deploy on Push

Railway automatically redeploys when you push to GitHub. No extra configuration needed!

---

## 🎨 Render

**Pros:** Easy setup, free tier, no credit card required
**Free Tier:** 750 hours/month (enough for 24/7 operation)

### Steps:

1. **Create Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

3. **Configure Service**
   ```
   Name: azerbaijan-jobs-bot
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Add Environment Variables**
   - Click "Environment" tab
   - Add variable:
     - Key: `TELEGRAM_BOT_TOKEN`
     - Value: Your bot token

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment
   - Check logs to verify

### Important Notes:

- **Free tier sleeps after 15 minutes** of inactivity
- For 24/7 operation, upgrade to paid tier ($7/month)
- Use cron job to keep awake (see below)

### Keep-Alive for Free Tier:

Create a health check endpoint in `index.js`:

```javascript
// Add this after bot initialization
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Bot is running!');
});

app.listen(PORT, () => {
  console.log(`Health check server on port ${PORT}`);
});
```

Install express: `npm install express`

Use [cron-job.org](https://cron-job.org) to ping your URL every 14 minutes.

---

## 🟣 Heroku

**Note:** Heroku eliminated free tier in November 2022. Minimum cost: $5/month per dyno.

### Steps:

1. **Install Heroku CLI**
   ```bash
   # Windows (download installer)
   https://devcenter.heroku.com/articles/heroku-cli
   
   # Mac
   brew tap heroku/brew && brew install heroku
   
   # Linux
   curl https://cli-assets.heroku.com/install.sh | sh
   ```

2. **Login**
   ```bash
   heroku login
   ```

3. **Create App**
   ```bash
   heroku create azerbaijan-jobs-bot
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set TELEGRAM_BOT_TOKEN=your_token_here
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

6. **Scale Dyno**
   ```bash
   heroku ps:scale worker=1
   ```

7. **View Logs**
   ```bash
   heroku logs --tail
   ```

### Create Procfile:

Create `Procfile` (no extension) in root:

```
worker: node index.js
```

---

## 🖥️ VPS (DigitalOcean, AWS, Linode, etc.)

**Pros:** Full control, better performance
**Cost:** $5-10/month
**Best for:** Advanced users

### Steps:

#### 1. Create VPS

- **DigitalOcean:** Create $5/month droplet (Ubuntu 22.04)
- **AWS:** Create EC2 t2.micro instance
- **Linode:** Create Nanode 1GB plan

#### 2. SSH into Server

```bash
ssh root@your_server_ip
```

#### 3. Install Node.js

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

#### 4. Install Git

```bash
apt install git -y
```

#### 5. Clone Repository

```bash
cd /opt
git clone https://github.com/yourusername/jobs-telegram-bot.git
cd jobs-telegram-bot
```

#### 6. Install Dependencies

```bash
npm install
```

#### 7. Create .env File

```bash
nano .env
```

Add:
```env
TELEGRAM_BOT_TOKEN=your_token_here
BOT_MODE=polling
```

Save: `Ctrl+X`, `Y`, `Enter`

#### 8. Install PM2 (Process Manager)

```bash
npm install -g pm2
```

#### 9. Start Bot with PM2

```bash
pm2 start index.js --name "jobs-bot"
```

#### 10. Configure PM2 Auto-Start

```bash
pm2 save
pm2 startup
# Run the command shown (starts with 'sudo env PATH=...')
```

#### 11. Useful PM2 Commands

```bash
# View logs
pm2 logs jobs-bot

# Restart bot
pm2 restart jobs-bot

# Stop bot
pm2 stop jobs-bot

# View status
pm2 status

# Monitor
pm2 monit
```

#### 12. Optional: Setup Nginx (for health checks)

```bash
apt install nginx -y

# Create config
nano /etc/nginx/sites-available/jobs-bot
```

Add:
```nginx
server {
    listen 80;
    server_name your_domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable:
```bash
ln -s /etc/nginx/sites-available/jobs-bot /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### 13. Optional: Setup SSL with Let's Encrypt

```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d your_domain.com
```

---

## 🔄 Continuous Deployment

### With GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to VPS

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Deploy to VPS
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.VPS_HOST }}
        username: ${{ secrets.VPS_USERNAME }}
        key: ${{ secrets.VPS_SSH_KEY }}
        script: |
          cd /opt/jobs-telegram-bot
          git pull origin main
          npm install
          pm2 restart jobs-bot
```

Add secrets in GitHub repo settings:
- `VPS_HOST`: Your server IP
- `VPS_USERNAME`: SSH username
- `VPS_SSH_KEY`: Private SSH key

---

## 📊 Monitoring

### Check Bot Health

1. **Telegram**
   - Send `/start` to bot
   - If it responds, it's working

2. **Logs (Railway/Render)**
   - Check platform dashboard logs

3. **Logs (VPS)**
   ```bash
   pm2 logs jobs-bot
   ```

### Common Issues

#### Bot doesn't respond
- Check logs for errors
- Verify token is correct
- Ensure bot process is running

#### Jobs not found
- Websites may have changed structure
- Network issues
- Rate limiting

#### Memory errors
- Upgrade to bigger instance
- Optimize scraping code
- Reduce cache size

---

## 🔐 Security Best Practices

1. **Environment Variables**
   - Never commit `.env` to git
   - Use platform secrets/config vars

2. **Keep Dependencies Updated**
   ```bash
   npm audit
   npm update
   ```

3. **Rate Limiting**
   - Built-in delays prevent abuse
   - Monitor logs for rate limit errors

4. **Access Control**
   - Consider adding user whitelist for private bots
   - Implement admin commands with user ID check

---

## 💰 Cost Estimates

### Monthly Hosting Costs

| Platform | Free Tier | Paid Tier | Notes |
|----------|-----------|-----------|-------|
| Railway | $5 credit | $5/month | Auto-scales |
| Render | 750 hrs/mo | $7/month | Sleeps after 15min |
| Heroku | None | $5/month | Deprecated free tier |
| DigitalOcean | None | $5/month | 1GB RAM droplet |
| AWS | 1 year free | $3-10/month | t2.micro |

### Recommendations

- **Hobby/Testing:** Railway or Render free tier
- **Production (small):** Railway $5/month
- **Production (24/7):** VPS $5/month or Render $7/month
- **High traffic:** VPS with 2GB+ RAM

---

## 🆘 Troubleshooting

### Build Fails

**Check:**
- Node.js version (requires 18+)
- `package.json` syntax
- All dependencies are listed

**Fix:**
```bash
npm install
npm start # Test locally first
```

### Bot times out

**Causes:**
- Scraping takes too long
- Rate limiting

**Fix:**
- Reduce timeout values
- Cache results longer
- Implement queue system

### Memory exceeded

**Fix:**
- Reduce concurrent scrapers
- Clear cache more frequently
- Upgrade to bigger instance

---

## 📝 Post-Deployment Checklist

- [ ] Bot responds to `/start`
- [ ] Search returns results
- [ ] All job sites working (check logs)
- [ ] No errors in logs
- [ ] Stats command working
- [ ] Bot doesn't crash after 24 hours
- [ ] Monitoring/alerts setup (optional)

---

## 🎉 Success!

Your bot is now deployed and running 24/7!

**Next Steps:**
- Share bot with users
- Monitor logs regularly
- Update scrapers when sites change
- Add new features
- Collect user feedback

---

Need help? Check the main README.md or open an issue on GitHub.

