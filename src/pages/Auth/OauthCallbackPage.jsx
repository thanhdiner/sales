import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Spin, message } from 'antd'
import { setUser } from '@/stores/user'
import { setClientAccessToken } from '@/utils/auth'
import { API_URL } from '@/utils/env'
import SEO from '@/components/SEO'
import './AuthTheme.scss'

function getQueryParam(search, key) {
  const params = new URLSearchParams(search)
  return params.get(key)
}

export default function OauthCallbackPage() {
  const { t } = useTranslation('clientAuth')
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    const code = getQueryParam(location.search, 'code')
    if (!code) {
      message.error(t('oauth.missingCode'))
      navigate('/user/login')
      return
    }

    fetch(`${API_URL}/user/oauth-code-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    })
      .then(res => res.json())
      .then(data => {
        if (data.clientAccessToken && data.user) {
          dispatch(setUser({ user: data.user, token: data.clientAccessToken }))
          setClientAccessToken(data.clientAccessToken)
          localStorage.setItem('user', JSON.stringify(data.user))
          message.success(t('oauth.success'))
          navigate('/')
        } else {
          message.error(data.error || t('oauth.failure'))
          navigate('/user/login')
        }
      })
      .catch(() => {
        message.error(t('oauth.genericError'))
        navigate('/user/login')
      })
  }, [location, dispatch, navigate, t])

  return (
    <div className="sovereign-auth-page sovereign-auth-oauth">
      <SEO title={t('oauth.seoTitle')} noIndex />
      <Spin size="large" tip={t('oauth.loading')} />
    </div>
  )
}
