import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';
import Navbar from './components/navbar';
import AddLaporan from './pages/AddLaporan';
import LaporanSaya from './pages/LaporanSaya';
import Profile from './pages/profile';

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes without Navbar */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Routes with Navbar */}
        <Route 
          path="/dashboard" 
          element={
            <>
              <Navbar />
              <Dashboard />
            </>
          } 
        />
        <Route 
          path="/AddLaporan" 
          element={
            <>
              <Navbar />
              <AddLaporan />
            </>
          } 
        />
                <Route 
          path="/LaporanSaya" 
          element={
            <>
              <Navbar />
              <LaporanSaya />
            </>
          } 
        />
                  <Route 
          path="/profile" 
          element={
            <>
              <Navbar />
              <Profile />
            </>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
