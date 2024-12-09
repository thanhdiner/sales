import LayoutDefault from '../Layout/LayoutDefault'
import Home from '../pages/Home'
import Product from '../pages/Products'
import Events from '../pages/Events'
import About from '../pages/About'
import Contact from '../pages/Contact'
import Blog from '../pages/Blog'
import Error404 from '../pages/Error404'
import ProductsDetail from '../pages/Products/ProductsDetail'

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
        path: ':slug',
        element: <ProductsDetail />
      },
      {
        path: '/products',
        element: <Product />
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
        element: <Error404 />
      }
    ]
  },
  // Admin
  {}
]
