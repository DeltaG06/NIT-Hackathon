import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, name: string, college: string, year?: string, department?: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (
    email: string,
    password: string,
    name: string,
    college: string,
    year?: string,
    department?: string
  ) => {
    // Simple password validation - just check minimum length
    if (!password || password.length < 3) {
      return { error: { message: 'Passkey must be at least 3 characters' } }
    }

    // Create auth user - disable email confirmation to avoid rate limits
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined,
        data: {
          name,
          college,
        },
      },
    })

    if (authError) {
      // Provide more helpful error messages
      let errorMessage = authError.message
      if (authError.message?.toLowerCase().includes('rate limit') || 
          authError.message?.toLowerCase().includes('email rate limit')) {
        errorMessage = 'Email rate limit exceeded. Please wait a few minutes before trying again.'
      }
      return { error: { ...authError, message: errorMessage } }
    }

    if (authData.user) {
      // Immediately insert into users table
      const { error: userError } = await supabase.from('users').insert({
        id: authData.user.id,
        email,
        name,
        college,
        year,
        department,
      })

      if (userError) {
        return { error: userError }
      }
    }

    return { error: null }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

