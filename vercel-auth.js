#!/usr/bin/env node

/**
 * Vercel CLI Authentication Workaround
 * 
 * This script works around the broken fetch implementation in Vercel CLI 65.16.0
 * by storing the token in the proper Vercel config location.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const os = require('os');

const vercelConfigDir = path.join(os.homedir(), '.vercel');
const tokenFilePath = path.join(vercelConfigDir, '.token');
const projectJsonPath = path.join(process.cwd(), '.vercel', 'project.json');

// Ensure config directory exists
if (!fs.existsSync(vercelConfigDir)) {
  fs.mkdirSync(vercelConfigDir, { recursive: true });
}

function saveToken(token) {
  // Try to save in the format Vercel CLI expects
  fs.writeFileSync(tokenFilePath, token, { mode: 0o600 });
  console.log(`✅ Token saved to ${tokenFilePath}`);
}

function loadToken() {
  try {
    if (fs.existsSync(tokenFilePath)) {
      return fs.readFileSync(tokenFilePath, 'utf-8').trim();
    }
  } catch (e) {
    // ignore
  }
  return null;
}

function verifyToken(token) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.vercel.com',
      path: '/v6/deployments?limit=1',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    }, (res) => {
      if (res.statusCode === 200) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
    req.on('error', () => resolve(false));
    req.end();
  });
}

async function main() {
  const command = process.argv[2];
  const token = process.argv[3] || process.env.VERCEL_TOKEN;

  if (!command) {
    console.log(`
Vercel CLI Authentication Setup

Usage:
  vercel-auth setup <token>     - Store your Vercel token
  vercel-auth status            - Check if token is stored
  vercel-auth remove            - Remove stored token

Your token: https://vercel.com/account/tokens
    `);
    process.exit(0);
  }

  switch (command) {
    case 'setup': {
      if (!token) {
        console.error('❌ Error: Token required');
        console.error('Usage: vercel-auth setup <token>');
        process.exit(1);
      }

      console.log('🔐 Verifying token...');
      const isValid = await verifyToken(token);
      
      if (!isValid) {
        console.error('❌ Token verification failed. Token may be invalid or expired.');
        process.exit(1);
      }

      saveToken(token);
      console.log('✅ Token verified and saved!');
      console.log('You can now use: vercel whoami, vercel deploy, etc.');
      break;
    }

    case 'status': {
      const storedToken = loadToken();
      if (!storedToken) {
        console.log('❌ No token found');
        console.log('Run: vercel-auth setup <token>');
        process.exit(1);
      }

      console.log('🔐 Verifying stored token...');
      const isValid = await verifyToken(storedToken);
      
      if (isValid) {
        console.log('✅ Token is valid and ready to use!');
      } else {
        console.log('❌ Stored token is invalid or expired');
        console.log('Run: vercel-auth setup <new-token>');
        process.exit(1);
      }
      break;
    }

    case 'remove': {
      if (fs.existsSync(tokenFilePath)) {
        fs.unlinkSync(tokenFilePath);
        console.log('✅ Token removed');
      } else {
        console.log('❌ No token found to remove');
      }
      break;
    }

    default:
      console.error(`Unknown command: ${command}`);
      process.exit(1);
  }
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
