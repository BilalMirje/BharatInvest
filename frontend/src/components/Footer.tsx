import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid sm:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-1 mb-3" translate="no">
              <span className="text-xl font-bold text-white">Bharat</span>
              <span className="text-xl font-bold text-accent-500">Invest</span>
            </div>
            <p className="text-sm leading-relaxed">
              India's platform connecting innovative founders with smart
              investors. Pitch, get AI feedback, and secure funding.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <Link to="/" className="block hover:text-white transition-colors">
                Home
              </Link>
              <Link
                to="/register"
                className="block hover:text-white transition-colors"
              >
                Register
              </Link>
              <Link
                to="/login"
                className="block hover:text-white transition-colors"
              >
                Login
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">For Users</h3>
            <div className="space-y-2 text-sm">
              <p>Founders: Create your business and pitch</p>
              <p>Investors: Browse and invest in startups</p>
              <p>AI-powered pitch analysis included</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm">
          <p>BharatInvest — copyright@2027</p>
        </div>
      </div>
    </footer>
  );
}
