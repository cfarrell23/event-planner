#!/usr/bin/env node

const https = require('https');

const token = process.env.VERCEL_TOKEN || process.argv[2];
const projectId = 'prj_x7WuK1j1YUSBp6U1Y4sRGE0EsKHV';

if (!token) {
  console.error('Error: VERCEL_TOKEN environment variable or token argument required');
  console.error('Usage: VERCEL_TOKEN=your_token node check-deployment.js');
  process.exit(1);
}

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.vercel.com',
      path: path,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function main() {
  console.log('🚀 Vercel Deployment Status\n');

  try {
    const result = await makeRequest(`/v6/deployments?projectId=${projectId}&limit=5`);
    
    if (result.status !== 200) {
      console.error('❌ Failed to fetch deployments:', result.data);
      process.exit(1);
    }

    if (!result.data.deployments || result.data.deployments.length === 0) {
      console.log('No deployments found');
      process.exit(1);
    }

    console.log('📋 Recent Deployments:\n');
    result.data.deployments.forEach((deployment, index) => {
      const isLatest = index === 0 ? ' ⭐ (Latest)' : '';
      console.log(`${index + 1}${isLatest}`);
      console.log(`   URL: https://${deployment.url}`);
      console.log(`   Status: ${deployment.state}`);
      console.log(`   Created: ${new Date(deployment.createdAt).toLocaleString()}`);
      if (deployment.meta?.githubCommitSha) {
        console.log(`   Commit: ${deployment.meta.githubCommitSha.slice(0, 7)}`);
      }
      if (deployment.meta?.githubCommitMessage) {
        console.log(`   Message: ${deployment.meta.githubCommitMessage.split('\n')[0]}`);
      }
      console.log();
    });

    console.log('✅ Deployment status retrieved successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
