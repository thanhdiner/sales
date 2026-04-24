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
    <Form.Item label={<span className="dark:text-gray-300">Avatar</span>}>
      <div className="flex min-h-[110px] items-center gap-10">
        <div className="relative h-[110px] w-[110px]">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Avatar"
              className="h-[110px] w-[110px] cursor-pointer rounded-[12px] border-[2.4px] border-solid border-[#eee] bg-[#fafbfc] object-cover shadow-[0_1px_8px_rgba(0,0,0,0.01)]"
              onClick={() => inputRef.current?.click()}
            />
          ) : (
            <div
              className="flex h-[110px] w-[110px] cursor-pointer items-center justify-center rounded-[12px] border border-solid border-[#eee] bg-[#f5f5f5] text-[40px] font-semibold text-[#999] shadow-[0_1px_8px_#0001]"
              onClick={() => inputRef.current?.click()}
            >
              {initialLetterAvatar}
            </div>
          )}

          {avatarPreview && (
            <CloseCircleFilled
              className="absolute right-[7px] top-[7px] cursor-pointer rounded-full bg-white text-[22px] text-[#f5222d] shadow-[0_1px_4px_#0002]"
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
