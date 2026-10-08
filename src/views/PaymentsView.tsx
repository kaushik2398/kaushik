import React, { useState } from 'react';
import {
  Receipt,
  Search,
  Filter,
  DollarSign,
  CreditCard,
  Radio,
  QrCode,
  CheckCircle2,
  Calendar,
  ArrowUpRight,
  Printer,
  ShieldAlert,
  Lock,
} from 'lucide-react';
import { Payment, UserRole } from '../types';

interface PaymentsViewProps {
  payments: Payment[];
  currentUserRole: UserRole;
  onOpenReceipt: (payment: Payment) => void;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({
  payments,
  currentUserRole,
  onOpenReceipt,
}) => {
  const [methodFilter, setMethodFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const isAdmin = currentUserRole === 'System Admin';

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const fastagTotal = payments.filter((p) => p.paymentMethod === 'Fastag / RFID').reduce((s, p) => s + p.amount, 0);
  const upiTotal = payments.filter((p) => p.paymentMethod === 'UPI / QR').reduce((s, p) => s + p.amount, 0);
  const cardTotal = payments.filter((p) => p.paymentMethod === 'Credit Card').reduce((s, p) => s + p.amount, 0);
  const cashTotal = payments.filter((p) => p.paymentMethod === 'Cash').reduce((s, p) => s + p.amount, 0);

  const filteredPayments = payments.filter((p) => {
    if (methodFilter !== 'All' && p.paymentMethod !== methodFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.plateNumber.toLowerCase().includes(q) ||
      p.ticketNumber.toLowerCase().includes(q) ||
      p.transactionReference.toLowerCase().includes(q) ||
      p.paymentId.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header & Metric Cards (Admin only sees financial summary cards; Staff sees operational counts) */}
      {isAdmin ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#0D1527] border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">Total Settled Revenue</span>
              <DollarSign className="w-4 h-4 text-lime-400" />
            </div>
            <div className="font-mono text-3xl font-extrabold text-lime-400">
              ₹{totalRevenue.toFixed(2)}
            </div>
            <p className="text-[11px] text-slate-400 mt-2 font-mono">
              {payments.length} transactions processed
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0D1527] border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">Fastag / RFID Gate</span>
              <Radio className="w-4 h-4 text-sky-400" />
            </div>
            <div className="font-mono text-2xl font-bold text-white">
              ₹{fastagTotal.toFixed(2)}
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              {Math.round((fastagTotal / (totalRevenue || 1)) * 100)}% automated collections
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0D1527] border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">UPI / QR & Cards</span>
              <QrCode className="w-4 h-4 text-amber-400" />
            </div>
            <div className="font-mono text-2xl font-bold text-white">
              ₹{(upiTotal + cardTotal).toFixed(2)}
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Digital counter POS payments
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0D1527] border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">Cash Collections</span>
              <Receipt className="w-4 h-4 text-slate-400" />
            </div>
            <div className="font-mono text-2xl font-bold text-white">
              ₹{cashTotal.toFixed(2)}
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Attendant cash register
            </p>
          </div>
        </div>
      ) : (
        /* Staff Operational Banner - STRICTLY NO REVENUE METRICS */
        <div className="p-5 rounded-2xl bg-[#0D1527] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-lime-400/10 text-lime-400 border border-lime-400/20">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">
                Operational Gate Transaction Status
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Staff view: Verify payment clearing status and boom barrier authorization tokens.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 px-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Financial aggregates restricted (Admin clearance required)</span>
          </div>
        </div>
      )}

      {/* Payment Ledger */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0D1527] border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
              {isAdmin ? 'Payments & Fiscal Ledger' : 'Gate Payment Verification Log'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Table schema: <code className="text-slate-300">payments (payment_id PK, record_id FK, payment_method, payment_status, transaction_reference)</code>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search plate, ticket, ref..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-750 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-lime-400"
              />
            </div>

            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-900 border border-slate-750 rounded-lg text-xs text-slate-200"
            >
              <option value="All">All Channels</option>
              <option value="Fastag / RFID">Fastag / RFID</option>
              <option value="UPI / QR">UPI / QR</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Cash">Cash</option>
            </select>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/90 text-slate-400 border-b border-slate-800">
                <th className="py-3 px-4 font-semibold">Payment ID</th>
                <th className="py-3 px-4 font-semibold">Vehicle Plate</th>
                <th className="py-3 px-4 font-semibold">Ticket No.</th>
                <th className="py-3 px-4 font-semibold">Channel</th>
                {isAdmin ? (
                  <th className="py-3 px-4 font-semibold">Amount</th>
                ) : (
                  <th className="py-3 px-4 font-semibold">Clearance State</th>
                )}
                <th className="py-3 px-4 font-semibold">Transaction Reference</th>
                <th className="py-3 px-4 font-semibold">Timestamp</th>
                <th className="py-3 px-4 font-semibold text-right">Receipt / Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredPayments.map((p) => (
                <tr
                  key={p.paymentId}
                  className="hover:bg-slate-850/50 transition-colors"
                >
                  <td className="py-3 px-4 text-white font-semibold">
                    {p.paymentId}
                  </td>
                  <td className="py-3 px-4 font-bold text-lime-400">
                    {p.plateNumber}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {p.ticketNumber}
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-200">
                    {p.paymentMethod}
                  </td>
                  {isAdmin ? (
                    <td className="py-3 px-4 font-bold text-white text-sm">
                      ₹{p.amount.toFixed(2)}
                    </td>
                  ) : (
                    <td className="py-3 px-4 font-sans text-xs">
                      <span className="inline-flex items-center gap-1 text-lime-400 font-semibold bg-lime-400/10 px-2 py-0.5 rounded border border-lime-400/20">
                        <CheckCircle2 className="w-3 h-3" /> Cleared
                      </span>
                    </td>
                  )}
                  <td className="py-3 px-4 text-slate-400 text-[11px]">
                    {p.transactionReference}
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[11px]">
                    {p.paymentTime}
                  </td>
                  <td className="py-3 px-4 text-right font-sans">
                    <button
                      onClick={() => onOpenReceipt(p)}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded transition-colors cursor-pointer"
                    >
                      Verify
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
