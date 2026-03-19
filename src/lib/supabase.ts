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
    // @ts-ignore-next-line
    signUp: (...args: any[]) => initSupabase().auth.signUp(...args),
    // @ts-ignore-next-line
    signInWithPassword: (...args: any[]) => initSupabase().auth.signInWithPassword(...args),
    // @ts-ignore-next-line
    signInWithOAuth: (...args: any[]) => initSupabase().auth.signInWithOAuth(...args),
    // @ts-ignore-next-line
    signOut: (...args: any[]) => initSupabase().auth.signOut(...args),
    // @ts-ignore-next-line
    getUser: (...args: any[]) => initSupabase().auth.getUser(...args),
    // @ts-ignore-next-line
    getSession: (...args: any[]) => initSupabase().auth.getSession(...args),
    // @ts-ignore-next-line
    onAuthStateChange: (...args: any[]) => initSupabase().auth.onAuthStateChange(...args),
    // @ts-ignore-next-line
    resetPasswordForEmail: (...args: any[]) => initSupabase().auth.resetPasswordForEmail(...args),
    // @ts-ignore-next-line
    updateUser: (...args: any[]) => initSupabase().auth.updateUser(...args),
    // @ts-ignore-next-line
    exchangeCodeForSession: (...args: any[]) => initSupabase().auth.exchangeCodeForSession(...args),
  },
  // @ts-ignore-next-line
  from: (...args: any[]) => initSupabase().from(...args),
  // @ts-ignore-next-line
  rpc: (...args: any[]) => initSupabase().rpc(...args),
} as any

export const supabaseAdmin = {
  auth: {
    // @ts-ignore-next-line
    admin: {
      // @ts-ignore-next-line
      createUser: (...args: any[]) => initSupabaseAdmin().auth.admin.createUser(...args),
      // @ts-ignore-next-line
      updateUserById: (...args: any[]) => initSupabaseAdmin().auth.admin.updateUserById(...args),
      // @ts-ignore-next-line
      deleteUser: (...args: any[]) => initSupabaseAdmin().auth.admin.deleteUser(...args),
      // @ts-ignore-next-line
      listUsers: (...args: any[]) => initSupabaseAdmin().auth.admin.listUsers(...args),
    },
    // @ts-ignore-next-line
    getUser: (...args: any[]) => initSupabaseAdmin().auth.getUser(...args),
  },
  // @ts-ignore-next-line
  from: (...args: any[]) => initSupabaseAdmin().from(...args),
  // @ts-ignore-next-line
  rpc: (...args: any[]) => initSupabaseAdmin().rpc(...args),
} as any
