import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import API from '../api'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e){
    e.preventDefault();
    try{

        const {data} = await API.post('auth/login',{email,password});
        localStorage.setItem('token',data.token);
        localStorage.setItem('user',JSON.stringify(data.user))
        navigate('/stores');

    }catch(err){
        alert(err?.response?.data?.message || 'Error')
    }

  }
  return (
    <div className="max-w-md mx-auto my-20 bg-white p-6 rounded shadow">
      <h2 className="text-xl mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          className="w-full p-2 border mb-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full p-2 border mb-2"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
        >
          Login
        </button>
      </form>
      <div className="mt-3 text-sm">
        No account? <Link to="/register" className="text-blue-600">Register</Link>
      </div>
    </div>
  )
}
