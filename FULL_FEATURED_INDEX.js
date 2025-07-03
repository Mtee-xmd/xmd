// MTEE-XMD Bot - Full Featured
const fs = require('fs');
const pino = require('pino');
const chalk = require('chalk');
const axios = require('axios');
const cheerio = require('cheerio');
const ytdl = require('ytdl-core');
const yts = require('yt-search');
const { exec } = require('child_process');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, downloadContentFromMessage, jidDecode, proto, getContentType } = require('@whiskeysockets/baileys');

// Bot Configuration
global.botname = process.env.BOT_NAME || 'MTEE-XMD';
global.ownername = process.env.OWNER_NAME || 'MTEE';
global.ownernumber = [process.env.OWNER_NUMBER || '263786453367'];
global.SESSION_ID = process.env.SESSION_ID || '';
global.prefix = process.env.PREFIX || '.';

// Create directories
const dirs = ['./session', './temp', './downloads'];
dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

console.log(chalk.cyan(`
███╗   ███╗████████╗███████╗███████╗      ██╗  ██╗███╗   ███╗██████╗ 
████╗ ████║╚══██╔══╝██╔════╝██╔════╝      ╚██╗██╔╝████╗ ████║██╔══██╗
██╔████╔██║   ██║   █████╗  █████╗   █████╗╚███╔╝ ██╔████╔██║██║  ██║
██║╚██╔╝██║   ██║   ██╔══╝  ██╔══╝   ╚════╝██╔██╗ ██║╚██╔╝██║██║  ██║
██║ ╚═╝ ██║   ██║   ███████╗███████╗      ██╔╝ ██╗██║ ╚═╝ ██║██████╔╝
╚═╝     ╚═╝   ╚═╝   ╚══════╝╚══════╝      ╚═╝  ╚═╝╚═╝     ╚═╝╚═════╝ 
`));

// Utility Functions
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const getBuffer = async (url) => {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return Buffer.from(response.data);
    } catch (error) {
        throw error;
    }
};

const ytSearch = async (query) => {
    try {
        const results = await yts(query);
        return results.videos[0];
    } catch (error) {
        return null;
    }
};

const downloadYT = async (url, type = 'mp3') => {
    try {
        const info = await ytdl.getInfo(url);
        const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');
        const filename = `./downloads/${title}.${type}`;
        
        if (type === 'mp3') {
            return new Promise((resolve, reject) => {
                ytdl(url, { quality: 'highestaudio' })
                    .pipe(fs.createWriteStream(filename))
                    .on('finish', () => resolve(filename))
                    .on('error', reject);
            });
        } else {
            return new Promise((resolve, reject) => {
                ytdl(url, { quality: 'highest' })
                    .pipe(fs.createWriteStream(filename))
                    .on('finish', () => resolve(filename))
                    .on('error', reject);
            });
        }
    } catch (error) {
        throw error;
    }
};

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    const { version } = await fetchLatestBaileysVersion();
    
    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: !global.SESSION_ID,
        auth: state,
        browser: ['MTEE-XMD', 'Chrome', '1.0.0'],
        markOnlineOnConnect: true
    });

    // Handle connection
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) startBot();
        } else if (connection === 'open') {
            console.log(chalk.green('✅ MTEE-XMD Connected Successfully!'));
        }
    });

    sock.ev.on('creds.update', saveCreds);

    // Message Handler
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
            const participants = isGroup ? groupMetadata.participants : [];

            // Quoted message
            const quoted = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;

            // Reply function
            const reply = (text) => {
                sock.sendMessage(from, { text: text }, { quoted: msg });
            };

            // Commands
            switch (command) {
                case 'menu':
                case 'help':
                    const menuText = `🤖 *${global.botname} - Command List*

📱 *General Commands:*
${global.prefix}menu - Show this menu
${global.prefix}ping - Check bot speed
${global.prefix}owner - Contact owner
${global.prefix}alive - Bot status

📥 *Downloaders:*
${global.prefix}play [song] - Download music
${global.prefix}video [song] - Download video
${global.prefix}ytmp3 [url] - YouTube to MP3
${global.prefix}ytmp4 [url] - YouTube to MP4
${global.prefix}ig [url] - Instagram downloader
${global.prefix}tiktok [url] - TikTok downloader

🎨 *Media Tools:*
${global.prefix}sticker - Convert image/video to sticker
${global.prefix}toimg - Convert sticker to image
${global.prefix}tomp3 - Convert video to audio

🎮 *Fun Commands:*
${global.prefix}joke - Random joke
${global.prefix}fact - Random fact
${global.prefix}quote - Inspirational quote
${global.prefix}meme - Random meme

🔍 *Search:*
${global.prefix}google [query] - Google search
${global.prefix}image [query] - Image search
${global.prefix}wiki [query] - Wikipedia search

👥 *Group Commands:*
${global.prefix}tagall - Tag everyone
${global.prefix}hidetag [text] - Hidden tag
${global.prefix}kick @user - Remove user
${global.prefix}add [number] - Add user

🛠 *Owner Only:*
${global.prefix}broadcast [text] - Broadcast message
${global.prefix}block @user - Block user
${global.prefix}unblock @user - Unblock user

💻 *Bot Info:*
📱 Name: ${global.botname}
👤 Owner: ${global.ownername}
🔧 Prefix: ${global.prefix}
⚡ Version: 4.0

_MTEE-XMD Multi-Device WhatsApp Bot_`;
                    reply(menuText);
                    break;

                case 'ping':
                    const start = Date.now();
                    const pingMsg = await sock.sendMessage(from, { text: '⏱️ Pinging...' });
                    const end = Date.now();
                    await sock.sendMessage(from, {
                        text: `🏓 *Pong!*\n📊 Speed: ${end - start}ms\n💾 RAM: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB`,
                        edit: pingMsg.key
                    });
                    break;

                case 'play':
                case 'song':
                    if (!text) return reply('Please provide a song name!');
                    reply('🔍 Searching for your song...');
                    try {
                        const search = await ytSearch(text);
                        if (!search) return reply('Song not found!');
                        
                        const audioPath = await downloadYT(search.url, 'mp3');
                        await sock.sendMessage(from, {
                            audio: fs.readFileSync(audioPath),
                            mimetype: 'audio/mpeg',
                            fileName: `${search.title}.mp3`
                        }, { quoted: msg });
                        
                        fs.unlinkSync(audioPath);
                    } catch (error) {
                        reply('Error downloading song!');
                    }
                    break;

                case 'video':
                    if (!text) return reply('Please provide a video name!');
                    reply('🔍 Searching for your video...');
                    try {
                        const search = await ytSearch(text);
                        if (!search) return reply('Video not found!');
                        
                        const videoPath = await downloadYT(search.url, 'mp4');
                        await sock.sendMessage(from, {
                            video: fs.readFileSync(videoPath),
                            caption: `🎬 *${search.title}*\n⏱️ Duration: ${search.duration.timestamp}`
                        }, { quoted: msg });
                        
                        fs.unlinkSync(videoPath);
                    } catch (error) {
                        reply('Error downloading video!');
                    }
                    break;

                case 'sticker':
                case 's':
                    if (msg.message.imageMessage || msg.message.videoMessage || quoted?.imageMessage || quoted?.videoMessage) {
                        reply('🔄 Converting to sticker...');
                        try {
                            const mediaMsg = msg.message.imageMessage || msg.message.videoMessage || quoted?.imageMessage || quoted?.videoMessage;
                            const stream = await downloadContentFromMessage(mediaMsg, mediaMsg.imageMessage ? 'image' : 'video');
                            let buffer = Buffer.from([]);
                            for await (const chunk of stream) {
                                buffer = Buffer.concat([buffer, chunk]);
                            }
                            
                            await sock.sendMessage(from, {
                                sticker: buffer,
                                packname: global.botname,
                                author: global.ownername
                            }, { quoted: msg });
                        } catch (error) {
                            reply('Error creating sticker!');
                        }
                    } else {
                        reply('Please reply to an image or video!');
                    }
                    break;

                case 'google':
                    if (!text) return reply('What do you want to search?');
                    try {
                        const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(text)}&key=YOUR_API_KEY&cx=YOUR_CX`;
                        reply(`🔍 *Google Search Results for "${text}"*\n\nFor detailed results, visit: https://google.com/search?q=${encodeURIComponent(text)}`);
                    } catch (error) {
                        reply('Search error!');
                    }
                    break;

                case 'joke':
                    try {
                        const response = await axios.get('https://official-joke-api.appspot.com/random_joke');
                        const joke = response.data;
                        reply(`😂 *Random Joke*\n\n${joke.setup}\n\n${joke.punchline}`);
                    } catch (error) {
                        reply('Could not fetch joke!');
                    }
                    break;

                case 'fact':
                    try {
                        const response = await axios.get('https://uselessfacts.jsph.pl/random.json?language=en');
                        const fact = response.data;
                        reply(`🧠 *Random Fact*\n\n${fact.text}`);
                    } catch (error) {
                        reply('Could not fetch fact!');
                    }
                    break;

                case 'quote':
                    try {
                        const response = await axios.get('https://api.quotegarden.io/api/v3/quotes/random');
                        const quote = response.data.data;
                        reply(`💭 *Inspirational Quote*\n\n"${quote.quoteText}"\n\n_- ${quote.quoteAuthor}_`);
                    } catch (error) {
                        reply('Could not fetch quote!');
                    }
                    break;

                case 'tagall':
                    if (!isGroup) return reply('This command is only for groups!');
                    let tagText = `🔔 *Group Announcement*\n\n${text || 'No message'}\n\n`;
                    for (let participant of participants) {
                        tagText += `@${participant.id.split('@')[0]} `;
                    }
                    await sock.sendMessage(from, {
                        text: tagText,
                        mentions: participants.map(p => p.id)
                    });
                    break;

                case 'owner':
                    reply(`👤 *Bot Owner Information*\n\n📱 Name: ${global.ownername}\n📞 Number: ${global.ownernumber[0]}\n🤖 Bot: ${global.botname}\n\n_Contact for support or inquiries_`);
                    break;

                case 'alive':
                    const uptime = process.uptime();
                    const hours = Math.floor(uptime / 3600);
                    const minutes = Math.floor((uptime % 3600) / 60);
                    reply(`✅ *${global.botname} is Online!*\n\n🟢 Status: Active\n⏰ Uptime: ${hours}h ${minutes}m\n💻 Owner: ${global.ownername}\n🔧 Prefix: ${global.prefix}\n\n_Bot is working perfectly!_`);
                    break;

                default:
                    if (isCmd && command) {
                        reply(`❌ Command *${global.prefix}${command}* not found!\n\nType *${global.prefix}menu* to see available commands.`);
                    }
                    break;
            }

        } catch (error) {
            console.error('Message handling error:', error);
        }
    });

    return sock;
}

// Error handling
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

// Start bot
console.log(chalk.green('🚀 Starting MTEE-XMD Bot...'));
startBot().catch(err => console.error('Bot startup error:', err));