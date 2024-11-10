import LayoutDefault from '../Layout/LayoutDefault'
import Home from '../pages/Home'
import Product from '../pages/Product'
import Store from '../pages/Store'
import About from '../pages/About'
import Contact from '../pages/Contact'
import Blog from '../pages/Blog'
import Error404 from '../pages/Error404'

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
        element: <Product />
      },
      {
        path: '/store',
        element: <Store />
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
        element: <Error404 />
      }
    ]
  },
  // Admin
  {}
]
