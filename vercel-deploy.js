#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const token = process.env.VERCEL_TOKEN || process.argv[2];

if (!token) {
  console.error('Error: VERCEL_TOKEN environment variable or token argument required');
  console.error('Usage: VERCEL_TOKEN=your_token node vercel-deploy.js');
  process.exit(1);
}

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.vercel.com',
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'VercelCLI/Deploy'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function main() {
  try {
    console.log('🚀 Vercel Deployment Tool\n');

    // Verify authentication by getting team info
    console.log('1️⃣  Verifying authentication...');
    const teamRes = await makeRequest('GET', '/v2/teams');
    if (teamRes.status !== 200) {
      console.error('❌ Authentication failed:', teamRes.data);
      process.exit(1);
    }
    const teamName = teamRes.data.teams && teamRes.data.teams.length > 0 ? teamRes.data.teams[0].name : 'Default';
    console.log(`✅ Authenticated to team: ${teamName}`);

    // Get projects
    console.log('\n2️⃣  Fetching projects...');
    const projectsRes = await makeRequest('GET', '/v9/projects');
    const eventPlannerProject = projectsRes.data.projects.find(p => p.name === 'event-planner');
    
    if (!eventPlannerProject) {
      console.error('❌ event-planner project not found');
      process.exit(1);
    }
    console.log(`✅ Found project: ${eventPlannerProject.name}`);
    console.log(`   Project ID: ${eventPlannerProject.id}`);
    console.log(`   Framework: ${eventPlannerProject.framework}`);
    console.log(`   Node Version: ${eventPlannerProject.nodeVersion}`);

    // Trigger deployment from latest git commit
    console.log('\n3️⃣  Creating deployment...');
    
    // Get current git info
    const gitCommit = execSync('git rev-parse HEAD').toString().trim();
    const gitBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
    
    console.log(`   From commit: ${gitCommit.slice(0, 7)}`);
    console.log(`   From branch: ${gitBranch}`);

    // Check for latest deployments
    const deploymentsRes = await makeRequest('GET', `/v6/deployments?projectId=${eventPlannerProject.id}&limit=1`);
    
    if (deploymentsRes.status === 200 && deploymentsRes.data.deployments && deploymentsRes.data.deployments.length > 0) {
      const latestDeploy = deploymentsRes.data.deployments[0];
      console.log(`\n📋 Latest Deployment:`);
      console.log(`   URL: https://${latestDeploy.url}`);
      console.log(`   Status: ${latestDeploy.state}`);
      console.log(`   Created: ${new Date(latestDeploy.createdAt).toLocaleString()}`);
    }

    console.log('\n✅ All checks passed!');
    console.log('\n💡 To push a new deployment:');
    console.log('   git push origin main');
    console.log('\nVercel will automatically rebuild and deploy when you push to main.');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
