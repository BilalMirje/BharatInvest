import { useNavigate } from 'react-router-dom';
import { useMyOffers } from '../../api/hooks';

const statusColor: Record<string, string> = {
  PENDING: 'text-yellow-600 bg-yellow-50',
  ACCEPTED: 'text-green-600 bg-green-50',
  REJECTED: 'text-red-600 bg-red-50',
};

export default function InvestorOffers() {
  const { data: offers, isLoading } = useMyOffers();
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Offers</h1>

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : offers && offers.length > 0 ? (
        <div className="space-y-4">
          {offers.map((o) => (
            <div key={o.id}
              onClick={() => navigate(`/investor/business/${o.businessId}`)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{o.businessName}</h3>
                  <p className="text-primary-600 font-medium mt-1">
                    ₹{(o.amount / 100000).toFixed(1)}L for {o.equityPercent}% equity
                  </p>
                  {o.message && <p className="text-gray-500 text-sm mt-2">"{o.message}"</p>}
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColor[o.status]}`}>
                  {o.status}
                </span>
              </div>
              {o.status === 'ACCEPTED' && (
                <p className="text-green-600 font-medium text-sm mt-3">Deal done</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">You haven't made any offers yet.</p>
        </div>
      )}
    </div>
  );
}
