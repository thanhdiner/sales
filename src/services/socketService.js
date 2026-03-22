import { io } from 'socket.io-client'

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001'

let socket = null

export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      autoConnect: false,
      reconnection: true,
      reconnectionDelay: 2000,
      reconnectionAttempts: 5
    })
  }
  return socket
}

export function connectSocket({ role, userId } = {}) {
  const s = getSocket()
  if (!s.connected) s.connect()
  s.on('connect', () => {
    s.emit('join', { role, userId })
  })
  // Nếu đã connected thì join luôn
  if (s.connected) s.emit('join', { role, userId })
  return s
}

export function disconnectSocket() {
  if (socket && socket.connected) {
    socket.disconnect()
  }
}
