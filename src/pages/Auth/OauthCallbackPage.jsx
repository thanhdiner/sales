import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUser } from '@/stores/user'
import { Spin, message } from 'antd'
import { setClientAccessToken } from '@/utils/auth'
import SEO from '@/components/SEO'

function getQueryParam(search, key) {
  const params = new URLSearchParams(search)
  return params.get(key)
}

export default function OauthCallbackPage() {const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    const code = getQueryParam(location.search, 'code')
    if (!code) {
      message.error('Không tìm thấy mã code đăng nhập!')
      navigate('/user/login')
      return
    }
    fetch(`${process.env.REACT_APP_API_URL}/user/oauth-code-login`, {
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
          message.success('Đăng nhập Google thành công!')
          navigate('/')
        } else {
          message.error(data.error || 'Đăng nhập Google thất bại!')
          navigate('/user/login')
        }
      })
      .catch(() => {
        message.error('Có lỗi xảy ra!')
        navigate('/user/login')
      })
  }, [location, dispatch, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <SEO title="Đang xác thực..." noIndex />
            <Spin size="large" tip="Đang đăng nhập..." />
    </div>
  )
}
