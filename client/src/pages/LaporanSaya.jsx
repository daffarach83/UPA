import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/footer';

const dummyData = [
  {
    kodeTiket: 'TKT-123456',
    barang: 'Kipas Angin Rusak',
    status: 'Pending',
  },
  {
    kodeTiket: 'TKT-654321',
    barang: 'AC Tidak Dingin',
    status: 'Diproses',
  },
  {
    kodeTiket: 'TKT-111222',
    barang: 'Lampu Mati',
    status: 'Selesai',
  },
];

const LaporanSaya = () => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Selesai': return 'bg-green-100 text-green-700';
      case 'Diproses': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-red-100 text-red-700';
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold text-black-600 mb-6 text-center">Laporan Saya</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {dummyData.map((laporan, index) => (
          <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg">
            <h3 className="font-bold text-lg text-blue-700 mb-2">#{laporan.kodeTiket}</h3>
            <p className="text-gray-800 mb-2"><strong>Judul:</strong> {laporan.barang}</p>
            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${getStatusColor(laporan.status)}`}>
              {laporan.status}
            </span>
<hr className="my-4 border-gray-300" />
<p
  onClick={() => navigate(`/laporan/${laporan.kodeTiket}`)}
  className="font-bold text-sm text-blue-600 hover:underline cursor-pointer text-center"
>
  View Detail
</p>


          </div>
        ))}
      </div>
    </div>
  );
};

export default LaporanSaya;