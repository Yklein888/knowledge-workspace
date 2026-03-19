import { createClient } from '@supabase/supabase-js'

let _supabase: ReturnType<typeof createClient> | null = null
let _supabaseAdmin: ReturnType<typeof createClient> | null = null

// Lazy initialization - safe for build time
function initSupabase() {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) throw new Error('Supabase URL and anon key are required')
    _supabase = createClient(url, key)
  }
  return _supabase
}

function initSupabaseAdmin() {
  if (!_supabaseAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) throw new Error('Supabase URL and service key are required')
    _supabaseAdmin = createClient(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }
  return _supabaseAdmin
}

// Export objects that call init functions when methods are accessed
export const supabase = {
  auth: {
    // @ts-ignore-next-line - spreading args with dynamic types
    signUp: (...args: any[]) => initSupabase().auth.signUp(...args),
    // @ts-ignore-next-line - spreading args with dynamic types
    signInWithPassword: (...args: any[]) => initSupabase().auth.signInWithPassword(...args),
    // @ts-ignore-next-line - spreading args with dynamic types
    signOut: (...args: any[]) => initSupabase().auth.signOut(...args),
  },
  // @ts-ignore-next-line - spreading args with dynamic types
  from: (...args: any[]) => initSupabase().from(...args),
  // @ts-ignore-next-line - spreading args with dynamic types
  rpc: (...args: any[]) => initSupabase().rpc(...args),
} as any

export const supabaseAdmin = {
  auth: {
    // @ts-ignore-next-line - spreading args with dynamic types
    signUp: (...args: any[]) => initSupabaseAdmin().auth.signUp(...args),
    // @ts-ignore-next-line - spreading args with dynamic types
    signInWithPassword: (...args: any[]) => initSupabaseAdmin().auth.signInWithPassword(...args),
    // @ts-ignore-next-line - spreading args with dynamic types
    signOut: (...args: any[]) => initSupabaseAdmin().auth.signOut(...args),
  },
  // @ts-ignore-next-line - spreading args with dynamic types
  from: (...args: any[]) => initSupabaseAdmin().from(...args),
  // @ts-ignore-next-line - spreading args with dynamic types
  rpc: (...args: any[]) => initSupabaseAdmin().rpc(...args),
} as any
