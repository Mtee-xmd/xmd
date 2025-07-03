# 🚀 MTEE-XMD Quick Setup Guide

## Step 1: Create package.json
```bash
mkdir MTEE-XMD-Bot && cd MTEE-XMD-Bot
npm init -y
```

Copy this into your `package.json`:
```json
{
  "name": "MTEE-XMD",
  "version": "4.0.0",
  "description": "MTEE-XMD WhatsApp Bot Using Baileys Multi Device",
  "main": "start.js",
  "scripts": {
    "start": "node start.js"
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

## Step 2: Create start.js
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

## Step 3: Create directory structure
```bash
mkdir -p mtee-config mtee-core mtee-utils MteeMedia/theme MteeMedia/database
mkdir -p mtee-core/media session database
```

## Step 4: Create basic settings (mtee-config/settings.js)
```javascript
const fs = require('fs');
const chalk = require('chalk');

// Bot Configuration
global.botname = process.env.BOT_NAME || 'MTEE-XMD';
global.ownername = process.env.OWNER_NAME || 'MTEE';
global.ownernumber = [process.env.OWNER_NUMBER || '263786453367'];
global.SESSION_ID = process.env.SESSION_ID || '';
global.xprefix = process.env.PREFIX || '.';
global.wm = process.env.WATERMARK || "MTEE-XMD Bot";
global.packname = process.env.PACK_NAME || "MTEE-XMD";
global.author = process.env.AUTHOR_NAME || "MADE BY MTEE";

// Limits
global.limit = {
  free: parseInt(process.env.FREE_LIMIT || 100),
  premium: parseInt(process.env.PREMIUM_LIMIT || 999),
  vip: process.env.VIP_LIMIT || 'VIP'
};

// Messages
global.mess = {
  error: process.env.ERROR_MESSAGE || 'Error!',
  nsfw: process.env.NSFW_MESSAGE || 'NSFW is disabled in this group',
  done: process.env.DONE_MESSAGE || 'Done'
};

console.log(chalk.green('✅ MTEE-XMD Settings Loaded'));
```

## Step 5: Install and Run
```bash
npm install
npm start
```

## 🎯 Ready to Use!

Your MTEE-XMD bot is now ready! The basic structure is set up with:
- ✅ Modern secure packages
- ✅ MTEE branding
- ✅ Organized file structure
- ✅ Essential configuration

For the complete bot with all features, you'll need the full MteeBot.js file and utility modules.

## 🔗 Alternative: Deploy to GitHub
1. Create a new GitHub repository
2. Upload these files
3. Deploy to Heroku/Railway using the repo
4. Add your SESSION_ID as environment variable

## 📞 Need Help?
Contact MTEE for the complete bot files if needed!