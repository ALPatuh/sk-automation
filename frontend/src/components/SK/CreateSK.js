import React, { useState } from 'react';
import axios from 'axios';

const CreateSK = () => {
  const [formData, setFormData] = useState({
    pembukaan: '',
    isi: '',
    penutup: '',
    tandaTangan: [], // Array of signers
    tanggalRealisasi: ''
  });

  const { pembukaan, isi, penutup, tandaTangan, tanggalRealisasi } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSignerChange = (index, e) => {
    const newSigners = [...tandaTangan];
    newSigners[index] = e.target.value;
    setFormData({ ...formData, tandaTangan: newSigners });
  };

  const addSigner = () => {
    setFormData({ ...formData, tandaTangan: [...tandaTangan, ''] });
  };

  const removeSigner = (index) => {
    const newSigners = tandaTangan.filter((_, i) => i !== index);
    setFormData({ ...formData, tandaTangan: newSigners });
  };

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token') // Assuming token is stored in localStorage
        }
      };
      const res = await axios.post('/api/sk', formData, config);
      console.log(res.data);
      // TODO: Handle successful SK creation (e.g., redirect to SK list)
    } catch (err) {
      console.error(err.response.data);
      // TODO: Handle error
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Buat Surat Keputusan Direksi</h1>
        <form onSubmit={e => onSubmit(e)} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Pembukaan:</label>
            <textarea
              name="pembukaan"
              value={pembukaan}
              onChange={e => onChange(e)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
              placeholder="Masukkan pembukaan surat keputusan"
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Isi:</label>
            <textarea
              name="isi"
              value={isi}
              onChange={e => onChange(e)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-48"
              placeholder="Masukkan isi surat keputusan"
            ></textarea>
            {/* TODO: Integrate WYSIWYG editor here */}
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Penutup:</label>
            <textarea
              name="penutup"
              value={penutup}
              onChange={e => onChange(e)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
              placeholder="Masukkan penutup surat keputusan"
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Tanda Tangan:</label>
            {tandaTangan.map((signer, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  placeholder={`Penandatangan ${index + 1}`}
                  value={signer}
                  onChange={e => handleSignerChange(index, e)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                />
                <button
                  type="button"
                  onClick={() => removeSigner(index)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Hapus
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSigner}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
            >
              Tambah Penandatangan
            </button>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Tanggal Realisasi:</label>
            <input
              type="date"
              name="tanggalRealisasi"
              value={tanggalRealisasi}
              onChange={e => onChange(e)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 ease-in-out"
          >
            Simpan SK
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateSK;