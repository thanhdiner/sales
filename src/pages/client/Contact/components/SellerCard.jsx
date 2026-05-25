import React from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { FacebookFilled, LinkOutlined, MailOutlined, MessageOutlined, PhoneOutlined } from '@ant-design/icons'
import { viewport } from '../constants'

const METHOD_ICONS = {
  zalo: MessageOutlined,
  facebook: FacebookFilled,
  email: MailOutlined,
  phone: PhoneOutlined,
  link: LinkOutlined
}

const getMethodIcon = method => {
  if (method.icon) return method.icon
  return METHOD_ICONS[method.type] || METHOD_ICONS.link
}

const SellerCard = ({ seller, index, note }) => {
  return (
    <motion.div
      className="contact-card contact-seller-card overflow-hidden rounded-[14px] border border-[#ffe6d4] bg-white shadow-[0_16px_34px_rgba(119,68,36,0.10)] transition-colors hover:border-[#ffc9a8]"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: 'easeOut' }}
      viewport={viewport}
    >
      <div className="contact-seller-card__head flex items-center gap-4 bg-[#ff641f] px-5 py-4 text-white">
        <span className="contact-seller-card__avatar flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/18 p-1 ring-1 ring-white/35">
          <img
            src={seller.avatar}
            alt={seller.name}
            className="h-full w-full rounded-full object-cover"
          />
        </span>

        <div className="min-w-0">
          <h3 className="contact-card-title truncate text-lg font-extrabold text-white">
            {seller.name}
          </h3>

          <p className="contact-muted-text mt-1 text-sm font-medium text-white/88">
            {seller.role}
          </p>
        </div>
      </div>

      <div className="space-y-3 px-5 py-4">
        {(seller.methods || []).map((method, methodIndex) => {
          const Icon = getMethodIcon(method)

          return (
            <motion.a
              key={`${seller.name}-${method.title}-${methodIndex}`}
              href={method.link}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="contact-method-row flex items-center justify-between gap-3 rounded-[10px] border border-transparent bg-white px-0 py-1.5 transition-colors hover:bg-[#fff7f1]"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.25,
                delay: methodIndex * 0.04,
                ease: 'easeOut',
              }}
              viewport={viewport}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className="contact-icon-box flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-[#ffe6d4] bg-[#fff3ea] text-[#ff641f]"
                  style={method.color ? { color: method.color } : undefined}
                >
                  <Icon className="h-4 w-4" />
                </span>

                <div className="min-w-0">
                  <div className="contact-card-title text-sm font-bold text-[#151821]">
                    {method.title}
                  </div>

                  <div
                    className="contact-method-value truncate text-xs font-medium text-[#6b7280]"
                    title={method.value}
                  >
                    {method.value}
                  </div>

                  {(method.actionLabel || method.actionKey) && (
                    <div className="mt-0.5 text-xs font-bold text-[#ff641f]">
                      {method.actionLabel || method.actionKey}
                    </div>
                  )}
                </div>
              </div>

              <ArrowUpRight className="contact-arrow h-4 w-4 shrink-0 text-[#ff641f]" />
            </motion.a>
          )
        })}
      </div>

      <p className="contact-muted-text border-t border-[#fff0e6] px-5 py-4 text-center text-xs font-medium leading-5 text-[#6b7280]">
        {note}
      </p>
    </motion.div>
  )
}

export default SellerCard
