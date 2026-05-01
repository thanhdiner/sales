import { useCallback, useState } from 'react'
import { message, Modal } from 'antd'
import { syncCartState } from '@/lib/client/clientCache'
import { removeCartItem, updateCartItem } from '@/services/client/commerce/cart'

export function useCartItemActions({ allAvailableSelected, availableIds, cartItems, dispatch, setSelectedItems, t }) {
  const [editingQty, setEditingQty] = useState({})

  const updateQuantity = useCallback(
    async (id, newQuantity) => {
      const prevItems = cartItems

      if (newQuantity <= 0) {
        const updatedItems = cartItems.filter(item => item.productId !== id)
        syncCartState(dispatch, updatedItems)

        setSelectedItems(prev => {
          const newSet = new Set(prev)
          newSet.delete(id)
          return newSet
        })

        try {
          await removeCartItem(id)
        } catch (err) {
          syncCartState(dispatch, prevItems)
          message.error(t('message.removeFailed'))
        }

        return
      }

      const updatedItems = cartItems.map(item => (item.productId === id ? { ...item, quantity: newQuantity } : item))

      syncCartState(dispatch, updatedItems)

      try {
        await updateCartItem({ productId: id, quantity: newQuantity })
      } catch (err) {
        syncCartState(dispatch, prevItems)
        message.error(t('message.updateQuantityFailed'))
      }
    },
    [cartItems, dispatch, setSelectedItems, t]
  )

  const handleQuantityStep = useCallback(
    (id, newQuantity) => {
      setEditingQty(prev => ({ ...prev, [id]: undefined }))
      updateQuantity(id, newQuantity)
    },
    [updateQuantity]
  )

  const handleQtyChange = useCallback((id, value) => {
    if (/^\d*$/.test(value)) {
      setEditingQty(prev => ({ ...prev, [id]: value }))
    }
  }, [])

  const handleQtyBlur = useCallback(
    (id, item) => {
      let valStr = editingQty[id]

      if (valStr === '' || valStr === undefined) {
        setEditingQty(prev => ({ ...prev, [id]: undefined }))
        return
      }

      let val = parseInt(valStr, 10)

      if (isNaN(val) || val < 1) {
        message.warning(t('message.invalidQuantity'))
        setEditingQty(prev => ({ ...prev, [id]: undefined }))
        return
      }

      if (item.stock && val > item.stock) {
        val = item.stock
        message.warning(t('message.maxStock', { count: item.stock }))
      }

      if (val !== item.quantity) {
        updateQuantity(id, val)
      }

      setEditingQty(prev => ({ ...prev, [id]: undefined }))
    },
    [editingQty, t, updateQuantity]
  )

  const removeItem = useCallback(
    id => {
      Modal.confirm({
        title: <span className="text-gray-900 dark:text-gray-100">{t('modal.removeTitle')}</span>,
        content: <span className="text-gray-500 dark:text-gray-400">{t('modal.removeContent')}</span>,
        okText: t('modal.okText'),
        cancelText: t('modal.cancelText'),
        okButtonProps: { danger: true },
        onOk: async () => {
          const prevItems = cartItems
          const updatedItems = cartItems.filter(item => item.productId !== id)

          syncCartState(dispatch, updatedItems)

          setSelectedItems(prev => {
            const newSet = new Set(prev)
            newSet.delete(id)
            return newSet
          })

          try {
            await removeCartItem(id)
            message.success(t('message.removeSuccess'))
          } catch (err) {
            syncCartState(dispatch, prevItems)
            message.error(t('message.removeFailed'))
          }
        }
      })
    },
    [cartItems, dispatch, setSelectedItems, t]
  )

  const handleSelectItem = useCallback(
    id => {
      setSelectedItems(prev => {
        const newSet = new Set(prev)

        if (newSet.has(id)) {
          newSet.delete(id)
        } else {
          newSet.add(id)
        }

        return newSet
      })
    },
    [setSelectedItems]
  )

  const handleSelectAll = useCallback(() => {
    if (allAvailableSelected) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(availableIds))
    }
  }, [allAvailableSelected, availableIds, setSelectedItems])

  return {
    editingQty,
    handleQtyBlur,
    handleQtyChange,
    handleQuantityStep,
    handleSelectAll,
    handleSelectItem,
    removeItem
  }
}
