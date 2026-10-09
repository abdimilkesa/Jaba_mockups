import { useEffect, useState } from 'react'
import { Search, SlidersHorizontal, ArrowUpRight, X } from 'lucide-react'
import { useSearchParams, Link } from 'react-router-dom'
import { api, getErrorMessage } from '../lib/api'
import MockupCard from '../components/MockupCard'
import { EmptyState, Loading } from '../components/Loading'

export default function Browse() {
  const [params, setParams] = useSearchParams()
  const [search, setSearch] = useState(params.get('q') || '')
  const [categories, setCategories] = useState([])
  const [items, setItems] = useState([])
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const category = params.get('category') || ''
  const page = Number(params.get('page') || 1)
  useEffect(() => { api.get('/categories').then(r => setCategories(r.data)).catch(() => {}) }, [])
  useEffect(() => {
    setLoading(true); setError('')
    const query = new URLSearchParams({ page: String(page), limit: '12' })
    if (params.get('q')) query.set('q', params.get('q'))
    if (category) query.set('category', category)
    if (params.get('featured')) query.set('featured', params.get('featured'))
    api.get(`/mockups?${query}`).then(({ data }) => { setItems(data.data || []); setPagination(data.pagination || { page: 1, pages: 1, total: 0 }) }).catch(e => setError(getErrorMessage(e))).finally(() => setLoading(false))
  }, [params.toString()])
  const searchSubmit = e => { e.preventDefault(); const next = new URLSearchParams(params); search.trim() ? next.set('q', search.trim()) : next.delete('q'); next.delete('page'); setParams(next) }
  const chooseCategory = value => { const next = new URLSearchParams(params); value ? next.set('category', value) : next.delete('category'); next.delete('page'); setParams(next) }
  const activeCategory = categories.find(c => c.slug === category || c._id === category)
  return <section className="browse-page"><div className="container"><div className="browse-top"><div><p className="eyebrow"><span className="eyebrow-line"/> THE JABA COLLECTION</p><h1>Explore the <span className="serif-italic">library.</span></h1><p className="browse-subtitle">A good starting point for your next great design.</p></div><div className="browse-total"><strong>{pagination.total}</strong><span>mockups<br/>and counting</span></div></div>
    <div className="browse-toolbar"><form className="browse-search" onSubmit={searchSubmit}><Search size={18}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Try “packaging”, “branding”…"/><button type="submit">Search</button></form><div className="filter-wrap"><SlidersHorizontal size={16}/><select value={category} onChange={e => chooseCategory(e.target.value)} aria-label="Filter by category"><option value="">All categories</option>{categories.map(c => <option key={c._id} value={c.slug || c._id}>{c.name}</option>)}</select></div></div>
    <div className="active-filters">{activeCategory && <button className="filter-chip" onClick={() => chooseCategory('')}>{activeCategory.name}<X size={13}/></button>}{params.get('q') && <button className="filter-chip" onClick={() => { const n = new URLSearchParams(params); n.delete('q'); setSearch(''); setParams(n) }}>“{params.get('q')}”<X size={13}/></button>}{params.get('featured') && <span className="filter-chip">Featured</span>}{(activeCategory || params.get('q') || params.get('featured')) && <button className="clear-filters" onClick={() => { setSearch(''); setParams({}) }}>Clear filters</button>}</div>
    {error && <div className="notice notice-error">{error} — check that the backend is running.</div>}
    {loading ? <Loading/> : items.length ? <><div className="browse-results-heading"><p>{pagination.total} result{pagination.total === 1 ? '' : 's'}{activeCategory ? ` in ${activeCategory.name}` : ''}</p><span>Newest first <ArrowUpRight size={13}/></span></div><div className="mockup-grid">{items.map((mockup, index) => <MockupCard key={mockup._id} mockup={mockup} index={index}/>)}</div>{pagination.pages > 1 && <div className="pagination"><button disabled={page <= 1} onClick={() => { const n = new URLSearchParams(params); n.set('page', String(page - 1)); setParams(n) }}>Previous</button><span>Page {page} of {pagination.pages}</span><button disabled={page >= pagination.pages} onClick={() => { const n = new URLSearchParams(params); n.set('page', String(page + 1)); setParams(n) }}>Next <ArrowUpRight size={14}/></button></div>}</> : <EmptyState title="No mockups found" message="Try another search or choose a different category. New designs will appear here as they are added."/>}
    <div className="browse-bottom-note"><span>✳</span><p>Have a design in mind? There's a mockup for that.</p><Link to="/register">Join the community <ArrowUpRight size={14}/></Link></div>
  </div></section>
}
