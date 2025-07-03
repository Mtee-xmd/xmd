# 🚀 Upload MTEE-XMD to GitHub - Easy Steps

## 📋 **Quick GitHub Upload (5 Minutes)**

### **Step 1: Create GitHub Repository**
1. Go to [github.com](https://github.com)
2. Click **"New Repository"**
3. Name it: `MTEE-XMD-Bot`
4. Make it **Public** or **Private**
5. Click **"Create Repository"**

### **Step 2: Download Essential Files**
Copy these files to your local computer:

#### **📄 package.json**
```json
{
  "name": "MTEE-XMD",
  "version": "4.0.0",
  "description": "MTEE-XMD WhatsApp Bot Using Baileys Multi Device",
  "main": "start.js",
  "type": "commonjs",
  "scripts": {
    "start": "node start.js"
  },
  "keywords": ["WhatsApp Bot", "MTEE", "Multi-Device"],
  "author": "MTEE",
  "license": "MIT",
  "engines": {
    "node": ">=18.0.0"
  },
  "dependencies": {
    "@whiskeysockets/baileys": "^6.7.8",
    "@adiwajshing/keyed-db": "^0.2.4",
    "@ffmpeg-installer/ffmpeg": "^1.1.0",
    "@hapi/boom": "^10.0.1",
    "axios": "^1.7.7",
    "chalk": "^4.1.2",
    "cheerio": "^1.0.0",
    "express": "^4.21.1",
    "file-type": "^16.5.4",
    "fluent-ffmpeg": "^2.1.3",
    "fs-extra": "^11.2.0",
    "moment-timezone": "^0.5.45",
    "node-cron": "^3.0.3",
    "node-fetch": "^2.7.0",
    "pino": "^9.5.0",
    "qrcode-terminal": "^0.12.0"
  }
}
```

#### **📄 start.js**
```javascript
const path = require('path');
const { spawn } = require('child_process');

function start() {
    let args = [path.join(__dirname, 'index.js'), ...process.argv.slice(2)]
    let p = spawn(process.argv[0], args, {
        stdio: ['inherit', 'inherit', 'inherit', 'ipc']
    }).on('message', data => {
        if (data == 'reset') {
            console.log('Restarting Bot...')
            p.kill()
            start()
            delete p
        }
    }).on('exit', code => {
        console.error('Exited with code:', code)
        if (code == '.' || code == 1 || code == 0) start()
    })
}
start()
```

#### **📄 .gitignore**
```
node_modules/
*.log
.env
session/
database/*.json
*.tmp
.DS_Store
```

#### **📄 README.md**
```markdown
# 🤖 MTEE-XMD WhatsApp Bot

A powerful multi-device WhatsApp bot with modern features.

## ✨ Features
- 🔥 Multi-Device Support
- 🎵 Media Downloader
- 🎮 Games & Entertainment
- 🤖 AI Chat Response
- 🛡️ Admin Tools
- 📱 Modern Interface

## 🚀 Quick Deploy

### Railway (Recommended)
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)

### Heroku
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## 📋 Manual Installation

1. **Clone Repository**
   ```bash
   git clone https://github.com/your-username/MTEE-XMD-Bot.git
   cd MTEE-XMD-Bot
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Bot**
   - Set your SESSION_ID
   - Update owner information
   - Customize settings

4. **Start Bot**
   ```bash
   npm start
   ```

## ⚙️ Configuration

Set these environment variables:
- `SESSION_ID` - Your WhatsApp session
- `OWNER_NUMBER` - Your phone number
- `BOT_NAME` - Custom bot name
- `PREFIX` - Command prefix (default: .)

## 📞 Support

Need help? Contact MTEE for assistance!

## 📄 License

MIT License - Feel free to use and modify!
```

### **Step 3: Upload to GitHub**

#### **Method A: GitHub Web Interface (Easiest)**
1. Go to your new repository
2. Click **"uploading an existing file"**
3. Upload the files above
4. Add commit message: "Initial MTEE-XMD Bot setup"
5. Click **"Commit changes"**

#### **Method B: Git Commands**
```bash
# In your local folder with the files:
git init
git add .
git commit -m "Initial MTEE-XMD Bot setup"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/MTEE-XMD-Bot.git
git push -u origin main
```

### **Step 4: Add Deploy Buttons**

#### **📄 app.json** (for Heroku deployment)
```json
{
  "name": "MTEE-XMD Bot",
  "description": "A powerful WhatsApp Bot with Multi Device support",
  "repository": "https://github.com/YOUR-USERNAME/MTEE-XMD-Bot",
  "logo": "https://i.imgur.com/LyHic3i.gif",
  "keywords": ["whatsapp", "bot", "multi-device"],
  "env": {
    "SESSION_ID": {
      "description": "Your WhatsApp session ID",
      "required": true
    },
    "OWNER_NUMBER": {
      "description": "Your phone number with country code",
      "value": "263786453367"
    },
    "BOT_NAME": {
      "description": "Your bot name",
      "value": "MTEE-XMD"
    },
    "PREFIX": {
      "description": "Bot command prefix",
      "value": "."
    }
  },
  "buildpacks": [
    {
      "url": "heroku/nodejs"
    }
  ]
}
```

## 🎯 **After Upload: One-Click Deploy**

Once on GitHub, anyone can:

1. **Deploy to Heroku**: `https://heroku.com/deploy?template=https://github.com/YOUR-USERNAME/MTEE-XMD-Bot`

2. **Deploy to Railway**: Import from GitHub on Railway dashboard

3. **Deploy to Render**: Connect GitHub repo on Render

## ✅ **You're Done!**

Your MTEE-XMD bot is now on GitHub and ready for:
- ✅ One-click deployments
- ✅ Easy sharing
- ✅ Version control
- ✅ Collaboration
- ✅ Professional hosting

## 🔗 **Example Deploy URLs**
- Heroku: `https://heroku.com/deploy?template=https://github.com/YOUR-USERNAME/MTEE-XMD-Bot`
- Railway: Just import the GitHub repo
- Replit: Fork from GitHub

**Your bot is now professional and ready to deploy anywhere!** 🚀