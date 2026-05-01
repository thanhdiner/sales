export const normalizeBannerActiveValue = value => value === true || value === 'true' || value === 1 || value === '1'

export const getBannerFileList = banner => {
  if (!banner?.img) {
    return []
  }

  return [
    {
      uid: banner._id,
      name: banner.img.split('/').pop(),
      status: 'done',
      url: banner.img
    }
  ]
}
