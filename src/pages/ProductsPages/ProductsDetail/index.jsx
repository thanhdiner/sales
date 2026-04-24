import { useEffect, useState } from 'react'
import { message, Spin } from 'antd'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Error404 from '@/pages/Error404'
import ReviewSection from './components/ReviewSection'
import { syncCartFromServer } from '@/lib/clientCache'
import { getCartUniqueItemLimitMessage, hasReachedCartUniqueItemLimit } from '@/lib/cartLimits'
import { addToCart } from '@/services/cartsService'
import { getProductDetail } from '@/services/clientProductService'
import titles from '@/utils/titles'
import ProductGallery from './components/ProductGallery'
import ExploreMoreSection from './components/ExploreMoreSection'
import ProductInfoSections from './components/ProductInfoSections'
import ProductPurchasePanel from './components/ProductPurchasePanel'
import ProductSummaryPanel from './components/ProductSummaryPanel'
import { getGalleryImages, getMaxAvailable, getProductFeatures, getProductId, getProductPricing } from './helpers'
import { getStoredClientAccessToken } from '@/utils/auth'

const EMPTY_CART_ITEMS = []

function ProductsDetail() {
  titles('Chi tiết sản phẩm')

  const { slug } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const cartItems = useSelector(state => state.cart.items ?? EMPTY_CART_ITEMS)

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [quantity, setQuantity] = useState('1')
  const [maxAvailable, setMaxAvailable] = useState(0)
  const [addCartLoading, setAddCartLoading] = useState(false)
  const [buyNowLoading, setBuyNowLoading] = useState(false)

  const flashSaleInfo = location.state?.flashSaleInfo || null
  const productId = getProductId(product)
  const galleryImages = getGalleryImages(product)
  const currentImage = galleryImages[selectedImage] || product?.thumbnail
  const features = getProductFeatures(product)
  const { priceOrigin, priceNew, discountPercent, savings, isFlashSale } = getProductPricing(product, flashSaleInfo)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        setNotFound(false)

        const productData = await getProductDetail(slug)

        if (!productData) {
          setNotFound(true)
          return
        }

        setProduct(productData)
        setSelectedImage(0)
      } catch {
        setError('Có lỗi xảy ra khi tải sản phẩm.')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slug])

  useEffect(() => {
    const available = getMaxAvailable(product, cartItems)

    setMaxAvailable(available)

    if (available > 0) {
      setQuantity(currentQuantity => {
        const nextQuantity = parseInt(currentQuantity, 10)

        if (Number.isNaN(nextQuantity) || nextQuantity <= available) {
          return currentQuantity
        }

        return String(available)
      })
    }
  }, [cartItems, product])

  const handleQtyInputChange = event => {
    const value = event.target.value

    if (/^\d*$/.test(value)) {
      setQuantity(value)
    }
  }

  const handleQtyBlur = () => {
    if (!product) return

    let nextQuantity = parseInt(quantity, 10)

    if (Number.isNaN(nextQuantity) || nextQuantity < 1) nextQuantity = 1
    if (nextQuantity > product.stock) nextQuantity = product.stock

    setQuantity(String(nextQuantity))
  }

  const buildCartPayload = () => {
    let payload = {
      productId,
      quantity: Number(quantity)
    }

    if (isFlashSale && flashSaleInfo) {
      payload = {
        ...payload,
        salePrice: flashSaleInfo.salePrice,
        discountPercent: flashSaleInfo.discountPercent,
        flashSaleId: flashSaleInfo.flashSaleId,
        isFlashSale: true
      }
    }

    return payload
  }

  const ensureLoggedIn = actionMessage => {
    const isLoggedIn = Boolean(getStoredClientAccessToken())

    if (isLoggedIn) {
      return true
    }

    message.info(actionMessage)
    navigate('/user/login')
    return false
  }

  const handleAddToCart = async () => {
    if (addCartLoading) return
    if (!ensureLoggedIn('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!')) return

    if (hasReachedCartUniqueItemLimit(cartItems, productId)) {
      message.warning(getCartUniqueItemLimitMessage())
      return
    }

    setAddCartLoading(true)

    try {
      if (+quantity > maxAvailable) {
        message.warning(`Chỉ có thể thêm tối đa ${maxAvailable} sản phẩm này vào giỏ hàng!`)
        return
      }

      await addToCart(buildCartPayload())
      await syncCartFromServer(dispatch)
      setQuantity('1')
      message.success('Đã thêm vào giỏ hàng!')
    } catch (err) {
      message.error(err.message || 'Thêm sản phẩm vào giỏ hàng thất bại!')
    } finally {
      setAddCartLoading(false)
    }
  }

  const handleBuyNow = async () => {
    if (buyNowLoading) return
    if (!ensureLoggedIn('Bạn cần đăng nhập để mua sản phẩm!')) return

    if (hasReachedCartUniqueItemLimit(cartItems, productId)) {
      message.warning(getCartUniqueItemLimitMessage())
      return
    }

    setBuyNowLoading(true)

    try {
      if (+quantity > maxAvailable) {
        navigate('/cart', { state: { buyNowProductId: productId } })
        return
      }

      await addToCart(buildCartPayload())
      await syncCartFromServer(dispatch)
      navigate('/cart', { state: { buyNowProductId: productId } })
    } catch (err) {
      message.error(err.message || 'Mua ngay thất bại!')
    } finally {
      setBuyNowLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Spin tip="Đang tải sản phẩm..." size="large" />
      </div>
    )
  }

  if (notFound) return <Error404 />

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-5 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <p className="text-base font-medium text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    )
  }

  if (!product) return null

  return (
    <div className="min-h-screen rounded-xl bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto max-w-7xl px-4 py-6 md:py-8">
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span>Trang chủ</span>
          <span>/</span>
          <span>Sản phẩm</span>
          <span>/</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">{product.title}</span>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,700px)_1fr]">
          <ProductGallery
            title={product.title}
            currentImage={currentImage}
            galleryImages={galleryImages}
            selectedImage={selectedImage}
            discountPercent={discountPercent}
            isLiked={isLiked}
            onSelectImage={setSelectedImage}
            onToggleLike={() => setIsLiked(currentState => !currentState)}
          />

          <div className="space-y-5">
            <ProductSummaryPanel
              product={product}
              priceNew={priceNew}
              priceOrigin={priceOrigin}
              discountPercent={discountPercent}
              savings={savings}
            />

            <ProductPurchasePanel
              quantity={quantity}
              maxAvailable={maxAvailable}
              addCartLoading={addCartLoading}
              buyNowLoading={buyNowLoading}
              onQuantityChange={handleQtyInputChange}
              onQuantityBlur={handleQtyBlur}
              onDecrease={() => setQuantity(currentQuantity => String(Math.max(1, +currentQuantity - 1)))}
              onIncrease={() => setQuantity(currentQuantity => String(Math.min(maxAvailable, +currentQuantity + 1)))}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />

            <ProductInfoSections product={product} features={features} />
          </div>
        </div>

        <div id="reviews-section" className="mt-8">
          <ReviewSection productId={productId} />
        </div>

        <ExploreMoreSection productId={productId} product={product} />
      </div>
    </div>
  )
}

export default ProductsDetail
