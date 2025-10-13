import { useParams } from 'react-router-dom'

export default function Tag() {
  const { slug } = useParams()
  return <div className="container-custom py-8">Tag: {slug}</div>
}
