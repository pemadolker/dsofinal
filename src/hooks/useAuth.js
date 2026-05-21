import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'

export function useAuth() {
  const [user, setUser]       = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user)
      else setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user)
      else { setProfile(null); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (u) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', u.id)
      .single()

    if (data) {
      setProfile(data)
    } else {
      // Auto-create profile on first login
      const name = u.user_metadata?.full_name || u.email?.split('@')[0] || 'Writer'
      const newProfile = {
        id:           u.id,
        full_name:    name,
        username:     name.toLowerCase().replace(/\s+/g, '_') + '_' + u.id.slice(0, 4),
        bio:          '',
        avatar_emoji: '🌸',
      }
      await supabase.from('profiles').insert([newProfile])
      setProfile(newProfile)
    }
    setLoading(false)
  }

  const signInWithGoogle = () =>
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })

  const signInWithEmail = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  const signUpWithEmail = (email, password) =>
    supabase.auth.signUp({ email, password })

  const signOut = () => supabase.auth.signOut()

  const updateProfile = async (updates) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()
    if (!error) setProfile(data)
    return { data, error }
  }

  return { user, profile, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut, updateProfile }
}
