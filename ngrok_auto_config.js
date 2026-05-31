const http = require('http');
const fs = require('fs');
const path = require('path');

/**
 * TRADEX - NGROK AUTO-CONFIGURATOR
 * This script automatically detects running ngrok tunnels and 
 * updates .env files for both Frontend and Backend.
 */

async function getNgrokTunnels() {
    return new Promise((resolve, reject) => {
        http.get('http://127.0.0.1:4040/api/tunnels', (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve(parsed.tunnels || []);
                } catch (e) {
                    reject('Could not parse ngrok API response. Is ngrok running?');
                }
            });
        }).on('error', (err) => {
            reject('ngrok local API not found. Start your tunnels first!');
        });
    });
}

function updateEnv(envPath, key, value) {
    let content = '';
    if (fs.existsSync(envPath)) {
        content = fs.readFileSync(envPath, 'utf8');
        const regex = new RegExp(`^${key}=.*`, 'm');
        if (content.match(regex)) {
            content = content.replace(regex, `${key}=${value}`);
        } else {
            content += `\n${key}=${value}`;
        }
    } else {
        content = `${key}=${value}\n`;
    }
    fs.writeFileSync(envPath, content);
    console.log(`✅ Updated ${key} in ${envPath}`);
}

async function main() {
    console.log('🔍 Detecting ngrok tunnels...\n');
    try {
        const tunnels = await getNgrokTunnels();
        const backendTunnel = tunnels.find(t => t.config.addr.includes(':5000'));
        const frontendTunnel = tunnels.find(t => t.config.addr.includes(':3000'));

        if (!backendTunnel) {
            console.log('❌ Error: No tunnel found for port 5000 (Backend). Run: ngrok http 5000');
        } else {
            // Update Frontend config to use Public Backend
            updateEnv(path.join(__dirname, 'client', '.env'), 'REACT_APP_API_URL', backendTunnel.public_url);
        }

        if (!frontendTunnel) {
            console.log('❌ Error: No tunnel found for port 3000 (Frontend). Run: ngrok http 3000');
        } else {
            // Update Backend config to allow Public Frontend (CORS)
            updateEnv(path.join(__dirname, '.env'), 'CLIENT_URL', frontendTunnel.public_url);
        }

        if (backendTunnel && frontendTunnel) {
            console.log('\n🚀 TRADEX IS NOW PUBLICLY CONFIGURED!');
            console.log(`🌎 Public Website: ${frontendTunnel.public_url}`);
            console.log(`📡 Public API:     ${backendTunnel.public_url}`);
            console.log('\n⚠️  FINAL STEP: Please restart your Backend and Frontend servers.');
        }
    } catch (err) {
        console.error(`❌ ${err}`);
    }
}

main();