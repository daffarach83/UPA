import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { FiEdit2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/footer';

const Profile = () => {
  const [userData, setUserData] = useState({
    fullname: '',
    role: '',
    jurusan: '',
    kelas: '',
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formData, setFormData] = useState(userData);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:5000/get_user_info', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        });

        const result = await response.json();

        if (result.result === 'success') {
          setUserData(result.user);
          setFormData(result.user);
        } else {
          navigate('/login');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        navigate('/login');
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handleEditClick = () => {
    setFormData(userData); // Set form data dari userData
    setEditModalOpen(true);
  };

  const handleSave = () => {
    setUserData(formData);
    setEditModalOpen(false);
    // TODO: Tambahkan POST/PATCH ke server untuk menyimpan perubahan
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-100">
      <div className="flex-grow flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-2xl text-center relative">
          {/* Foto Profil dan Edit Icon */}
          <div className="relative flex justify-center mb-6">
            <FaUserCircle className="text-gray-400 text-[150px]" />
            <button
              onClick={() => alert('Fitur upload foto belum tersedia')}
              className="absolute bottom-4 right-[calc(50%-45px)] bg-white p-1 rounded-full shadow hover:bg-gray-100 transition"
              title="Ubah Foto"
            >
              <FiEdit2 className="text-blue-500 text-xl" />
            </button>
          </div>

          <h2 className="text-3xl font-bold text-gray-800">{userData.fullname || 'Nama Lengkap'}</h2>
          <p className="text-lg text-gray-500 mb-6">{userData.role || 'Role'}</p>

          <div className="text-lg text-gray-700 space-y-2">
            <p><strong>Jurusan:</strong> {userData.jurusan || <span className="text-red-500">Belum diisi</span>}</p>
            <p><strong>Kelas:</strong> {userData.kelas || <span className="text-red-500">Belum diisi</span>}</p>
          </div>

          <button
            onClick={handleEditClick}
            className="mt-8 bg-blue-500 text-white px-6 py-3 text-lg rounded-lg hover:bg-blue-600 transition"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Modal Edit Profile */}
      {editModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg relative">
            <h3 className="text-xl font-semibold mb-4 text-center">Edit Profil</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  value={formData.fullname}
                  onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Jurusan</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  value={formData.jurusan}
                  onChange={(e) => setFormData({ ...formData, jurusan: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Kelas</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  value={formData.kelas}
                  onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Profile;
