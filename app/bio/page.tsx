import dynamic from 'next/dynamic'

// Create a static loading component
const LoadingComponent = () => (
  <div className="min-h-screen py-32 px-4">
    <div className="max-w-4xl mx-auto text-center">
      <div className="animate-pulse text-purple-500">Loading...</div>
    </div>
  </div>
)

// Dynamically import the BioLinks component with SSR disabled
const BioLinks = dynamic(() => import('@/app/components/BioLinks'), {
  ssr: false,
  loading: LoadingComponent,
})

export default function BioPage() {
  return <BioLinks />
}