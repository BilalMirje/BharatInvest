import { Link } from 'react-router-dom';
import { useMyBusinesses } from '../../api/hooks';

const statusBadge: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  APPROVED: 'bg-blue-100 text-blue-700',
  REJECTED: 'bg-red-100 text-red-700',
  LIVE: 'bg-green-100 text-green-700',
  FUNDED: 'bg-purple-100 text-purple-700',
};

export default function FounderDashboard() {
  const { data: businesses, isLoading } = useMyBusinesses();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Businesses</h1>
        <Link to="/founder/create"
          className="bg-primary-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-700">
          + Create Business
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : businesses && businesses.length > 0 ? (
        <div className="space-y-4">
          {businesses.map((b) => (
            <div key={b.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{b.name}</h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {b.category} · ₹{(b.askAmount / 100000).toFixed(1)}L for {b.equityOffered}%
                  </p>
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusBadge[b.status]}`}>
                  {b.status}
                </span>
              </div>

              <p className="text-gray-600 text-sm mt-3 line-clamp-2">{b.description}</p>

              {b.rejectionReason && (
                <p className="text-red-600 text-sm mt-2 bg-red-50 p-2 rounded">
                  Rejection reason: {b.rejectionReason}
                </p>
              )}

              <div className="mt-4 flex gap-3">
                {b.status === 'APPROVED' && (
                  <Link to={`/founder/pitch/${b.id}`}
                    className="bg-accent-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent-600">
                    Upload Pitch
                  </Link>
                )}
                {b.status === 'LIVE' && (
                  <>
                    <Link to={`/founder/pitch/${b.id}`}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200">
                      View Pitch
                    </Link>
                    <Link to="/founder/offers"
                      className="bg-primary-100 text-primary-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-200">
                      View Offers
                    </Link>
                  </>
                )}
                {b.status === 'FUNDED' && (
                  <span className="text-green-600 font-medium text-sm">Funded — Deal completed</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500 text-lg mb-4">No businesses yet</p>
          <Link to="/founder/create"
            className="bg-primary-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-700">
            Create Your First Business
          </Link>
        </div>
      )}
    </div>
  );
}
