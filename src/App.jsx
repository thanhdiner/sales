import AllRoute from './components/AllRoute'
import LayoutDefault from './Layout/LayoutDefault'
import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <>
      <ScrollToTop />
      <AllRoute>
        <LayoutDefault></LayoutDefault>
      </AllRoute>
    </>
  )
}

export default App
