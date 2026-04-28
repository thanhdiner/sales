import React from 'react'
import { Alert, Divider, Input, Modal, Tag, Timeline, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { returnPolicyTrackingStatuses } from '../data'

const { Text } = Typography

const ReturnTrackingModal = ({ open, onClose }) => {
  const { t } = useTranslation('clientReturnPolicy')

  return (
    <Modal title={t('tracking.modalTitle')} open={open} onCancel={onClose} footer={null} width={600}>
      <div className="mb-4">
        <Input.Search
          placeholder={t('tracking.searchPlaceholder')}
          enterButton={t('tracking.searchButton')}
          size="large"
        />
      </div>

      <Divider />

      <div className="mb-4">
        <Text strong>{t('tracking.codeLabel')} </Text>
        <Text code>RT2025080001</Text>
        <Tag color="processing" className="ml-2">
          {t('tracking.statusLabel')}
        </Tag>
      </div>

      <Timeline
        items={returnPolicyTrackingStatuses.map(status => ({
          color: status.time ? 'green' : 'gray',
          children: (
            <div>
              <Text strong>{t(status.statusKey)}</Text>
              {status.time ? (
                <>
                  <br />
                  <Text type="secondary" className="text-sm">
                    {status.time}
                  </Text>
                </>
              ) : null}
            </div>
          ),
        }))}
      />

      <Alert
        message={t('tracking.estimatedTitle')}
        description={t('tracking.estimatedDescription')}
        type="info"
        className="mt-4"
      />
    </Modal>
  )
}

export default ReturnTrackingModal
