import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary-700">Bharat</span>
            <span className="text-2xl font-bold text-accent-500">Invest</span>
          </Link>

          <div className="flex items-center gap-4">
            {!user ? (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary-600 font-medium">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 font-medium"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                {user.role === 'ADMIN' && (
                  <Link to="/admin" className="text-gray-600 hover:text-primary-600 font-medium">
                    Dashboard
                  </Link>
                )}
                {user.role === 'FOUNDER' && (
                  <>
                    <Link to="/founder/dashboard" className="text-gray-600 hover:text-primary-600 font-medium">
                      My Businesses
                    </Link>
                    <Link to="/founder/offers" className="text-gray-600 hover:text-primary-600 font-medium">
                      Offers
                    </Link>
                  </>
                )}
                {user.role === 'INVESTOR' && (
                  <>
                    <Link to="/investor/browse" className="text-gray-600 hover:text-primary-600 font-medium">
                      Browse
                    </Link>
                    <Link to="/investor/offers" className="text-gray-600 hover:text-primary-600 font-medium">
                      My Offers
                    </Link>
                  </>
                )}
                <Link to="/chat" className="text-gray-600 hover:text-primary-600 font-medium">
                  Chat
                </Link>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {user.name} ({user.role})
                </span>
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-700 font-medium"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
