# 🔧 Adding New Commands to MTEE-XMD Bot

## 📋 **How Commands Work**

In your `index.js` file, commands are handled in a **switch statement** around line 120. Here's the structure:

```javascript
switch (command) {
    case 'menu':
        // Menu command code
        break;
    
    case 'ping':
        // Ping command code
        break;
    
    // Add new commands here!
    
    default:
        // Unknown command response
        break;
}
```

---

## ➕ **Adding a Simple Command**

### **Step 1: Find the Switch Statement**
Open your `index.js` file and find this line:
```javascript
switch (command) {
```

### **Step 2: Add Your Command**
Add your new command **before** the `default:` case:

```javascript
case 'hello':
    reply(`👋 Hello ${msg.pushName || 'User'}! Welcome to ${global.botname}!`);
    break;

case 'time':
    const now = new Date();
    reply(`🕐 Current time: ${now.toLocaleString()}`);
    break;
```

### **Step 3: Update the Menu**
Find the `case 'menu':` section and add your new commands to the list:

```javascript
📱 *General Commands:*
${global.prefix}menu - Show this menu
${global.prefix}ping - Check bot speed
${global.prefix}hello - Say hello
${global.prefix}time - Current time
```

---

## 🎯 **Command Examples**

### **1. Simple Text Response**
```javascript
case 'about':
    reply(`ℹ️ *About ${global.botname}*\n\nA powerful WhatsApp bot with amazing features!\n\nDeveloped by: ${global.ownername}\nVersion: 4.0\nPrefix: ${global.prefix}`);
    break;
```

### **2. API-Based Command**
```javascript
case 'weather':
    if (!text) return reply('Please provide a city name!\nExample: .weather London');
    
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=YOUR_API_KEY&units=metric`);
        const weather = response.data;
        
        reply(`🌤️ *Weather in ${weather.name}*\n\n🌡️ Temperature: ${weather.main.temp}°C\n💨 Wind: ${weather.wind.speed} m/s\n☁️ Description: ${weather.weather[0].description}`);
    } catch (error) {
        reply('Weather data not found for that city!');
    }
    break;
```

### **3. Group-Only Command**
```javascript
case 'groupinfo':
    if (!isGroup) return reply('This command is only for groups!');
    
    const groupInfo = await sock.groupMetadata(from);
    reply(`👥 *Group Information*\n\n📛 Name: ${groupInfo.subject}\n👤 Members: ${groupInfo.participants.length}\n📅 Created: ${new Date(groupInfo.creation * 1000).toDateString()}\n📝 Description: ${groupInfo.desc || 'No description'}`);
    break;
```

### **4. Owner-Only Command**
```javascript
case 'restart':
    // Check if sender is owner
    if (!global.ownernumber.includes(sender.split('@')[0])) {
        return reply('❌ This command is only for the bot owner!');
    }
    
    reply('🔄 Restarting bot...');
    process.exit(1); // This will trigger auto-restart
    break;
```

### **5. Media Processing Command**
```javascript
case 'blur':
    if (!msg.message.imageMessage && !quoted?.imageMessage) {
        return reply('Please reply to an image to blur it!');
    }
    
    reply('🔄 Processing image...');
    
    try {
        // Get the image
        const mediaMsg = msg.message.imageMessage || quoted.imageMessage;
        const stream = await downloadContentFromMessage(mediaMsg, 'image');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }
        
        // Process with Jimp (you need to add jimp to dependencies)
        const Jimp = require('jimp');
        const image = await Jimp.read(buffer);
        const blurred = await image.blur(5).getBufferAsync(Jimp.MIME_JPEG);
        
        await sock.sendMessage(from, {
            image: blurred,
            caption: '🌫️ Blurred image!'
        }, { quoted: msg });
        
    } catch (error) {
        reply('Error processing image!');
    }
    break;
```

### **6. Database/Storage Command**
```javascript
case 'note':
    if (!text) return reply('Usage: .note [your note]\nExample: .note Remember to buy milk');
    
    // Simple file-based storage
    const notesFile = './user_notes.json';
    let notes = {};
    
    if (fs.existsSync(notesFile)) {
        notes = JSON.parse(fs.readFileSync(notesFile));
    }
    
    if (!notes[sender]) notes[sender] = [];
    notes[sender].push({
        note: text,
        date: new Date().toISOString()
    });
    
    fs.writeFileSync(notesFile, JSON.stringify(notes, null, 2));
    reply(`📝 Note saved! You have ${notes[sender].length} notes total.`);
    break;

case 'mynotes':
    const notesFile2 = './user_notes.json';
    if (!fs.existsSync(notesFile2)) return reply('No notes found!');
    
    const allNotes = JSON.parse(fs.readFileSync(notesFile2));
    const userNotes = allNotes[sender] || [];
    
    if (userNotes.length === 0) return reply('You have no notes!');
    
    let notesList = `📝 *Your Notes*\n\n`;
    userNotes.forEach((note, index) => {
        notesList += `${index + 1}. ${note.note}\n`;
    });
    
    reply(notesList);
    break;
```

---

## 🎨 **Advanced Command Features**

### **1. Commands with Arguments**
```javascript
case 'calculate':
    if (!text) return reply('Usage: .calculate [expression]\nExample: .calculate 2 + 2');
    
    try {
        const math = require('mathjs');
        const result = math.evaluate(text);
        reply(`🧮 *Calculator*\n\n📊 ${text} = ${result}`);
    } catch (error) {
        reply('Invalid mathematical expression!');
    }
    break;
```

### **2. Commands with Multiple Sub-commands**
```javascript
case 'admin':
    const subCommand = args[0]?.toLowerCase();
    
    switch (subCommand) {
        case 'kick':
            // Kick user logic
            break;
        case 'promote':
            // Promote user logic
            break;
        case 'demote':
            // Demote user logic
            break;
        default:
            reply('Admin commands: kick, promote, demote\nUsage: .admin kick @user');
    }
    break;
```

---

## 📁 **Organizing Many Commands**

### **Option 1: Categories in Switch**
```javascript
// Fun commands
case 'joke':
case 'meme':
case 'quote':
    // Handle fun commands
    break;

// Utility commands  
case 'qr':
case 'shorten':
case 'password':
    // Handle utility commands
    break;
```

### **Option 2: External Command Files**
Create separate files for command categories:

**commands/fun.js:**
```javascript
module.exports = {
    joke: async (sock, msg, reply, text) => {
        // Joke command logic
    },
    meme: async (sock, msg, reply, text) => {
        // Meme command logic
    }
};
```

**In index.js:**
```javascript
const funCommands = require('./commands/fun');

// In your switch statement:
case 'joke':
    await funCommands.joke(sock, msg, reply, text);
    break;
```

---

## ✅ **Best Practices**

### **1. Always Add Error Handling**
```javascript
case 'mycommand':
    try {
        // Your command logic
    } catch (error) {
        console.error('Command error:', error);
        reply('Something went wrong!');
    }
    break;
```

### **2. Validate Input**
```javascript
case 'download':
    if (!text) return reply('Please provide a URL!');
    if (!text.includes('youtube.com')) return reply('Only YouTube URLs supported!');
    
    // Continue with command
    break;
```

### **3. Add Help Text**
```javascript
case 'translate':
    if (!text) {
        return reply(`📚 *Translate Command*\n\nUsage: ${global.prefix}translate [lang] [text]\nExample: ${global.prefix}translate es Hello world\n\nSupported languages: en, es, fr, de, it, pt`);
    }
    
    // Translation logic
    break;
```

### **4. Rate Limiting (Optional)**
```javascript
const userCooldowns = new Map();

case 'heavy-command':
    const userId = sender;
    const cooldownTime = 30000; // 30 seconds
    
    if (userCooldowns.has(userId)) {
        const timeLeft = (userCooldowns.get(userId) + cooldownTime) - Date.now();
        if (timeLeft > 0) {
            return reply(`⏳ Please wait ${Math.ceil(timeLeft/1000)} seconds before using this command again.`);
        }
    }
    
    userCooldowns.set(userId, Date.now());
    
    // Command logic
    break;
```

---

## 🔄 **Testing New Commands**

### **1. Local Testing**
1. Add your command to `index.js`
2. Run `npm start`
3. Test the command in WhatsApp
4. Check console for errors

### **2. Error Debugging**
```javascript
case 'test':
    console.log('Command triggered');
    console.log('Text:', text);
    console.log('Args:', args);
    reply('Test successful!');
    break;
```

---

## 📦 **Adding Dependencies**

If your command needs new packages:

1. **Install the package:**
   ```bash
   npm install package-name
   ```

2. **Add to package.json dependencies:**
   ```json
   "new-package": "^1.0.0"
   ```

3. **Import in index.js:**
   ```javascript
   const newPackage = require('new-package');
   ```

---

## 🎯 **Command Ideas to Add**

### **Easy Commands:**
- `.uptime` - Show bot uptime
- `.repo` - Show GitHub repository
- `.support` - Support information
- `.donate` - Donation links

### **Medium Commands:**
- `.qr [text]` - Generate QR codes
- `.shorten [url]` - URL shortener
- `.password` - Generate random passwords
- `.base64 [text]` - Encode/decode base64

### **Advanced Commands:**
- `.ai [question]` - ChatGPT integration
- `.image [prompt]` - AI image generation
- `.voice [text]` - Text to speech
- `.translate [lang] [text]` - Translation

---

## 🚀 **Deployment After Adding Commands**

1. **Update your GitHub repository**
2. **Redeploy on Heroku/Railway**
3. **Test new commands**
4. **Update README.md** with new command list

---

**Adding commands is easy! Just follow the patterns above and your bot will grow more powerful! 🎉**