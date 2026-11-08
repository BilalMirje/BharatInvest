import type { Business } from '../types';

interface Props {
  business: Business;
  onClick?: () => void;
  locked?: boolean;
}

const categoryColors: Record<string, string> = {
  TECH: 'bg-blue-100 text-blue-700',
  FOOD: 'bg-orange-100 text-orange-700',
  FASHION: 'bg-pink-100 text-pink-700',
  HEALTH: 'bg-green-100 text-green-700',
  EDUCATION: 'bg-purple-100 text-purple-700',
  FINANCE: 'bg-yellow-100 text-yellow-700',
  ECOMMERCE: 'bg-indigo-100 text-indigo-700',
  AGRICULTURE: 'bg-emerald-100 text-emerald-700',
  ENTERTAINMENT: 'bg-rose-100 text-rose-700',
  OTHER: 'bg-gray-100 text-gray-700',
};

export default function BusinessCard({ business, onClick, locked }: Props) {
  return (
    <div
      onClick={!locked ? onClick : undefined}
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all ${
        !locked ? 'hover:shadow-md hover:border-primary-300 cursor-pointer' : 'opacity-80'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{business.name}</h3>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${categoryColors[business.category] || categoryColors.OTHER}`}>
          {business.category}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{business.description}</p>

      <div className="flex justify-between items-center text-sm">
        <div>
          <span className="text-gray-500">Asking: </span>
          <span className="font-semibold text-primary-700">₹{(business.askAmount / 100000).toFixed(1)}L</span>
        </div>
        <div>
          <span className="text-gray-500">Equity: </span>
          <span className="font-semibold text-accent-600">{business.equityOffered}%</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
        <span className="text-xs text-gray-500">by {business.founderName}</span>
        {locked && (
          <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
            Login to view details
          </span>
        )}
      </div>
    </div>
  );
}
