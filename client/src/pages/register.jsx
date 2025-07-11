import { useState } from 'react';
import './style.css'; 
import axios from 'axios';
import Swal from 'sweetalert2';


const Register = () => {
  const [email, setEmail] = useState('');
  const [fullname, setFullname] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  // ✅ Validasi email khusus @pnj.ac.id
  const validateEmail = (email) => {
    return /^[^\s@]+@pnj\.ac\.id$/.test(email.toLowerCase());
  };

  const handleRegister = async (e) => {
    e.preventDefault();
  
    // Cek apakah email berakhiran @mhsw.pnj.ac.id
    if (!/\S+@\S+\.\S+/.test(email)) {
      return Swal.fire({
        icon: 'warning',
        title: 'Email Tidak Valid',
        text: 'Masukkan alamat email yang benar.',
      });
    }
  
    try {
      const response = await axios.post('http://localhost:5000/register', {
        fullname,
        email,
        password,
      });
  
      if (response.data.result === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Registrasi Berhasil',
          text: 'Anda akan diarahkan ke halaman login.',
          timer: 2000,
          showConfirmButton: false,
        });
  
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Registrasi Gagal',
          text: response.data.msg || 'Silakan coba lagi.',
        });
      }
    } catch (error) {
      if (error.response) {
        Swal.fire({
          icon: 'error',
          title: 'Kesalahan Server',
          text: error.response.data.msg || 'Terjadi kesalahan saat mendaftar.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Kesalahan Jaringan',
          text: 'Jaringan bermasalah atau server tidak dapat dijangkau.',
        });
      }
    }
  };
  
 

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="left"></div>
        <div className="right">
          <h1>Register</h1>
          {message && <div className="message">{message}</div>}
          <form onSubmit={handleRegister}>
          <div className="input">
            <label>Full Name</label>
            <input
              type="fullname"
              placeholder="Fullname"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
          </div>
          <div className="input">
            <label>Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="input">
              <label className="block mb-1 text-sm font-medium text-gray-700">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              >
                <option value="">Pilih Role</option>
                <option value="Mahasiswa">Mahasiswa</option>
                <option value="Dosen">Dosen</option>
                <option value="Staff">Staff</option>
              </select>
            </div>
          </div>
          <div className="input password-input">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="password-toggle" onClick={togglePassword}>
                {showPassword ? (
                  // 👁️ Eye Open SVG
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="gray" viewBox="0 0 24 24">
                    <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12c-2.8 0-5-2.2-5-5s2.2-5 5-5c2.8 0 5 2.2 5 5s-2.2 5-5 5zm0-8c-1.7 0-3 1.3-3 3s1.3 3 3 3c1.7 0 3-1.3 3-3s-1.3-3-3-3z"/>
                  </svg>
                ) : (
                  // 🚫 Eye Slash SVG
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="gray" viewBox="0 0 24 24">
                    <path d="M12 5c-1.7 0-3.2.5-4.6 1.3l1.5 1.5c.9-.5 1.9-.8 3.1-.8 2.8 0 5 2.2 5 5 0 1.2-.3 2.2-.8 3.1l1.5 1.5c.8-1.4 1.3-2.9 1.3-4.6 0-4-3.1-7-7-7zm10.2 15.4l-4.3-4.3-1.5-1.5-5.9-5.9-1.5-1.5-4.3-4.3-1.4 1.4 4.3 4.3-1.5 1.5c-.8 1.4-1.3 2.9-1.3 4.6 0 4 3.1 7 7 7 1.7 0 3.2-.5 4.6-1.3l1.5-1.5 4.3 4.3 1.4-1.4zm-10.2-.4c-2.8 0-5-2.2-5-5 0-1.2.3-2.2.8-3.1l7.3 7.3c-.9.5-1.9.8-3.1.8z"/>
                  </svg>
                )}
              </span>
            </div>
          </div>
          {/* <div className="remember-me">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              id="rememberMe"
            />
            <label htmlFor="rememberMe">Remember Me</label>
          </div> */}
          <button type="submit">Register</button>
        </form>
        <div className="forgot-links">
          <a href="/">Already have an account? Login</a>
          <a href="#">Forgot Your Password?</a>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Register;
