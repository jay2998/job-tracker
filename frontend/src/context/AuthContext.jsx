import { useEffect, useMemo, useState } from 'react'
import { getApiError, getCurrentUser, loginUser, registerUser, setAuthToken } from '@/lib/api'
import { AuthContext } from '@/context/auth-context'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    getCurrentUser()
      .then((response) => {
        if (!active) return
        setUser(response.data.user)
      })
      .catch(() => {
        if (!active) return
        setAuthToken('')
        setUser(null)
      })
      .finally(() => {
        if (!active) return
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const value = useMemo(() => ({
    user,
    loading,
    async login(form) {
      const response = await loginUser(form)
      setAuthToken(response.data.token)
      setUser(response.data.user)
      return response.data.user
    },
    async register(form) {
      const response = await registerUser(form)
      setAuthToken(response.data.token)
      setUser(response.data.user)
      return response.data.user
    },
    logout() {
      setAuthToken('')
      setUser(null)
    },
    getErrorMessage(error, fallback) {
      return getApiError(error, fallback)
    },
  }), [loading, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
