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
            <p className="text-lg text-primary-200 mb-8 leading-relaxed">
              BharatInvest connects innovative founders with passionate investors.
              Pitch your business, get AI-powered feedback, and secure funding — all in one platform.
            </p>
            {!user ? (
              <div className="flex gap-4 justify-center flex-wrap">
                <Link to="/register"
                  className="bg-accent-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent-600 transition-colors text-lg">
                  Get Started
                </Link>
                <Link to="/login"
                  className="bg-white/10 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/20 text-lg">
                  Login
                </Link>
              </div>
            ) : (
              <Link
                to={user.role === 'FOUNDER' ? '/founder/dashboard' : user.role === 'INVESTOR' ? '/investor/browse' : '/admin'}
                className="inline-block bg-accent-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent-600 transition-colors text-lg">
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-primary-600">{businesses?.length || 0}+</p>
              <p className="text-sm text-gray-500 mt-1">Live Businesses</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-accent-600">AI</p>
              <p className="text-sm text-gray-500 mt-1">Pitch Analysis</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">Free</p>
              <p className="text-sm text-gray-500 mt-1">To Register</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-600">Real-time</p>
              <p className="text-sm text-gray-500 mt-1">Chat & Offers</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">How It Works</h2>
          <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
            Three simple steps to get your business funded or find your next investment
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Your Business</h3>
              <p className="text-gray-600">Founders register and create their business profile with description, ask amount, and equity details.</p>
            </div>
            <div className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-accent-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Pitch Review</h3>
              <p className="text-gray-600">Upload your pitch video, get instant AI feedback with scores, tips, and financial projections.</p>
            </div>
            <div className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect & Deal</h3>
              <p className="text-gray-600">Investors browse, make offers, and negotiate directly with founders via real-time chat.</p>
            </div>
          </div>
        </div>
      </section>

      {/* For Founders & Investors */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-primary-700 mb-4">For Founders</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex gap-2"><span className="text-primary-500 mt-0.5">&#10003;</span> Create business profile and upload pitch video</li>
                <li className="flex gap-2"><span className="text-primary-500 mt-0.5">&#10003;</span> Get AI-powered feedback before going live</li>
                <li className="flex gap-2"><span className="text-primary-500 mt-0.5">&#10003;</span> View financial projections and improvement tips</li>
                <li className="flex gap-2"><span className="text-primary-500 mt-0.5">&#10003;</span> Receive and manage investment offers</li>
                <li className="flex gap-2"><span className="text-primary-500 mt-0.5">&#10003;</span> Chat directly with interested investors</li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-accent-600 mb-4">For Investors</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex gap-2"><span className="text-accent-500 mt-0.5">&#10003;</span> Browse verified live businesses by category</li>
                <li className="flex gap-2"><span className="text-accent-500 mt-0.5">&#10003;</span> Watch founder pitch videos and view financials</li>
                <li className="flex gap-2"><span className="text-accent-500 mt-0.5">&#10003;</span> Make offers with custom amount and equity</li>
                <li className="flex gap-2"><span className="text-accent-500 mt-0.5">&#10003;</span> Chat with founders to negotiate deals</li>
                <li className="flex gap-2"><span className="text-accent-500 mt-0.5">&#10003;</span> Account verified by admin for trust</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Live Businesses */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Businesses Looking for Investment</h2>
          <p className="text-center text-gray-500 mb-10">
            {user ? 'Click on a business to view details' : 'Login to view full details and make offers'}
          </p>

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

          {!user && (
            <div className="text-center mt-10">
              <Link to="/register"
                className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                Register to Get Started
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
