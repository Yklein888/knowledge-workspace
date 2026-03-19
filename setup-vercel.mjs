import https from 'https';

const token = 'vcp_3449YnXDxH0ocNHUCkYzQJ99E8AibTCkRKTI9q4SBZciedqey93rH5j5';

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
  console.log('🚀 Setting up Vercel project...\n');

  // List projects
  console.log('📋 Checking existing projects...');
  const projectsResp = await apiCall('/v1/projects?limit=100');
  const projects = projectsResp.data.projects || [];
  let project = projects.find(p => p.name === 'knowledge-workspace');

  if (!project) {
    console.log('Creating new project: knowledge-workspace');
    const createResp = await apiCall('/v1/projects', 'POST', {
      name: 'knowledge-workspace'
    });
    if (createResp.status !== 200 && createResp.status !== 201) {
      throw new Error(`Failed to create project: ${createResp.data.error?.message}`);
    }
    project = createResp.data;
    console.log(`✅ Project created: ${project.id}\n`);
  } else {
    console.log(`✅ Project found: ${project.name} (${project.id})\n`);
  }

  // Set environment variables
  console.log('🔐 Setting environment variables...');
  const envVars = [
    { key: 'NEXT_PUBLIC_SUPABASE_URL', value: 'https://gxkapudasfsreqhcniwq.supabase.co', target: ['production'] },
    { key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4a2FwdWRhc2ZzcmVxaGNuaXdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1Njg5MzMsImV4cCI6MjA4OTE0NDkzM30.YKdcnxbTeCm0-RTQERr07m2RFoHn7dARYPZqTcWXbNs', target: ['production'] },
    { key: 'SUPABASE_SERVICE_ROLE_KEY', value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4a2FwdWRhc2ZzcmVxaGNuaXdxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzU2ODkzMywiZXhwIjoyMDg5MTQ0OTMzfQ.RMMDkB86Ph85s_WtqYUEnYQzuPYdUl7TWorpFU7AphQ', target: ['production'] },
    { key: 'DATABASE_URL', value: 'postgresql://postgres:5380266Jj%40Jj%40@db.gxkapudasfsreqhcniwq.supabase.co:5432/postgres', target: ['production'] }
  ];

  for (const env of envVars) {
    const resp = await apiCall(`/v1/projects/${project.id}/env`, 'POST', env);
    if (resp.status === 200 || resp.status === 201) {
      console.log(`  ✅ ${env.key}`);
    } else {
      console.log(`  ⚠️  ${env.key}: ${resp.data.error?.message || 'failed'}`);
    }
  }

  console.log(`\n✨ Vercel project ready: ${project.id}`);
  console.log(`📍 Project name: knowledge-workspace`);
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
