const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

dotenv.config();

console.log('--- TRADEX SYSTEM DIAGNOSTICS ---');

// 1. Check Node Version
const version = process.versions.node.split('.')[0];
if (parseInt(version) < 18) {
    console.error('❌ ERROR: Node.js version is too old. Please use Node 18+');
} else {
    console.log('✅ Node.js Version:', process.version);
}

// 2. Check Environment Variables
const requiredVars = ['MONGODB_URI', 'JWT_SECRET', 'PORT'];
requiredVars.forEach(v => {
    if (!process.env[v]) {
        console.error(`❌ ERROR: Missing environment variable: ${v}`);
    }
});

// 3. Validate MongoDB Connection String
const uri = process.env.MONGODB_URI || '';
if (uri.includes('cluster0.mongodb.net') && !process.env.USE_MOCK_DB === 'true') {
    console.log('⚠️  WARNING: Using default Cluster0 URI. Ensure this matches your Atlas settings.');
}

// 4. Test Connectivity
if (process.env.USE_MOCK_DB === 'false' && uri) {
    mongoose.connect(uri)
        .then(() => {
            console.log('✅ Database Connectivity: SUCCESS');
            process.exit(0);
        })
        .catch(err => {
            console.error('❌ ERROR: Database Connection Failed:', err.message);
            process.exit(1);
        });
} else {
    console.log('ℹ️  INFO: Running in Mock Database mode.');
}