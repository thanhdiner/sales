import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { userRefreshToken } from '@/services/client/auth/user'
import { setUser } from '@/stores/client/user'
import {
  clearAllClientTokens,
  getClientTokenStorage,
  getStoredClientUser,
  hasStoredClientAccessToken,
  setClientAccessTokenByStorage
} from '@/utils/auth'

const getPreferredClientStorage = () => {
  const tokenStorage = getClientTokenStorage()
  if (tokenStorage) return tokenStorage
  if (sessionStorage.getItem('user')) return 'session'
  return 'local'
}

const persistClientUser = (user, storage) => {
  if (!user) return

  const serializedUser = JSON.stringify(user)

  if (storage === 'session') {
    sessionStorage.setItem('user', serializedUser)
    return
  }

  localStorage.setItem('user', serializedUser)
}

export default function useClientAuthStatus() {
  const dispatch = useDispatch()
  const clientUser = useSelector(state => state.clientUser)
  const hasSyncAuth = Boolean(clientUser?.token || clientUser?.user || hasStoredClientAccessToken())
  const [hasCheckedRefresh, setHasCheckedRefresh] = useState(false)
  const [isChecking, setIsChecking] = useState(() => !hasSyncAuth)
  const [isRefreshAuthenticated, setIsRefreshAuthenticated] = useState(false)

  useEffect(() => {
    let isMounted = true

    if (hasSyncAuth) {
      setIsChecking(false)
      setIsRefreshAuthenticated(false)
      return undefined
    }

    if (hasCheckedRefresh) {
      setIsChecking(false)
      setIsRefreshAuthenticated(false)
      return undefined
    }

    const refreshClientAuth = async () => {
      setIsChecking(true)

      try {
        const res = await userRefreshToken()

        if (!isMounted) return
        if (!res?.clientAccessToken) throw new Error('No client access token')

        const storage = getPreferredClientStorage()
        const nextUser = res.user || getStoredClientUser()

        setClientAccessTokenByStorage(res.clientAccessToken, storage)
        persistClientUser(nextUser, storage)
        dispatch(setUser({ user: nextUser || null, token: res.clientAccessToken }))
        setIsRefreshAuthenticated(true)
      } catch {
        if (!isMounted) return
        clearAllClientTokens()
        dispatch(setUser({ user: null, token: null }))
        setIsRefreshAuthenticated(false)
      } finally {
        if (isMounted) {
          setHasCheckedRefresh(true)
          setIsChecking(false)
        }
      }
    }

    refreshClientAuth()

    return () => {
      isMounted = false
    }
  }, [dispatch, hasCheckedRefresh, hasSyncAuth])

  return {
    isAuthenticated: hasSyncAuth || isRefreshAuthenticated,
    isChecking
  }
}
