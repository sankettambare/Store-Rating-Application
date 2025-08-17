import React, { useState } from 'react'
import API from '../api'
import { useNavigate } from 'react-router-dom'


export const Register = () => {
    const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [address,setAddress]=useState('');
  const [password,setPassword]=useState('');
  const navigate = useNavigate();
  async function submit(e){
    e.preventDefault();
    try{
      const { data } = await API.post('/auth/register',{ name, email, address, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/login');
    }catch(err){ alert(err?.response?.data?.message || 'Error'); }
  }
  return (
        <div className="max-w-md mx-auto my-20 bg-white p-6 rounded shadow">
      <h2 className="text-xl mb-4">Register</h2>
      <form onSubmit={submit}>
        <input className="w-full p-2 border mb-2" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="w-full p-2 border mb-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full p-2 border mb-2" placeholder="Address" value={address} onChange={e=>setAddress(e.target.value)} />
        <input type="password" className="w-full p-2 border mb-2" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="w-full p-2 bg-green-600 text-white">Sign Up</button>
      </form>
    </div>
  )
}
