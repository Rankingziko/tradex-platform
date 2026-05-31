// Simple test server to verify TRADEX is working
// Start with: node test-server.js

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.url === '/' || req.url === '/index.html') {
        fs.readFile(path.join(__dirname, 'test.html'), 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading page');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } else if (req.url === '/api/test') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            status: 'ok', 
            message: 'Test server is running!',
            timestamp: new Date().toISOString()
        }));
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
});

server.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════╗
║         TRADEX TEST SERVER RUNNING                     ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║  🌐 Test Page:  http://localhost:${PORT}                  ║
║  🔗 Backend:    http://localhost:5000/api              ║
║  📊 Frontend:   http://localhost:3000                  ║
║                                                        ║
║  This test server verifies TRADEX is online.          ║
║  Open http://localhost:${PORT} in your browser          ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
    `);
});
