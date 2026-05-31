const os = require('os');

function getLocalIp() {
    const interfaces = os.networkInterfaces();
    for (const devName in interfaces) {
        const iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            const alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return '0.0.0.0';
}

const ip = getLocalIp();

console.log('\n🚀 TRADEX SHARING LINKS 🚀');
console.log('-------------------------------------------');
console.log(`🏠 LOCAL NETWORK (Same WiFi):`);
console.log(`   Frontend: http://${ip}:3000`);
console.log(`   Backend:  http://${ip}:5000`);
console.log('-------------------------------------------');
console.log(`🌍 PUBLIC INTERNET:`);
console.log(`   1. Terminal A: ngrok http 5000`);
console.log(`   2. Terminal B: ngrok http 3000`);
console.log(`   3. Terminal C: node ngrok_auto_config.js`);
console.log(`   4. Restart your servers and share the link!`);
console.log('-------------------------------------------');
console.log('Note: Ensure your Firewall allows traffic on ports 3000 and 5000.\n');