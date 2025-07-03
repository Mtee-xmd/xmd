// Quick error test for MTEE-XMD bot
console.log('🔍 Testing MTEE-XMD Bot for errors...\n');

try {
  // Test settings loading
  console.log('📋 Testing settings.js...');
  require('./settings');
  console.log('✅ Settings loaded successfully');
  
  // Test basic dependencies
  console.log('\n📦 Testing core dependencies...');
  const fs = require('fs');
  const chalk = require('chalk');
  const axios = require('axios');
  console.log('✅ Core dependencies loaded');
  
  // Test Baileys library
  console.log('\n📱 Testing Baileys WhatsApp library...');
  const { makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
  console.log('✅ Baileys library loaded successfully');
  
  // Test database module
  console.log('\n🗄️ Testing database module...');
  const Database = require('./src/database');
  console.log('✅ Database module loaded');
  
  // Test utility functions
  console.log('\n🛠️ Testing utility functions...');
  const { isUrl, generateMessageTag } = require('./lib/function');
  console.log('✅ Utility functions loaded');
  
  // Test message handler
  console.log('\n💬 Testing message handler...');
  const { MessagesUpsert, Solving } = require('./src/message');
  console.log('✅ Message handler loaded');
  
  // Check global configurations
  console.log('\n⚙️ Checking configurations...');
  console.log(`Bot Name: ${global.botname}`);
  console.log(`Owner: ${global.ownername}`);
  console.log(`Prefix: ${global.xprefix}`);
  console.log(`Owner Number: ${global.ownernumber}`);
  
  console.log('\n🎉 All tests passed! Bot should start without errors.');
  
} catch (error) {
  console.error('\n❌ Error detected:', error.message);
  console.error('\n📍 Stack trace:', error.stack);
  process.exit(1);
}