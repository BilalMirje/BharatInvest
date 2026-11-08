import { useReceivedOffers, useAcceptOffer, useRejectOffer } from '../../api/hooks';
import toast from 'react-hot-toast';

const statusColor: Record<string, string> = {
  PENDING: 'text-yellow-600 bg-yellow-50',
  ACCEPTED: 'text-green-600 bg-green-50',
  REJECTED: 'text-red-600 bg-red-50',
};

export default function FounderOffers() {
  const { data: offers, isLoading } = useReceivedOffers();
  const acceptOffer = useAcceptOffer();
  const rejectOffer = useRejectOffer();

  const handleAccept = (id: number) => {
    if (!confirm('Accept this offer? The business will be marked as funded.')) return;
    acceptOffer.mutate(id, {
      onSuccess: () => toast.success('Offer accepted! Deal done! 🎉'),
      onError: (err: any) => toast.error(err.response?.data?.error || 'Failed'),
    });
  };

  const handleReject = (id: number) => {
    if (!confirm('Reject this offer?')) return;
    rejectOffer.mutate(id, {
      onSuccess: () => toast.success('Offer rejected'),
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Offers Received</h1>

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : offers && offers.length > 0 ? (
        <div className="space-y-4">
          {offers.map((o) => (
            <div key={o.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {o.investorName} → {o.businessName}
                  </h3>
                  <p className="text-primary-600 font-medium mt-1">
                    ₹{(o.amount/100000).toFixed(1)}L for {o.equityPercent}% equity
                  </p>
                  {o.message && <p className="text-gray-600 text-sm mt-2">"{o.message}"</p>}
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColor[o.status]}`}>
                  {o.status}
                </span>
              </div>

              {o.status === 'PENDING' && (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleAccept(o.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
                  >
                    ✓ Accept Deal
                  </button>
                  <button
                    onClick={() => handleReject(o.id)}
                    className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200"
                  >
                    ✕ Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">No offers received yet.</p>
        </div>
      )}
    </div>
  );
}
