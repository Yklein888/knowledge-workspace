import https from 'https';
import fs from 'fs';

const token = 'vcp_3449YnXDxH0ocNHUCkYzQJ99E8AibTCkRKTI9q4SBZciedqey93rH5j5';
const projectId = 'prj_zZq61uQ2b4bm5iDZWU9KR0yTBupu';

async function apiCall(path, method = 'GET', body = null) {
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
        resolve({ status: res.statusCode, data: data ? JSON.parse(data) : null });
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function main() {
  console.log('📦 Deploying to Vercel...\n');

  // Trigger production deployment
  const resp = await apiCall(`/v1/projects/${projectId}/deployments`, 'POST', {
    name: 'knowledge-workspace',
    target: 'production',
    source: 'cli'
  });

  if (resp.status === 200 || resp.status === 201) {
    const deployment = resp.data;
    console.log(`✅ Deployment initiated: ${deployment.id}`);
    console.log(`📍 Project: ${deployment.meta?.githubRepo || projectId}`);
    console.log(`🔗 URL: https://${deployment.alias?.[0] || deployment.url}`);
    console.log(`\n⏳ Deployment in progress...`);
  } else {
    console.log(`❌ Deployment failed: ${resp.data?.error?.message || resp.status}`);
    console.log(JSON.stringify(resp.data, null, 2));
  }
}

main().catch(err => console.error('❌ Error:', err.message));
