import React from 'react';
import { Package, Receipt, CreditCard } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function Billing() {
  const { coins, addCoins } = useAppStore();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
        <div className="flex gap-8">
          <button className="flex items-center gap-2 text-purple-600 font-medium border-b-2 border-purple-600 pb-4 -mb-4">
            <Package className="w-4 h-4" /> Package
          </button>
          <button className="flex items-center gap-2 text-zinc-500 font-medium pb-4 -mb-4 hover:text-zinc-900">
            <Receipt className="w-4 h-4" /> Orders
          </button>
          <button className="flex items-center gap-2 text-zinc-500 font-medium pb-4 -mb-4 hover:text-zinc-900">
            <CreditCard className="w-4 h-4" /> Transactions
          </button>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-zinc-200 shadow-sm">
          <span className="text-zinc-500 text-sm">Total balance:</span>
          <span className="font-bold text-zinc-900">{coins} Coins</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-semibold">Premium</h3>
            <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-3 py-1 rounded-full">
              🪙 50
            </div>
          </div>
          <div className="mb-8">
            <span className="text-4xl font-bold text-zinc-900">75 000</span>
            <span className="text-zinc-500 ml-2">UZS</span>
          </div>
          <button 
            onClick={() => addCoins(50)}
            className="w-full py-3 rounded-xl text-white font-medium bg-gradient-to-r from-[#a855f7] to-[#7c3aed] hover:opacity-90 transition-opacity mb-6"
          >
            Buy
          </button>
          <div className="space-y-3">
            <p className="text-sm text-zinc-500 mb-4">Purchase coins and use them to unlock any of these modules.</p>
            {['Reading Module', 'Listening Module', 'Writing Module', 'Speaking Module'].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="text-sm text-zinc-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
