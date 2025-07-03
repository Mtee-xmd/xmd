import { makeWASocket, DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys';
import qrcode from 'qrcode-terminal';
import pino from 'pino';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

// Configure logger (silent mode for clean output)
const logger = pino({ level: 'silent' });

// Bot configuration
const config = {
  sessionPath: './session',
  prefix: '!',
  botName: 'WhatsApp Bot MVP',
  ownerNumber: process.env.OWNER_NUMBER || '1234567890' // Set your number in .env
};

// Auto-reply responses
const autoReplies = {
  'hello': 'Hi there! I\'m your WhatsApp assistant 🤖',
  'hi': 'Hello! How can I help you today? 😊',
  'good morning': 'Good morning! Hope you have a great day! ☀️',
  'good night': 'Good night! Sweet dreams! 🌙',
  'how are you': 'I\'m doing great! Thanks for asking. How about you?',
  'thanks': 'You\'re welcome! 😊',
  'thank you': 'You\'re welcome! Happy to help! 🙏'
};

// Command responses
const commands = {
  help: `📋 *Available Commands:*

🔹 !help - Show this help menu
🔹 !info - Bot information
🔹 !joke - Get a random joke
🔹 !ping - Check bot response time
🔹 !about - About this bot

💡 *Auto Replies:* Try saying hello, hi, thanks, etc.`,

  info: `ℹ️ *Bot Information:*

🤖 *Name:* ${config.botName}
📱 *Type:* WhatsApp Bot MVP
⚡ *Version:* 1.0.0
🛠️ *Built with:* Node.js & Baileys
👨‍💻 *Status:* Active and running!`,

  about: `📖 *About WhatsApp Bot MVP:*

This is a Minimum Viable Product (MVP) WhatsApp bot that demonstrates core features:

✅ Session Management
✅ Message Receiving & Logging
✅ Auto Replies
✅ Command Handler
✅ Error Handling

Perfect foundation for building more advanced features!`,

  joke: () => {
    const jokes = [
      "Why don't scientists trust atoms? Because they make up everything! 😄",
      "Why did the scarecrow win an award? He was outstanding in his field! 🌾",
      "Why don't eggs tell jokes? They'd crack each other up! 🥚",
      "What do you call a fake noodle? An impasta! 🍝",
      "Why did the math book look so sad? Because it had too many problems! 📚"
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  },

  ping: () => {
    const startTime = Date.now();
    return `🏓 Pong! Response time: ${Date.now() - startTime}ms`;
  }
};

// Utility functions
function logMessage(type, from, message) {
  const timestamp = new Date().toLocaleString();
  const fromName = from.includes('@g.us') ? 'Group' : 'Private';
  console.log(`[${timestamp}] ${type} from ${fromName} (${from}): ${message}`);
}

function isCommand(message) {
  return message.startsWith(config.prefix);
}

function getCommand(message) {
  return message.slice(config.prefix.length).toLowerCase().trim();
}

function findAutoReply(message) {
  const lowerMessage = message.toLowerCase();
  for (const [keyword, reply] of Object.entries(autoReplies)) {
    if (lowerMessage.includes(keyword)) {
      return reply;
    }
  }
  return null;
}

// Main bot function
async function startBot() {
  try {
    // Ensure session directory exists
    if (!fs.existsSync(config.sessionPath)) {
      fs.mkdirSync(config.sessionPath, { recursive: true });
    }

    // Load or create session
    const { state, saveCreds } = await useMultiFileAuthState(config.sessionPath);

    // Create WhatsApp socket
    const sock = makeWASocket({
      auth: state,
      logger,
      printQRInTerminal: false, // We'll handle QR code display manually
      browser: ['WhatsApp Bot MVP', 'Chrome', '1.0.0']
    });

    // Handle QR Code for new sessions
    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        console.log('\n📱 Scan this QR code with your WhatsApp to login:');
        qrcode.generate(qr, { small: true });
        console.log('\n⚠️  QR code expires in 60 seconds. Please scan quickly!\n');
      }

      if (connection === 'close') {
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
        
        console.log('❌ Connection closed due to:', lastDisconnect.error);
        
        if (shouldReconnect) {
          console.log('🔄 Reconnecting...');
          setTimeout(startBot, 3000);
        } else {
          console.log('🚪 Logged out. Please restart the bot.');
          process.exit(0);
        }
      } else if (connection === 'open') {
        console.log('✅ Connected successfully!');
        console.log(`🤖 ${config.botName} is now active and ready!`);
        console.log(`📝 Logs will appear below:\n`);
      }
    });

    // Save credentials when updated
    sock.ev.on('creds.update', saveCreds);

    // Handle incoming messages
    sock.ev.on('messages.upsert', async (messageUpdate) => {
      const message = messageUpdate.messages[0];
      
      if (!message.message) return;
      if (message.key.fromMe) return; // Ignore own messages

      const messageContent = message.message.conversation || 
                           message.message.extendedTextMessage?.text || '';
      
      if (!messageContent) return;

      const from = message.key.remoteJid;
      const isGroup = from.includes('@g.us');

      // Log incoming message
      logMessage('📨 RECEIVED', from, messageContent);

      let replyText = null;

      try {
        // Handle commands
        if (isCommand(messageContent)) {
          const command = getCommand(messageContent);
          
          if (commands[command]) {
            if (typeof commands[command] === 'function') {
              replyText = commands[command]();
            } else {
              replyText = commands[command];
            }
            
            logMessage('⚡ COMMAND', from, `!${command}`);
          } else {
            replyText = `❓ Unknown command: !${command}\n\nType !help to see available commands.`;
          }
        }
        // Handle auto-replies (only if not a command)
        else {
          const autoReply = findAutoReply(messageContent);
          if (autoReply) {
            replyText = autoReply;
            logMessage('🤖 AUTO-REPLY', from, 'Matched keyword');
          }
        }

        // Send reply if we have one
        if (replyText) {
          await sock.sendMessage(from, { text: replyText });
          logMessage('📤 SENT', from, replyText);
        }

      } catch (error) {
        console.error('❌ Error handling message:', error);
        
        // Send error message to user
        try {
          await sock.sendMessage(from, { 
            text: '⚠️ Sorry, I encountered an error processing your message. Please try again.' 
          });
        } catch (sendError) {
          console.error('❌ Error sending error message:', sendError);
        }
      }
    });

    // Handle contact updates
    sock.ev.on('contacts.update', (update) => {
      for (let contact of update) {
        let id = sock.decodeJid(contact.id);
        if (sock.store && sock.store.contacts) {
          sock.store.contacts[id] = { id, name: contact.notify };
        }
      }
    });

    // Handle group updates
    sock.ev.on('groups.update', (updates) => {
      for (let update of updates) {
        logMessage('📢 GROUP UPDATE', update.id, `${update.announce ? 'Announced' : 'Opened'}`);
      }
    });

    return sock;

  } catch (error) {
    console.error('❌ Error starting bot:', error);
    process.exit(1);
  }
}

// Handle process termination gracefully
process.on('SIGINT', () => {
  console.log('\n👋 Bot is shutting down...');
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Banner
console.log(`
╔══════════════════════════════════════╗
║        🤖 WhatsApp Bot MVP           ║
║                                      ║
║   ✅ Session Management              ║
║   ✅ Message Receiving               ║
║   ✅ Auto Replies                    ║
║   ✅ Command Handler                 ║
║   ✅ Logging                         ║
║                                      ║
║   Ready to connect to WhatsApp!     ║
╚══════════════════════════════════════╝
`);

// Start the bot
console.log('🚀 Starting WhatsApp Bot MVP...\n');
startBot();