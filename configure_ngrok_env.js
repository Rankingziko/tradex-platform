const fs = require('fs');
const path = require('path');

// Get the ngrok URL from command line arguments
const ngrokUrl = process.argv[2];

if (!ngrokUrl) {
    console.error('❌ Error: Please provide your ngrok backend URL.');
    console.log('Usage: node configure_ngrok_env.js https://your-link.ngrok-free.app');
    process.exit(1);
}

const envPath = path.join(__dirname, 'client', '.env');
const envContent = `REACT_APP_API_URL=${ngrokUrl}\n`;

try {
    // Create client directory if it doesn't exist (safety)
    if (!fs.existsSync(path.join(__dirname, 'client'))) {
        fs.mkdirSync(path.join(__dirname, 'client'));
    }

    fs.writeFileSync(envPath, envContent);
    console.log('✅ Success! Frontend configured to use public backend.');
    console.log(`📍 File updated: ${envPath}`);
    console.log(`🔗 API Target: ${ngrokUrl}`);
    console.log('\nNext Steps:');
    console.log('1. Restart your React app (npm start)');
    console.log('2. Run "ngrok http 3000" in a new terminal');
    console.log('3. Share the NEW port 3000 ngrok link with your friends!');
} catch (err) {
    console.error('❌ Failed to update .env file:', err.message);
}