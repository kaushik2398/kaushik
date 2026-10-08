import React, { useRef } from 'react';
import { X, Printer, CheckCircle2, Receipt, ArrowRight, ShieldCheck } from 'lucide-react';
import { Payment } from '../types';

interface ReceiptModalProps {
  payment: Payment | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ payment, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!payment) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-[#0D1527] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#080D1A]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-lime-400" />
            <h3 className="font-display font-bold text-base text-white">Payment Receipt</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Receipt Body */}
        <div ref={printRef} className="p-6 space-y-5 bg-gradient-to-b from-[#0D1527] to-[#0A0F1D]">
          {/* Top Receipt Title */}
          <div className="text-center pb-4 border-b border-dashed border-slate-700">
            <span className="text-[10px] font-mono tracking-widest text-lime-400 uppercase font-semibold">
              SMARTPARK DBMS FISCAL RECEIPT
            </span>
            <div className="text-xl font-mono font-bold tracking-tight text-white mt-1">
              PAID · ₹{payment.amount.toFixed(2)}
            </div>
            <p className="text-xs text-slate-400 mt-1">Gate Exit Checkout · Terminal 2 Plaza</p>
          </div>

          {/* Transaction Metadata */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Payment ID</span>
              <span className="font-mono font-semibold text-white">{payment.paymentId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Ticket Ref</span>
              <span className="font-mono text-slate-200">{payment.ticketNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Vehicle Plate</span>
              <span className="font-mono font-bold text-lime-400">{payment.plateNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Payment Method</span>
              <span className="font-semibold text-slate-200">{payment.paymentMethod}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Txn Reference</span>
              <span className="font-mono text-[11px] text-slate-400">{payment.transactionReference}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Processed At</span>
              <span className="font-mono text-[11px] text-slate-300">{payment.paymentTime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Staff Attendant</span>
              <span className="text-slate-300">{payment.staffName}</span>
            </div>
          </div>

          {/* Amount Paid Callout */}
          <div className="p-3 bg-lime-400/10 border border-lime-400/20 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-[11px] text-lime-300 font-medium uppercase tracking-wider">Total Settled</div>
              <div className="text-xs text-slate-400">Slot auto-released to Available status</div>
            </div>
            <div className="text-2xl font-mono font-extrabold text-lime-400">
              ₹{payment.amount.toFixed(2)}
            </div>
          </div>

          <div className="text-[10px] text-slate-400 text-center">
            Payment successfully processed and verified. 
            All slot statuses and ledger balances have been updated.
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 bg-[#080D1A] border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-850 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-lime-400 hover:bg-lime-300 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
};
