export function formatDeliveryDate(days) {
  const now = new Date()
  now.setDate(now.getDate() + days)

  if (days === 0) return 'Giao trong hôm nay'

  const weekDays = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']
  const thu = weekDays[now.getDay()]
  const day = now.getDate().toString().padStart(2, '0')
  const month = (now.getMonth() + 1).toString().padStart(2, '0')

  return `Dự kiến giao ${thu}, ${day}/${month}`
}
