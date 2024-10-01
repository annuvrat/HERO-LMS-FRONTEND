import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaBars, FaTimes } from 'react-icons/fa';
import loggo from '../assets/loggo.png'; // Adjust the path as needed

const LOGO_IMAGE = 'https://s3-symbol-logo.tradingview.com/hero-motocorp--600.png'; 
const LOGIN_PAGE_BG_IMAGE = 'https://plus.unsplash.com/premium_photo-1661963253228-5058700024ea?q=80&w=1886&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D.JPG';

const LoginPage = () => {
  const [emplCode, setEmplCode] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!emplCode || !password) {
      setErrorMessage('Employee code and password are required.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/login', {
        empl_code: emplCode,
        empl_pwd: password,
      });

      if (response.status === 200) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/dash');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response && error.response.status === 401) {
        setErrorMessage('Invalid credentials');
      } else {
        setErrorMessage('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-red-600 text-white py-2 md:py-3 relative h-14 md:h-16">
        <div className="container mx-auto flex justify-between items-center h-full">
          <div className="flex items-center space-x-4">
            <img src={LOGO_IMAGE} alt="Logo" className="w-12 h-12" />
            <a href="#"><h1 className="text-xl font-bold">LEAVE MANAGEMENT SYSTEM</h1></a>
          </div>
          <nav className="hidden md:flex space-x-6 absolute left-1/2 transform -translate-x-1/2">
            <a href="https://www.heromotocorp.com/en-in.html" className="text-lg text-white hover:text-gray-200">Home</a>
            <a href="https://www.heromotocorp.com/en-tt/m/contact.php" className="text-lg text-white hover:text-gray-200">Contact</a>
            <a href="https://www.heromotocorp.com/en-in/company/about-us/overview.html" className="text-lg text-white hover:text-gray-200">About</a>
          </nav>
          <div className="md:hidden flex items-center">
            <button
              className="text-white focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden absolute top-full right-0 bg-red-700 w-full mt-2 shadow-lg">
            <a href="#" className="block px-4 py-2 text-white hover:bg-red-600">Home</a>
            <a href="#" className="block px-4 py-2 text-white hover:bg-red-600">Contact</a>
            <a href="#" className="block px-4 py-2 text-white hover:bg-red-600">About</a>
          </div>
        )}
      </header>

      <div className="flex-grow flex items-center justify-center bg-gray-100 relative">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${LOGIN_PAGE_BG_IMAGE})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 1,
          }}
        >
          <div className="absolute bottom-4 right-4 text-black-600 text-lg font-bold">
            <p>BE YOUR OWN <span className='text-blue'> HERO</span> </p>
          </div>
        </div>
        <div className="relative z-10 max-w-sm w-full space-y-4 p-4 bg-white bg-blur-sm bg-opacity-75 rounded-xl shadow-md"> {/* Translucent effect applied */}
          <div className="flex flex-col items-center mb-2">
            <img
              src={loggo}
              alt="Login"
              className="w-15 h-20 object-contain"
            />
            <p className="text-lg font-bold mt-3">Employee Login</p>
            <FaUser className="text-black-300 text-2xl mt-1" />
          </div>
          <form className="mt-2 space-y-3" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="adid" className="sr-only">
                  Employee Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="adid"
                    name="adid"
                    type="text"
                    autoComplete="username"
                    required
                    value={emplCode}
                    onChange={(e) => setEmplCode(e.target.value)}
                    className="appearance-none rounded-t-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    placeholder="Employee Code"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none rounded-b-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    placeholder="Password"
                  />
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="text-red-500 text-center">
                {errorMessage}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
