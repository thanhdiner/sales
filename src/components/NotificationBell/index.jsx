import { useState, useEffect, useRef } from 'react'
import { Bell, Package, X, CheckCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const MAX_NOTIFICATIONS = 20

export default function NotificationBell({ onNewOrder }) {
  const [notifications, setNotifications] = useState([])
  const [open, setOpen] = useState(false)
  const [hasNew, setHasNew] = useState(false)
  const panelRef = useRef(null)
  const navigate = useNavigate()

  // Nhận notification từ parent (AdminLayout truyền xuống)
  useEffect(() => {
    if (!onNewOrder) return
    const handler = order => {
      const notif = {
        id: order._id,
        title: 'Đơn hàng mới!',
        body: `${order.contact?.firstName || ''} ${order.contact?.lastName || ''} — ${order.total?.toLocaleString('vi-VN')}₫`,
        time: new Date(),
        read: false,
        orderId: order._id
      }
      setNotifications(prev => [notif, ...prev].slice(0, MAX_NOTIFICATIONS))
      setHasNew(true)

      // Browser notification nếu được cấp quyền
      if (Notification.permission === 'granted') {
        new Notification('SmartMall — Đơn hàng mới 🛒', { body: notif.body, icon: '/favicon.ico' })
      }
    }
    onNewOrder(handler)
  }, [onNewOrder])

  // Click outside để đóng
  useEffect(() => {
    const handle = e => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  // Xin quyền browser notification
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setHasNew(false)
  }

  const handleClickNotif = notif => {
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n))
    setOpen(false)
    navigate(`/admin/orders/${notif.orderId}`)
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => { setOpen(o => !o); setHasNew(false) }}
        className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        title="Thông báo"
      >
        <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-bounce">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
        {hasNew && unreadCount === 0 && (
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <span className="font-bold text-gray-800 dark:text-gray-100">Thông báo</span>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" /> Đọc tất cả
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-700">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <Bell className="w-10 h-10 mb-2 opacity-30" />
                <span className="text-sm">Chưa có thông báo nào</span>
              </div>
            ) : (
              notifications.map(notif => (
                <button
                  key={notif.id + notif.time}
                  onClick={() => handleClickNotif(notif)}
                  className={`w-full text-left px-4 py-3 flex gap-3 items-start hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    !notif.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${notif.read ? 'bg-gray-100 dark:bg-gray-700' : 'bg-blue-100 dark:bg-blue-800'}`}>
                    <Package className={`w-4 h-4 ${notif.read ? 'text-gray-500' : 'text-blue-600 dark:text-blue-300'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${notif.read ? 'text-gray-700 dark:text-gray-300' : 'text-blue-800 dark:text-blue-200'}`}>
                      {notif.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{notif.body}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {notif.time.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {!notif.read && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
