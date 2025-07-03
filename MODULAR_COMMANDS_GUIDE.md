# 📁 Modular Command System for MTEE-XMD Bot

## 🏗️ **Better File Organization**

Instead of putting all commands in `index.js`, let's organize them in separate files by category!

---

## 📂 **Directory Structure**

Create this folder structure:
```
MTEE-XMD-Bot/
├── index.js                 # Main bot file
├── start.js                 # Starter script
├── package.json             # Dependencies
├── commands/                # 📁 Commands folder
│   ├── general.js           # General commands
│   ├── downloaders.js       # Download commands
│   ├── fun.js               # Fun & entertainment
│   ├── media.js             # Media processing
│   ├── group.js             # Group management
│   ├── owner.js             # Owner-only commands
│   └── index.js             # Command loader
└── utils/                   # 📁 Utilities
    ├── functions.js         # Helper functions
    └── responses.js         # Response templates
```

---

## 🎯 **Step 1: Create Command Files**

### **commands/general.js**
```javascript
module.exports = {
    menu: {
        description: 'Show bot menu',
        category: 'General',
        usage: '.menu',
        execute: async (sock, msg, args, { reply, prefix, botname, ownername }) => {
            const menuText = `🤖 *${botname} - Command Menu*

📱 *General Commands:*
${prefix}menu - Show this menu
${prefix}ping - Check bot speed
${prefix}alive - Bot status
${prefix}owner - Contact owner

📥 *Downloaders:*
${prefix}play [song] - Download music
${prefix}video [name] - Download video
${prefix}ytmp3 [url] - YouTube to MP3

🎮 *Fun Commands:*
${prefix}joke - Random joke
${prefix}fact - Random fact
${prefix}quote - Inspirational quote

👥 *Group Commands:*
${prefix}tagall - Tag all members
${prefix}groupinfo - Group information

🛠️ *Media Tools:*
${prefix}sticker - Convert to sticker
${prefix}blur - Blur images

💻 *Bot Info:*
📱 Name: ${botname}
👤 Owner: ${ownername}
🔧 Prefix: ${prefix}

_MTEE-XMD Multi-Device WhatsApp Bot_`;
            
            await reply(menuText);
        }
    },

    ping: {
        description: 'Check bot response time',
        category: 'General',
        usage: '.ping',
        execute: async (sock, msg, args, { reply }) => {
            const start = Date.now();
            const pingMsg = await sock.sendMessage(msg.key.remoteJid, { text: '⏱️ Pinging...' });
            const end = Date.now();
            
            await sock.sendMessage(msg.key.remoteJid, {
                text: `🏓 *Pong!*\n📊 Speed: ${end - start}ms\n💾 RAM: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB`,
                edit: pingMsg.key
            });
        }
    },

    alive: {
        description: 'Check if bot is running',
        category: 'General',
        usage: '.alive',
        execute: async (sock, msg, args, { reply, botname, ownername, prefix }) => {
            const uptime = process.uptime();
            const hours = Math.floor(uptime / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            
            await reply(`✅ *${botname} is Online!*\n\n🟢 Status: Active\n⏰ Uptime: ${hours}h ${minutes}m\n💻 Owner: ${ownername}\n🔧 Prefix: ${prefix}\n\n_Bot is working perfectly!_`);
        }
    },

    owner: {
        description: 'Contact bot owner',
        category: 'General',
        usage: '.owner',
        execute: async (sock, msg, args, { reply, botname, ownername, ownernumber }) => {
            await reply(`👤 *Bot Owner Information*\n\n📱 Name: ${ownername}\n📞 Number: ${ownernumber[0]}\n🤖 Bot: ${botname}\n\n_Contact for support or inquiries_`);
        }
    }
};
```

### **commands/fun.js**
```javascript
const axios = require('axios');

module.exports = {
    joke: {
        description: 'Get a random joke',
        category: 'Fun',
        usage: '.joke',
        execute: async (sock, msg, args, { reply }) => {
            try {
                const response = await axios.get('https://official-joke-api.appspot.com/random_joke');
                const joke = response.data;
                await reply(`😂 *Random Joke*\n\n${joke.setup}\n\n${joke.punchline}`);
            } catch (error) {
                await reply('Could not fetch joke! Try again later.');
            }
        }
    },

    fact: {
        description: 'Get a random fact',
        category: 'Fun',
        usage: '.fact',
        execute: async (sock, msg, args, { reply }) => {
            try {
                const response = await axios.get('https://uselessfacts.jsph.pl/random.json?language=en');
                const fact = response.data;
                await reply(`🧠 *Random Fact*\n\n${fact.text}`);
            } catch (error) {
                await reply('Could not fetch fact! Try again later.');
            }
        }
    },

    quote: {
        description: 'Get an inspirational quote',
        category: 'Fun',
        usage: '.quote',
        execute: async (sock, msg, args, { reply }) => {
            try {
                const response = await axios.get('https://api.quotegarden.io/api/v3/quotes/random');
                const quote = response.data.data;
                await reply(`💭 *Inspirational Quote*\n\n"${quote.quoteText}"\n\n_- ${quote.quoteAuthor}_`);
            } catch (error) {
                await reply('Could not fetch quote! Try again later.');
            }
        }
    },

    time: {
        description: 'Get current time',
        category: 'Fun',
        usage: '.time',
        execute: async (sock, msg, args, { reply }) => {
            const now = new Date();
            await reply(`🕐 *Current Time*\n\n${now.toLocaleString()}\n\nTimezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`);
        }
    }
};
```

### **commands/downloaders.js**
```javascript
const ytdl = require('ytdl-core');
const yts = require('yt-search');
const fs = require('fs');

module.exports = {
    play: {
        description: 'Download music from YouTube',
        category: 'Downloaders',
        usage: '.play [song name]',
        execute: async (sock, msg, args, { reply, text }) => {
            if (!text) return reply('Please provide a song name!');
            
            await reply('🔍 Searching for your song...');
            
            try {
                const search = await yts(text);
                if (!search.videos.length) return reply('Song not found!');
                
                const video = search.videos[0];
                const info = await ytdl.getInfo(video.url);
                const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');
                const filename = `./downloads/${title}.mp3`;
                
                await new Promise((resolve, reject) => {
                    ytdl(video.url, { quality: 'highestaudio' })
                        .pipe(fs.createWriteStream(filename))
                        .on('finish', resolve)
                        .on('error', reject);
                });
                
                await sock.sendMessage(msg.key.remoteJid, {
                    audio: fs.readFileSync(filename),
                    mimetype: 'audio/mpeg',
                    fileName: `${title}.mp3`
                }, { quoted: msg });
                
                fs.unlinkSync(filename);
            } catch (error) {
                await reply('Error downloading song! Please try again.');
            }
        }
    },

    video: {
        description: 'Download video from YouTube',
        category: 'Downloaders',
        usage: '.video [video name]',
        execute: async (sock, msg, args, { reply, text }) => {
            if (!text) return reply('Please provide a video name!');
            
            await reply('🔍 Searching for your video...');
            
            try {
                const search = await yts(text);
                if (!search.videos.length) return reply('Video not found!');
                
                const video = search.videos[0];
                await reply(`🎬 *${video.title}*\n⏱️ Duration: ${video.duration.timestamp}\n👀 Views: ${video.views}\n\n📥 Downloading...`);
                
                // Add actual download logic here
                // This is a simplified version
            } catch (error) {
                await reply('Error downloading video! Please try again.');
            }
        }
    }
};
```

### **commands/group.js**
```javascript
module.exports = {
    tagall: {
        description: 'Tag all group members',
        category: 'Group',
        usage: '.tagall [message]',
        execute: async (sock, msg, args, { reply, text, isGroup, groupMetadata }) => {
            if (!isGroup) return reply('This command is only for groups!');
            
            const participants = groupMetadata.participants;
            let tagText = `🔔 *Group Announcement*\n\n${text || 'No message'}\n\n`;
            
            for (let participant of participants) {
                tagText += `@${participant.id.split('@')[0]} `;
            }
            
            await sock.sendMessage(msg.key.remoteJid, {
                text: tagText,
                mentions: participants.map(p => p.id)
            });
        }
    },

    groupinfo: {
        description: 'Get group information',
        category: 'Group',
        usage: '.groupinfo',
        execute: async (sock, msg, args, { reply, isGroup, groupMetadata }) => {
            if (!isGroup) return reply('This command is only for groups!');
            
            await reply(`👥 *Group Information*\n\n📛 Name: ${groupMetadata.subject}\n👤 Members: ${groupMetadata.participants.length}\n📅 Created: ${new Date(groupMetadata.creation * 1000).toDateString()}\n📝 Description: ${groupMetadata.desc || 'No description'}`);
        }
    }
};
```

### **commands/media.js**
```javascript
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

module.exports = {
    sticker: {
        description: 'Convert image/video to sticker',
        category: 'Media',
        usage: '.sticker (reply to image/video)',
        execute: async (sock, msg, args, { reply, quoted, botname, ownername }) => {
            if (!msg.message.imageMessage && !msg.message.videoMessage && !quoted?.imageMessage && !quoted?.videoMessage) {
                return reply('Please reply to an image or video!');
            }
            
            await reply('🔄 Converting to sticker...');
            
            try {
                const mediaMsg = msg.message.imageMessage || msg.message.videoMessage || quoted?.imageMessage || quoted?.videoMessage;
                const stream = await downloadContentFromMessage(mediaMsg, mediaMsg.imageMessage ? 'image' : 'video');
                let buffer = Buffer.from([]);
                
                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk]);
                }
                
                await sock.sendMessage(msg.key.remoteJid, {
                    sticker: buffer,
                    packname: botname,
                    author: ownername
                }, { quoted: msg });
                
            } catch (error) {
                await reply('Error creating sticker!');
            }
        }
    }
};
```

---

## 🔧 **Step 2: Create Command Loader**

### **commands/index.js**
```javascript
const fs = require('fs');
const path = require('path');

class CommandHandler {
    constructor() {
        this.commands = new Map();
        this.categories = new Map();
        this.loadCommands();
    }

    loadCommands() {
        const commandFiles = fs.readdirSync(__dirname).filter(file => 
            file.endsWith('.js') && file !== 'index.js'
        );

        for (const file of commandFiles) {
            const commands = require(path.join(__dirname, file));
            const category = file.replace('.js', '');

            for (const [name, command] of Object.entries(commands)) {
                this.commands.set(name, command);
                
                if (!this.categories.has(category)) {
                    this.categories.set(category, []);
                }
                this.categories.get(category).push(name);
            }
        }

        console.log(`✅ Loaded ${this.commands.size} commands from ${commandFiles.length} files`);
    }

    async executeCommand(commandName, sock, msg, args, context) {
        const command = this.commands.get(commandName);
        if (!command) return false;

        try {
            await command.execute(sock, msg, args, context);
            return true;
        } catch (error) {
            console.error(`Error executing command ${commandName}:`, error);
            context.reply('An error occurred while executing this command!');
            return false;
        }
    }

    getCommand(name) {
        return this.commands.get(name);
    }

    getAllCommands() {
        return Array.from(this.commands.keys());
    }

    getCommandsByCategory(category) {
        return this.categories.get(category) || [];
    }
}

module.exports = CommandHandler;
```

---

## 🔄 **Step 3: Update Main index.js**

Replace your switch statement in `index.js` with this:

```javascript
// Add at the top of index.js
const CommandHandler = require('./commands');
const commandHandler = new CommandHandler();

// Replace the entire switch statement with this:
// Handle messages
sock.ev.on('messages.upsert', async (m) => {
    try {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const from = msg.key.remoteJid;
        const body = msg.message.conversation || 
                    msg.message.extendedTextMessage?.text || 
                    msg.message.imageMessage?.caption || 
                    msg.message.videoMessage?.caption || '';
        
        const isCmd = body.startsWith(global.prefix);
        const command = isCmd ? body.slice(global.prefix.length).trim().split(' ')[0].toLowerCase() : '';
        const args = body.trim().split(/ +/).slice(1);
        const text = args.join(' ');
        const sender = msg.key.participant || msg.key.remoteJid;
        const isGroup = from.endsWith('@g.us');
        const groupMetadata = isGroup ? await sock.groupMetadata(from) : {};

        // Quoted message
        const quoted = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;

        // Reply function
        const reply = (text) => {
            sock.sendMessage(from, { text: text }, { quoted: msg });
        };

        // Context object with all needed variables
        const context = {
            reply,
            text,
            args,
            sender,
            isGroup,
            groupMetadata,
            quoted,
            prefix: global.prefix,
            botname: global.botname,
            ownername: global.ownername,
            ownernumber: global.ownernumber
        };

        // Execute command if it exists
        if (isCmd && command) {
            const executed = await commandHandler.executeCommand(command, sock, msg, args, context);
            
            if (!executed) {
                reply(`❌ Command *${global.prefix}${command}* not found!\n\nType *${global.prefix}menu* to see available commands.`);
            }
        }

    } catch (error) {
        console.error('Message handling error:', error);
    }
});
```

---

## ➕ **Step 4: Adding New Commands**

Now adding commands is super easy! Just edit the appropriate file:

### **Add to existing file (commands/fun.js):**
```javascript
// Add this to the module.exports object in fun.js:
roll: {
    description: 'Roll a dice',
    category: 'Fun',
    usage: '.roll [sides]',
    execute: async (sock, msg, args, { reply, text }) => {
        const sides = parseInt(text) || 6;
        const result = Math.floor(Math.random() * sides) + 1;
        await reply(`🎲 You rolled: **${result}** (out of ${sides})`);
    }
}
```

### **Create new category (commands/utilities.js):**
```javascript
module.exports = {
    qr: {
        description: 'Generate QR code',
        category: 'Utilities',
        usage: '.qr [text]',
        execute: async (sock, msg, args, { reply, text }) => {
            if (!text) return reply('Please provide text for QR code!');
            
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
            
            await sock.sendMessage(msg.key.remoteJid, {
                image: { url: qrUrl },
                caption: `📱 QR Code for: ${text}`
            }, { quoted: msg });
        }
    },

    shorten: {
        description: 'Shorten a URL',
        category: 'Utilities',
        usage: '.shorten [url]',
        execute: async (sock, msg, args, { reply, text }) => {
            if (!text || !text.includes('http')) {
                return reply('Please provide a valid URL!');
            }
            
            // Add URL shortening logic here
            await reply(`🔗 Shortened URL: https://short.ly/abc123`);
        }
    }
};
```

---

## 🎯 **Benefits of This System:**

### **✅ Better Organization:**
- Commands grouped by category
- Easy to find and edit
- Clean file structure

### **✅ Easy to Add Commands:**
- Just add to existing files
- Create new categories easily
- No need to edit main bot file

### **✅ Better Maintainability:**
- Each file handles specific functionality
- Error handling per command
- Easy debugging

### **✅ Team Development:**
- Multiple people can work on different files
- No merge conflicts in main file
- Easy to review changes

---

## 📋 **Command Template:**

When adding new commands, use this template:

```javascript
commandName: {
    description: 'What this command does',
    category: 'Category Name',
    usage: '.commandname [arguments]',
    execute: async (sock, msg, args, { reply, text, /* other context */ }) => {
        try {
            // Your command logic here
            
            if (!text) return reply('Usage: .commandname [arguments]');
            
            // Do something
            await reply('Command executed successfully!');
            
        } catch (error) {
            await reply('Error executing command!');
        }
    }
}
```

---

## 🚀 **This modular system makes your bot:**
- ✅ **More organized**
- ✅ **Easier to maintain**
- ✅ **Simpler to add commands**
- ✅ **Better for collaboration**
- ✅ **Professional structure**

**Your MTEE-XMD bot will be much more scalable and professional with this approach!** 🎉