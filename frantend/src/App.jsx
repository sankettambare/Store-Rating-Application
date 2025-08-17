import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { StoreList } from './pages/StoreList'
import { AdminDashboard } from './pages/AdminDashboard'
import { OwnerDashboard } from './pages/OwnerDashboard'



export function Private({ children, role }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!token || !user) return <Navigate to="/login" />; // not logged in
  if (role && user.role !== role) return <Navigate to="/stores" />; // role mismatch

  return children;
}

export const App = () => {
  return (
    <div className="min-h-screen bg-indigo-200">
      <Header />
      <div className='p-6'>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/stores" element={<Private><StoreList /></Private>} />
          <Route path="/owner" element={<Private role="owner"><OwnerDashboard /></Private>} />
          <Route path="/admin" element={<Private role="admin"><AdminDashboard /></Private>} />
          <Route path="/stores" element={<Private><StoreList /></Private>} />

        </Routes>

      </div>
    </div>
  )
}
