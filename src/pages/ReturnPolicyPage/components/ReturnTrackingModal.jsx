import React from 'react'
import { Alert, Divider, Input, Modal, Tag, Timeline, Typography } from 'antd'
import { returnPolicyTrackingStatuses } from '../data'

const { Text } = Typography

const ReturnTrackingModal = ({ open, onClose }) => {
  return (
    <Modal title="Tra Cứu Trạng Thái Đổi Trả" open={open} onCancel={onClose} footer={null} width={600}>
      <div className="mb-4">
        <Input.Search
          placeholder="Nhập mã yêu cầu đổi trả (VD: RT2025080001)"
          enterButton="Tra cứu"
          size="large"
        />
      </div>

      <Divider />

      <div className="mb-4">
        <Text strong>Mã yêu cầu: </Text>
        <Text code>RT2025080001</Text>
        <Tag color="processing" className="ml-2">
          Đang xử lý
        </Tag>
      </div>

      <Timeline
        items={returnPolicyTrackingStatuses.map(status => ({
          color: status.time ? 'green' : 'gray',
          children: (
            <div>
              <Text strong>
                {status.icon} {status.status}
              </Text>
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
        message="Ước tính hoàn tất"
        description="Yêu cầu của bạn dự kiến được hoàn tất trong 2-3 ngày làm việc tới."
        type="info"
        showIcon
        className="mt-4"
      />
    </Modal>
  )
}

export default ReturnTrackingModal
