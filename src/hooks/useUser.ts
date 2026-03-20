'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    supabase.auth.getUser().then((result: any) => {
      setUser(result?.data?.user ?? null)
      setLoading(false)
    })

    // Subscribe to auth state changes
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: { subscription } } = (supabase.auth as any).onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading }
}
