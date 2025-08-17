import React, { useEffect, useState } from 'react';
import API from '../api';

export function StoreList() {
  const [stores, setStores] = useState([]);
  const [q, setQ] = useState('');

  // Load stores with optional search query
  async function load(search = '') {
    try {
      const res = await API.get('/stores', { params: { q: search } });
      setStores(res.data);
    } catch (err) {
      alert(err?.response?.data?.message || 'Error loading stores');
    }
  }

  // Load all stores on first render
  useEffect(() => {
    load();
  }, []);

  // Submit rating
  async function rate(id, score) {
    try {
      await API.post(`/stores/${id}/rate`, { score });
      alert('Rated!');
      load(q); // reload stores with current search
    } catch (err) {
      alert(err?.response?.data?.message || 'Error rating store');
    }
  }

  // Handle search button click
  function handleSearch() {
    load(q); // pass current search value
  }

  return (
    <div className="max-w-4xl mx-auto my-10">
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          className="flex-1 p-2 border rounded"
          placeholder="Search stores"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {stores.map((it) => (
          <div key={it.store.id} className="p-4 bg-white rounded shadow">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-bold">{it.store.name}</div>
                <div className="text-sm">{it.store.address}</div>
                <div className="text-sm">
                  Overall: {it.avg ? Number(it.avg).toFixed(2) : 'No ratings'}
                </div>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => rate(it.store.id, s)}
                    className="p-2 border rounded hover:bg-gray-100"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
        {stores.length === 0 && (
          <div className="text-center text-gray-500">No stores found</div>
        )}
      </div>
    </div>
  );
}
