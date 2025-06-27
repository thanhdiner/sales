import {
  CloseCircleFilled,
  DeleteOutlined,
  EditOutlined,
  FilePdfOutlined,
  FilterOutlined,
  PlusCircleFilled,
  TableOutlined,
  UnorderedListOutlined
} from '@ant-design/icons'
import { Button, message, Modal, Pagination, Space, Table, Tag } from 'antd'
import './AdminProductsPages.scss'
import { useEffect, useState } from 'react'
import AdminProductsFilter from '../../components/AdminProductsFilter'
import { deleteProduct, getAdminProducts, toggleProductStatus } from '../../services/productService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
function AdminProductsPages() {
  // const [columnsVisible, setColumnsVisible] = useState({
  //   title: true,
  //   price: true,
  //   status: true,
  //   actions: true
  // })

  //# state
  const [isFilterVisible, setIsFilterVisible] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [limitItems, setLimitItems] = useState(10)
  const [totalProducts, setTotalProducts] = useState(0)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const result = await getAdminProducts(currentPage, limitItems)
        setProducts(result.products)
        setLimitItems(result.limitItems)
        setTotalProducts(result.total)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [currentPage, limitItems])

  const rowSelection = {
    selectedRowKeys,
    onChange: selectedKeys => {
      setSelectedRowKeys(selectedKeys)
      console.log('Selected row keys:', selectedKeys)
    }
  }

  const [sortOrder, setSortOrder] = useState(null) // 'ascend' | 'descend' | null
  const [sortField, setSortField] = useState(null)

  const handleSort = field => {
    console.log('Sorting by field:', field)
    if (sortField !== field) {
      setSortField(field)
      setSortOrder('ascend')
    } else {
      setSortOrder(prev => (prev === 'ascend' ? 'descend' : prev === 'descend' ? null : 'ascend'))
    }
  }

  const columns = [
    {
      title: (
        <div onClick={() => handleSort('_id')} style={{ cursor: 'pointer' }} className="ant-table-column-sorters sortable">
          ID
          <FontAwesomeIcon color="#aaa" icon={faSort} />
        </div>
      ),
      dataIndex: '_id',
      key: '_id',
      className: 'ant-table-cell-style'
    },
    {
      title: (
        <div onClick={() => handleSort('title')} className="ant-table-column-sorters sortable">
          Title
          <FontAwesomeIcon color="#aaa" icon={faSort} />
        </div>
      ),
      dataIndex: 'title',
      key: 'title',
      className: 'ant-table-cell-style',
      render: (productName, record) => (
        <Link href={`/admin/products&categories/products/details/${record.slug}`} target="_blank">
          {productName}
        </Link>
      )
    },
    {
      title: 'Thumbnail',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      className: 'ant-table-cell-style',
      render: (thumbnail, record) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img
            src={thumbnail}
            alt={record.productName}
            style={{
              padding: 3,
              width: 50,
              height: 30,
              objectFit: 'cover',
              borderRadius: 3,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
            }}
          />
        </div>
      )
    },
    {
      title: (
        <div onClick={() => handleSort('position')} className="ant-table-column-sorters sortable">
          Position
          <FontAwesomeIcon color="#aaa" icon={faSort} />
        </div>
      ),
      dataIndex: 'position',
      className: 'ant-table-cell-style position-column',
      key: 'position',
      render: (value, record) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <input
            type="number"
            defaultValue={value}
            style={{
              width: '100%',
              maxWidth: 60,
              textAlign: 'center',
              padding: '2px 6px',
              border: '1px solid #ccc',
              borderRadius: 4
            }}
            onChange={e => {
              const newValue = e.target.value
              console.log(`Change position of ${record.title} to ${newValue}`)
              // Bạn có thể gọi API update ở đây nếu muốn
            }}
          />
        </div>
      )
    },
    {
      title: (
        <div onClick={() => handleSort('price')} className="ant-table-column-sorters sortable">
          Price
          <FontAwesomeIcon color="#aaa" icon={faSort} />
        </div>
      ),
      dataIndex: 'price',
      className: 'ant-table-cell-style',
      key: 'price'
    },
    {
      title: (
        <div onClick={() => handleSort('discountPercentage')} className="ant-table-column-sorters sortable">
          Discount Percentage
          <FontAwesomeIcon color="#aaa" icon={faSort} />
        </div>
      ),
      dataIndex: 'discountPercentage',
      className: 'ant-table-cell-style',
      key: 'discountPercentage',
      width: 100
    },

    {
      title: (
        <div onClick={() => handleSort('stock')} className="ant-table-column-sorters sortable">
          Stock
          <FontAwesomeIcon color="#aaa" icon={faSort} />
        </div>
      ),
      dataIndex: 'stock',
      className: 'ant-table-cell-style',
      key: 'stock',
      width: 100
    },
    {
      title: (
        <div onClick={() => handleSort('status')} className="ant-table-column-sorters sortable">
          Status
          <FontAwesomeIcon color="#aaa" icon={faSort} />
        </div>
      ),
      dataIndex: 'status',
      className: 'ant-table-cell-style',
      key: 'status',
      width: 100,
      render: (status, record) => (
        <Tag
          color={status === 'active' ? 'green' : 'red'}
          style={{ cursor: 'pointer' }}
          onClick={() => {
            Modal.confirm({
              title: 'Change Product Status',
              content: `Are you sure you want to change status of "${record.title}" from "${status}" to "${
                status === 'active' ? 'inactive' : 'active'
              }"?`,
              okText: 'Yes',
              cancelText: 'No',
              onOk: async () => {
                try {
                  const updated = await toggleProductStatus(record._id, status)
                  setProducts(prev => prev.map(p => (p._id === record._id ? { ...p, status: updated.status } : p)))
                  message.success(`✅ Status updated to ${updated.status}`)
                } catch (err) {
                  message.error('❌ Failed to update status')
                }
              }
            })
          }}
        >
          {status}
        </Tag>
      )
    },
    {
      title: 'Action',
      key: 'action',
      className: 'ant-table-cell-style',
      width: 100,
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button color="danger" variant="outlined" icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
        </Space>
      )
    }
  ]

  //# handler
  const handleToggleFilter = () => {
    setIsFilterVisible(!isFilterVisible)
  }

  const handleChangePage = page => {
    setCurrentPage(page)
    setSelectedRowKeys([])
  }

  const handleEdit = record => {
    console.log('Editing product:', record)
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
          setTotalProducts(prev => prev - 1)
          setProducts(prev => prev.filter(p => p._id !== record._id))
          setSelectedRowKeys([])
        } catch (err) {
          message.error('❌ Failed to delete product.')
        }
      }
    })
  }

  return (
    <>
      <div className="products-wrap">
        <div className="admin-title">
          <UnorderedListOutlined style={{ fontSize: '16px' }} />
          <h1 className="products-heading">Product Manager</h1>
        </div>
        <div className="products-utility">
          <Button color="cyan" variant="solid">
            <FilePdfOutlined />
            Export Products
          </Button>
          <Button className="custom-btn-orange">
            <TableOutlined />
            Toggle Columns
          </Button>
          <Button onClick={handleToggleFilter}>
            <FilterOutlined />
            Filter
          </Button>
        </div>
      </div>
      {isFilterVisible && <AdminProductsFilter />}
      <div className="products-header">
        <span style={{ marginLeft: 8 }}>
          Selected <span style={{ fontWeight: 'bold' }}>{selectedRowKeys.length}</span> items
        </span>
        <div className="products-header-right">
          <Link to="/admin/products&categories/products/create">
            <Button style={{ fontWeight: '700' }} variant="outlined" className="custom-btn-blue">
              <PlusCircleFilled />
              ADD
            </Button>
          </Link>
          <Button style={{ fontWeight: '700' }} variant="solid" color="danger" disabled={!selectedRowKeys.length}>
            <CloseCircleFilled />
            DELETE
          </Button>
        </div>
      </div>
      <div className="products-table">
        <Table
          loading={{
            spinning: isLoading,
            tip: 'Loading products...'
          }}
          rowKey="_id"
          rowSelection={rowSelection}
          columns={columns}
          dataSource={products}
          pagination={false}
          bordered
        />
        <div className="products-table-pagination">
          <span style={{ marginRight: 8 }}>
            Total <span style={{ fontWeight: 'bold' }}>{totalProducts}</span> products, Page {currentPage} of{' '}
            {Math.ceil(totalProducts / limitItems)}
          </span>
          <Pagination
            size="small"
            current={currentPage}
            total={totalProducts}
            pageSize={limitItems}
            onChange={handleChangePage}
            showSizeChanger={false}
            showQuickJumper
          />
        </div>
      </div>
    </>
  )
}

export default AdminProductsPages
