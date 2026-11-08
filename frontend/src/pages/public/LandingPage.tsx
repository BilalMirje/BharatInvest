import { Link } from 'react-router-dom';
import { usePublicBusinesses } from '../../api/hooks';
import BusinessCard from '../../components/BusinessCard';
import { useAuth } from '../../auth/context/AuthContext';

export default function LandingPage() {
  const { data: businesses, isLoading } = usePublicBusinesses();
  const { user } = useAuth();

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 sm:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
              Where Great Ideas Meet
              <span className="text-accent-500"> Smart Investment</span>
            </h1>
            <p className="text-lg text-primary-200 mb-8">
              BharatInvest connects innovative founders with passionate investors.
              Pitch your business, get AI-powered feedback, and secure funding — all in one platform.
            </p>
            {!user && (
              <div className="flex gap-4 justify-center">
                <Link
                  to="/register"
                  className="bg-accent-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-600 transition-colors"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="bg-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/20"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📝</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Your Business</h3>
              <p className="text-gray-600">Founders register and create their business profile with all the details investors need.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Pitch Review</h3>
              <p className="text-gray-600">Upload your pitch video and get instant AI feedback to improve before going live.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect & Deal</h3>
              <p className="text-gray-600">Investors browse, make offers, and negotiate directly with founders via real-time chat.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Businesses */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Businesses Looking for Investment</h2>
          <p className="text-center text-gray-500 mb-10">Login to view full details and make offers</p>

          {isLoading ? (
            <div className="text-center py-12 text-gray-400">Loading...</div>
          ) : businesses && businesses.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((b) => (
                <BusinessCard key={b.id} business={b} locked={!user} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">No businesses available right now.</div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-lg font-semibold text-white mb-2">BharatInvest</p>
          <p className="text-sm">CDAC Project — Connecting Ideas with Investment</p>
        </div>
      </footer>
    </div>
  );
}
