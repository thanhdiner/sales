import React from 'react'
import { UserOutlined, FireOutlined, StarFilled } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

const TAB_DATA = [
  {
    id: 'foryou',
    labelKey: 'dailySuggestionsSection.tabs.forYou',
    icon: <UserOutlined />,
    color: '#0b74e5'
  },
  {
    id: 'deal',
    labelKey: 'dailySuggestionsSection.tabs.deal',
    icon: <FireOutlined />,
    color: '#ff424e'
  },
  {
    id: 'new',
    labelKey: 'dailySuggestionsSection.tabs.new',
    icon: <StarFilled />,
    color: '#f59e0b'
  }
]

export default function SuggestionTabs({ activeTab, setActiveTab }) {
  const { t } = useTranslation('clientHome')

  return (
    <div className="Suggestions-header-block">
      <div className="Suggestions-title">
        <svg width="390" height="86" viewBox="0 0 390 86" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path
            d="M28 19L31 29L41 32L31 35L28 45L25 35L15 32L25 29L28 19Z"
            fill="#1677FF"
          />
          <path
            d="M50 50C98 46 155 52 215 48C266 45 316 47 358 49"
            stroke="#FFD166"
            strokeWidth="9"
            strokeLinecap="round"
            opacity="0.4"
          />
          <text
            x="52"
            y="43"
            fontFamily="Comic Sans MS, Segoe Print, cursive"
            fontSize="27"
            fontWeight="800"
            fill="#071B4D"
            transform="rotate(-0.7 52 43)"
          >
            Today’s suggestions
          </text>
          <path
            d="M54 55C105 58 163 54 221 55.5C264 56.5 314 55 354 54"
            stroke="#1677FF"
            strokeWidth="2.1"
            strokeLinecap="round"
            opacity="0.45"
          />
          <path
            d="M348 18L350 24L356 26L350 28L348 34L346 28L340 26L346 24L348 18Z"
            fill="#8EC5FF"
          />
        </svg>
        <span>{t('dailySuggestionsSection.title')}</span>
      </div>

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
              <span className="Suggestions-tab__label">{t(tab.labelKey)}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}