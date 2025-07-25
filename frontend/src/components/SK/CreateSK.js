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
    <div>
      <h1>Buat Surat Keputusan Direksi</h1>
      <form onSubmit={e => onSubmit(e)}>
        <div>
          <label>Pembukaan:</label>
          <textarea
            name="pembukaan"
            value={pembukaan}
            onChange={e => onChange(e)}
            required
          ></textarea>
        </div>
        <div>
          <label>Isi:</label>
          <textarea
            name="isi"
            value={isi}
            onChange={e => onChange(e)}
            required
          ></textarea>
          {/* TODO: Integrate WYSIWYG editor here */}
        </div>
        <div>
          <label>Penutup:</label>
          <textarea
            name="penutup"
            value={penutup}
            onChange={e => onChange(e)}
            required
          ></textarea>
        </div>
        <div>
          <label>Tanda Tangan:</label>
          {tandaTangan.map((signer, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder={`Penandatangan ${index + 1}`}
                value={signer}
                onChange={e => handleSignerChange(index, e)}
              />
              <button type="button" onClick={() => removeSigner(index)}>
                Hapus
              </button>
            </div>
          ))}
          <button type="button" onClick={addSigner}>
            Tambah Penandatangan
          </button>
        </div>
        <div>
          <label>Tanggal Realisasi:</label>
          <input
            type="date"
            name="tanggalRealisasi"
            value={tanggalRealisasi}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <input type="submit" value="Simpan SK" />
      </form>
    </div>
  );
};

export default CreateSK;