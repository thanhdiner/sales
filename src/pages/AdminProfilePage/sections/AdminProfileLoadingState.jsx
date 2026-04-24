import { Spin } from 'antd'

export default function AdminProfileLoadingState() {
  return (
    <Spin tip="Loading profile...">
      <div className="min-h-[200px]" />
    </Spin>
  )
}
