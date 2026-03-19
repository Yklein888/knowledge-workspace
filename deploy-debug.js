const { execSync } = require('child_process');
const fs = require('fs');

console.log('=== DEBUG DEPLOYMENT ===');
console.log('');

// Get git info
console.log('Current commit:', execSync('git rev-parse --short HEAD').toString().trim());
console.log('Current branch:', execSync('git rev-parse --abbrev-ref HEAD').toString().trim());
console.log('');

// Check file size
console.log('Project size:');
const size = execSync('du -sh .').toString().split('\t')[0];
console.log(`Total: ${size}`);
console.log('');

// List important files
console.log('Key files:');
['package.json', 'next.config.ts', 'vercel.json', 'tsconfig.json', '.env.local'].forEach(f => {
  const exists = fs.existsSync(f) ? '✓' : '✗';
  console.log(`  ${exists} ${f}`);
});
console.log('');

// Check env vars
console.log('Environment variables set:');
console.log(`NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓' : '✗'}`);
console.log(`NEXT_PUBLIC_SUPABASE_ANON_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓' : '✗'}`);
console.log('');

// Try deployment with full output
console.log('Attempting deployment with verbose output...');
try {
  execSync('vercel deploy --prod --force --debug 2>&1 | tee deploy.log', { stdio: 'inherit' });
} catch(e) {
  console.log('Deployment command exited with error (expected)');
}

// Check logs
if (fs.existsSync('deploy.log')) {
  const log = fs.readFileSync('deploy.log', 'utf8');
  const errorLines = log.split('\n').filter(l => l.includes('error') || l.includes('Error') || l.includes('ERROR'));
  console.log('');
  console.log('Error lines found in log:');
  errorLines.forEach(l => console.log('  ' + l));
}
