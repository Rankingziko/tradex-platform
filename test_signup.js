#!/usr/bin/env node

/**
 * Sign Up Testing Script
 * Tests the registration and login flow
 */

const fetch = require('node-fetch');

const API_URL = 'http://localhost:5000/api';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  test: (msg) => console.log(`\n${colors.cyan}${msg}${colors.reset}`),
};

async function testSignUp() {
  log.test('=== SIGN UP FUNCTIONALITY TESTS ===\n');

  // Test 1: Valid Registration
  log.info('Test 1: Valid User Registration');
  try {
    const email = `test${Date.now()}@example.com`;
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Test',
        lastName: 'User',
        email: email,
        password: 'TestPass123',
        confirmPassword: 'TestPass123',
      }),
    });

    const data = await response.json();
    if (response.ok && data.token && data.user) {
      log.success(`Registration successful for ${email}`);
      log.success(`Token generated: ${data.token.substring(0, 20)}...`);
      return data.token; // Return token for login test
    } else {
      log.error(`Registration failed: ${data.error || 'Unknown error'}`);
      return null;
    }
  } catch (err) {
    log.error(`Test 1 failed: ${err.message}`);
    return null;
  }

  // Test 2: Duplicate Email
  log.info('\nTest 2: Duplicate Email Rejection');
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Test',
        lastName: 'User',
        email: 'demo@tradex.com', // Already exists
        password: 'TestPass123',
        confirmPassword: 'TestPass123',
      }),
    });

    const data = await response.json();
    if (!response.ok && data.error && data.error.includes('already')) {
      log.success('Duplicate email correctly rejected');
    } else {
      log.error('Duplicate email should have been rejected');
    }
  } catch (err) {
    log.error(`Test 2 failed: ${err.message}`);
  }

  // Test 3: Weak Password
  log.info('\nTest 3: Weak Password Rejection');
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Test',
        lastName: 'User',
        email: `weak${Date.now()}@example.com`,
        password: 'weak',
        confirmPassword: 'weak',
      }),
    });

    const data = await response.json();
    if (!response.ok && data.error) {
      log.success(`Weak password correctly rejected: ${data.error}`);
    } else {
      log.error('Weak password should have been rejected');
    }
  } catch (err) {
    log.error(`Test 3 failed: ${err.message}`);
  }

  // Test 4: Password Mismatch
  log.info('\nTest 4: Password Mismatch Rejection');
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Test',
        lastName: 'User',
        email: `mismatch${Date.now()}@example.com`,
        password: 'Match123',
        confirmPassword: 'NoMatch123',
      }),
    });

    const data = await response.json();
    if (!response.ok && data.error && data.error.includes('not match')) {
      log.success('Password mismatch correctly detected');
    } else {
      log.error('Password mismatch should have been detected');
    }
  } catch (err) {
    log.error(`Test 4 failed: ${err.message}`);
  }

  // Test 5: Demo Login
  log.info('\nTest 5: Login with Demo Account');
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'demo@tradex.com',
        password: 'demo123',
      }),
    });

    const data = await response.json();
    if (response.ok && data.token && data.user) {
      log.success(`Login successful for demo user`);
      log.success(`User: ${data.user.firstName} ${data.user.lastName}`);
      log.success(`Token: ${data.token.substring(0, 20)}...`);
      
      // Test 6: Get Current User with Token
      log.info('\nTest 6: Get Current User Info');
      try {
        const meResponse = await fetch(`${API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${data.token}`,
          },
        });

        const meData = await meResponse.json();
        if (meResponse.ok) {
          log.success('Current user info retrieved');
          log.success(`Balance: $${meData.user?.balance || meData.balance || 0}`);
        } else {
          log.error(`Failed to get current user: ${meData.error}`);
        }
      } catch (err) {
        log.error(`Test 6 failed: ${err.message}`);
      }
    } else {
      log.error(`Login failed: ${data.error || 'Unknown error'}`);
    }
  } catch (err) {
    log.error(`Test 5 failed: ${err.message}`);
  }

  log.test('\n=== TESTS COMPLETE ===');
  console.log('\nSign up and login functionality is working correctly! 🎉');
}

// Run tests
testSignUp().catch(err => {
  log.error(`Tests failed: ${err.message}`);
  process.exit(1);
});
