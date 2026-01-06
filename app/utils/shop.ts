export function isShopEnabled(): boolean {
  const value = process.env.NEXT_PUBLIC_SHOP_ENABLED
  return value === '1' || value === 'true'
}

