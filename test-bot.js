// Test script to verify bot setup
require('./settings');
const chalk = require('chalk');

console.log(chalk.green('🚀 Testing XLICON-V4-MD Bot Setup...'));

// Test basic configurations
console.log(chalk.blue('📋 Bot Configuration:'));
console.log(`Bot Name: ${global.botname}`);
console.log(`Owner: ${global.ownername}`);
console.log(`Prefix: ${global.xprefix}`);
console.log(`Owner Number: ${global.ownernumber}`);

// Test dependencies
console.log(chalk.blue('\n📦 Testing Dependencies:'));

try {
  const baileys = require('@whiskeysockets/baileys');
  console.log(chalk.green('✅ Baileys library loaded successfully'));
} catch (error) {
  console.log(chalk.red('❌ Baileys library failed to load:', error.message));
}

try {
  const axios = require('axios');
  console.log(chalk.green('✅ Axios loaded successfully'));
} catch (error) {
  console.log(chalk.red('❌ Axios failed to load:', error.message));
}

try {
  const fs = require('fs');
  console.log(chalk.green('✅ File system module loaded'));
} catch (error) {
  console.log(chalk.red('❌ File system module failed:', error.message));
}

// Test database module
try {
  const Database = require('./src/database');
  console.log(chalk.green('✅ Database module loaded successfully'));
} catch (error) {
  console.log(chalk.red('❌ Database module failed to load:', error.message));
}

// Test lib functions
try {
  const { isUrl, generateMessageTag } = require('./lib/function');
  console.log(chalk.green('✅ Utility functions loaded successfully'));
} catch (error) {
  console.log(chalk.red('❌ Utility functions failed to load:', error.message));
}

console.log(chalk.yellow('\n⚡ Bot setup test completed!'));
console.log(chalk.yellow('📝 To start the bot with WhatsApp connection, run: npm start'));
console.log(chalk.yellow('📖 Check WHATSAPP_BOT_GUIDE.md for detailed instructions'));