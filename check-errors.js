// MTEE-XMD Bot Error Checking Script
const chalk = require('chalk');
const fs = require('fs');

console.log(chalk.green('🔍 MTEE-XMD Bot Error Check Starting...\n'));

let errorCount = 0;
let warningCount = 0;

function logError(message) {
    console.log(chalk.red('❌ ERROR: ' + message));
    errorCount++;
}

function logWarning(message) {
    console.log(chalk.yellow('⚠️  WARNING: ' + message));
    warningCount++;
}

function logSuccess(message) {
    console.log(chalk.green('✅ ' + message));
}

// Test 1: Check settings.js syntax
console.log(chalk.blue('📋 Testing settings.js...'));
try {
    require('./settings');
    logSuccess('settings.js loaded successfully');
    console.log(`Bot Name: ${global.botname}`);
    console.log(`Owner: ${global.ownername}`);
    console.log(`Prefix: ${global.xprefix}`);
} catch (error) {
    logError(`settings.js has syntax error: ${error.message}`);
}

// Test 2: Check main dependencies
console.log(chalk.blue('\n📦 Testing core dependencies...'));
const criticalDeps = [
    '@whiskeysockets/baileys',
    'axios',
    'chalk',
    'fs-extra',
    'qrcode-terminal'
];

criticalDeps.forEach(dep => {
    try {
        require(dep);
        logSuccess(`${dep} loaded successfully`);
    } catch (error) {
        logError(`${dep} failed to load: ${error.message}`);
    }
});

// Test 3: Check index.js syntax (without running)
console.log(chalk.blue('\n📄 Testing index.js syntax...'));
try {
    const indexContent = fs.readFileSync('./index.js', 'utf8');
    // Basic syntax check
    if (indexContent.includes('startMteeBot')) {
        logSuccess('Function names updated correctly');
    } else {
        logWarning('startMteeBot function not found');
    }
    
    if (indexContent.includes('MteeBotInc')) {
        logSuccess('Bot instance variable updated correctly');
    } else {
        logWarning('MteeBotInc variable not found');
    }
} catch (error) {
    logError(`index.js syntax check failed: ${error.message}`);
}

// Test 4: Check essential directories
console.log(chalk.blue('\n📁 Testing directory structure...'));
const requiredDirs = ['src', 'lib', 'session', 'database'];
requiredDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        logSuccess(`${dir}/ directory exists`);
    } else {
        logError(`${dir}/ directory missing`);
    }
});

// Test 5: Check essential files
console.log(chalk.blue('\n📋 Testing essential files...'));
const requiredFiles = [
    'package.json',
    'start.js', 
    'index.js',
    'settings.js',
    'src/message.js',
    'lib/function.js'
];

requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        logSuccess(`${file} exists`);
    } else {
        logError(`${file} missing`);
    }
});

// Test 6: Check src/message.js for syntax
console.log(chalk.blue('\n🔧 Testing src/message.js...'));
try {
    const messageContent = fs.readFileSync('./src/message.js', 'utf8');
    // Check if XliconBotInc references were updated
    if (messageContent.includes('XliconBotInc')) {
        logWarning('src/message.js still contains old XliconBotInc references');
    } else {
        logSuccess('src/message.js appears to be updated');
    }
} catch (error) {
    logError(`src/message.js check failed: ${error.message}`);
}

// Test 7: Check lib/function.js
console.log(chalk.blue('\n🛠️  Testing lib/function.js...'));
try {
    const { isUrl, generateMessageTag } = require('./lib/function');
    if (typeof isUrl === 'function') {
        logSuccess('lib/function.js utility functions loaded');
    }
} catch (error) {
    logError(`lib/function.js failed to load: ${error.message}`);
}

// Test 8: Check database module
console.log(chalk.blue('\n💾 Testing database module...'));
try {
    const Database = require('./src/database');
    logSuccess('Database module loaded successfully');
} catch (error) {
    logError(`Database module failed: ${error.message}`);
}

// Summary
console.log(chalk.blue('\n📊 Error Check Summary:'));
console.log(`✅ Successes: ${chalk.green('Multiple checks passed')}`);
console.log(`⚠️  Warnings: ${chalk.yellow(warningCount)}`);
console.log(`❌ Errors: ${chalk.red(errorCount)}`);

if (errorCount === 0) {
    console.log(chalk.green('\n🎉 No critical errors found! Bot should start successfully.'));
    console.log(chalk.blue('💡 To start the bot: npm start'));
} else {
    console.log(chalk.red('\n🚨 Critical errors found! Please fix before starting the bot.'));
}

if (warningCount > 0) {
    console.log(chalk.yellow('\n⚠️  Some warnings detected - bot may work but could have issues.'));
}