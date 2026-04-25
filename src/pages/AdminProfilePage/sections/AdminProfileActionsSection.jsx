import { Button } from 'antd'

export default function AdminProfileActionsSection({ loading, onCancel }) {
  return (
    <div className="mt-6 text-right">
      <Button
        className="mr-2 !border-[var(--admin-border)] !bg-[var(--admin-surface-2)] !text-[var(--admin-text-muted)] hover:!border-[var(--admin-border-strong)] hover:!text-[var(--admin-text)]"
        htmlType="button"
        onClick={onCancel}
        disabled={loading}
      >
        Cancel
      </Button>

      <Button
        className="!border-none !bg-[var(--admin-accent)] !text-white hover:!opacity-90"
        htmlType="submit"
        loading={loading}
      >
        Save
      </Button>
    </div>
  )
}
