import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gxkapudasfsreqhcniwq.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4a2FwdWRhc2ZzcmVxaGNuaXdxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzU2ODkzMywiZXhwIjoyMDg5MTQ0OTMzfQ.RMMDkB86Ph85s_WtqYUEnYQzuPYdUl7TWorpFU7AphQ';

const supabase = createClient(supabaseUrl, serviceRoleKey);

console.log('🔍 Testing Supabase connection...');
setTimeout(() => {
  console.log('⏱️  Timeout - Supabase database might still be initializing');
  process.exit(1);
}, 5000);

try {
  const { data, error } = await supabase.rpc('now');
  if (error) throw error;
  console.log('✅ Supabase connection successful!');
  process.exit(0);
} catch (e) {
  console.error('❌ Connection failed:', e.message);
  process.exit(1);
}
