import { CloseCircleFilled } from '@ant-design/icons'
import { Form } from 'antd'

export default function AdminProfileAvatarSection({
  avatarPreview,
  initialLetterAvatar,
  inputRef,
  onFileChange,
  onRemove
}) {
  return (
    <Form.Item label={<span className="text-[var(--admin-text-muted)]">Avatar</span>}>
      <div className="flex min-h-[110px] items-center gap-10">
        <div className="relative h-[110px] w-[110px]">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Avatar"
              className="h-[110px] w-[110px] cursor-pointer rounded-[12px] border-[2.4px] border-solid border-[var(--admin-border)] bg-[var(--admin-surface-2)] object-cover shadow-[0_1px_8px_rgba(0,0,0,0.12)]"
              onClick={() => inputRef.current?.click()}
            />
          ) : (
            <div
              className="flex h-[110px] w-[110px] cursor-pointer items-center justify-center rounded-[12px] border border-solid border-[var(--admin-border)] bg-[var(--admin-surface-2)] text-[40px] font-semibold text-[var(--admin-text-subtle)] shadow-[0_1px_8px_rgba(0,0,0,0.12)]"
              onClick={() => inputRef.current?.click()}
            >
              {initialLetterAvatar}
            </div>
          )}

          {avatarPreview && (
            <CloseCircleFilled
              className="absolute right-[7px] top-[7px] cursor-pointer rounded-full bg-[var(--admin-surface)] text-[22px] text-[#f87171] shadow-[0_1px_4px_rgba(0,0,0,0.24)]"
              onClick={onRemove}
              title="Xóa ảnh"
            />
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="!hidden"
            onChange={onFileChange}
          />
        </div>
      </div>
    </Form.Item>
  )
}
