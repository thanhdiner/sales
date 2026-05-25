import { CloseCircleFilled } from '@ant-design/icons'
import { Form } from 'antd'

export default function ProfileAvatar({ avatarPreview, initialLetterAvatar, inputRef, onFileChange, onRemove, t }) {
  return (
    <Form.Item className="!mb-2" label={<span className="text-[var(--admin-text-muted)]">{t('avatar.label')}</span>}>
      <div className="flex items-center gap-4">
        <div className="relative h-[72px] w-[72px]">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt={t('avatar.alt')}
              className="h-[72px] w-[72px] cursor-pointer rounded-md border-[2px] border-solid border-[var(--admin-border)] bg-[var(--admin-surface-2)] object-cover shadow-[0_1px_8px_rgba(0,0,0,0.12)]"
              onClick={() => inputRef.current?.click()}
            />
          ) : (
            <div
              className="flex h-[72px] w-[72px] cursor-pointer items-center justify-center rounded-md border border-solid border-[var(--admin-border)] bg-[var(--admin-surface-2)] text-[28px] font-semibold text-[var(--admin-text-subtle)] shadow-[0_1px_8px_rgba(0,0,0,0.12)]"
              onClick={() => inputRef.current?.click()}
            >
              {initialLetterAvatar}
            </div>
          )}

          {avatarPreview && (
            <CloseCircleFilled
              className="absolute right-[7px] top-[7px] cursor-pointer rounded-full bg-[var(--admin-surface)] text-[22px] text-[#f87171] shadow-[0_1px_4px_rgba(0,0,0,0.24)]"
              onClick={onRemove}
              title={t('avatar.remove')}
            />
          )}

          <input ref={inputRef} type="file" accept="image/*" className="!hidden" onChange={onFileChange} />
        </div>
      </div>
    </Form.Item>
  )
}
