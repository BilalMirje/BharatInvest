import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateBusiness } from '../../api/hooks';
import { CATEGORIES, type Category } from '../../types';
import toast from 'react-hot-toast';

export default function CreateBusiness() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('TECH');
  const [description, setDescription] = useState('');
  const [askAmount, setAskAmount] = useState('');
  const [equityOffered, setEquityOffered] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const navigate = useNavigate();
  const createBiz = useCreateBusiness();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBiz.mutate(
      { name, category, description, askAmount: Number(askAmount), equityOffered: Number(equityOffered), websiteUrl: websiteUrl || undefined },
      {
        onSuccess: () => {
          toast.success('Business created! Waiting for admin approval.');
          navigate('/founder/dashboard');
        },
        onError: (err: any) => toast.error(err.response?.data?.error || 'Failed'),
      }
    );
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Business</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none"
            placeholder="e.g., FreshKart"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business Pitch Description <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-400 mb-2">
            Write a detailed description — Cover: what your business does, the problem you solve,
            your target market, current traction (users/revenue/growth), how you'll use the funding, and what makes you different.
          </p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            minLength={100}
            rows={6}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none"
            placeholder={"Example: FreshBasket delivers farm-fresh organic vegetables to doorsteps within 2 hours. We solve the problem of unreliable vegetable quality in urban areas. Currently serving Mumbai, Pune, and Bangalore with 5000+ daily orders and ₹15L monthly revenue. Our CAC is ₹120 and LTV is ₹2400. We're seeking funding to expand to 10 more cities and build cold-chain infrastructure..."}
          />
          <p className="text-xs text-gray-400 mt-1">{description.length}/100 characters minimum</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Website URL (optional)</label>
          <input
            type="url"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none"
            placeholder="https://www.example.com"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ask Amount (₹)</label>
            <input
              type="number"
              value={askAmount}
              onChange={(e) => setAskAmount(e.target.value)}
              required
              min={1}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="e.g., 1000000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Equity Offered (%)</label>
            <input
              type="number"
              value={equityOffered}
              onChange={(e) => setEquityOffered(e.target.value)}
              required
              min={0.1}
              max={100}
              step={0.1}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="e.g., 10"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={createBiz.isPending}
          className="w-full bg-primary-600 text-white py-2.5 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50"
        >
          {createBiz.isPending ? 'Creating...' : 'Create Business'}
        </button>
      </form>
    </div>
  );
}

