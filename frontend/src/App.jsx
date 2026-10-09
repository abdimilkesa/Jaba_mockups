import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Browse from './pages/Browse'
import MockupDetail from './pages/MockupDetail'
import Auth from './pages/Auth'
import Admin from './pages/Admin'

function AppRoutes() {
  return <Routes>
    <Route path="/" element={<Layout><Home /></Layout>} />
    <Route path="/browse" element={<Layout><Browse /></Layout>} />
    <Route path="/mockups/:id" element={<Layout><MockupDetail /></Layout>} />
    <Route path="/login" element={<Auth mode="login" />} />
    <Route path="/register" element={<Auth mode="register" />} />
    <Route path="/admin" element={<Layout><Admin /></Layout>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
}
export default function App() { return <BrowserRouter><AuthProvider><AppRoutes /></AuthProvider></BrowserRouter> }
