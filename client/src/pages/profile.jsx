import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/footer';

const Profile = () => {
  const [userData, setUserData] = useState({
    fullname: 'Nama Lengkap',
    role: 'Mahasiswa',
    jurusan: 'Teknik Informatika',
    kelas: 'TI-3A',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (storedData) {
      setUserData(storedData);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-100">
      {/* Konten Utama */}
      <div className="flex-grow flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-2xl text-center">
          {/* Profile Picture */}
          <div className="flex justify-center mb-6">
            <FaUserCircle className="text-gray-400 text-[150px]" />
          </div>

          {/* Informasi Pengguna */}
          <h2 className="text-3xl font-bold text-gray-800">{userData.fullname}</h2>
          <p className="text-lg text-gray-500 mb-6">{userData.role}</p>
          <div className="text-lg text-gray-700 space-y-2">
            <p><strong>Jurusan:</strong> {userData.jurusan}</p>
            <p><strong>Kelas:</strong> {userData.kelas}</p>
          </div>

          {/* Tombol Edit */}
          <button
            onClick={() => navigate('/edit-profile')}
            className="mt-8 bg-blue-500 text-white px-6 py-3 text-lg rounded-lg hover:bg-blue-600 transition"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Profile;
