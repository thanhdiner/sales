import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort } from '@fortawesome/free-solid-svg-icons'
import { message, Modal, Table } from 'antd'
import { deleteProduct } from '../../services/productService'
import FieldThumbnail from './FieldThumbnail'
import FieldTitle from './FieldTitle'
import FieldPosition from './FieldPosition'
import FieldStatus from './FieldStatus'
import FieldAction from './FieldAction'
import FieldCategory from './FieldCategory'

function AdminProductsTable({
  isLoading,
  products,
  setEditedPositions,
  setProducts,
  sortField,
  setSortField,
  setSortOrder,
  selectedRowKeys,
  setSelectedRowKeys,
  columnsVisible,
  totalProducts,
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
      title: sortableTitle('Product Name', 'title'),
      dataIndex: 'title',
      key: 'title',
      className: 'ant-table-cell-style',
      render: (productName, record) => <FieldTitle {...{ productName, record }} />
    },
    {
      title: sortableTitle('Category', 'productCategory'),
      dataIndex: 'productCategory',
      key: 'productCategory',
      className: 'ant-table-cell-style',
      render: category => <FieldCategory {...{ category }} />
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
      title: sortableTitle('Price', 'price'),
      dataIndex: 'price',
      className: 'ant-table-cell-style',
      key: 'price'
    },
    {
      title: sortableTitle('Discount Percentage', 'discountPercentage'),
      dataIndex: 'discountPercentage',
      className: 'ant-table-cell-style',
      key: 'discountPercentage',
      width: 100
    },

    {
      title: sortableTitle('Stock', 'stock'),
      dataIndex: 'stock',
      className: 'ant-table-cell-style',
      key: 'stock',
      width: 100
    },
    {
      title: sortableTitle('Status', 'status'),
      dataIndex: 'status',
      className: 'ant-table-cell-style',
      key: 'status',
      width: 100,
      render: (status, record) => <FieldStatus {...{ status, record, setProducts }} />
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
      title: 'Confirm Delete',
      content: `Are you sure you want to delete product "${record.title}"?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deleteProduct(record._id)
          message.success('🗑️ Product deleted successfully!')
          const updatedProducts = products.filter(p => p._id !== record._id)
          const updatedTotal = totalProducts - 1

          if (updatedProducts.length === 0 && updatedTotal > 0 && currentPage > 1) {
            setCurrentPage(prev => prev - 1)
          } else {
            fetchData()
          }

          setSelectedRowKeys([])
        } catch (err) {
          message.error('❌ Failed to delete product.')
        }
      }
    })
  }
  //# End handler

  return (
    <div className="products-table">
      <Table
        loading={{
          spinning: isLoading,
          tip: 'Loading products...'
        }}
        rowKey="_id"
        rowSelection={rowSelection}
        columns={visibleColumns}
        dataSource={products}
        pagination={false}
        bordered
      />
    </div>
  )
}

export default AdminProductsTable
