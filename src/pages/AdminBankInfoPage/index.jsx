import React, { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Input, Space, Typography, Tag, Popconfirm, message, Switch, Card, Image, Upload } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, BankOutlined, QrcodeOutlined, EyeOutlined } from '@ant-design/icons'

import { getBankInfos, createBankInfo, updateBankInfo, deleteBankInfo, activateBankInfo } from '@/services/adminBankInfoService'
import SEO from '@/components/SEO'

const { Title, Text } = Typography

export default function AdminBankInfoPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form] = Form.useForm()

  const [oldQR, setOldQR] = useState('')
  const [qrToDelete, setQrToDelete] = useState('')
  const [isRemoveQR, setIsRemoveQR] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await getBankInfos({ page: 1, limit: 100 })
      const list = res?.bankInfos || []
      setData(list)
    } catch (e) {
      message.error(e?.message || 'Lỗi tải danh sách bank info')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const onCreate = () => {
    setEditing(null)
    setOldQR('')
    setQrToDelete('')
    setIsRemoveQR(false)
    form.resetFields()
    setOpen(true)
  }

  const onEdit = record => {
    setEditing(record)
    setOldQR(record?.qrCode || '')
    setQrToDelete('')
    setIsRemoveQR(false)
    form.setFieldsValue({
      ...record,
      qrCode: record?.qrCode
        ? [
            {
              uid: record._id,
              name: record.qrCode.split('/').pop(),
              status: 'done',
              url: record.qrCode
            }
          ]
        : []
    })
    setOpen(true)
  }

  const onSubmit = async () => {
    try {
      const values = await form.validateFields()
      setSubmitLoading(true)

      const fd = new FormData()
      fd.append('bankName', values.bankName)
      fd.append('accountNumber', values.accountNumber)
      fd.append('accountHolder', values.accountHolder)
      fd.append('noteTemplate', values.noteTemplate)

      const file = values.qrCode?.[0]?.originFileObj
      if (file) {
        fd.append('qrCode', file)
        if (oldQR) fd.append('oldImage', oldQR)
      } else {
        if (editing && isRemoveQR) {
          fd.append('oldImage', qrToDelete || oldQR)
          fd.append('deleteImage', true)
          fd.append('qrCode', '')
        }
      }

      if (editing) {
        await updateBankInfo(editing._id, fd)
        message.success('Đã cập nhật')
      } else {
        fd.append('isActive', 'false')
        await createBankInfo(fd)
        message.success('Đã tạo mới')
      }

      setOpen(false)
      setEditing(null)
      setIsRemoveQR(false)
      setQrToDelete('')
      form.resetFields()
      await load()
    } catch (e) {
      if (e?.errorFields) return
      message.error(e?.message || e?.response?.message || 'Có lỗi xảy ra')
    } finally {
      setSubmitLoading(false)
    }
  }

  const onDelete = async id => {
    try {
      await deleteBankInfo(id)
      message.success('Đã xoá')
      await load()
    } catch (e) {
      message.error(e?.message || 'Xoá thất bại')
    }
  }

  const onActivate = async (record, checked) => {
    try {
      if (!checked) {
        const otherActiveCount = data.filter(it => it.isActive && it._id !== record._id).length
        if (otherActiveCount === 0) {
          message.info('Cần ít nhất 1 bản ghi đang dùng. Hãy kích hoạt bản ghi khác trước.')
          return
        }
      }
      await activateBankInfo(record._id, { active: checked })
      message.success(checked ? 'Đã đặt làm bản ghi đang dùng' : 'Đã tắt kích hoạt')
      await load()
    } catch (e) {
      message.error(e?.message || 'Kích hoạt thất bại')
    }
  }

  const columns = [
    {
      title: 'Ngân hàng',
      dataIndex: 'bankName',
      key: 'bankName',
      width: 180,
      render: t => (
        <Space>
          <BankOutlined style={{ color: '#1890ff' }} />
          <span className="font-medium whitespace-normal break-words">{t}</span>
        </Space>
      )
    },
    { title: 'Số tài khoản', dataIndex: 'accountNumber', key: 'accountNumber', width: 160 },
    { title: 'Chủ tài khoản', dataIndex: 'accountHolder', key: 'accountHolder', width: 180 },
    {
      title: 'Nội dung mẫu',
      dataIndex: 'noteTemplate',
      key: 'noteTemplate',
      width: 240,
      render: v => <span className="whitespace-normal break-words text-gray-700 dark:text-gray-300">{v}</span>
    },
    {
      title: 'QR Code',
      dataIndex: 'qrCode',
      key: 'qrCode',
      width: 110,
      render: url =>
        url ? (
          <Image src={url} width={60} height={60} style={{ objectFit: 'cover', borderRadius: 6 }} preview={{ mask: <EyeOutlined /> }} />
        ) : (
          <Tag>Chưa có</Tag>
        )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 120,
      render: v => (v ? <Tag color="green">Đang dùng</Tag> : <Tag>Nháp</Tag>)
    },
    {
      title: 'Kích hoạt',
      key: 'activate',
      width: 110,
      render: (_, record) => <Switch checked={record.isActive} onChange={checked => onActivate(record, checked)} />
    },
    {
      title: 'Thao tác',
      key: 'actions',
      fixed: 'right',
      width: 140,
      render: (_, record) => (
        <Space size="small" wrap>
          <Button size="small" icon={<EditOutlined />} onClick={() => onEdit(record)}>
            Sửa
          </Button>
          <Popconfirm title="Xoá bản ghi?" okText="Xoá" cancelText="Huỷ" onConfirm={() => onDelete(record._id)}>
            <Button size="small" icon={<DeleteOutlined />} danger ghost>
              Xoá
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <div className="p-4 dark:bg-gray-800 rounded-xl">
      <SEO title="Admin – Ngân hàng" noIndex />
      <Card
        className="shadow-lg rounded-xl dark:bg-gray-800"
        title={
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Title level={4} className="!mb-0">
              Quản lý thông tin chuyển khoản
            </Title>
            <Button type="primary" icon={<PlusOutlined />} onClick={onCreate} className="rounded-lg w-full sm:w-auto">
              Thêm tài khoản
            </Button>
          </div>
        }
      >
        <Text className="block mb-3 text-gray-500">
          Bản ghi <b>Đang dùng</b> sẽ hiển thị cho khách hàng ở trang thanh toán.
        </Text>

        <div className="overflow-x-auto custom-scrollbar">
          <Table
            rowKey="_id"
            loading={loading}
            dataSource={data}
            columns={columns}
            pagination={{ pageSize: 8 }}
            className="rounded-lg"
            scroll={{ x: 1100 }}
            style={{ minWidth: 950 }}
          />
        </div>
      </Card>

      <Modal
        title={
          editing ? (
            <span className="dark:text-gray-100">Sửa thông tin</span>
          ) : (
            <span className="dark:text-gray-100">Thêm thông tin mới</span>
          )
        }
        open={open}
        onOk={onSubmit}
        onCancel={() => {
          setOpen(false)
          setEditing(null)
          form.resetFields()
          setIsRemoveQR(false)
          setQrToDelete('')
          setOldQR('')
        }}
        okText={editing ? 'Lưu' : 'Tạo'}
        cancelText="Đóng"
        destroyOnClose
        className="rounded-xl"
        confirmLoading={submitLoading}
        okButtonProps={{ disabled: submitLoading }}
        cancelButtonProps={{ disabled: submitLoading }}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            bankName: '',
            accountNumber: '',
            accountHolder: '',
            noteTemplate: '',
            qrCode: []
          }}
        >
          <Form.Item
            name="bankName"
            label={<span className="dark:text-gray-200">Ngân hàng</span>}
            rules={[{ required: true, message: 'Nhập tên ngân hàng' }]}
          >
            <Input placeholder="Vietcombank" className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700" />
          </Form.Item>
          <Form.Item
            name="accountNumber"
            label={<span className="dark:text-gray-200">Số tài khoản</span>}
            rules={[{ required: true, message: 'Nhập số tài khoản' }]}
          >
            <Input placeholder="1234567890" className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700" />
          </Form.Item>
          <Form.Item
            name="accountHolder"
            label={<span className="dark:text-gray-200">Chủ tài khoản</span>}
            rules={[{ required: true, message: 'Nhập chủ tài khoản' }]}
          >
            <Input placeholder="NGUYEN VAN A" className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700" />
          </Form.Item>
          <Form.Item
            name="noteTemplate"
            label={<span className="dark:text-gray-200">Nội dung chuyển khoản (mẫu)</span>}
            rules={[{ required: true, message: 'Nhập mẫu nội dung' }]}
          >
            <Input placeholder="[Ten KH] - [So dien thoai]" className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700" />
          </Form.Item>

          <Form.Item
            name="qrCode"
            label={<span className="dark:text-gray-200">Ảnh QR Code</span>}
            valuePropName="fileList"
            getValueFromEvent={e => (Array.isArray(e) ? e : e?.fileList)}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              accept="image/*"
              beforeUpload={file => {
                setIsRemoveQR(false)
                const isImage = file.type?.startsWith('image/')
                const isLt5M = file.size / 1024 / 1024 < 5
                if (!isImage) message.error('Chỉ được upload file ảnh!')
                if (!isLt5M) message.error('Ảnh phải nhỏ hơn 5MB!')
                // trả false để không upload tự động; ta tự submit qua FormData
                return isImage && isLt5M ? false : Upload.LIST_IGNORE
              }}
              onRemove={() => {
                setQrToDelete(oldQR)
                setOldQR('')
                setIsRemoveQR(true)
                return true
              }}
            >
              <div>
                <QrcodeOutlined />
                <div className="mt-2 dark:text-gray-200">Thêm QR</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
