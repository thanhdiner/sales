import React from 'react'
import { CircleDollarSign, PackagePlus, ShieldCheck, UserPlus } from 'lucide-react'
import { formatCurrency } from '../utils/dashboardTransforms'

export const extractClock = value => {
  if (!value) return '--:--'
  return String(value).match(/\d{1,2}:\d{2}/)?.[0] || '--:--'
}

export const clampPercent = value => Math.max(0, Math.min(100, Number(value) || 0))

export const percentOf = (value, target) => clampPercent(((Number(value) || 0) / target) * 100)

export const formatNumber = (value, locale) => (Number(value) || 0).toLocaleString(locale)

export function buildOverviewRows(statsData, t, locale) {
  return [
    {
      label: t('charts.rows.customers'),
      value: `${formatNumber(statsData.totalUsers.value, locale)}/1000`,
      percent: percentOf(statsData.totalUsers.value, 1000)
    },
    {
      label: t('charts.rows.orders'),
      value: `${formatNumber(statsData.order.all.total, locale)}/1000`,
      percent: percentOf(statsData.order.all.total, 1000)
    },
    {
      label: t('charts.rows.revenue'),
      value: formatCurrency(statsData.totalRevenue.value, locale),
      percent: clampPercent(statsData.totalRevenue.change)
    },
    {
      label: t('charts.rows.profit'),
      value: formatCurrency(statsData.profit.value, locale),
      percent: clampPercent(statsData.profit.change)
    },
    {
      label: t('charts.rows.products'),
      value: `${formatNumber(statsData.product.total, locale)}/1000`,
      percent: percentOf(statsData.product.total, 1000)
    },
    {
      label: t('charts.rows.categories'),
      value: `${formatNumber(statsData.category.total, locale)}/100`,
      percent: percentOf(statsData.category.total, 100)
    }
  ]
}

export function buildFunnelItems(statsData, t, locale) {
  const funnel = statsData.conversionFunnel || {}
  const rawItems = [
    { key: 'visitors', label: t('charts.funnel.visitors'), count: Number(funnel.visitors) || 0 },
    { key: 'productViews', label: t('charts.funnel.productViews'), count: Number(funnel.productViews) || 0 },
    { key: 'addToCart', label: t('charts.funnel.addToCart'), count: Number(funnel.addToCart) || 0 },
    { key: 'orders', label: t('charts.funnel.orders'), count: Number(funnel.orders) || 0 },
    { key: 'completed', label: t('charts.funnel.completed'), count: Number(funnel.completed) || 0 }
  ]
  const maxValue = Math.max(...rawItems.map(item => item.count), 1)

  return rawItems.map(item => ({
    ...item,
    value: formatNumber(item.count, locale),
    percent: clampPercent((item.count / maxValue) * 100)
  }))
}

export function buildActivityItems(statsData, recentOrders, t, locale) {
  const latestOrderTime = extractClock(recentOrders?.[0]?.time)

  return [
    {
      title: t('charts.activity.newOrders'),
      detail: t('charts.activity.newThisWeek', {
        count: formatNumber(statsData.order.all.new.current, locale)
      }),
      time: latestOrderTime,
      icon: <ShieldCheck size={18} />,
      tone: 'green'
    },
    {
      title: t('charts.activity.newCustomers'),
      detail: t('charts.activity.newThisWeek', {
        count: formatNumber(statsData.totalUsers.new.current, locale)
      }),
      time: '09:15',
      icon: <UserPlus size={18} />,
      tone: 'blue'
    },
    {
      title: t('charts.activity.newProducts'),
      detail: t('charts.activity.newThisWeek', {
        count: formatNumber(statsData.product.new.current, locale)
      }),
      time: '08:42',
      icon: <PackagePlus size={18} />,
      tone: 'purple'
    },
    {
      title: t('charts.activity.todayRevenue'),
      detail: formatCurrency(statsData.totalRevenue.value, locale),
      time: '00:01',
      icon: <CircleDollarSign size={18} />,
      tone: 'green'
    }
  ]
}
