import React from 'react'
import { Skeleton } from 'antd'

export default function OrdersTableSkeleton() {
  return (
    <div className="orders-table-skeleton">
      <table>
        <thead>
          <tr>
            <th>Đơn hàng</th>
            <th>Khách hàng</th>
            <th>Giá trị</th>
            <th>Trạng thái</th>
            <th>Thời gian</th>
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: 8 }).map((_, idx) => (
            <tr key={idx}>
              <td>
                <Skeleton.Input className="skeleton-input" style={{ width: 72 }} active size="small" />
              </td>

              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 32 }}>
                  <Skeleton.Avatar active size={32} shape="circle" style={{ margin: 0 }} />
                  <Skeleton.Input
                    className="skeleton-input"
                    style={{ width: 88, height: 32, borderRadius: 8, margin: 0, lineHeight: '32px' }}
                    active
                    size="small"
                  />
                </div>
              </td>

              <td>
                <Skeleton.Input className="skeleton-input" style={{ width: 80 }} active size="small" />
              </td>

              <td>
                <Skeleton.Button className="skeleton-btn" style={{ width: 72 }} active size="small" />
              </td>

              <td>
                <Skeleton.Input className="skeleton-input" style={{ width: 98 }} active size="small" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
