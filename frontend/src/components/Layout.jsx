import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ArrowUpRight, Menu, X, Sparkles, UserRound, LogOut, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Layout({ children }) {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const navClass = ({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`
  const signOut = () => { logout(); navigate('/') }
  return <div className="min-h-screen bg-paper text-ink">
    <div className="announcement"><Sparkles size={14} /> A better canvas for your next big idea <span className="announcement-dot">·</span> Fresh mockups, made for makers</div>
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}><span className="brand-mark">J</span><span>JABA<span className="brand-light"> MOCKUPS</span></span></Link>
        <nav className={`main-nav ${open ? 'main-nav-open' : ''}`}>
          <NavLink to="/browse" className={navClass} onClick={() => setOpen(false)}>Explore mockups</NavLink>
          <a className="nav-link" href="/browse?featured=true" onClick={() => setOpen(false)}>Featured</a>
          {user?.role === 'admin' && <NavLink to="/admin" className={navClass} onClick={() => setOpen(false)}><LayoutDashboard size={15}/> Dashboard</NavLink>}
          <div className="mobile-nav-actions">
            {user ? <button className="btn btn-dark" onClick={signOut}>Sign out <LogOut size={15}/></button> : <><Link className="nav-link" to="/login" onClick={() => setOpen(false)}>Log in</Link><Link className="btn btn-dark" to="/register" onClick={() => setOpen(false)}>Join for free <ArrowUpRight size={16}/></Link></>}
          </div>
        </nav>
        <div className="header-actions">
          {user ? <><span className="user-chip"><UserRound size={15}/>{user.name?.split(' ')[0] || 'Account'}</span><button className="icon-btn" title="Sign out" onClick={signOut}><LogOut size={17}/></button></> : <><Link className="login-link" to="/login">Log in</Link><Link className="btn btn-dark header-cta" to="/register">Get started <ArrowUpRight size={16}/></Link></>}
        </div>
        <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X/> : <Menu/>}</button>
      </div>
    </header>
    <main>{children}</main>
    <footer className="site-footer"><div className="container footer-top"><Link to="/" className="brand"><span className="brand-mark">J</span><span>JABA<span className="brand-light"> MOCKUPS</span></span></Link><p>Good design deserves a great presentation.</p><Link to="/browse" className="footer-explore">Explore the library <ArrowUpRight size={16}/></Link></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} JABA MOCKUPS</span><span>Built for the people who make things.</span></div></footer>
  </div>
}
