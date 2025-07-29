import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort } from '@fortawesome/free-solid-svg-icons'
import { message, Modal, Table } from 'antd'
import { deleteProductCategory } from '@/services/productCategoryService'
import FieldThumbnail from './FieldThumbnail'
import FieldTitle from './FieldTitle'
import FieldPosition from './FieldPosition'
import FieldStatus from './FieldStatus'
import FieldAction from './FieldAction'
import AdminFieldUserInfo from '@/components/AdminFieldUserInfo'

function AdminProductCategoriesTable({
  isLoading,
  productCategories,
  setEditedPositions,
  setProductCategories,
  sortField,
  setSortField,
  setSortOrder,
  selectedRowKeys,
  setSelectedRowKeys,
  columnsVisible,
  totalProductCategories,
  currentPage,
  setCurrentPage,
  fetchData
}) {
  const sortableTitle = (label, field) => (
    <div onClick={() => handleSort(field)} className="ant-table-column-sorters sortable" style={{ cursor: 'pointer' }}>
      {label}
      <FontAwesomeIcon color="#aaa" icon={faSort} />
    </div>
  )

  const columns = [
    {
      title: sortableTitle('ID', '_id'),
      dataIndex: '_id',
      key: '_id',
      className: 'ant-table-cell-style'
    },
    {
      title: sortableTitle('Category Name', 'title'),
      dataIndex: 'title',
      key: 'title',
      className: 'ant-table-cell-style',
      render: (categoryName, record) => <FieldTitle {...{ categoryName, record }} />
    },
    {
      title: 'Thumbnail',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      className: 'ant-table-cell-style',
      render: (thumbnail, record) => <FieldThumbnail {...{ thumbnail, record }} />
    },
    {
      title: sortableTitle('Position', 'position'),
      dataIndex: 'position',
      className: 'ant-table-cell-style position-column',
      key: 'position',
      render: (value, record) => <FieldPosition {...{ value, record, setEditedPositions }} />
    },
    {
      title: 'Updated By',
      dataIndex: 'updateBy',
      className: 'ant-table-cell-style',
      key: 'updateBy',
      render: (updateByArr = []) => {
        const lastUpdate = updateByArr.length > 0 ? updateByArr[updateByArr.length - 1] : null
        return lastUpdate && lastUpdate.by ? <AdminFieldUserInfo user={lastUpdate.by} /> : 'N/A'
      }
    },
    {
      title: 'Updated At',
      dataIndex: 'updateBy',
      className: 'ant-table-cell-style',
      key: 'updateAt',
      render: updateBy => {
        if (!updateBy || updateBy.length === 0) return 'N/A'
        const last = updateBy[updateBy.length - 1]
        return last?.at ? new Date(last.at).toLocaleString() : 'N/A'
      }
    },
    {
      title: sortableTitle('Created By', 'createdBy'),
      dataIndex: 'createdBy',
      key: 'createdBy',
      className: 'ant-table-cell-style',
      render: createdBy => (createdBy && createdBy.by ? <AdminFieldUserInfo user={createdBy.by} /> : 'N/A')
    },
    {
      title: sortableTitle('Created At', 'createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      className: 'ant-table-cell-style',
      render: v => (v ? new Date(v).toLocaleString() : 'N/A')
    },
    {
      title: sortableTitle('Status', 'status'),
      dataIndex: 'status',
      className: 'ant-table-cell-style',
      key: 'status',
      width: 100,
      render: (status, record) => <FieldStatus {...{ status, record, setProductCategories }} />
    },
    {
      title: 'Action',
      key: 'action',
      className: 'ant-table-cell-style',
      width: 100,
      render: (_, record) => <FieldAction {...{ record, handleDelete }} />
    }
  ]

  const rowSelection = {
    selectedRowKeys,
    onChange: selectedKeys => {
      setSelectedRowKeys(selectedKeys)
      console.log('Selected row keys:', selectedKeys)
    }
  }

  const visibleColumns = columns.filter(col => columnsVisible[col.key] !== false)

  //# handler
  const handleSort = field => {
    if (sortField !== field) {
      setSortField(field)
      setSortOrder('ascend')
    } else setSortOrder(prev => (prev === 'ascend' ? 'descend' : prev === 'descend' ? null : 'ascend'))
  }

  const handleDelete = record => {
    Modal.confirm({
      title: <span className="dark:text-gray-300">Confirm Delete</span>,
      content: <span className="dark:text-gray-300">Are you sure you want to delete product category "{record.title}"?</span>,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deleteProductCategory(record._id)
          message.success('🗑️ Product Category deleted successfully!')
          const updatedProductCategories = productCategories.filter(p => p._id !== record._id)
          const updatedTotal = totalProductCategories - 1

          if (updatedProductCategories.length === 0 && updatedTotal > 0 && currentPage > 1) {
            setCurrentPage(prev => prev - 1)
          } else {
            fetchData()
          }

          setSelectedRowKeys([])
        } catch (err) {
          message.error('❌ Failed to delete product category.')
        }
      }
    })
  }
  //# End handler

  return (
    <div className="mt-2.5">
      <Table
        loading={{
          spinning: isLoading,
          tip: 'Loading product categories...'
        }}
        rowKey="_id"
        rowSelection={rowSelection}
        columns={visibleColumns}
        dataSource={productCategories}
        pagination={false}
        bordered
      />
    </div>
  )
}

export default AdminProductCategoriesTable
