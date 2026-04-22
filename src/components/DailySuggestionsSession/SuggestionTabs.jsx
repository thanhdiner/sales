import React from 'react'
import { UserOutlined, FireOutlined, StarFilled } from '@ant-design/icons'

const TAB_DATA = [
  {
    id: 'foryou',
    label: 'Dành cho bạn',
    icon: <UserOutlined />,
    color: '#0b74e5'
  },
  {
    id: 'deal',
    label: 'Deal Siêu Rẻ',
    icon: <FireOutlined />,
    color: '#ff424e'
  },
  {
    id: 'new',
    label: 'Hàng Mới Nhất',
    icon: <StarFilled />,
    color: '#f59e0b'
  }
]

export default function SuggestionTabs({ activeTab, setActiveTab }) {
  return (
    <div className="Suggestions-header-block">
      <div className="Suggestions-title">Gợi ý hôm nay</div>

      <div className="Suggestions-tabs">
        {TAB_DATA.map(tab => {
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              type="button"
              className={`Suggestions-tab ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              style={isActive ? { '--tab-color': tab.color } : {}}
            >
              <span className="Suggestions-tab__icon">{tab.icon}</span>
              <span className="Suggestions-tab__label">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}