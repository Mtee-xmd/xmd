// MTEE-XMD Bot - Minimal Setup
const fs = require('fs');
const pino = require('pino');
const chalk = require('chalk');
const readline = require('readline');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');

// Bot Configuration
global.botname = process.env.BOT_NAME || 'MTEE-XMD';
global.ownername = process.env.OWNER_NAME || 'MTEE';
global.ownernumber = [process.env.OWNER_NUMBER || '263786453367'];
global.SESSION_ID = process.env.SESSION_ID || '';
global.prefix = process.env.PREFIX || '.';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (text) => new Promise((resolve) => rl.question(text, resolve));

console.log(chalk.cyan(`
███╗   ███╗████████╗███████╗███████╗      ██╗  ██╗███╗   ███╗██████╗ 
████╗ ████║╚══██╔══╝██╔════╝██╔════╝      ╚██╗██╔╝████╗ ████║██╔══██╗
██╔████╔██║   ██║   █████╗  █████╗   █████╗╚███╔╝ ██╔████╔██║██║  ██║
██║╚██╔╝██║   ██║   ██╔══╝  ██╔══╝   ╚════╝██╔██╗ ██║╚██╔╝██║██║  ██║
██║ ╚═╝ ██║   ██║   ███████╗███████╗      ██╔╝ ██╗██║ ╚═╝ ██║██████╔╝
╚═╝     ╚═╝   ╚═╝   ╚══════╝╚══════╝      ╚═╝  ╚═╝╚═╝     ╚═╝╚═════╝ 
`));

console.log(chalk.green('🚀 MTEE-XMD Bot Starting...'));

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    const { version, isLatest } = await fetchLatestBaileysVersion();
    
    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: !global.SESSION_ID,
        auth: state,
        browser: ['MTEE-XMD', 'Chrome', '1.0.0']
    });

    // Handle connection updates
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect);
            if (shouldReconnect) {
                startBot();
            }
        } else if (connection === 'open') {
            console.log(chalk.green('✅ Connected to WhatsApp!'));
            console.log(chalk.blue(`📱 Bot: ${global.botname}`));
            console.log(chalk.blue(`👤 Owner: ${global.ownername}`));
            console.log(chalk.blue(`🔧 Prefix: ${global.prefix}`));
        }
    });

    // Save credentials
    sock.ev.on('creds.update', saveCreds);

    // Handle messages
    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const from = msg.key.remoteJid;
        const body = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
        const isCmd = body.startsWith(global.prefix);
        const command = isCmd ? body.slice(global.prefix.length).trim().split(' ')[0].toLowerCase() : '';
        const args = body.trim().split(/ +/).slice(1);

        // Basic Commands
        switch (command) {
            case 'menu':
            case 'help':
                await sock.sendMessage(from, {
                    text: `🤖 *${global.botname}*\n\n📋 *Available Commands:*\n\n${global.prefix}menu - Show this menu\n${global.prefix}ping - Check bot speed\n${global.prefix}owner - Contact owner\n${global.prefix}alive - Check if bot is running\n\n💻 *Owner:* ${global.ownername}\n🔧 *Prefix:* ${global.prefix}\n\n_MTEE-XMD Bot v4.0_`
                });
                break;

            case 'ping':
                const start = Date.now();
                const msg_ping = await sock.sendMessage(from, { text: '⏱️ Pinging...' });
                const end = Date.now();
                await sock.sendMessage(from, {
                    text: `🏓 *Pong!*\n📊 *Speed:* ${end - start}ms`,
                    edit: msg_ping.key
                });
                break;

            case 'owner':
                await sock.sendMessage(from, {
                    text: `👤 *Bot Owner*\n\n📱 *Name:* ${global.ownername}\n📞 *Number:* ${global.ownernumber[0]}\n🤖 *Bot:* ${global.botname}\n\n_Contact for support or inquiries_`
                });
                break;

            case 'alive':
                await sock.sendMessage(from, {
                    text: `✅ *${global.botname} is Online!*\n\n🟢 *Status:* Active\n⚡ *Uptime:* ${Math.floor(process.uptime())} seconds\n💻 *Owner:* ${global.ownername}\n\n_Bot is working perfectly!_`
                });
                break;

            default:
                // Auto-response for non-commands
                if (isCmd && command) {
                    await sock.sendMessage(from, {
                        text: `❌ Command *${global.prefix}${command}* not found!\n\nType *${global.prefix}menu* to see available commands.`
                    });
                }
                break;
        }
    });

    return sock;
}

// Start the bot
startBot().catch(err => console.log('Error starting bot:', err));