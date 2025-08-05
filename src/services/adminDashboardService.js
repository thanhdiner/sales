import { get } from '@/utils/request'

export const getAdminDashboard = (range = '7days') => get(`admin/dashboard?range=${range}`)
