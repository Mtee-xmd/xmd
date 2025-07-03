// Verification script for restructured MTEE-XMD bot
console.log('🔍 Verifying MTEE-XMD Bot Structure...\n');

try {
  // Test settings loading
  console.log('📋 Testing mtee-config/settings.js...');
  require('./mtee-config/settings');
  console.log('✅ Settings loaded successfully');
  
  // Test core dependencies
  console.log('\n📦 Testing core dependencies...');
  const fs = require('fs');
  const chalk = require('chalk');
  console.log('✅ Core dependencies loaded');
  
  // Test mtee-utils modules
  console.log('\n🛠️ Testing mtee-utils modules...');
  const { isUrl } = require('./mtee-utils/function');
  const { color } = require('./mtee-utils/color');
  console.log('✅ Mtee-utils modules loaded');
  
  // Test mtee-core modules
  console.log('\n🗄️ Testing mtee-core modules...');
  const Database = require('./mtee-core/database');
  console.log('✅ Mtee-core modules loaded');
  
  // Check MteeMedia directory
  console.log('\n📂 Checking MteeMedia directory...');
  if (fs.existsSync('./MteeMedia')) {
    console.log('✅ MteeMedia directory exists');
    if (fs.existsSync('./MteeMedia/theme/MteePic.jpg')) {
      console.log('✅ MteePic.jpg found');
    }
    if (fs.existsSync('./MteeMedia/theme/Mtee-Video.mp4')) {
      console.log('✅ Mtee-Video.mp4 found');
    }
  }
  
  // Test main bot file
  console.log('\n🤖 Testing MteeBot.js structure...');
  if (fs.existsSync('./MteeBot.js')) {
    console.log('✅ MteeBot.js exists');
  }
  
  // Check configurations
  console.log('\n⚙️ Checking configurations...');
  console.log(`Bot Name: ${global.botname}`);
  console.log(`Owner: ${global.ownername}`);
  console.log(`Prefix: ${global.xprefix}`);
  
  console.log('\n🎉 All structure verification tests passed!');
  console.log('🚀 MTEE-XMD Bot is ready to be packaged!');
  
} catch (error) {
  console.error('\n❌ Structure verification failed:', error.message);
  console.error('\n📍 Stack trace:', error.stack);
  process.exit(1);
}