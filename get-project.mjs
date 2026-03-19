import https from 'https';
import fs from 'fs';

const token = 'vcp_3449YnXDxH0ocNHUCkYzQJ99E8AibTCkRKTI9q4SBZciedqey93rH5j5';

async function apiCall(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.vercel.com',
      path,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, data: JSON.parse(data) });
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function main() {
  try {
    const resp = await apiCall('/v1/projects?limit=100');
    const project = resp.data.projects.find(p => p.name === 'knowledge-workspace');
    
    if (!project) throw new Error('Project not found');
    
    console.log(`📍 Project ID: ${project.id}`);
    console.log(`👤 Team ID: ${project.teamId}`);
    
    // Save config
    fs.mkdirSync('.vercel', { recursive: true });
    fs.writeFileSync('.vercel/project.json', JSON.stringify({
      projectId: project.id,
      orgId: project.teamId
    }, null, 2));
    
    console.log('✅ .vercel/project.json created');
    
  } catch (e) {
    console.error('❌ Error:', e.message);
    process.exit(1);
  }
}

main();
