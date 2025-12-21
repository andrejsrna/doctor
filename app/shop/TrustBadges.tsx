import { FaLock, FaShippingFast, FaStar } from 'react-icons/fa'

export default function TrustBadges({
  className = '',
  variant = 'default',
}: {
  className?: string
  variant?: 'default' | 'compact'
}) {
  const itemClass =
    variant === 'compact'
      ? 'rounded-2xl border border-white/10 bg-white/5 p-4'
      : 'rounded-2xl border border-purple-500/20 bg-white/5 p-5'

  const iconWrapClass =
    variant === 'compact'
      ? 'h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-200'
      : 'h-11 w-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-200'

  return (
    <div className={`grid gap-4 sm:grid-cols-3 ${className}`}>
      <div className={itemClass}>
        <div className={iconWrapClass}>
          <FaLock />
        </div>
        <p className="font-semibold text-white mt-3">Secure checkout</p>
        <p className="text-sm text-gray-200 mt-1">Pay safely with Stripe. Your details are encrypted and handled by Stripe.</p>
      </div>

      <div className={itemClass}>
        <div className={iconWrapClass}>
          <FaShippingFast />
        </div>
        <p className="font-semibold text-white mt-3">Made to order</p>
        <p className="text-sm text-gray-200 mt-1">Printed on demand to reduce waste — production starts after purchase.</p>
      </div>

      <div className={itemClass}>
        <div className={iconWrapClass}>
          <FaStar />
        </div>
        <p className="font-semibold text-white mt-3">Artist-first brand</p>
        <p className="text-sm text-gray-200 mt-1">Support the project directly and help us fund more releases and content.</p>
      </div>
    </div>
  )
}

