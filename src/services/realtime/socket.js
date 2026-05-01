import { io } from 'socket.io-client'
import { SOCKET_URL as DEFAULT_SOCKET_URL } from '@/utils/env'

const SOCKET_URL = DEFAULT_SOCKET_URL

let socket = null
let currentRole = null
let currentUserId = null

const emitJoin = () => {
  if (!socket) return

  socket.emit('join', {
    role: currentRole,
    userId: currentUserId
  })
}

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      autoConnect: false,
      reconnection: true,
      reconnectionDelay: 2000,
      reconnectionAttempts: 10
    })

    socket.on('connect', emitJoin)
  }

  return socket
}

export const connectSocket = ({ role, userId } = {}) => {
  const s = getSocket()

  if (role) currentRole = role
  if (userId) currentUserId = userId

  if (!s.connected) {
    s.connect()
  } else {
    emitJoin()
  }

  return s
}

export const disconnectSocket = () => {
  if (socket?.connected) {
    socket.disconnect()
  }
}

export const joinRoom = ({ role, userId } = {}) => {
  getSocket()

  if (role) currentRole = role
  if (userId) currentUserId = userId

  if (socket?.connected) {
    emitJoin()
  }
}
