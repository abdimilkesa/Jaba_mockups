import { ArrowUpRight, Download, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getImageUrl } from '../lib/api'

export default function MockupCard({ mockup, index = 0 }) {
  const category = typeof mockup.category === 'object' ? mockup.category?.name : 'Mockup'
  return <article className="mockup-card" style={{ '--card-delay': `${index * 55}ms` }}>
    <Link to={`/mockups/${mockup._id}`} className="mockup-image-wrap" aria-label={`View ${mockup.title}`}>
      {mockup.previewImage ? <img className="mockup-image" src={getImageUrl(mockup.previewImage)} alt={mockup.title} loading="lazy" /> : <div className="image-fallback"><span>J.</span></div>}
      <span className="image-view"><ArrowUpRight size={18}/></span>
      {mockup.featured && <span className="featured-pill">Featured</span>}
    </Link>
    <div className="mockup-card-info"><div><p className="eyebrow category-label">{category}</p><Link to={`/mockups/${mockup._id}`} className="mockup-title">{mockup.title}</Link></div><span className="download-count"><Download size={13}/>{mockup.downloads || 0}</span></div>
  </article>
}
