import React, { useEffect, useState } from 'react';
import API from '../api';

export const OwnerDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [stores, setStores] = useState([]);

  useEffect(() => { load(); }, []);

  async function load() {
    if (!user) return;
    try {
      const res = await API.get('/stores');
      const own = res.data.filter(r => r.ownerId === user.id);
      setStores(own);
    } catch(err) {
      console.error(err);
    }
  }

  async function viewRatings(storeId) {
    try {
      const res = await API.get(`/stores/${storeId}/ratings`);
      const ratings = res.data.map(r => ({ user: r.user.name, score: r.score }));
      alert(JSON.stringify(ratings, null, 2));
    } catch(err) {
      alert(err?.response?.data?.message || 'Error fetching ratings');
    }
  }

  if (!user) return <div>Please login</div>;

  return (
    <div className='max-w-4xl mx-auto'>
      <h2 className='text-xl mb-4'>Owner Dashboard</h2>
      <div className='grid gap-4'>
        {stores.map(s => (
          <div key={s.id} className='bg-white p-4 rounded shadow'>
            <div className='font-bold'>{s.name}</div>
            <div>Average: {s.avg ? Number(s.avg).toFixed(2) : 'No rating'}</div>
            <button className='mt-2 p-2 border' onClick={() => viewRatings(s.id)}>View Ratings</button>
          </div>
        ))}
      </div>
    </div>
  );
};
