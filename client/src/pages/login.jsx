import { useState } from 'react';
import './style.css';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password,
      }, {
        withCredentials: true,
      });

      if (response.data.result === 'success') {
        // ✅ Simpan token dan expiry
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('expiresIn', response.data.expiresIn);
        localStorage.setItem('user_id', response.data.user_id);

        setMessage('Login berhasil! Mengarahkan...');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      } else {
        setMessage(response.data.msg || 'Login gagal.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage(error.response?.data?.msg || 'Terjadi kesalahan saat login.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="left"></div>
        <div className="right">
          <h1>Login</h1>

          {message && <div className="message">{message}</div>}

          <form onSubmit={handleLogin}>
            <div className="input">
              <label>Email</label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input password-input">
              <label>Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span className="password-toggle" onClick={togglePassword}>
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="gray" viewBox="0 0 24 24">
                      <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12c-2.8 0-5-2.2-5-5s2.2-5 5-5c2.8 0 5 2.2 5 5s-2.2 5-5 5zm0-8c-1.7 0-3 1.3-3 3s1.3 3 3 3c1.7 0 3-1.3 3-3s-1.3-3-3-3z"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="gray" viewBox="0 0 24 24">
                      <path d="M12 5c-1.7 0-3.2.5-4.6 1.3l1.5 1.5c.9-.5 1.9-.8 3.1-.8 2.8 0 5 2.2 5 5 0 1.2-.3 2.2-.8 3.1l1.5 1.5c.8-1.4 1.3-2.9 1.3-4.6 0-4-3.1-7-7-7zm10.2 15.4l-4.3-4.3-1.5-1.5-5.9-5.9-1.5-1.5-4.3-4.3-1.4 1.4 4.3 4.3-1.5 1.5c-.8 1.4-1.3 2.9-1.3 4.6 0 4 3.1 7 7 7 1.7 0 3.2-.5 4.6-1.3l1.5-1.5 4.3 4.3 1.4-1.4zm-10.2-.4c-2.8 0-5-2.2-5-5 0-1.2.3-2.2.8-3.1l7.3 7.3c-.9.5-1.9.8-3.1.8z"/>
                    </svg>
                  )}
                </span>
              </div>
            </div>

            <button type="submit">Login</button>
          </form>

          <div className="forgot-links">
            <a href="/register">Belum punya akun? Daftar</a>
            <a href="#">Lupa Password?</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
