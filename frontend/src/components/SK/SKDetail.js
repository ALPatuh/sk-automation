import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const SKDetail = () => {
  const { id } = useParams();
  const [sk, setSk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSK = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        };
        const res = await axios.get(`/api/sk/${id}`, config);
        setSk(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err.response ? err.response.data : err.message);
        setError('Failed to fetch SK details');
        setLoading(false);
      }
    };

    fetchSK();
  }, [id]);

  if (loading) return <div>Loading SK details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!sk) return <div>SK not found.</div>;

  return (
    <div>
      <h1>Detail Surat Keputusan Direksi</h1>
      <h2>Pembukaan:</h2>
      <p>{sk.pembukaan}</p>
      <h2>Isi:</h2>
      <p>{sk.isi}</p>
      <h2>Penutup:</h2>
      <p>{sk.penutup}</p>
      <h2>Tanda Tangan:</h2>
      <ul>
        {sk.tandaTangan.map((signer, index) => (
          <li key={index}>{signer}</li>
        ))}
      </ul>
      <p><strong>Tanggal Realisasi:</strong> {new Date(sk.tanggalRealisasi).toLocaleDateString()}</p>
      <p><strong>Dibuat oleh:</strong> {sk.createdBy ? sk.createdBy.username : 'N/A'}</p>
      <p><strong>Status:</strong> {sk.status}</p>
      <p><strong>Tanggal Dibuat:</strong> {new Date(sk.createdAt).toLocaleDateString()}</p>

      {/* Add download PDF button */}
      <a href={`/api/sk/generate-pdf/${sk._id}`} target="_blank" rel="noopener noreferrer">
        <button>Unduh PDF</button>
      </a>
    </div>
  );
};

export default SKDetail;