import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import PostJob from './pages/PostJob'
import Dashboard from './pages/Dashboard'
import EditJob from './pages/EditJob'
import Profile from './pages/Profile'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="bg-slate-950 min-h-screen">
          <Navbar />
          <ToastContainer position="top-right" autoClose={3000} theme="dark" />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/edit-job/:id" element={<EditJob />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
