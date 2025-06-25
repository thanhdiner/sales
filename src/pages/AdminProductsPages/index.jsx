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
import { Button, Pagination, Space, Table, Tag } from 'antd'
import './AdminProductsPages.scss'
import { useEffect, useState } from 'react'
import AdminProductsFilter from '../../components/AdminProductsFilter'
import Link from 'antd/es/typography/Link'
import { getProducts } from '../../services/productService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort } from '@fortawesome/free-solid-svg-icons'
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
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const result = await getProducts()
      setProducts(result)
    }
    fetchData()
  }, [])

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
        <Link href={`/admin/products/details/${record.slug}`} target="_blank">
          {productName}
        </Link>
      )
    },
    {
      title: 'Thumbnail',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      width: 120,
      className: 'ant-table-cell-style',
      render: (thumbnail, record) => (
        <img
          src={thumbnail}
          alt={record.productName}
          style={{
            padding: 5,
            width: 100,
            height: 50,
            objectFit: 'cover',
            borderRadius: 3,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
          }}
        />
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
      className: 'ant-table-cell-style',
      key: 'position'
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
      render: status => <Tag color={status === 'active' ? 'green' : 'red'}>{status}</Tag>
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
    console.log('Current page:', page)
  }

  const handleEdit = record => {
    console.log('Editing product:', record)
  }

  const handleDelete = record => {
    console.log('Delete product:', record)
  }

  return (
    <>
      <div className="products-wrap">
        <div className="admin-title">
          <UnorderedListOutlined style={{ fontSize: '25px' }} />
          <h1>Product Manager</h1>
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
          <Button style={{ fontWeight: '700' }} variant="outlined" className="custom-btn-blue">
            <PlusCircleFilled />
            ADD
          </Button>
          <Button style={{ fontWeight: '700' }} variant="solid" color="danger" disabled={!selectedRowKeys.length}>
            <CloseCircleFilled />
            DELETE
          </Button>
        </div>
      </div>
      <div className="products-table">
        <Table rowKey="_id" rowSelection={rowSelection} columns={columns} dataSource={products} pagination={false} bordered />
        <div className="products-table-pagination">
          <span style={{ marginRight: 8 }}>
            Total <span style={{ fontWeight: 'bold' }}>{products.length}</span> products, Page {currentPage} of{' '}
            {Math.ceil(products.length / 10)}
          </span>
          <Pagination
            size="small"
            current={currentPage}
            total={products.length}
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
