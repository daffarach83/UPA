import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/footer';

const Dashboard = ({ ticketStats = {} }) => {
  const { pending = 0, inProgress = 0, completed = 0 } = ticketStats;
  const [fullname, setFullname] = useState('');
  const [loading, setLoading] = useState(true);
  const [laporanData, setLaporanData] = useState([]); // <- ini untuk data laporan
  const navigate = useNavigate();

useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      // Ambil user info
      const userRes = await axios.get('http://localhost:5000/get_user_info', {
        headers,
        withCredentials: true,
      });

      if (userRes.data.result === 'success') {
        setFullname(userRes.data.user.fullname);
      } else {
        navigate('/');
        return;
      }

      // Ambil semua laporan
      const laporanRes = await axios.get('http://localhost:5000/api/semua_laporan', {
        headers,
        withCredentials: true,
      });

      if (laporanRes.data.result === 'success') {
        setLaporanData(laporanRes.data.laporan);
      }

    } catch (error) {
      console.error('Error fetching dashboard:', error);
      localStorage.removeItem('token');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  fetchDashboardData();
}, [navigate]);


  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <p className="text-gray-600">Memuat dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="p-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-6 px-4 rounded-xl shadow-md mb-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">
            Pusat Pengaduan Sarana dan Prasarana UPT PNJ
          </h1>
          <p className="text-sm md:text-base mt-2">
            Solusi cepat dan tanggap untuk masalah fasilitas kampus.
          </p>
        </div>

        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Selamat datang, {fullname}!
        </h2>

        {/* Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {[['Tiket Baru', pending], ['Sedang Ditinjau', inProgress], ['Telah Dikerjakan', completed]].map(([label, value], i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold text-black-600">{label}</h3>
              <p className="text-4xl font-bold mt-4 text-black-600">{value}</p>
            </div>
          ))}
        </div>

        {/* Tombol Aksi */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <button onClick={() => navigate('/AddLaporan')} className="w-64 bg-[#A3C7C5] hover:bg-[#8FB7B4] text-white font-semibold px-6 py-3 rounded-lg shadow-md transition transform hover:scale-105">
            Buat Laporan
          </button>
          <button onClick={() => navigate('/LaporanSaya')} className="w-64 bg-[#A3C7C5] hover:bg-[#8FB7B4] text-white font-semibold px-6 py-3 rounded-lg shadow-md transition transform hover:scale-105">
            Laporan Saya
          </button>
        </div>

        {/* Tabel */}
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Kode Tiket', 'Barang', 'Status', 'Tanggal Submit'].map((head, i) => (
                  <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
<tbody className="bg-white divide-y divide-gray-200">
  {laporanData.length > 0 ? (
    laporanData.map((lapor, i) => (
      <tr key={i}>
        <td className="px-6 py-4 text-sm">{lapor.kodeTiket}</td>
        <td className="px-6 py-4 text-sm">{lapor.barang}</td>
        <td className="px-6 py-4 text-sm text-blue-600 font-semibold">Baru</td>
        <td className="px-6 py-4 text-sm text-gray-500">{lapor.tanggal}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="4" className="px-6 py-4 text-center text-gray-500 font-medium">
        Belum ada laporan.
      </td>
    </tr>
  )}
</tbody>

          </table>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
