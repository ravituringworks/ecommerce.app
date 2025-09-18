'use client'

export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
      <h2 className="text-3xl font-bold mb-3">Something went wrong!</h2>
      <p className="text-gray-600 mb-6">{error.message || 'An unexpected error occurred.'}</p>
      <button className="btn-primary" onClick={() => reset()}>Try again</button>
    </div>
  )
}
