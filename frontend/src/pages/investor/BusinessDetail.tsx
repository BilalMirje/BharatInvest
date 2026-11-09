import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useBusiness, usePitch, useCreateOffer, useOffersForBusiness } from '../../api/hooks';
import { useAuth } from '../../auth/context/AuthContext';
import { parseFeedback } from '../../utils/feedbackParser';
import FinancialChart from '../../components/pitch/FinancialChart';
import toast from 'react-hot-toast';

export default function BusinessDetail() {
  const { id } = useParams<{ id: string }>();
  const bId = Number(id);
  const { data: business, isLoading } = useBusiness(bId);
  const { data: pitch } = usePitch(bId);
  const { data: offers } = useOffersForBusiness(bId);
  const { user } = useAuth();
  const createOffer = useCreateOffer();

  const [showOffer, setShowOffer] = useState(false);
  const [amount, setAmount] = useState('');
  const [equity, setEquity] = useState('');
  const [message, setMessage] = useState('');

  const handleOffer = (e: React.FormEvent) => {
    e.preventDefault();
    createOffer.mutate(
      { businessId: bId, amount: Number(amount), equityPercent: Number(equity), message },
      {
        onSuccess: () => {
          toast.success('Offer sent');
          setShowOffer(false);
          setAmount(''); setEquity(''); setMessage('');
        },
        onError: (err: any) => toast.error(err.response?.data?.error || 'Failed'),
      }
    );
  };

  if (isLoading) return <div className="text-center py-12 text-gray-400">Loading...</div>;
  if (!business) return <div className="text-center py-12 text-red-500">Business not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{business.name}</h1>
            <p className="text-gray-500 mt-1">{business.category} · by {business.founderName}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary-600">₹{(business.askAmount / 100000).toFixed(1)}L</p>
            <p className="text-sm text-gray-500">for {business.equityOffered}% equity</p>
          </div>
        </div>
        <p className="text-gray-700 leading-relaxed">{business.description}</p>
        {business.websiteUrl && (
          <a href={business.websiteUrl} target="_blank" rel="noopener noreferrer"
            className="inline-block mt-3 text-primary-600 hover:underline text-sm font-medium">
            Visit Website
          </a>
        )}
      </div>

      {pitch?.videoUrl && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Pitch Video</h2>
          <div className="w-full aspect-video bg-black rounded-lg overflow-hidden relative">
            <video controls className="absolute inset-0 w-full h-full object-contain" src={pitch.videoUrl}>
              Your browser does not support video.
            </video>
          </div>
          {pitch.description && <p className="text-gray-600 mt-3 text-sm">{pitch.description}</p>}
        </div>
      )}

      {(() => {
        const fb = parseFeedback(pitch?.aiFeedback);
        if (!fb?.financialData) return null;
        return <div className="mb-6"><FinancialChart financialData={fb.financialData} /></div>;
      })()}

      {offers && offers.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Current Offers</h2>
          <div className="space-y-2">
            {offers.map((o) => (
              <div key={o.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-700">{o.investorName}</span>
                <span className="text-sm font-medium text-primary-600">
                  ₹{(o.amount / 100000).toFixed(1)}L / {o.equityPercent}%
                </span>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  o.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                  o.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                  'bg-red-100 text-red-700'
                }`}>{o.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {user?.role === 'INVESTOR' && business.status === 'LIVE' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {!showOffer ? (
            <button onClick={() => setShowOffer(true)}
              className="w-full bg-accent-500 text-white py-3 rounded-lg font-semibold hover:bg-accent-600 text-lg">
              Make an Offer
            </button>
          ) : (
            <form onSubmit={handleOffer} className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Your Offer</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                  <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                    required min={1}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Equity (%)</label>
                  <input type="number" value={equity} onChange={(e) => setEquity(e.target.value)}
                    required min={0.1} max={100} step={0.1}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Why you want to invest..." />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={createOffer.isPending}
                  className="bg-accent-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-accent-600 disabled:opacity-50">
                  {createOffer.isPending ? 'Sending...' : 'Send Offer'}
                </button>
                <button type="button" onClick={() => setShowOffer(false)}
                  className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-200">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
