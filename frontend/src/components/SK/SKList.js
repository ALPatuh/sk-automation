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
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Daftar Surat Keputusan Direksi</h1>
 
      <div className="flex flex-col md:flex-row justify-between mb-6 space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex items-center space-x-2">
          <label className="text-gray-700 font-medium">Filter Status:</label>
          <select
            onChange={(e) => setStatusFilter(e.target.value)}
            value={statusFilter}
            className="block w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
          >
            <option value="">All</option>
            <option value="draft">Draft</option>
            <option value="final">Final</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-gray-700 font-medium">Search:</label>
          <input
            type="text"
            placeholder="Search SKs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
          />
        </div>
      </div>
 
      {sks.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No SKs found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sks.map(sk => (
            <div key={sk._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{sk.pembukaan.substring(0, 50)}...</h3>
              <p className="text-gray-600 mb-1">Status: <span className={`font-medium ${sk.status === 'final' ? 'text-green-600' : sk.status === 'archived' ? 'text-red-600' : 'text-yellow-600'}`}>{sk.status}</span></p>
              <p className="text-gray-600 mb-1">Dibuat oleh: <span className="font-medium">{sk.createdBy ? sk.createdBy.username : 'N/A'}</span></p>
              <p className="text-gray-600 mb-4">Tanggal Realisasi: <span className="font-medium">{new Date(sk.tanggalRealisasi).toLocaleDateString()}</span></p>
              <div className="flex justify-between items-center mt-4">
                <Link to={`/sk/${sk._id}`} className="text-blue-600 hover:text-blue-800 font-medium transition duration-200 ease-in-out">Lihat Detail</Link>
                <div className="space-x-2">
                  {sk.status !== 'archived' && (
                    <button
                      onClick={() => handleArchive(sk._id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-200 ease-in-out"
                    >
                      Arsipkan
                    </button>
                  )}
                  <a
                    href={`/api/sk/generate-pdf/${sk._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-200 ease-in-out"
                  >
                    Unduh PDF
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SKList;