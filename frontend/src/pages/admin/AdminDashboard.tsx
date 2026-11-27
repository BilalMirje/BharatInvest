import { useState } from 'react';
import {
  usePendingBusinesses, useAllBusinessesAdmin, useApproveBusiness, useRejectBusiness,
  useDeleteBusiness, useAdminInvestors, useApproveInvestor, useRejectInvestor, useInvestorOffers
} from '../../api/hooks';
import toast from 'react-hot-toast';

const statusBadge: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  APPROVED: 'bg-blue-100 text-blue-700',
  REJECTED: 'bg-red-100 text-red-700',
  LIVE: 'bg-green-100 text-green-700',
  FUNDED: 'bg-purple-100 text-purple-700',
};

function InvestorDetail({ investorId }: { investorId: number }) {
  const { data: offers, isLoading } = useInvestorOffers(investorId);
  if (isLoading) return <p className="text-gray-400 text-sm py-2">Loading offers...</p>;
  if (!offers || offers.length === 0) return <p className="text-gray-400 text-sm py-2">No offers yet.</p>;

  const totalInvested = offers.filter((o: any) => o.status === 'ACCEPTED').reduce((s: number, o: any) => s + o.amount, 0);

  return (
    <div className="mt-3 border-t border-gray-100 pt-3">
      <p className="text-sm font-medium text-gray-700 mb-2">
        Total Invested: <span className="text-primary-600 font-bold">₹{(totalInvested / 100000).toFixed(1)}L</span>
        {' · '}{offers.length} offer{offers.length !== 1 ? 's' : ''}
      </p>
      <div className="space-y-1.5 max-h-40 overflow-y-auto">
        {offers.map((o: any) => (
          <div key={o.id} className="flex justify-between items-center text-xs bg-gray-50 rounded px-3 py-1.5">
            <span className="text-gray-700">{o.businessName}</span>
            <span className="text-gray-600">₹{(o.amount / 100000).toFixed(1)}L / {o.equityPercent}%</span>
            <span className={`px-1.5 py-0.5 rounded ${
              o.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
              o.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
            }`}>{o.status}</span>
            <span className="text-gray-400">{new Date(o.createdAt).toLocaleDateString('en-IN')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [tab, setTab] = useState<'pending' | 'all' | 'investors'>('pending');
  const { data: pending, isLoading: loadingPending } = usePendingBusinesses();
  const { data: all, isLoading: loadingAll } = useAllBusinessesAdmin();
  const { data: investors, isLoading: loadingInvestors } = useAdminInvestors();
  const approveBiz = useApproveBusiness();
  const rejectBiz = useRejectBusiness();
  const deleteBiz = useDeleteBusiness();
  const approveInvestor = useApproveInvestor();
  const rejectInvestor = useRejectInvestor();
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [expandedInvestor, setExpandedInvestor] = useState<number | null>(null);

  const businesses = tab === 'pending' ? pending : all;
  const loading = tab === 'pending' ? loadingPending : tab === 'all' ? loadingAll : loadingInvestors;

  const handleApprove = (id: number) => {
    approveBiz.mutate(id, { onSuccess: () => toast.success('Business approved!') });
  };
  const handleReject = (id: number) => {
    if (!rejectReason.trim()) return toast.error('Enter rejection reason');
    rejectBiz.mutate({ id, reason: rejectReason }, {
      onSuccess: () => { toast.success('Business rejected'); setRejectingId(null); setRejectReason(''); },
    });
  };
  const handleDelete = (id: number) => {
    if (!confirm('Delete this business permanently?')) return;
    deleteBiz.mutate(id, { onSuccess: () => toast.success('Business deleted') });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      <div className="flex gap-2 mb-6">
        {(['pending', 'all', 'investors'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg font-medium ${tab === t ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
            {t === 'pending' ? `Pending ${pending ? `(${pending.length})` : ''}` :
             t === 'all' ? 'All Businesses' : `Investors ${investors ? `(${investors.length})` : ''}`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : tab === 'investors' ? (
        investors && investors.length > 0 ? (
          <div className="space-y-4">
            {investors.map((inv: any) => (
              <div key={inv.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{inv.name}</h3>
                    <p className="text-gray-500 text-sm">{inv.email} · Joined {new Date(inv.createdAt).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${inv.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {inv.approved ? 'Approved' : 'Pending'}
                    </span>
                    {!inv.approved && (
                      <button onClick={() => approveInvestor.mutate(inv.id, { onSuccess: () => toast.success('Investor approved') })}
                        className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-green-700">
                        Approve
                      </button>
                    )}
                    {inv.approved && (
                      <button onClick={() => rejectInvestor.mutate(inv.id, { onSuccess: () => toast.success('Investor access revoked') })}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-xs font-medium hover:bg-red-200">
                        Revoke
                      </button>
                    )}
                  </div>
                </div>
                <button onClick={() => setExpandedInvestor(expandedInvestor === inv.id ? null : inv.id)}
                  className="text-primary-600 text-sm mt-2 hover:underline">
                  {expandedInvestor === inv.id ? 'Hide Details' : 'View Investment History'}
                </button>
                {expandedInvestor === inv.id && <InvestorDetail investorId={inv.id} />}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500">No investors registered yet.</p>
          </div>
        )
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
                {tab === 'all' && (
                  <button onClick={() => handleDelete(b.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium ml-4 flex-shrink-0">
                    Delete
                  </button>
                )}
              </div>

              {b.status === 'PENDING' && (
                <div className="mt-4 flex gap-3 items-center">
                  <button onClick={() => handleApprove(b.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700">
                    Approve
                  </button>
                  {rejectingId === b.id ? (
                    <div className="flex gap-2 items-center flex-1">
                      <input type="text" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Rejection reason..."
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-400" />
                      <button onClick={() => handleReject(b.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Reject</button>
                      <button onClick={() => { setRejectingId(null); setRejectReason(''); }}
                        className="text-gray-500 text-sm">Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => setRejectingId(b.id)}
                      className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200">Reject</button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">{tab === 'pending' ? 'No pending businesses.' : 'No businesses yet.'}</p>
        </div>
      )}
    </div>
  );
}
