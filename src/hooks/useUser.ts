import { useEffect, useState } from 'react'
import { getCurrentUser } from '@/lib/auth'
import type { User } from '@supabase/supabase-js'

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUser() {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch (err) {
        // User not logged in
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return { user, loading }
}
