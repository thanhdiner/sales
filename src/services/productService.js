import { get } from '../utils/request'

export const getProducts = async () => {
  return await get('products')
}
