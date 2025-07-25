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
    <div className="container mx-auto p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Detail Surat Keputusan Direksi</h1>
 
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2 text-gray-700">Pembukaan:</h2>
            <p className="text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-md">{sk.pembukaan}</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2 text-gray-700">Isi:</h2>
            <p className="text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-md">{sk.isi}</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2 text-gray-700">Penutup:</h2>
            <p className="text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-md">{sk.penutup}</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2 text-gray-700">Tanda Tangan:</h2>
            <ul className="list-disc list-inside text-gray-800 bg-gray-50 p-4 rounded-md">
              {sk.tandaTangan.map((signer, index) => (
                <li key={index}>{signer}</li>
              ))}
            </ul>
          </div>
          <p className="text-gray-700 text-lg"><strong>Tanggal Realisasi:</strong> <span className="font-semibold">{new Date(sk.tanggalRealisasi).toLocaleDateString()}</span></p>
          <p className="text-gray-700 text-lg"><strong>Dibuat oleh:</strong> <span className="font-semibold">{sk.createdBy ? sk.createdBy.username : 'N/A'}</span></p>
          <p className="text-gray-700 text-lg"><strong>Status:</strong> <span className={`font-semibold ${sk.status === 'final' ? 'text-green-600' : sk.status === 'archived' ? 'text-red-600' : 'text-yellow-600'}`}>{sk.status}</span></p>
          <p className="text-gray-700 text-lg"><strong>Tanggal Dibuat:</strong> <span className="font-semibold">{new Date(sk.createdAt).toLocaleDateString()}</span></p>
 
          {/* Add download PDF button */}
          <a href={`/api/sk/generate-pdf/${sk._id}`} target="_blank" rel="noopener noreferrer">
            <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded transition duration-200 ease-in-out w-full">
              Unduh PDF
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SKDetail;