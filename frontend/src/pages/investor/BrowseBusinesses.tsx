import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveBusinesses } from '../../api/hooks';
import BusinessCard from '../../components/BusinessCard';
import CategoryFilter from '../../components/CategoryFilter';

export default function BrowseBusinesses() {
  const [category, setCategory] = useState('');
  const { data: businesses, isLoading } = useLiveBusinesses(category || undefined);
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Browse Businesses</h1>
      <p className="text-gray-500 mb-6">Discover startups looking for investment</p>

      <div className="mb-6">
        <CategoryFilter selected={category} onChange={setCategory} />
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : businesses && businesses.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((b) => (
            <BusinessCard
              key={b.id}
              business={b}
              onClick={() => navigate(`/investor/business/${b.id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">
            {category ? 'No businesses in this category right now.' : 'No businesses seeking funding right now.'}
          </p>
        </div>
      )}
    </div>
  );
}
