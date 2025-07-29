import { Result, Button } from 'antd'
import { useNavigate } from 'react-router-dom'

export default function AccessDenied() {
  const navigate = useNavigate()
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-800">
      <Result
        status="403"
        title={<span className="dark:text-gray-200">403</span>}
        subTitle={<span className="dark:text-gray-300">Sorry, you are not authorized to access this page.</span>}
        extra={
          <Button type="primary" onClick={() => navigate('/admin/dashboard')}>
            Back to Dashboard
          </Button>
        }
      />
    </div>
  )
}
