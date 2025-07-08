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
  // Admin
  {
    path: '/admin',
    element: <LayoutAdmin />,
    children: [
      {
        index: true, // tương đương path: ''
        element: <Navigate to="/admin/dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <AdminDashboard />
      },
      {
        path: 'products',
        element: <AdminProductsPages />
      },
      {
        path: 'products/details/:id',
        element: <AdminProductsDetails />
      },
      {
        path: 'products/create',
        element: <AdminProductsCreate />
      },
      {
        path: 'products/edit/:id',
        element: <AdminProductsEdit />
      },
      {
        path: 'product-categories',
        element: <AdminProductCategoriesPage />
      },
      {
        path: 'product-categories/:id',
        element: <AdminProductCategoriesDetails />
      },
      {
        path: 'product-categories/create',
        element: <AdminProductCategoriesCreate />
      },
      {
        path: 'product-categories/edit/:id',
        element: <AdminProductCategoriesEdit />
      },
      {
        path: 'roles',
        element: <AdminRolesPage />
      },
      {
        path: 'permissions',
        element: <AdminPermissionsPage />
      },
      {
        path: 'permission-groups',
        element: <AdminPermissionGroupsPage />
      },
      {
        path: 'role-permission',
        element: <AdminRolePermissionPage />
      },
      {
        path: 'accounts',
        element: <AdminAccountsPage />
      },
      {
        path: '*',
        element: <Error404 path="/admin/dashboard" />
      }
    ]
  }
]
