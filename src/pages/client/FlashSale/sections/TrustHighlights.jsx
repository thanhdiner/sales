import { Clock, ShieldCheck, Zap } from 'lucide-react'

export default function TrustHighlights({ t }) {
  const trustItems = [
    {
      icon: ShieldCheck,
      title: t('trust.official.title'),
      desc: t('trust.official.desc')
    },
    {
      icon: Zap,
      title: t('trust.fastDelivery.title'),
      desc: t('trust.fastDelivery.desc')
    },
    {
      icon: Clock,
      title: t('trust.support.title'),
      desc: t('trust.support.desc')
    }
  ]

  return (
    <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="grid gap-5 md:grid-cols-3">
        {trustItems.map(item => {
          const Icon = item.icon

          return (
            <div key={item.title} className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300">
                <Icon className="h-5 w-5" />
              </div>

              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
