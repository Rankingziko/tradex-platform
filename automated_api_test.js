const http = require('http');

const CONFIG = {
    backendUrl: 'http://localhost:5000',
    endpoints: [
        { name: 'System Health', path: '/api/health' },
        { name: 'Market Data', path: '/api/markets' }
    ]
};

async function testEndpoint(endpoint) {
    return new Promise((resolve) => {
        console.log(`Testing ${endpoint.name} (${endpoint.path})...`);
        
        http.get(`${CONFIG.backendUrl}${endpoint.path}`, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log(`✅ ${endpoint.name}: SUCCESS (200 OK)`);
                    try {
                        const json = JSON.parse(data);
                        console.log(`   Response Data:`, json);
                    } catch (e) {
                        console.log(`   Response is not JSON but successful.`);
                    }
                } else {
                    console.log(`❌ ${endpoint.name}: FAILED (Status: ${res.statusCode})`);
                }
                resolve();
            });
        }).on('error', (err) => {
            console.log(`❌ ${endpoint.name}: UNREACHABLE. Is the server running on port 5000?`);
            resolve();
        });
    });
}

async function runTests() {
    console.log('--- TRADEX BACKEND VERIFICATION ---');
    console.log(`Target: ${CONFIG.backendUrl}\n`);

    for (const endpoint of CONFIG.endpoints) {
        await testEndpoint(endpoint);
        console.log('-----------------------------------');
    }

    console.log('\nNext Steps:');
    console.log('1. Ensure MongoDB is running (Check MONGODB_SETUP_AND_TEST.md)');
    console.log('2. If Health check passed, proceed to http://localhost:3000/login');
}

runTests();