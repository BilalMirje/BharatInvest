
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    close();
  };

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) =>
    `font-medium transition-colors ${
      isActive(path)
        ? 'text-primary-600'
        : 'text-gray-600 hover:text-primary-600'
    }`;

  const mobileLinkClass = (path: string) =>
    `block px-3 py-3 rounded-lg font-medium ${
      isActive(path)
        ? 'bg-primary-50 text-primary-600'
        : 'text-gray-700 hover:bg-gray-50'
    }`;

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">

            {/* Brand */}
            <Link to="/" onClick={close} className="flex items-center gap-1">
              <span className="text-2xl font-bold text-primary-700">
                Bharat
              </span>
              <span className="text-2xl font-bold text-accent-500">
                Invest
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-5">
              {!user ? (
                <>
                  <Link to="/login" className={linkClass('/login')}>
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
                    <Link to="/admin" className={linkClass('/admin')}>
                      Dashboard
                    </Link>
                  )}

                  {user.role === 'FOUNDER' && (
                    <>
                      <Link
                        to="/founder/dashboard"
                        className={linkClass('/founder/dashboard')}
                      >
                        My Businesses
                      </Link>

                      <Link
                        to="/founder/offers"
                        className={linkClass('/founder/offers')}
                      >
                        Offers
                      </Link>
                    </>
                  )}

                  {user.role === 'INVESTOR' && (
                    <>
                      <Link
                        to="/investor/browse"
                        className={linkClass('/investor/browse')}
                      >
                        Browse
                      </Link>

                      <Link
                        to="/investor/offers"
                        className={linkClass('/investor/offers')}
                      >
                        My Offers
                      </Link>
                    </>
                  )}

                  {user.role !== 'ADMIN' && (
                    <Link to="/chat" className={linkClass('/chat')}>
                      Chat
                    </Link>
                  )}

                  <span className="text-sm text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                    {user.name} ({user.role})
                  </span>

                  <button
                    onClick={handleLogout}
                    className="text-red-500 hover:text-red-700 font-medium text-sm"
                  >
                    Logout
                  </button>
                </>
              )}

              {/* Google Translate */}
              <div id="google_translate_element" />
            </div>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              aria-label="Toggle navigation menu"
              aria-expanded={open}
            >
              <div className="w-5 flex flex-col gap-1">
                <span className={`h-0.5 bg-gray-700 transition-all ${
                  open ? 'rotate-45 translate-y-1.5' : ''
                }`} />
                <span className={`h-0.5 bg-gray-700 transition-all ${
                  open ? 'opacity-0' : ''
                }`} />
                <span className={`h-0.5 bg-gray-700 transition-all ${
                  open ? '-rotate-45 -translate-y-1.5' : ''
                }`} />
              </div>
            </button>

          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`md:hidden fixed inset-0 z-[60] ${
        open ? 'visible' : 'invisible pointer-events-none'
      }`}>

        {/* Overlay */}
        <button
          type="button"
          aria-label="Close menu"
          onClick={close}
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Side Panel */}
        <aside
          className={`fixed right-0 top-0 z-[70] h-full w-80 max-w-[85vw] bg-white shadow-xl flex flex-col drawer-transition ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >

          {/* Drawer Header */}
          <div className="flex items-center justify-between px-5 h-16 border-b border-gray-200">
            <Link to="/" onClick={close} className="flex items-center gap-1">
              <span className="text-2xl font-bold text-primary-700">
                Bharat
              </span>
              <span className="text-2xl font-bold text-accent-500">
                Invest
              </span>
            </Link>

            <button
              type="button"
              onClick={close}
              className="text-2xl text-gray-600 hover:text-gray-900"
              aria-label="Close navigation"
            >
              &times;
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto px-4 py-5">
            {!user ? (
              <>
                <Link
                  to="/login"
                  onClick={close}
                  className={mobileLinkClass('/login')}
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={close}
                  className={mobileLinkClass('/register')}
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                {user.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    onClick={close}
                    className={mobileLinkClass('/admin')}
                  >
                    Dashboard
                  </Link>
                )}

                {user.role === 'FOUNDER' && (
                  <>
                    <Link
                      to="/founder/dashboard"
                      onClick={close}
                      className={mobileLinkClass('/founder/dashboard')}
                    >
                      My Businesses
                    </Link>

                    <Link
                      to="/founder/offers"
                      onClick={close}
                      className={mobileLinkClass('/founder/offers')}
                    >
                      Offers
                    </Link>
                  </>
                )}

                {user.role === 'INVESTOR' && (
                  <>
                    <Link
                      to="/investor/browse"
                      onClick={close}
                      className={mobileLinkClass('/investor/browse')}
                    >
                      Browse
                    </Link>

                    <Link
                      to="/investor/offers"
                      onClick={close}
                      className={mobileLinkClass('/investor/offers')}
                    >
                      My Offers
                    </Link>
                  </>
                )}

                {user.role !== 'ADMIN' && (
                  <Link
                    to="/chat"
                    onClick={close}
                    className={mobileLinkClass('/chat')}
                  >
                    Chat
                  </Link>
                )}
              </>
            )}
          </div>

          {/* User Details & Logout */}
          {user && (
            <div className="border-t border-gray-200 p-5">
              <p className="text-sm text-gray-500 mb-3">
                {user.name} ({user.role})
              </p>

              <button
                onClick={handleLogout}
                className="w-full text-left text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg font-medium"
              >
                Logout
              </button>
            </div>
          )}

        </aside>
      </div>
    </>
  );
}
