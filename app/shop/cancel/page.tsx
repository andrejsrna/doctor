import Link from 'next/link'

export default function ShopCancelPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <section className="max-w-2xl mx-auto px-4 py-20 space-y-6">
        <h1 className="text-3xl font-bold">Checkout canceled</h1>
        <p className="text-gray-200">No payment was taken.</p>
        <Link href="/shop" className="inline-block px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 transition-colors text-white font-semibold">
          Back to shop
        </Link>
      </section>
    </div>
  )
}

