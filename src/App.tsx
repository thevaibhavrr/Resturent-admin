import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardLayout from './components/DashboardLayout'
import Dashboard from './pages/Dashboard'
import Restaurants from './pages/Restaurants'
import Plans from './pages/Plans'
import { Toaster } from './components/Toast'

interface User {
  id: string;
  username: string;
  role: string;
  email: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('superadmin_token')
    const userData = localStorage.getItem('superadmin_user')
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('superadmin_token')
        localStorage.removeItem('superadmin_user')
      }
    }
    setLoading(false)
  }, [])

  const handleLogin = (userData: User, token: string) => {
    localStorage.setItem('superadmin_token', token)
    localStorage.setItem('superadmin_user', JSON.stringify(userData))
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('superadmin_token')
    localStorage.removeItem('superadmin_user')
    setUser(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        {!user ? (
          <>
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<DashboardLayout user={user} onLogout={handleLogout} />}>
              <Route index element={<Dashboard />} />
              <Route path="restaurants" element={<Restaurants />} />
              <Route path="plans" element={<Plans />} />
            </Route>
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  )
}

export default App
