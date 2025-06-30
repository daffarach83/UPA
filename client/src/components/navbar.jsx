import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';

const Navbar = () => {
  const [profileImage, setProfileImage] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const storedImage = localStorage.getItem('profileImage');
    setProfileImage(storedImage || '/default-avatar.png'); // fallback default image
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    // Implement your logout logic here
    console.log('User logged out');
  };

  return (
    <nav
      className="shadow-md px-6 py-0 flex h-12 justify-between items-center relative"
      style={{ backgroundColor: '#A3C7C5' }}
    >
      {/* Left: Logo */}
      <div className="text-l font-bold text-white-600">UPT PNJ</div>

      {/* Center: Menu */}
      <ul className="absolute font-bold left-1/2 transform -translate-x-1/2 flex space-x-6 text-gray-700 text-sm">
        <li><Link to="/dashboard" className="hover:text-blue-500">Home</Link></li>
        <li><Link to="/About" className="hover:text-blue-500">About</Link></li>
        <li><Link to="/settings" className="hover:text-blue-500">Settings</Link></li>
      </ul>

      {/* Right: Profile Picture with Dropdown */}
      <div className="relative">
        <div className="flex items-center cursor-pointer" onClick={toggleDropdown}>
          <img
            src={profileImage}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover border border-white"
          />
        </div>
        
{dropdownOpen && (
  <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-50 overflow-hidden">
    <ul>
      <li>
        <Link 
          to="/profile" 
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          onClick={() => setDropdownOpen(false)}
        >
          Profile
        </Link>
      </li>

      <hr className="border-t border-gray-200 mx-2" />

      <li>
        <Link 
          to="/logout" 
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex justify-between items-center"
          onClick={() => setDropdownOpen(false)}
        >
          Logout
          <FiLogOut className="ml-2 text-base" />
        </Link>
      </li>

        </ul>
      </div>
    )}
      </div>
    </nav>
  );
};

export default Navbar;
