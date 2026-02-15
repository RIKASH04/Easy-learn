import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    function applySession(session) {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setProfile(null)
    }

    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    const hasAuthHash = hash && (hash.includes('access_token') || hash.includes('refresh_token'))

    supabase.auth.getSession()
      .then(({ data: { session } }) => applySession(session))
      .catch(() => {
        setUser(null)
        setProfile(null)
      })
      .finally(() => {
        if (!hasAuthHash) setLoading(false)
      })

    // After OAuth redirect: keep loading until we've read session from URL hash (Supabase parses it async)
    let hashTimeout
    if (hasAuthHash) {
      hashTimeout = setTimeout(() => {
        supabase.auth.getSession()
          .then(({ data: { session } }) => {
            if (session) applySession(session)
            setLoading(false)
          })
          .catch(() => setLoading(false))
      }, 300)
    }

    let subscription = { unsubscribe: () => {} }
    try {
      const result = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setUser(session?.user ?? null)
          if (session?.user) {
            try {
              await fetchProfile(session.user.id)
            } catch {
              setProfile(null)
            }
          } else {
            setProfile(null)
          }
        }
      )
      subscription = result?.data?.subscription ?? subscription
    } catch {
      // ignore
    }

    return () => {
      if (hashTimeout) clearTimeout(hashTimeout)
      subscription?.unsubscribe?.()
    }
  }, [])

  async function fetchProfile(userId) {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      setProfile(data)
    } catch {
      setProfile(null)
    }
  }

  async function updateProfile(updates) {
    if (!user) return
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()
    if (!error) setProfile(data)
    return { data, error }
  }

  function setSessionFromAuth(session) {
    setUser(session?.user ?? null)
    if (session?.user) fetchProfile(session.user.id)
    else setProfile(null)
  }

  const value = {
    user,
    profile,
    loading,
    updateProfile,
    refreshProfile: () => user && fetchProfile(user.id),
    setSessionFromAuth,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
