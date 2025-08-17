import React, { useEffect, useState } from 'react'
import API from '../api'

export const AdminDashboard = () => {
  const [stats, setStats] = useState({})
  const [users, setUsers] = useState([])

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      const s = await API.get('/dashboard')
      setStats(s.data)
      const u = await API.get('/users')
      setUsers(u.data)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl mb-4">Admin Dashboard</h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white rounded shadow">
          Users<br />{stats.totalUsers}
        </div>
        <div className="p-4 bg-white rounded shadow">
          Stores<br />{stats.totalStores}
        </div>
        <div className="p-4 bg-white rounded shadow">
          Ratings<br />{stats.totalRatings}
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-bold mb-2">Users</h3>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
