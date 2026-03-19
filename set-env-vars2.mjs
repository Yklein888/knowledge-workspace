import https from 'https';

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

async function setEnv(key, value) {
  // Without type specification
  const resp = await apiCall(`/v1/projects/${projectId}/env`, 'POST', {
    key,
    value,
    target: ['production', 'preview', 'development']
  });

  return resp;
}

async function main() {
  console.log('🔐 Setting Vercel environment variables...\n');

  const vars = [
    ['NEXT_PUBLIC_SUPABASE_URL', 'https://gxkapudasfsreqhcniwq.supabase.co'],
    ['NEXT_PUBLIC_SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4a2FwdWRhc2ZzcmVxaGNuaXdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1Njg5MzMsImV4cCI6MjA4OTE0NDkzM30.YKdcnxbTeCm0-RTQERr07m2RFoHn7dARYPZqTcWXbNs'],
    ['SUPABASE_SERVICE_ROLE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4a2FwdWRhc2ZzcmVxaGNuaXdxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzU2ODkzMywiZXhwIjoyMDg5MTQ0OTMzfQ.RMMDkB86Ph85s_WtqYUEnYQzuPYdUl7TWorpFU7AphQ'],
    ['DATABASE_URL', 'postgresql://postgres:5380266Jj%40Jj%40@db.gxkapudasfsreqhcniwq.supabase.co:5432/postgres']
  ];

  for (const [key, value] of vars) {
    const resp = await setEnv(key, value);
    if (resp.status === 200 || resp.status === 201) {
      console.log(`✅ ${key}`);
    } else {
      console.log(`⚠️  ${key}: ${resp.data?.error?.message || `status ${resp.status}`}`);
      console.log(`   Response: ${JSON.stringify(resp.data)}`);
    }
  }

  console.log('\n✨ Environment variables configured!');
}

main().catch(err => console.error('❌ Error:', err.message));
