import { useState } from 'react';
import { usePendingBusinesses, useAllBusinessesAdmin, useApproveBusiness, useRejectBusiness } from '../../api/hooks';
import toast from 'react-hot-toast';

const statusBadge: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  APPROVED: 'bg-blue-100 text-blue-700',
  REJECTED: 'bg-red-100 text-red-700',
  LIVE: 'bg-green-100 text-green-700',
  FUNDED: 'bg-purple-100 text-purple-700',
};

export default function AdminDashboard() {
  const [tab, setTab] = useState<'pending' | 'all'>('pending');
  const { data: pending, isLoading: loadingPending } = usePendingBusinesses();
  const { data: all, isLoading: loadingAll } = useAllBusinessesAdmin();
  const approveBiz = useApproveBusiness();
  const rejectBiz = useRejectBusiness();
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const businesses = tab === 'pending' ? pending : all;
  const loading = tab === 'pending' ? loadingPending : loadingAll;

  const handleApprove = (id: number) => {
    approveBiz.mutate(id, {
      onSuccess: () => toast.success('Business approved!'),
    });
  };

  const handleReject = (id: number) => {
    if (!rejectReason.trim()) return toast.error('Enter rejection reason');
    rejectBiz.mutate(
      { id, reason: rejectReason },
      {
        onSuccess: () => {
          toast.success('Business rejected');
          setRejectingId(null);
          setRejectReason('');
        },
      }
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('pending')}
          className={`px-4 py-2 rounded-lg font-medium ${
            tab === 'pending' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          Pending Approval {pending ? `(${pending.length})` : ''}
        </button>
        <button
          onClick={() => setTab('all')}
          className={`px-4 py-2 rounded-lg font-medium ${
            tab === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          All Businesses
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : businesses && businesses.length > 0 ? (
        <div className="space-y-4">
          {businesses.map((b) => (
            <div key={b.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">{b.name}</h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusBadge[b.status]}`}>
                      {b.status}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">
                    {b.category} · by {b.founderName} · ₹{(b.askAmount/100000).toFixed(1)}L for {b.equityOffered}%
                  </p>
                  <p className="text-gray-600 text-sm mt-2">{b.description}</p>
                </div>
              </div>

              {b.status === 'PENDING' && (
                <div className="mt-4 flex gap-3 items-center">
                  <button
                    onClick={() => handleApprove(b.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
                  >
                    ✓ Approve
                  </button>
                  {rejectingId === b.id ? (
                    <div className="flex gap-2 items-center flex-1">
                      <input
                        type="text"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Rejection reason..."
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-400"
                      />
                      <button
                        onClick={() => handleReject(b.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => { setRejectingId(null); setRejectReason(''); }}
                        className="text-gray-500 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setRejectingId(b.id)}
                      className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200"
                    >
                      ✕ Reject
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">
            {tab === 'pending' ? 'No pending businesses.' : 'No businesses yet.'}
          </p>
        </div>
      )}
    </div>
  );
}
