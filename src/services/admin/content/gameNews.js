import { get, patch } from '@/utils/request'

export const getGameNewsContent = () => {
  return get('admin/game-news')
}

export const updateGameNewsContent = data => {
  return patch('admin/game-news', data)
}
