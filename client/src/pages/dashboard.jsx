import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/footer';

const Dashboard = ({ fullName, ticketStats, tickets = [] }) => {
  const { pending = 0, inProgress = 0, completed = 0 } = ticketStats || {};
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="p-6">
        {/* Judul Utama */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-6 px-4 rounded-xl shadow-md mb-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">
            Pusat Pengaduan Sarana dan Prasarana UPT PNJ
          </h1>
          <p className="text-sm md:text-base mt-2">
            Solusi cepat dan tanggap untuk masalah fasilitas kampus.
          </p>
        </div>

        {/* Sapaan Pengguna */}
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Selamat datang, {fullName}!
        </h2>

        {/* Konten Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-black-600">Tiket Baru</h3>
            <p className="text-4xl font-bold mt-4 text-black-600">{pending}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-black-600">Sedang Ditinjau</h3>
            <p className="text-4xl font-bold mt-4 text-black-600">{inProgress}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-black-600">Telah Dikerjakan</h3>
            <p className="text-4xl font-bold mt-4 text-black-600">{completed}</p>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <button
            onClick={() => navigate('/AddLaporan')}
            className="w-64 bg-[#A3C7C5] hover:bg-[#8FB7B4] text-white font-semibold px-6 py-3 rounded-lg shadow-md transition transform hover:scale-105"
          >
            Buat Laporan
          </button>
          <button
            onClick={() => navigate('/laporan-saya')}
            className="w-64 bg-[#A3C7C5] hover:bg-[#8FB7B4] text-white font-semibold px-6 py-3 rounded-lg shadow-md transition transform hover:scale-105"
          >
            Laporan Saya
          </button>
        </div>

        {/* Tabel Tiket */}
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Tiket
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Judul Laporan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Submit
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tickets.length > 0 ? (
                tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.title}</td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                        ticket.status === 'pending'
                          ? 'text-red-600'
                          : ticket.status === 'inProgress'
                          ? 'text-blue-600'
                          : 'text-green-600'
                      }`}
                    >
                      {ticket.status === 'pending'
                        ? 'Baru'
                        : ticket.status === 'inProgress'
                        ? 'Sedang Diproses'
                        : 'Selesai'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(ticket.submittedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500 font-medium">
                    Belum ada Laporan
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
