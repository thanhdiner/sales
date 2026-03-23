import { io } from 'socket.io-client'

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001'

let socket = null
let currentRole = null
let currentUserId = null

export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      autoConnect: false,
      reconnection: true,
      reconnectionDelay: 2000,
      reconnectionAttempts: 10
    })
  }
  return socket
}

// Gọi mỗi khi biết role/userId — idempotent: không duplicate listener
export function connectSocket({ role, userId } = {}) {
  const s = getSocket()

  // Lưu lại thông tin để re-join sau reconnect
  if (role) currentRole = role
  if (userId) currentUserId = userId

  // Đảm bảo chỉ có 1 listener 'connect' cho mục đích join
  s.off('connect_join') // không dùng named event nhưng dùng flag approach
  s.off('connect')

  s.on('connect', () => {
    s.emit('join', { role: currentRole, userId: currentUserId })
  })

  if (!s.connected) {
    s.connect()
  } else {
    // Đã connected → join ngay
    s.emit('join', { role: currentRole, userId: currentUserId })
  }

  return s
}

export function disconnectSocket() {
  if (socket && socket.connected) {
    socket.disconnect()
  }
}

// Chỉ update role mà không reconnect (dùng khi đã connected)
export function joinRoom({ role, userId } = {}) {
  const s = getSocket()
  if (role) currentRole = role
  if (userId) currentUserId = userId
  if (s.connected) {
    s.emit('join', { role: currentRole, userId: currentUserId })
  }
}
