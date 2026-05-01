import { get, patch } from '@/utils/request'

export const getGameAccountContent = () => {
  return get('admin/game-account')
}

export const updateGameAccountContent = data => {
  return patch('admin/game-account', data)
}
