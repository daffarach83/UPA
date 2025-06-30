import React, { useState, useEffect } from 'react';
import { FiCamera } from 'react-icons/fi';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

const AddLaporan = ({ fullName = 'Nama User', role = 'Mahasiswa' }) => {
  const [formData, setFormData] = useState({
    tanggal: '',
    kodeTiket: '',
    lokasi: '',
    barang: '',
    keterangan: '',
    image: null,
  });

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const randomKode = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
    setFormData((prev) => ({
      ...prev,
      tanggal: today,
      kodeTiket: randomKode,
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }
    data.append('fullName', fullName);
    data.append('role', role);

    fetch('http://localhost:5000/api/Addlaporan', {
      method: 'POST',
      body: data,
    })
      .then((res) => res.json())
      .then(() => {
        alert('Laporan berhasil dikirim!');
      })
      .catch(() => {
        alert('Gagal mengirim laporan.');
      });
  };

  return (
    <>
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md border border-gray-300 mt-10 mb-10">
        <h2 className="text-2xl font-bold text-black-600 mb-6 text-center">Form Laporan</h2>
        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block font-medium text-gray-700">Tanggal</label>
            <input
              type="date"
              name="tanggal"
              value={formData.tanggal}
              readOnly
              className="w-full border px-3 py-2 rounded-md bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Kode Tiket</label>
            <input
              type="text"
              name="kodeTiket"
              value={formData.kodeTiket}
              readOnly
              className="w-full border px-3 py-2 rounded-md bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Lokasi</label>
            <input
              type="text"
              name="lokasi"
              value={formData.lokasi}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Barang</label>
            <input
              type="text"
              name="barang"
              value={formData.barang}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Keterangan</label>
            <textarea
              name="keterangan"
              value={formData.keterangan}
              onChange={handleChange}
              rows="4"
              required
              className="w-full border px-3 py-2 rounded-md"
            ></textarea>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Upload Foto</label>
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:border-blue-500 transition">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FiCamera className="text-3xl text-gray-500 mb-2" />
                <p className="text-sm text-gray-500">Klik untuk memilih foto atau seret ke sini</p>
              </div>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex justify-between gap-4">
            <div className="w-1/2">
              <label className="block font-medium text-gray-700">Nama</label>
              <input
                type="text"
                value={fullName}
                readOnly
                className="w-full border px-3 py-2 rounded-md bg-gray-100"
              />
            </div>
            <div className="w-1/2">
              <label className="block font-medium text-gray-700">Role</label>
              <input
                type="text"
                value={role}
                readOnly
                className="w-full border px-3 py-2 rounded-md bg-gray-100"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
          >
            Kirim Laporan
          </button>
        </form>
      </div>

      <Footer />
    </>
  );
};

export default AddLaporan;
