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
        path: '/admin/dashboard',
        element: <AdminDashboard />
      },
      {
        path: '/admin/products&categories/products',
        element: <AdminProductsPages />
      },
      {
        path: '/admin/products&categories/products/details/:id',
        element: <AdminProductsDetails />
      },
      {
        path: '/admin/products&categories/products/create',
        element: <AdminProductsCreate />
      },
      {
        path: '/admin/products&categories/products/edit/:id',
        element: <AdminProductsEdit />
      },
      {
        path: '*',
        element: <Error404 path="/admin/dashboard" />
      }
    ]
  }
]
