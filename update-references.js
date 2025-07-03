const fs = require('fs');
const path = require('path');

// Function to update file content
function updateFileContent(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Update all XliconMedia paths to MteeMedia
        content = content.replace(/XliconMedia/g, 'MteeMedia');
        
        // Update variable names
        content = content.replace(/VoiceNoteXlicon/g, 'VoiceNoteMtee');
        content = content.replace(/StickerXlicon/g, 'StickerMtee');
        content = content.replace(/ImageXlicon/g, 'ImageMtee');
        content = content.replace(/VideoXlicon/g, 'VideoMtee');
        content = content.replace(/DocXlicon/g, 'DocMtee');
        content = content.replace(/ZipXlicon/g, 'ZipMtee');
        content = content.replace(/ApkXlicon/g, 'ApkMtee');
        
        // Update specific file references
        content = content.replace(/XliconPic\.jpg/g, 'MteePic.jpg');
        content = content.replace(/Xlicon-Video\.mp4/g, 'Mtee-Video.mp4');
        content = content.replace(/XliconStikRep/g, 'MteeStikRep');
        content = content.replace(/XliconWlcm/g, 'MteeWlcm');
        content = content.replace(/XliconLft/g, 'MteeLft');
        content = content.replace(/BhosdikaXlicon/g, 'BhosdikaMtee');
        
        // Update database file names
        content = content.replace(/xliconvn\.json/g, 'mteevn.json');
        content = content.replace(/xliconsticker\.json/g, 'mteesticker.json');
        content = content.replace(/xliconimage\.json/g, 'mteeimage.json');
        content = content.replace(/xliconvideo\.json/g, 'mteevideo.json');
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated: ${filePath}`);
        
    } catch (error) {
        console.error(`❌ Error updating ${filePath}:`, error.message);
    }
}

// Files to update
const filesToUpdate = [
    'XliconV4.js',
    'src/message.js',
    'lib/ytdl.js',
    'lib/tts.js',
    'lib/function.js'
];

console.log('🔄 Updating XliconMedia references to MteeMedia...\n');

filesToUpdate.forEach(file => {
    if (fs.existsSync(file)) {
        updateFileContent(file);
    } else {
        console.log(`⚠️  File not found: ${file}`);
    }
});

console.log('\n🎉 Reference update completed!');