import { useEffect, useMemo, useRef, useState } from 'react'
import { Input, message, Modal, Spin } from 'antd'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Error404 from '@/pages/client/Error404'
import { syncCartFromServer } from '@/lib/client/clientCache'
import { getCartUniqueItemLimitMessage, hasReachedCartUniqueItemLimit } from '@/lib/cart/cartLimits'
import { addToCart } from '@/services/client/commerce/cart'
import { getProductDetail, subscribeBackInStock } from '@/services/client/commerce/product'
import SEO from '@/components/shared/SEO'
import ProductGallery from './components/ProductGallery'
import ExploreMore from './components/ExploreMore'
import ProductBreadcrumb from './components/ProductBreadcrumb'
import ProductInfo from './components/ProductInfo'
import ProductPurchasePanel from './components/ProductPurchasePanel'
import ProductSummaryPanel from './components/ProductSummaryPanel'
import ProductTabs from './components/ProductTabs'
import { formatPrice, getGalleryImages, getMaxAvailable, getProductFeatures, getProductId, getProductPricing } from './helpers'
import { getStoredClientAccessToken } from '@/utils/auth'
import useCurrentLanguage from '@/hooks/shared/useCurrentLanguage'
import { useRegisterPageEntity } from '@/features/chat/pageContext/PageContextProvider'
import './index.scss'

const EMPTY_CART_ITEMS = []
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const isMobileDevice = () => {
  if (typeof navigator === 'undefined') return false

  if (typeof navigator.userAgentData?.mobile === 'boolean') {
    return navigator.userAgentData.mobile
  }

  const userAgent = navigator.userAgent || ''
  const platform = navigator.platform || ''
  const isIPadOS = platform === 'MacIntel' && navigator.maxTouchPoints > 1

  return isIPadOS || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
}

const writeTextToClipboard = async text => {
  if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
    throw new Error('Clipboard API is unavailable')
  }

  await navigator.clipboard.writeText(text)
}

const canUseNativeProductShare = shareData => {
  if (!isMobileDevice() || typeof navigator === 'undefined' || typeof navigator.share !== 'function') {
    return false
  }

  if (typeof navigator.canShare !== 'function') {
    return true
  }

  try {
    return navigator.canShare(shareData)
  } catch {
    return false
  }
}

function Detail() {
  const { t, i18n } = useTranslation('clientProducts')
  const { slug } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const language = useCurrentLanguage()
  const cartItems = useSelector(state => state.cart.items ?? EMPTY_CART_ITEMS)
  const clientUser = useSelector(state => state.clientUser.user)
  const previousSlugRef = useRef('')

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorKey, setErrorKey] = useState('')
  const [notFound, setNotFound] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [quantity, setQuantity] = useState('1')
  const [maxAvailable, setMaxAvailable] = useState(0)
  const [addCartLoading, setAddCartLoading] = useState(false)
  const [buyNowLoading, setBuyNowLoading] = useState(false)
  const [notifyLoading, setNotifyLoading] = useState(false)
  const [notifyEmail, setNotifyEmail] = useState('')
  const [notifyModalOpen, setNotifyModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('description')
  const [manualShareUrl, setManualShareUrl] = useState('')

  const flashSaleInfo = location.state?.flashSaleInfo || null
  const productId = getProductId(product)
  const galleryImages = getGalleryImages(product)
  const currentImage = galleryImages[selectedImage] || product?.thumbnail
  const features = getProductFeatures(product)
  const { priceOrigin, priceNew, discountPercent, savings, isFlashSale } = getProductPricing(product, flashSaleInfo)
  const isOutOfStock = Number(product?.stock || 0) <= 0
  const pageEntity = useMemo(() => {
    if (!product) return null

    return {
      type: 'product',
      id: productId,
      slug,
      title: product.title,
      price: priceNew,
      stock: product.stock,
      category: product.productCategory?.title
    }
  }, [product, productId, priceNew, slug])

  useRegisterPageEntity(pageEntity)

  useEffect(() => {
    const fetchProduct = async () => {
      const slugChanged = previousSlugRef.current !== slug
      const shouldShowLoading = slugChanged || !product

      try {
        previousSlugRef.current = slug

        if (shouldShowLoading) {
          setLoading(true)
          if (slugChanged) setProduct(null)
        }

        setErrorKey('')
        setNotFound(false)

        const productData = await getProductDetail(slug)

        if (!productData) {
          setNotFound(true)
          return
        }

        setProduct(productData)
        setSelectedImage(0)
        setActiveTab('description')
      } catch {
        setErrorKey('productDetail.message.loadFailed')
      } finally {
        if (shouldShowLoading) setLoading(false)
      }
    }

    fetchProduct()
  }, [language, slug])

  useEffect(() => {
    setNotifyEmail(clientUser?.email || '')
    setNotifyModalOpen(false)
  }, [clientUser?.email, slug])

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
    const upperLimit = Math.max(1, maxAvailable || 0)
    if (nextQuantity > upperLimit) nextQuantity = upperLimit

    setQuantity(String(nextQuantity))
  }

  const getSafeQuantity = value => {
    const nextQuantity = parseInt(value, 10)
    return Number.isNaN(nextQuantity) ? 1 : nextQuantity
  }

  const getNormalizedQuantity = () => {
    const upperLimit = Math.max(1, maxAvailable || 0)
    return Math.min(Math.max(1, getSafeQuantity(quantity)), upperLimit)
  }

  const handleDecreaseQuantity = () => {
    setQuantity(currentQuantity => String(Math.max(1, getSafeQuantity(currentQuantity) - 1)))
  }

  const handleIncreaseQuantity = () => {
    setQuantity(currentQuantity => String(Math.min(maxAvailable, getSafeQuantity(currentQuantity) + 1)))
  }

  const handleToggleLike = () => {
    setIsLiked(currentState => !currentState)
  }

  const handleShareProduct = async () => {
    if (!product || typeof window === 'undefined') return

    const productTitle = product.title || t('productDetail.seo.title')
    const shareData = {
      title: productTitle,
      text: t('productDetail.shareText', { title: productTitle }),
      url: window.location.href
    }
    const canUseNativeShare = canUseNativeProductShare(shareData)

    const copyShareUrl = async () => {
      await writeTextToClipboard(shareData.url)
      message.success(t('productDetail.message.shareCopySuccess'))
    }

    try {
      if (canUseNativeShare) {
        await navigator.share(shareData)
        message.success(t('productDetail.message.shareSuccess'))
        return
      }

      await copyShareUrl()
    } catch (error) {
      if (error?.name === 'AbortError') return

      if (canUseNativeShare) {
        try {
          await copyShareUrl()
          return
        } catch {
          // Show the manual copy modal below.
        }
      }

      setManualShareUrl(shareData.url)
      message.error(t('productDetail.message.shareFailed'))
    }
  }

  const handleOpenReviews = () => {
    setActiveTab('reviews')

    window.requestAnimationFrame(() => {
      document.getElementById('product-detail-tabs')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    })
  }

  const buildCartPayload = () => {
    const normalizedQuantity = getNormalizedQuantity()

    let payload = {
      productId,
      quantity: normalizedQuantity
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

  const submitBackInStockNotification = async emailValue => {
    if (notifyLoading || !productId) return

    const email = String(emailValue || clientUser?.email || '').trim()

    if (!email) {
      setNotifyEmail('')
      setNotifyModalOpen(true)
      return
    }

    if (!EMAIL_REGEX.test(email)) {
      setNotifyEmail(email)
      setNotifyModalOpen(true)
      message.warning(t('productDetail.message.notifyEmailInvalid'))
      return
    }

    setNotifyLoading(true)

    try {
      const result = await subscribeBackInStock(productId, { email })
      message.success(result?.message || t('productDetail.message.notifySuccess'))
      setNotifyModalOpen(false)
      setNotifyEmail(email)
    } catch (err) {
      message.error(err.message || t('productDetail.message.notifyFailed'))
    } finally {
      setNotifyLoading(false)
    }
  }

  const handleNotifyWhenBackInStock = () => {
    submitBackInStockNotification(clientUser?.email || notifyEmail)
  }

  const handleConfirmNotifyEmail = () => {
    submitBackInStockNotification(notifyEmail)
  }

  const handleAddToCart = async () => {
    if (addCartLoading) return
    if (!ensureLoggedIn(t('productDetail.message.loginRequiredAddCart'))) return

    if (hasReachedCartUniqueItemLimit(cartItems, productId)) {
      message.warning(getCartUniqueItemLimitMessage())
      return
    }

    setAddCartLoading(true)

    try {
      const normalizedQuantity = getNormalizedQuantity()

      if (normalizedQuantity > maxAvailable) {
        message.warning(t('productDetail.message.maxAddToCart', { count: maxAvailable }))
        return
      }

      setQuantity(String(normalizedQuantity))
      await addToCart(buildCartPayload())
      await syncCartFromServer(dispatch)
      setQuantity('1')
      message.success(t('productDetail.message.addCartSuccess'))
    } catch (err) {
      message.error(err.message || t('productDetail.message.addCartFailed'))
    } finally {
      setAddCartLoading(false)
    }
  }

  const handleBuyNow = async () => {
    if (buyNowLoading) return
    if (!ensureLoggedIn(t('productDetail.message.loginRequiredBuyNow'))) return

    if (hasReachedCartUniqueItemLimit(cartItems, productId)) {
      message.warning(getCartUniqueItemLimitMessage())
      return
    }

    setBuyNowLoading(true)

    try {
      const normalizedQuantity = getNormalizedQuantity()

      if (normalizedQuantity > maxAvailable) {
        navigate('/cart', { state: { buyNowProductId: productId } })
        return
      }

      setQuantity(String(normalizedQuantity))
      await addToCart(buildCartPayload())
      await syncCartFromServer(dispatch)
      navigate('/cart', { state: { buyNowProductId: productId } })
    } catch (err) {
      message.error(err.message || t('productDetail.message.buyNowFailed'))
    } finally {
      setBuyNowLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="product-detail-page flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <SEO title={t('productDetail.seo.title')} noIndex />
        <Spin tip={t('productDetail.loading')} size="large" />
      </div>
    )
  }

  if (notFound) return <Error404 />

  if (errorKey) {
    return (
      <div className="product-detail-page flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <SEO title={t('productDetail.seo.title')} noIndex />
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-5 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <p className="text-base font-medium text-red-600 dark:text-red-400">{t(errorKey)}</p>
        </div>
      </div>
    )
  }

  if (!product) return null

  return (
    <div className="product-detail-page min-h-screen bg-gray-50 dark:bg-gray-950">
      <SEO
        title={product.title || t('productDetail.seo.title')}
        description={product.description?.replace(/<[^>]*>/g, '').slice(0, 160)}
        type="product"
      />

      <div className="product-detail-page__inner">
        <ProductBreadcrumb product={product} />

        <div className="product-detail-main-grid">
          <div className="product-detail-gallery-column" data-page-section="product_gallery">
            <div className="product-detail-gallery-pin">
              <ProductGallery
                title={product.title}
                currentImage={currentImage}
                galleryImages={galleryImages}
                selectedImage={selectedImage}
                discountPercent={discountPercent}
                isLiked={isLiked}
                onSelectImage={setSelectedImage}
                onShare={handleShareProduct}
                onToggleLike={handleToggleLike}
              />
            </div>
          </div>

          <div className="product-detail-side-stack" data-page-section="product_summary">
            <ProductSummaryPanel
              product={product}
              priceNew={priceNew}
              priceOrigin={priceOrigin}
              discountPercent={discountPercent}
              savings={savings}
              onOpenReviews={handleOpenReviews}
            />

            <div data-page-section="purchase_panel">
              <ProductPurchasePanel
                quantity={quantity}
                maxAvailable={maxAvailable}
                addCartLoading={addCartLoading}
                buyNowLoading={buyNowLoading}
                notifyLoading={notifyLoading}
                isOutOfStock={isOutOfStock}
                onQuantityChange={handleQtyInputChange}
                onQuantityBlur={handleQtyBlur}
                onDecrease={handleDecreaseQuantity}
                onIncrease={handleIncreaseQuantity}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                onNotifyWhenBackInStock={handleNotifyWhenBackInStock}
                isLiked={isLiked}
                onToggleLike={handleToggleLike}
              />
            </div>

            <div data-page-section="product_info">
              <ProductInfo product={product} features={features} />
            </div>
          </div>
        </div>

        <div className="product-detail-tabs-wrap" data-page-section={activeTab}>
          <ProductTabs
            product={product}
            productId={productId}
            features={features}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        <ExploreMore productId={productId} product={product} />
      </div>

      <Modal
        open={notifyModalOpen}
        title={t('productDetail.notifyModal.title')}
        onCancel={() => setNotifyModalOpen(false)}
        onOk={handleConfirmNotifyEmail}
        confirmLoading={notifyLoading}
        okText={t('productDetail.notifyModal.submit')}
        cancelText={t('productDetail.notifyModal.cancel')}
        destroyOnClose
      >
        <div className="space-y-3 pt-1">
          <p className="m-0 text-sm leading-6 text-gray-600 dark:text-gray-300">
            {t('productDetail.notifyModal.description')}
          </p>
          <Input
            type="email"
            value={notifyEmail}
            onChange={event => setNotifyEmail(event.target.value)}
            onPressEnter={handleConfirmNotifyEmail}
            placeholder={t('productDetail.notifyModal.emailPlaceholder')}
            autoFocus
          />
        </div>
      </Modal>

      <Modal
        open={Boolean(manualShareUrl)}
        title={t('productDetail.shareModal.title')}
        onCancel={() => setManualShareUrl('')}
        footer={null}
        destroyOnClose
      >
        <div className="space-y-3 pt-1">
          <p className="m-0 text-sm leading-6 text-gray-600 dark:text-gray-300">
            {t('productDetail.shareModal.description')}
          </p>
          <Input
            readOnly
            value={manualShareUrl}
            onClick={event => event.currentTarget.select()}
            onFocus={event => event.currentTarget.select()}
          />
        </div>
      </Modal>

      <div className="product-detail-sticky-actions">
        <div>
          <span>{t('productDetail.stickyActions.price')}</span>
          <strong>{formatPrice(priceNew, i18n.language)}</strong>
        </div>

        {isOutOfStock ? (
          <button
            type="button"
            className="product-detail-sticky-notify"
            onClick={handleNotifyWhenBackInStock}
            disabled={notifyLoading}
          >
            {t('productDetail.purchasePanel.notifyWhenBackInStock')}
          </button>
        ) : (
          <>
            <button type="button" onClick={handleAddToCart} disabled={addCartLoading || maxAvailable <= 0}>
              {t('productDetail.purchasePanel.addToCart')}
            </button>

            <button type="button" onClick={handleBuyNow} disabled={buyNowLoading || maxAvailable <= 0}>
              {t('productDetail.purchasePanel.buyNow')}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default Detail
