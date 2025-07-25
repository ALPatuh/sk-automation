import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SKList = () => {
  const [sks, setSks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSKs = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            'x-auth-token': localStorage.getItem('token')
          },
          params: {
            status: statusFilter,
            search: searchTerm
          }
        };
        const res = await axios.get('/api/sk', config);
        setSks(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err.response ? err.response.data : err.message);
        setError('Failed to fetch SKs');
        setLoading(false);
      }
    };

    fetchSKs();
  }, [statusFilter, searchTerm]);

  const handleArchive = async (id) => {
    try {
      const config = {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      };
      await axios.put(`/api/sk/archive/${id}`, {}, config);
      // Refresh the list after archiving
      setStatusFilter(''); // Clear filter to show all (including newly archived)
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      alert('Failed to archive SK');
    }
  };

  if (loading) return <div>Loading SKs...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Daftar Surat Keputusan Direksi</h1>

      <div>
        <label>Filter Status:</label>
        <select onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
          <option value="">All</option>
          <option value="draft">Draft</option>
          <option value="final">Final</option>
          <option value="archived">Archived</option>
        </select>
      </div>
      <div>
        <label>Search:</label>
        <input
          type="text"
          placeholder="Search SKs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {sks.length === 0 ? (
        <p>No SKs found.</p>
      ) : (
        <ul>
          {sks.map(sk => (
            <li key={sk._id}>
              <h3>{sk.pembukaan.substring(0, 50)}...</h3>
              <p>Status: {sk.status}</p>
              <p>Dibuat oleh: {sk.createdBy ? sk.createdBy.username : 'N/A'}</p>
              <p>Tanggal Realisasi: {new Date(sk.tanggalRealisasi).toLocaleDateString()}</p>
              <Link to={`/sk/${sk._id}`}>Lihat Detail</Link>
              {sk.status !== 'archived' && (
                <button onClick={() => handleArchive(sk._id)}>Arsipkan</button>
              )}
              {/* Add download PDF button */}
              <a href={`/api/sk/generate-pdf/${sk._id}`} target="_blank" rel="noopener noreferrer">
                <button>Unduh PDF</button>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SKList;