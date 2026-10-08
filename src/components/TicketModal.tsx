import React, { useRef } from 'react';
import { X, Printer, CheckCircle2, QrCode, ArrowDownRight, Clock, ShieldCheck, MapPin } from 'lucide-react';
import { ParkingRecord } from '../types';

interface TicketModalProps {
  record: ParkingRecord | null;
  onClose: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({ record, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!record) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-[#0D1527] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#080D1A]">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-lime-400" />
            <h3 className="font-display font-bold text-base text-white">Digital Parking Ticket</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Ticket Body */}
        <div ref={printRef} className="p-6 space-y-5 bg-gradient-to-b from-[#0D1527] to-[#0A0F1D]">
          {/* Top Ticket Header */}
          <div className="text-center pb-4 border-b border-dashed border-slate-700">
            <span className="text-[10px] font-mono tracking-widest text-lime-400 uppercase font-semibold">
              SMARTPARK SYSTEM TICKET
            </span>
            <div className="text-2xl font-mono font-bold tracking-tight text-white mt-1">
              {record.ticketNumber}
            </div>
            <p className="text-xs text-slate-400 mt-1">Terminal 2 · Central Plaza Parking</p>
          </div>

          {/* Big Allocated Slot Display */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-lime-400/30 text-center relative overflow-hidden">
            <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">
              Assigned Parking Slot
            </div>
            <div className="text-4xl font-mono font-extrabold text-lime-400 tracking-tight my-1">
              {record.slotCode}
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-slate-300 font-mono">
              <MapPin className="w-3.5 h-3.5 text-lime-400" />
              <span>{record.floorLevel}</span>
              <span>·</span>
              <span>Bay {record.slotCode}</span>
            </div>
          </div>

          {/* Vehicle & Owner Details */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase">Vehicle Plate</div>
              <div className="font-mono font-bold text-white text-sm mt-0.5">{record.plateNumber}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase">Vehicle Category</div>
              <div className="font-semibold text-slate-200 mt-0.5">{record.vehicleType}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase">Driver / Owner</div>
              <div className="font-semibold text-slate-200 mt-0.5 truncate">{record.ownerName}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase">Entry Timestamp</div>
              <div className="font-mono text-slate-300 mt-0.5 text-[11px] truncate">{record.entryTime}</div>
            </div>
          </div>

          {/* Barcode & Simulated QR */}
          <div className="pt-2 flex flex-col items-center justify-center border-t border-dashed border-slate-700">
            {/* Simulated 1D Barcode */}
            <div className="w-full flex items-center justify-center gap-[3px] h-10 px-4 bg-white/95 rounded p-1 mb-2">
              {[4, 2, 6, 2, 4, 1, 3, 5, 2, 4, 3, 1, 5, 2, 4, 2, 3, 6, 1, 4, 3, 2, 5, 1, 4, 2, 5, 3].map((w, idx) => (
                <div
                  key={idx}
                  className="h-full bg-slate-950"
                  style={{ width: `${w * 1.5}px` }}
                />
              ))}
            </div>
            <span className="text-[10px] font-mono text-slate-400 tracking-wider">
              Scan barcode at gate sensor or keep ticket on dashboard
            </span>
          </div>

          <div className="text-[10px] text-slate-400 text-center leading-relaxed">
            * 15-minute free grace period applies. Lost ticket subject to penalty rate. 
            All allocations are logged securely in system records.
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 bg-[#080D1A] border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-850 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-lime-400 hover:bg-lime-300 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Ticket</span>
          </button>
        </div>
      </div>
    </div>
  );
};
