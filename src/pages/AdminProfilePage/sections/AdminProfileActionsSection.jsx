import { Button } from 'antd'

export default function AdminProfileActionsSection({ loading, onCancel }) {
  return (
    <div className="mt-6 text-right">
      <Button className="mr-2" htmlType="button" onClick={onCancel} disabled={loading}>
        Cancel
      </Button>

      <Button type="primary" htmlType="submit" loading={loading}>
        Save
      </Button>
    </div>
  )
}
