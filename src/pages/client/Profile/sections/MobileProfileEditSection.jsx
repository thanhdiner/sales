import { DownOutlined, UserOutlined } from '@ant-design/icons'
import { useState } from 'react'
import ProfileDetailsCard from './ProfileDetailsCard'

function MobileProfileEditSection(props) {
  const { t } = props
  const [open, setOpen] = useState(false)

  return (
    <section className="mb-7 lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(value => !value)}
        className="flex w-full items-center justify-between rounded-2xl bg-white p-4 text-left shadow-sm dark:bg-gray-800"
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
            <UserOutlined />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-gray-900 dark:text-white">{t('mobileProfileEdit.title')}</span>
            <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">{t('mobileProfileEdit.description')}</span>
          </span>
        </span>
        <DownOutlined className={`text-xs text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="mt-3">
          <ProfileDetailsCard {...props} />
        </div>
      )}
    </section>
  )
}

export default MobileProfileEditSection
