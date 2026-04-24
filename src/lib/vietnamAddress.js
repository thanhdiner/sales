const ADDRESS_API_URL = 'https://provinces.open-api.vn/api/v1/?depth=3'
const ADDRESS_CACHE_KEY = 'sales_vietnam_address_tree_v1'
const ADDRESS_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000

let addressTreeCache = null
let addressTreeRequest = null

const normalizeText = value => (typeof value === 'string' ? value.trim() : '')

const normalizeCode = value => {
  if (value === undefined || value === null) return ''
  return `${value}`.trim()
}

const ensureArray = value => (Array.isArray(value) ? value : [])

const normalizeSearchText = value => normalizeText(value)
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[đĐ]/g, 'd')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()

const normalizeWard = ward => ({
  code: normalizeCode(ward?.code),
  name: normalizeText(ward?.name)
})

const normalizeDistrict = district => ({
  code: normalizeCode(district?.code),
  name: normalizeText(district?.name),
  wards: ensureArray(district?.wards)
    .map(normalizeWard)
    .filter(item => item.code && item.name)
})

const normalizeProvince = province => ({
  code: normalizeCode(province?.code),
  name: normalizeText(province?.name),
  districts: ensureArray(province?.districts)
    .map(normalizeDistrict)
    .filter(item => item.code && item.name)
})

const sortByName = items => [...items].sort((left, right) => left.name.localeCompare(right.name, 'vi'))

const readAddressCache = () => {
  if (typeof window === 'undefined') return null

  try {
    const rawValue = window.localStorage.getItem(ADDRESS_CACHE_KEY)
    if (!rawValue) return null

    const parsedValue = JSON.parse(rawValue)
    if (!parsedValue?.savedAt || Date.now() - parsedValue.savedAt > ADDRESS_CACHE_TTL_MS) {
      return null
    }

    return ensureArray(parsedValue.data)
  } catch {
    return null
  }
}

const writeAddressCache = data => {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(
      ADDRESS_CACHE_KEY,
      JSON.stringify({
        savedAt: Date.now(),
        data
      })
    )
  } catch {
    // Ignore cache write failures. The request still succeeded.
  }
}

const buildAddressAliases = (name, level) => {
  const fullName = normalizeSearchText(name)
  if (!fullName) return []

  const aliases = new Set([fullName])
  let baseName = fullName

  if (level === 'province') {
    baseName = fullName.replace(/^(tinh|thanh pho)\s+/, '')
    if (baseName && baseName !== fullName) aliases.add(baseName)
    if (baseName) aliases.add(`tp ${baseName}`)
  }

  if (level === 'district') {
    baseName = fullName.replace(/^(quan|huyen|thi xa|thanh pho)\s+/, '')
    if (baseName && baseName !== fullName) aliases.add(baseName)
    if (baseName) {
      aliases.add(`q ${baseName}`)
      aliases.add(`h ${baseName}`)
      aliases.add(`tx ${baseName}`)
      aliases.add(`tp ${baseName}`)
    }
  }

  if (level === 'ward') {
    baseName = fullName.replace(/^(phuong|xa|thi tran)\s+/, '')
    if (baseName && baseName !== fullName) aliases.add(baseName)
    if (baseName) {
      aliases.add(`p ${baseName}`)
      aliases.add(`x ${baseName}`)
      aliases.add(`tt ${baseName}`)
    }
  }

  return [...aliases].filter(Boolean)
}

const findBestAdministrativeMatch = (items, addressText, level) => {
  const normalizedAddress = normalizeSearchText(addressText)
  if (!normalizedAddress) return null

  return ensureArray(items)
    .map(item => {
      const aliases = buildAddressAliases(item.name, level)
      const matchedAlias = aliases
        .filter(alias => normalizedAddress.includes(alias))
        .sort((left, right) => right.length - left.length)[0]

      if (!matchedAlias) return null

      return {
        item,
        score: matchedAlias.length
      }
    })
    .filter(Boolean)
    .sort((left, right) => right.score - left.score)[0]?.item || null
}

const extractAddressLine1FromLegacyText = (rawAddress, province, district, ward) => {
  const segments = normalizeText(rawAddress)
    .split(/[,;\n]/)
    .map(segment => segment.trim())
    .filter(Boolean)

  if (!segments.length) return ''

  const matchedAliases = [
    ...buildAddressAliases(province?.name, 'province'),
    ...buildAddressAliases(district?.name, 'district'),
    ...buildAddressAliases(ward?.name, 'ward')
  ]

  const detailSegments = segments.filter(segment => {
    const normalizedSegment = normalizeSearchText(segment)
    if (!normalizedSegment) return false

    return !matchedAliases.some(alias => (
      normalizedSegment === alias ||
      normalizedSegment.startsWith(`${alias} `) ||
      normalizedSegment.endsWith(` ${alias}`)
    ))
  })

  if (detailSegments.length) {
    return detailSegments.join(', ')
  }

  return normalizeText(rawAddress)
}

export const formatVietnamAddress = address => (
  [
    normalizeText(address?.addressLine1),
    normalizeText(address?.wardName),
    normalizeText(address?.districtName),
    normalizeText(address?.provinceName)
  ]
    .filter(Boolean)
    .join(', ')
)

export const normalizeVietnamAddress = address => {
  const legacyAddress = normalizeText(address?.address)
  const provinceCode = normalizeCode(address?.provinceCode)
  const provinceName = normalizeText(address?.provinceName)
  const districtCode = normalizeCode(address?.districtCode)
  const districtName = normalizeText(address?.districtName)
  const wardCode = normalizeCode(address?.wardCode)
  const wardName = normalizeText(address?.wardName)

  const hasStructuredNames = Boolean(provinceName || districtName || wardName)
  const addressLine1 = normalizeText(address?.addressLine1) || (!hasStructuredNames ? legacyAddress : '')
  const formattedAddress = formatVietnamAddress({
    addressLine1,
    provinceName,
    districtName,
    wardName
  })

  return {
    addressLine1,
    provinceCode,
    provinceName,
    districtCode,
    districtName,
    wardCode,
    wardName,
    address: formattedAddress || legacyAddress
  }
}

export const inferVietnamAddressFromText = (tree, rawAddress) => {
  const normalizedRawAddress = normalizeText(rawAddress)
  if (!normalizedRawAddress) return null

  const province = findBestAdministrativeMatch(tree, normalizedRawAddress, 'province')
  if (!province) return null

  const district = findBestAdministrativeMatch(province.districts, normalizedRawAddress, 'district')
  if (!district) return null

  const ward = findBestAdministrativeMatch(district.wards, normalizedRawAddress, 'ward')
  if (!ward) return null

  return normalizeVietnamAddress({
    addressLine1: extractAddressLine1FromLegacyText(normalizedRawAddress, province, district, ward),
    provinceCode: province.code,
    provinceName: province.name,
    districtCode: district.code,
    districtName: district.name,
    wardCode: ward.code,
    wardName: ward.name,
    address: normalizedRawAddress
  })
}

export const hasAnyStructuredVietnamAddressInput = address => Boolean(
  normalizeText(address?.addressLine1) ||
  normalizeCode(address?.provinceCode) ||
  normalizeText(address?.provinceName) ||
  normalizeCode(address?.districtCode) ||
  normalizeText(address?.districtName) ||
  normalizeCode(address?.wardCode) ||
  normalizeText(address?.wardName)
)

export const hasCompleteStructuredVietnamAddress = address => Boolean(
  normalizeText(address?.addressLine1) &&
  normalizeCode(address?.provinceCode) &&
  normalizeText(address?.provinceName) &&
  normalizeCode(address?.districtCode) &&
  normalizeText(address?.districtName) &&
  normalizeCode(address?.wardCode) &&
  normalizeText(address?.wardName)
)

export const fetchVietnamAddressTree = async () => {
  if (Array.isArray(addressTreeCache)) return addressTreeCache

  const cachedTree = readAddressCache()
  if (cachedTree?.length) {
    addressTreeCache = cachedTree
    return addressTreeCache
  }

  if (addressTreeRequest) return addressTreeRequest

  addressTreeRequest = fetch(ADDRESS_API_URL, { cache: 'force-cache' })
    .then(async response => {
      if (!response.ok) {
        throw new Error('Khong tai duoc danh sach dia chi Viet Nam')
      }

      const payload = await response.json()
      const normalizedTree = sortByName(
        ensureArray(payload)
          .map(normalizeProvince)
          .filter(item => item.code && item.name)
      )

      addressTreeCache = normalizedTree
      writeAddressCache(normalizedTree)
      return normalizedTree
    })
    .finally(() => {
      addressTreeRequest = null
    })

  return addressTreeRequest
}

export const getProvinceOptions = tree => sortByName(ensureArray(tree))

export const getDistrictOptions = (tree, provinceCode) => {
  const normalizedProvinceCode = normalizeCode(provinceCode)
  if (!normalizedProvinceCode) return []

  const province = ensureArray(tree).find(item => item.code === normalizedProvinceCode)
  return province ? sortByName(province.districts) : []
}

export const getWardOptions = (tree, provinceCode, districtCode) => {
  const normalizedProvinceCode = normalizeCode(provinceCode)
  const normalizedDistrictCode = normalizeCode(districtCode)

  if (!normalizedProvinceCode || !normalizedDistrictCode) return []

  const province = ensureArray(tree).find(item => item.code === normalizedProvinceCode)
  const district = province?.districts?.find(item => item.code === normalizedDistrictCode)

  return district ? sortByName(district.wards) : []
}
