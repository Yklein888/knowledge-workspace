import https from 'https';
import fs from 'fs';

const token = 'vcp_3449YnXDxH0ocNHUCkYzQJ99E8AibTCkRKTI9q4SBZciedqey93rH5j5';

async function apiCall(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.vercel.com',
      path,
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function main() {
  try {
    console.log('🔍 Checking for existing project...\n');
    const projectsResp = await apiCall('GET', '/v1/projects?limit=100');
    const projects = projectsResp.data.projects || [];
    let project = projects.find(p => p.name === 'knowledge-workspace');

    if (project) {
      console.log(`✅ Found project: ${project.name}`);
      console.log(`📍 Project ID: ${project.id}\n`);
    } else {
      console.log('❌ Project not found. Creating new one...\n');
      const createResp = await apiCall('POST', '/v1/projects', {
        name: 'knowledge-workspace'
      });
      if (createResp.status !== 201 && createResp.status !== 200) {
        throw new Error(`Failed to create project: ${createResp.data.error?.message}`);
      }
      project = createResp.data;
      console.log(`✅ Project created: ${project.name}`);
      console.log(`📍 Project ID: ${project.id}\n`);
    }

    // Save project info
    fs.mkdirSync('.vercel', { recursive: true });
    fs.writeFileSync('.vercel/project.json', JSON.stringify({
      projectId: project.id,
      orgId: project.teamId || 'team_EhK4h2IyfDxnzjTlvbSauZz6'
    }, null, 2));
    
    console.log('✅ Project configured locally\n');
    console.log(`Ready to deploy! Run: vercel deploy --prod\n`);

  } catch (e) {
    console.error('❌ Error:', e.message);
    process.exit(1);
  }
}

main();
