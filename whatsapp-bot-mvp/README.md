# 🤖 WhatsApp Bot MVP

A **Minimum Viable Product (MVP)** WhatsApp bot built with Node.js and Baileys. This bot focuses on core features only, making it perfect for learning or as a foundation for more advanced bots.

## ✨ Features

- ✅ **Session Management** - QR Code login with persistent sessions
- ✅ **Message Receiving** - Listen and log all incoming messages  
- ✅ **Auto Replies** - Respond to keywords automatically
- ✅ **Command Handler** - Support for prefix-based commands
- ✅ **Logging** - Console logging for all bot activities
- ✅ **Error Handling** - Graceful error handling and recovery

## 🚀 Quick Start

### Prerequisites

- Node.js v16 or higher
- A phone with WhatsApp installed
- Internet connection

### Installation

1. **Clone or download this MVP:**
   ```bash
   # If you have the files, navigate to the directory
   cd whatsapp-bot-mvp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment (optional):**
   ```bash
   cp .env.example .env
   # Edit .env with your preferred settings
   ```

4. **Start the bot:**
   ```bash
   npm start
   ```

5. **Scan QR Code:**
   - A QR code will appear in your terminal
   - Open WhatsApp on your phone
   - Go to Settings > Linked Devices > Link a Device
   - Scan the QR code

6. **Bot is ready!** 🎉

## 📱 Usage Examples

### Commands

Send these commands to your bot:

```
!help     - Show available commands
!info     - Bot information  
!joke     - Get a random joke
!ping     - Test bot response
!about    - About this bot
```

### Auto Replies

The bot automatically responds to these keywords:

```
hello     → "Hi there! I'm your WhatsApp assistant 🤖"
hi        → "Hello! How can I help you today? 😊"
thanks    → "You're welcome! 😊"
good morning → "Good morning! Hope you have a great day! ☀️"
```

### Example Conversation

```
User: hello
Bot:  Hi there! I'm your WhatsApp assistant 🤖

User: !help
Bot:  📋 Available Commands:
      🔹 !help - Show this help menu
      🔹 !info - Bot information
      🔹 !joke - Get a random joke
      🔹 !ping - Check bot response time
      🔹 !about - About this bot
      
      💡 Auto Replies: Try saying hello, hi, thanks, etc.

User: !joke
Bot:  Why don't scientists trust atoms? Because they make up everything! 😄
```

## 📁 Project Structure

```
whatsapp-bot-mvp/
├── bot.js              # Main bot file
├── package.json        # Dependencies and scripts
├── .env.example        # Environment template
├── README.md          # This file
└── session/           # WhatsApp session data (auto-created)
```

## ⚙️ Configuration

### Environment Variables (.env)

```env
OWNER_NUMBER=1234567890     # Your WhatsApp number (optional)
BOT_NAME="WhatsApp Bot MVP" # Bot display name
COMMAND_PREFIX="!"          # Command prefix
SESSION_PATH="./session"    # Session storage path
```

### Customizing Responses

Edit the `autoReplies` object in `bot.js`:

```javascript
const autoReplies = {
  'hello': 'Hi there! I\'m your WhatsApp assistant 🤖',
  'price': 'Please check our website for current pricing.',
  'support': 'For support, please contact admin@example.com'
  // Add more auto-replies here
};
```

### Adding Commands

Add new commands to the `commands` object in `bot.js`:

```javascript
const commands = {
  // Existing commands...
  
  time: () => {
    return `🕐 Current time: ${new Date().toLocaleString()}`;
  },
  
  weather: 'Check weather at: https://weather.com'
};
```

## 🔧 Troubleshooting

### Common Issues

**QR Code not appearing:**
- Make sure your terminal supports QR code display
- Try running in a different terminal

**Connection failed:**
- Check your internet connection
- Make sure WhatsApp Web is not already connected on another device
- Try deleting the `session` folder and re-scanning

**Bot not responding:**
- Check console for error messages
- Verify the bot is showing as "online" in WhatsApp
- Make sure you're sending messages from a different phone

**Session expired:**
- Delete the `session` folder
- Restart the bot and scan QR code again

### Logs

The bot logs all activities to the console:

```
[12/25/2023, 10:30:15 AM] 📨 RECEIVED from Private (+1234567890@s.whatsapp.net): hello
[12/25/2023, 10:30:15 AM] 🤖 AUTO-REPLY from Private (+1234567890@s.whatsapp.net): Matched keyword
[12/25/2023, 10:30:16 AM] 📤 SENT from Private (+1234567890@s.whatsapp.net): Hi there! I'm your WhatsApp assistant 🤖
```

## 🛠️ Development

### Tech Stack
- **Node.js** - JavaScript runtime
- **@whiskeysockets/baileys** - WhatsApp Web API
- **qrcode-terminal** - QR code display
- **pino** - Logging
- **dotenv** - Environment variables

### Code Structure

The bot is organized into clear sections:

1. **Configuration** - Bot settings and responses
2. **Utility Functions** - Helper functions for message processing
3. **Main Bot Function** - Core WhatsApp connection logic
4. **Event Handlers** - Message processing and responses

## 🔄 Extending the Bot

This MVP provides a solid foundation. Here's how to add features:

### Adding Database Storage
```javascript
// Install: npm install lowdb
import { Low, JSONFile } from 'lowdb'

const adapter = new JSONFile('db.json')
const db = new Low(adapter)
```

### Adding Media Support
```javascript
// Handle image messages
if (message.message.imageMessage) {
  const media = await downloadMediaMessage(message, 'buffer');
  // Process image...
}
```

### Adding Group Management
```javascript
// Group-specific commands
if (isGroup && command === 'groupinfo') {
  const groupMetadata = await sock.groupMetadata(from);
  // Send group information...
}
```

## 📝 License

MIT License - feel free to use this code for any purpose.

## 🤝 Contributing

This is an MVP focused on simplicity. For feature requests or improvements:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 💡 MVP Goals Achieved

✅ **Connect to WhatsApp reliably** - QR code login with auto-reconnection  
✅ **Respond to basic user messages** - Auto-replies and commands  
✅ **Avoid crashes** - Comprehensive error handling  
✅ **Foundation for growth** - Clean, extensible code structure  

---

**Ready to build something amazing?** Start with this MVP and add features as you need them! 🚀