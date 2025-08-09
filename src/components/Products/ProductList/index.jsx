import React, { useMemo } from 'react'
import { FixedSizeGrid as Grid } from 'react-window'
import useMeasure from 'react-use-measure'
import ProductCard from './ProductCard'
import './ProductList.scss'

const GRID_HEIGHT = 550
const ROW_HEIGHT = 380
const COLUMN_GAP = 16

function ProductList({ products = [], loading = false, className = '' }) {
  const [ref, { width }] = useMeasure()

  const gridConfig = useMemo(() => {
    if (width <= 0) return { columnCount: 0, rowCount: 0, columnWidth: 0 }

    // Responsive columns by container width (Tailwind-like breakpoints)
    let columnCount = 5 // >= 1024px giữ nguyên 5 cột (desktop & laptop)
    if (width < 640) columnCount = 2 // < sm (mobile)
    else if (width < 768) columnCount = 3 // < md (phablet)
    else if (width < 1024) columnCount = 4 // < lg (tablet)

    const rowCount = Math.ceil(products.length / columnCount)
    const availableWidth = width - COLUMN_GAP * (columnCount + 1)
    const columnWidth = Math.floor(availableWidth / columnCount)

    return { columnCount, rowCount, columnWidth }
  }, [width, products.length])

  if (loading) {
    return (
      <div ref={ref} className={`w-full ${className}`}>
        <div className="flex justify-center items-center" style={{ height: GRID_HEIGHT }}>
          <div className="text-gray-500">Loading products...</div>
        </div>
      </div>
    )
  }

  if (!products.length) {
    return (
      <div ref={ref} className={`w-full ${className}`}>
        <div className="flex justify-center items-center" style={{ height: GRID_HEIGHT }}>
          <div className="text-gray-500">No products found</div>
        </div>
      </div>
    )
  }

  return (
    <div ref={ref} className={`w-full ${className}`}>
      {width > 0 && gridConfig.columnCount > 0 && (
        <Grid
          columnCount={gridConfig.columnCount}
          columnWidth={gridConfig.columnWidth + COLUMN_GAP}
          height={GRID_HEIGHT}
          rowCount={gridConfig.rowCount}
          rowHeight={ROW_HEIGHT}
          width={width}
          overscanRowCount={2}
          overscanColumnCount={1}
          className="product-list-scroll"
        >
          {({ columnIndex, rowIndex, style }) => {
            const index = rowIndex * gridConfig.columnCount + columnIndex
            const product = products[index]

            if (!product) return null

            const adjustedStyle = {
              ...style,
              left: style.left + COLUMN_GAP / 2,
              width: gridConfig.columnWidth,
              padding: `0 ${COLUMN_GAP / 2}px`
            }

            return (
              <div style={adjustedStyle} key={product.id || `product-${index}`}>
                <ProductCard product={product} />
              </div>
            )
          }}
        </Grid>
      )}
    </div>
  )
}

export default ProductList
