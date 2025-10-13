import { useSearchParams } from 'react-router-dom'

export default function Search() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')

  return (
    <div className="container-custom py-8">
      <h1 className="text-2xl font-bold mb-4">Search Results</h1>
      <p className="text-gray-600">Searching for: {query}</p>
    </div>
  )
}
