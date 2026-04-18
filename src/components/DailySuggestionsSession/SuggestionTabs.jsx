import React from 'react'
import { UserOutlined, FireOutlined, StarOutlined } from '@ant-design/icons'

const TAB_DATA = [
  { 
    id: 'foryou', 
    label: 'Dành cho bạn', 
    icon: <UserOutlined />,
    bgColor: '#f0f8ff',
    color: '#0b74e5'
  },
  { 
    id: 'deal', 
    label: 'Deal Siêu Rẻ', 
    icon: <FireOutlined />,
    bgColor: '#fff0f1',
    color: '#ff424e'
  },
  { 
    id: 'new', 
    label: 'Hàng Mới Nhất', 
    icon: <StarOutlined />,
    bgColor: '#fff5eb',
    color: '#f5a623'
  },
]

export default function SuggestionTabs({ activeTab, setActiveTab }) {
  return (
    <div className="Suggestions-header-block">
      <div className="Suggestions-title">Gợi ý hôm nay</div>
      <div className="Suggestions-tabs">
        {TAB_DATA.map(tab => {
          const isActive = activeTab === tab.id
          return (
            <div 
              key={tab.id} 
              className={`Suggestions-tab ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              style={isActive ? { borderBottomColor: tab.color } : {}}
            >
              <div 
                className="img-wrapper" 
                style={isActive ? { background: tab.bgColor, color: tab.color } : { color: '#808089' }}
              >
                {tab.icon}
              </div>
              <span style={isActive ? { color: tab.color } : {}}>{tab.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
