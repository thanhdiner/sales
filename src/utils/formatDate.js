export const formatDate = d => (d ? new Date(d).toLocaleString('vi-VN', { hour12: false }) : '—')
