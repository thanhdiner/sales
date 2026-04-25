import React from 'react'
import { ShieldCheck, Truck, MessageCircle } from 'lucide-react'

const items = [
  {
    icon: ShieldCheck,
    title: 'Làm việc rõ ràng',
    description: 'Thông tin sản phẩm được ghi rõ để khách dễ chọn và dễ so sánh.'
  },
  {
    icon: Truck,
    title: 'Gửi nhanh',
    description: 'Sau khi chốt đơn, shop cố gắng gửi tài khoản hoặc phần mềm sớm nhất có thể.'
  },
  {
    icon: MessageCircle,
    title: 'Hỗ trợ khi cần',
    description: 'Nếu có vướng mắc trong quá trình sử dụng, shop vẫn hỗ trợ để khách yên tâm hơn.'
  }
]

const BenefitsSection = () => {
  return (
    <section className="px-4 py-8 md:py-12">
      <div className="about-page__surface mx-auto max-w-6xl rounded-[28px] border border-gray-200 bg-[#fcfcfc] px-6 py-10 shadow-sm md:px-10 md:py-14">
        <h2 className="about-page__section-title text-center text-3xl font-bold uppercase tracking-tight text-[#111] md:text-5xl">Benefits of Working With Us</h2>

        <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-3 md:gap-8">
          {items.map((item, index) => {
            const Icon = item.icon

            return (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="about-page__icon-pill flex h-14 w-14 items-center justify-center rounded-full bg-[#2672CD] text-white">
                  <Icon className="h-7 w-7" strokeWidth={2.2} />
                </div>

                <h3 className="about-page__item-title mt-5 max-w-[220px] text-2xl font-bold uppercase leading-none text-[#111] md:text-[22px]">{item.title}</h3>

                <p className="about-page__muted mt-4 max-w-[280px] text-base leading-8 text-gray-500 md:text-[15px] md:leading-7">{item.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default BenefitsSection
