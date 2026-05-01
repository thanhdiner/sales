import React from 'react'
import { Skeleton } from 'antd'
import { useTranslation } from 'react-i18next'
import {
  CircleDollarSign,
  Grid3X3,
  Package,
  ShieldCheck,
  ShoppingCart,
  UsersRound
} from 'lucide-react'
import StatCard from './StatCard'

export default function Stats({ loading, statsData }) {
  const { t } = useTranslation('adminDashboard')
  const labels = {
    active: t('stats.subInfo.active'),
    inactive: t('stats.subInfo.inactive'),
    newThisWeek: t('stats.subInfo.newThisWeek'),
    pending: t('stats.subInfo.pending'),
    confirmed: t('stats.subInfo.confirmed'),
    shipping: t('stats.subInfo.shipping'),
    completed: t('stats.subInfo.completed'),
    cancelled: t('stats.subInfo.cancelled'),
    visible: t('stats.subInfo.visible'),
    hidden: t('stats.subInfo.hidden')
  }

  const statCards = [
    {
      title: t('stats.cards.totalUsers'),
      value: statsData.totalUsers.value,
      change: statsData.totalUsers.change,
      trend: statsData.totalUsers.trend,
      icon: <UsersRound />,
      color: 'var(--dashboard-success)',
      subInfo: [
        { label: labels.active, value: statsData.activeClients },
        { label: labels.inactive, value: statsData.inactiveClients },
        { label: labels.newThisWeek, value: statsData.totalUsers.new.current }
      ]
    },
    {
      title: t('stats.cards.totalAdmins'),
      value: statsData.totalAdmins.value,
      change: statsData.totalAdmins.change,
      trend: statsData.totalAdmins.trend,
      icon: <ShieldCheck />,
      color: 'var(--dashboard-purple)',
      subInfo: [
        { label: labels.active, value: statsData.activeAdmins },
        { label: labels.inactive, value: statsData.inactiveAdmins },
        { label: labels.newThisWeek, value: statsData.totalAdmins.new.current }
      ]
    },
    {
      title: t('stats.cards.totalOrders'),
      value: statsData.order.all.total,
      change: statsData.order.all.new.change,
      trend: statsData.order.all.new.trend,
      icon: <ShoppingCart />,
      color: 'var(--dashboard-warning)',
      subInfo: [
        { label: labels.pending, value: statsData.order.pending.total },
        { label: labels.confirmed, value: statsData.order.confirmed.total },
        { label: labels.shipping, value: statsData.order.shipping.total },
        { label: labels.completed, value: statsData.order.completed.total },
        { label: labels.cancelled, value: statsData.order.cancelled.total },
        { label: labels.newThisWeek, value: statsData.order.all.new.current }
      ]
    },
    {
      title: t('stats.cards.revenue'),
      value: statsData.totalRevenue.value,
      change: statsData.totalRevenue.change,
      trend: statsData.totalRevenue.trend,
      icon: <CircleDollarSign />,
      color: 'var(--dashboard-success)',
      isCurrency: true,
      sparkline: true,
      caption: t('stats.comparison')
    },
    {
      title: t('stats.cards.profit'),
      value: statsData.profit.value,
      change: statsData.profit.change,
      trend: statsData.profit.trend,
      icon: <CircleDollarSign />,
      color: 'var(--dashboard-warning)',
      isCurrency: true,
      sparkline: true,
      caption: t('stats.comparison')
    },
    {
      title: t('stats.cards.products'),
      value: statsData.product.total,
      change: statsData.product.new.change,
      trend: statsData.product.new.trend,
      icon: <Package />,
      color: 'var(--dashboard-info)',
      subInfo: [
        { label: labels.visible, value: statsData.product.active },
        { label: labels.hidden, value: statsData.product.inactive },
        { label: labels.newThisWeek, value: statsData.product.new.current }
      ]
    },
    {
      title: t('stats.cards.categories'),
      value: statsData.category.total,
      change: statsData.category.new.change,
      trend: statsData.category.new.trend,
      icon: <Grid3X3 />,
      color: 'var(--dashboard-purple)',
      subInfo: [
        { label: labels.visible, value: statsData.category.active },
        { label: labels.hidden, value: statsData.category.inactive },
        { label: labels.newThisWeek, value: statsData.category.new.current }
      ]
    }
  ]

  return (
    <section className="stats-row">
      {loading
        ? Array.from({ length: 7 }).map((_, index) => (
            <Skeleton.Button
              key={index}
              block
              active
              className="dashboard-card-skeleton"
            />
          ))
        : statCards.map(card => <StatCard key={card.title} {...card} />)}
    </section>
  )
}
