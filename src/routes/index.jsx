import LayoutDefault from '../Layout/LayoutDefault'
import Home from '../pages/Home'
import ProductsPages from '../pages/ProductsPages'
import Events from '../pages/Events'
import About from '../pages/About'
import Contact from '../pages/Contact'
import Blog from '../pages/Blog'
import Error404 from '../pages/Error404'
import ProductsDetail from '../pages/ProductsPages/ProductsDetail'
import AdminDashboard from '../pages/AdminDashboard'
import LayoutAdmin from '../Layout/LayoutAdmin'
import AdminProductsPages from '../pages/AdminProductsPages'
import AdminProductsDetails from '../pages/AdminProductsPages/AdminProductsDetails'
import { Navigate } from 'react-router-dom'
import AdminProductsCreate from '../pages/AdminProductsPages/AdminProductsCreate'
import AdminProductsEdit from '../pages/AdminProductsPages/AdminProductsEdit'
import AdminProductCategoriesPage from '../pages/AdminProductCategoriesPage'
import AdminProductCategoriesCreate from '../pages/AdminProductCategoriesPage/AdminProductCategoriesCreate'
import AdminProductCategoriesEdit from '../pages/AdminProductCategoriesPage/AdminProductCategoriesEdit'
import AdminRolesPage from '../pages/AdminRolesPage'
import AdminPermissionsPage from '../pages/AdminPermissionsPage'
import AdminProductCategoriesDetails from '../pages/AdminProductCategoriesPage/AdminProductCategoriesDetails'
import AdminPermissionGroupsPage from '../pages/AdminPermissionGroupsPage'
import AdminRolePermissionPage from '../pages/AdminRolePermissionPage'
import AdminAccountsPage from '../pages/AdminAccountsPage'
import RequireAuth from '../components/AdminRequireAuth'
import AdminLoginRoute from '../components/AdminLoginRoute'

export const routes = [
  // Client
  {
    path: '/',
    element: <LayoutDefault />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/products',
        element: <ProductsPages />
      },
      {
        path: '/products/:slug',
        element: <ProductsDetail />
      },
      {
        path: '/events',
        element: <Events />
      },
      {
        path: '/about',
        element: <About />
      },
      {
        path: '/contact',
        element: <Contact />
      },
      {
        path: '/blog',
        element: <Blog />
      },
      {
        path: '*',
        element: <Error404 path="/" />
      }
    ]
  },

  // Admin Login
  {
    path: '/admin/auth/login',
    element: <AdminLoginRoute />
  },

  // Admin
  {
    path: '/admin',
    element: (
      <RequireAuth>
        <LayoutAdmin />
      </RequireAuth>
    ),
    children: [
      {
        index: true, // tương đương path: ''
        element: <Navigate to="/admin/dashboard" replace />
      },
      {
        path: 'dashboard',
        element: (
          <RequireAuth>
            <AdminDashboard />
          </RequireAuth>
        )
      },
      {
        path: 'products',
        element: (
          <RequireAuth>
            <AdminProductsPages />
          </RequireAuth>
        )
      },
      {
        path: 'products/details/:id',
        element: (
          <RequireAuth>
            <AdminProductsDetails />
          </RequireAuth>
        )
      },
      {
        path: 'products/create',
        element: (
          <RequireAuth>
            <AdminProductsCreate />
          </RequireAuth>
        )
      },
      {
        path: 'products/edit/:id',
        element: (
          <RequireAuth>
            <AdminProductsEdit />
          </RequireAuth>
        )
      },
      {
        path: 'product-categories',
        element: (
          <RequireAuth>
            <AdminProductCategoriesPage />
          </RequireAuth>
        )
      },
      {
        path: 'product-categories/:id',
        element: (
          <RequireAuth>
            <AdminProductCategoriesDetails />
          </RequireAuth>
        )
      },
      {
        path: 'product-categories/create',
        element: (
          <RequireAuth>
            <AdminProductCategoriesCreate />
          </RequireAuth>
        )
      },
      {
        path: 'product-categories/edit/:id',
        element: (
          <RequireAuth>
            <AdminProductCategoriesEdit />
          </RequireAuth>
        )
      },
      {
        path: 'roles',
        element: (
          <RequireAuth>
            <AdminRolesPage />
          </RequireAuth>
        )
      },
      {
        path: 'permissions',
        element: (
          <RequireAuth>
            <AdminPermissionsPage />
          </RequireAuth>
        )
      },
      {
        path: 'permission-groups',
        element: (
          <RequireAuth>
            <AdminPermissionGroupsPage />
          </RequireAuth>
        )
      },
      {
        path: 'role-permission',
        element: (
          <RequireAuth>
            <AdminRolePermissionPage />
          </RequireAuth>
        )
      },
      {
        path: 'accounts',
        element: (
          <RequireAuth>
            <AdminAccountsPage />
          </RequireAuth>
        )
      },
      {
        path: '*',
        element: <Error404 path="/admin/dashboard" />
      }
    ]
  }
]
