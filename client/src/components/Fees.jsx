import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Filter, 
  DollarSign, 
  X,
  FileText
} from 'lucide-react';
import { dataService } from '../lib/supabase';

export default function Fees({ currentRole }) {
  const [fees, setFees] = useState([]);
  const [members, setMembers] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [payModalFee, setPayModalFee] = useState(null);
  const [payMethod, setPayMethod] = useState('Credit Card');

  // New Fee state
  const [newFee, setNewFee] = useState({
    user_id: '',
    amount: '75.00',
    type: 'monthly',
    description: 'Monthly Club Training & Facility Dues',
    due_date: '2026-11-30'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [feesData, membersData] = await Promise.all([
      dataService.getFees(),
      dataService.getMembers()
    ]);
    setFees(feesData);
    setMembers(membersData);
  };

  const handleCreateFee = async (e) => {
    e.preventDefault();
    if (!newFee.user_id || !newFee.amount) return;
    const athlete = members.find(m => m.id === newFee.user_id);
    await dataService.addFee({
      ...newFee,
      user_name: athlete ? athlete.name : 'Club Member'
    });
    setIsAddOpen(false);
    setNewFee({
      user_id: '',
      amount: '75.00',
      type: 'monthly',
      description: 'Monthly Club Training & Facility Dues',
      due_date: '2026-11-30'
    });
    await loadData();
  };

  const handleConfirmPayment = async (e) => {
    e.preventDefault();
    if (!payModalFee) return;
    await dataService.markFeePaid(payModalFee.id, payMethod);
    setPayModalFee(null);
    await loadData();
  };

  // Calculations
  const totalCollected = fees.filter(f => f.status === 'paid').reduce((s, f) => s + Number(f.amount), 0);
  const totalPending = fees.filter(f => f.status === 'pending').reduce((s, f) => s + Number(f.amount), 0);
  const totalOverdue = fees.filter(f => f.status === 'overdue').reduce((s, f) => s + Number(f.amount), 0);

  const filteredFees = fees.filter(f => {
    if (statusFilter === 'all') return true;
    return f.status === statusFilter;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-400" />
            Fee & Payment Management
          </h1>
          <p className="text-xs text-slate-400">Track monthly athlete dues, annual memberships, and tournament registration fees</p>
        </div>

        {currentRole === 'admin' && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Issue Fee Invoice
          </button>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Total Dues Collected</span>
          <div className="text-2xl font-black text-emerald-400 tracking-tight">
            ${totalCollected.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-emerald-500 font-medium mt-1 inline-block">
            Verified across club records
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Pending Invoices</span>
          <div className="text-2xl font-black text-amber-400 tracking-tight">
            ${totalPending.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-amber-500 font-medium mt-1 inline-block">
            Awaiting athlete settlement
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Overdue Invoices</span>
          <div className="text-2xl font-black text-rose-400 tracking-tight">
            ${totalOverdue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-rose-400 font-medium mt-1 inline-block">
            Urgent follow-up required
          </span>
        </div>
      </div>

      {/* Filter and Table Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm space-y-3">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {['all', 'pending', 'paid', 'overdue'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize transition ${
                  statusFilter === st
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Showing {filteredFees.length} invoices
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Athlete / Member</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {filteredFees.map((fee) => (
                <tr key={fee.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-white">{fee.user_name}</div>
                    <div className="text-[11px] text-slate-400">{fee.description}</div>
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-white">
                    ${Number(fee.amount).toFixed(2)}
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium text-[10px] uppercase">
                      {fee.type}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-slate-400">
                    {new Date(fee.due_date).toLocaleDateString()}
                  </td>

                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      fee.status === 'paid'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : fee.status === 'pending'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {fee.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    {fee.status === 'paid' ? (
                      <span className="text-[11px] text-emerald-400 font-semibold flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {fee.payment_method || 'Settled'}
                      </span>
                    ) : (
                      currentRole === 'admin' && (
                        <button
                          onClick={() => setPayModalFee(fee)}
                          className="px-2.5 py-1 text-[11px] font-bold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-600 hover:text-white rounded-lg border border-emerald-500/20 transition"
                        >
                          Mark Paid
                        </button>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Fee Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-400" /> Issue Club Fee Invoice
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFee} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Select Member / Athlete</label>
                <select
                  required
                  value={newFee.user_id}
                  onChange={(e) => setNewFee({ ...newFee, user_id: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="">-- Choose Member --</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.sport} - {m.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Amount ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newFee.amount}
                    onChange={(e) => setNewFee({ ...newFee, amount: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Fee Type</label>
                  <select
                    value={newFee.type}
                    onChange={(e) => setNewFee({ ...newFee, type: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="monthly">Monthly Dues</option>
                    <option value="annual">Annual Membership</option>
                    <option value="equipment">Equipment Fee</option>
                    <option value="registration">Tournament Registration</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <input
                  type="text"
                  value={newFee.description}
                  onChange={(e) => setNewFee({ ...newFee, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Due Date</label>
                <input
                  type="date"
                  required
                  value={newFee.due_date}
                  onChange={(e) => setNewFee({ ...newFee, due_date: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-600/20"
                >
                  Create Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {payModalFee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Record Member Payment</h3>
              <button onClick={() => setPayModalFee(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Confirming payment of <span className="text-emerald-400 font-bold">${Number(payModalFee.amount).toFixed(2)}</span> for <span className="text-white font-semibold">{payModalFee.user_name}</span>.
            </p>

            <form onSubmit={handleConfirmPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Method</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Credit Card">Credit / Debit Card</option>
                  <option value="Bank Transfer">Bank Direct Transfer</option>
                  <option value="Cash">Cash at Club Office</option>
                  <option value="Apple Pay / GPay">Digital Wallet</option>
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPayModalFee(null)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow"
                >
                  Confirm Settlement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
