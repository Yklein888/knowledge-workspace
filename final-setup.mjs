import https from 'https';

const token = 'vcp_3449YnXDxH0ocNHUCkYzQJ99E8AibTCkRKTI9q4SBZciedqey93rH5j5';
const projectId = 'prj_zZq61uQ2b4bm5iDZWU9KR0yTBupu';
const teamId = 'team_EhK4h2IyfDxnzjTlvbSauZz6';

async function httpRequest(method, path, body = null) {
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
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function setEnvVar(key, value) {
  // First, delete if exists
  await httpRequest('DELETE', `/v1/projects/${projectId}/env/${key}`).catch(() => {});

  // Then create
  const response = await httpRequest('POST', `/v1/projects/${projectId}/env`, {
    key: key,
    value: value,
    target: ['production', 'preview', 'development']
  });

  return response;
}

async function main() {
  console.log('🔐 Setting Vercel environment variables...\n');

  const envVars = {
    'NEXT_PUBLIC_SUPABASE_URL': 'https://gxkapudasfsreqhcniwq.supabase.co',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4a2FwdWRhc2ZzcmVxaGNuaXdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1Njg5MzMsImV4cCI6MjA4OTE0NDkzM30.YKdcnxbTeCm0-RTQERr07m2RFoHn7dARYPZqTcWXbNs',
    'SUPABASE_SERVICE_ROLE_KEY': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4a2FwdWRhc2ZzcmVxaGNuaXdxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzU2ODkzMywiZXhwIjoyMDg5MTQ0OTMzfQ.RMMDkB86Ph85s_WtqYUEnYQzuPYdUl7TWorpFU7AphQ',
    'DATABASE_URL': 'postgresql://postgres:5380266Jj%40Jj%40@db.gxkapudasfsreqhcniwq.supabase.co:5432/postgres'
  };

  let successCount = 0;

  for (const [key, value] of Object.entries(envVars)) {
    try {
      const res = await setEnvVar(key, value);
      if (res.status === 200 || res.status === 201) {
        console.log(`✅ ${key}`);
        successCount++;
      } else {
        console.log(`⚠️  ${key}: status ${res.status}`);
        if (res.body?.error?.message) {
          console.log(`   ${res.body.error.message}`);
        }
      }
    } catch (e) {
      console.log(`❌ ${key}: ${e.message}`);
    }
  }

  console.log(`\n${successCount}/4 environment variables set`);

  if (successCount === 4) {
    console.log('\n✨ Now triggering redeploy...');
    
    // Trigger rebuild
    const redeploy = await httpRequest('POST', `/v1/projects/${projectId}/redeploy`);
    if (redeploy.status === 200 || redeploy.status === 201) {
      console.log('✅ Redeploy triggered!');
      console.log('\n🚀 Your app is now deploying to:');
      console.log('📍 https://knowledge-workspace-cqf38kof2-yklein89-3235s-projects.vercel.app');
    } else {
      console.log('⚠️  Redeploy may need manual trigger');
    }
  }
}

main().catch(err => {
  console.error('❌ Fatal error:', err.message);
  process.exit(1);
});
