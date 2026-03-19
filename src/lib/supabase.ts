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
    async signUp(...args: any[]) {
      return initSupabase().auth.signUp(...args)
    },
    async signInWithPassword(...args: any[]) {
      return initSupabase().auth.signInWithPassword(...args)
    },
    async signOut(...args: any[]) {
      return initSupabase().auth.signOut(...args)
    },
  },
  from: (...args: any[]) => initSupabase().from(...args),
  rpc: (...args: any[]) => initSupabase().rpc(...args),
} as any

export const supabaseAdmin = {
  auth: {
    async signUp(...args: any[]) {
      return initSupabaseAdmin().auth.signUp(...args)
    },
    async signInWithPassword(...args: any[]) {
      return initSupabaseAdmin().auth.signInWithPassword(...args)
    },
    async signOut(...args: any[]) {
      return initSupabaseAdmin().auth.signOut(...args)
    },
  },
  from: (...args: any[]) => initSupabaseAdmin().from(...args),
  rpc: (...args: any[]) => initSupabaseAdmin().rpc(...args),
} as any
