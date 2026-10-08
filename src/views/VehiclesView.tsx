import React, { useState } from 'react';
import {
  Car,
  Search,
  Filter,
  Clock,
  Phone,
  User,
  LogOut,
  Calendar,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { ParkingRecord } from '../types';

interface VehiclesViewProps {
  records: ParkingRecord[];
  onOpenExitModal: (record: ParkingRecord) => void;
}

export const VehiclesView: React.FC<VehiclesViewProps> = ({
  records,
  onOpenExitModal,
}) => {
  const [tab, setTab] = useState<'Parked' | 'Completed' | 'All'>('Parked');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<ParkingRecord | null>(null);

  const filteredRecords = records.filter((r) => {
    if (tab !== 'All' && r.status !== tab) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.plateNumber.toLowerCase().includes(q) ||
      r.ownerName.toLowerCase().includes(q) ||
      r.ownerPhone.toLowerCase().includes(q) ||
      r.ticketNumber.toLowerCase().includes(q) ||
      r.slotCode.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0D1527] border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
              Vehicle & Owner Registry
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Normalized relational lookup between <code className="text-slate-300">vehicles</code>, <code className="text-slate-300">owners</code>, and session logs.
            </p>
          </div>

          {/* Tab Filter */}
          <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800">
            {(['Parked', 'Completed', 'All'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  tab === t
                    ? 'bg-lime-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t === 'Parked' ? 'Currently Parked' : t === 'Completed' ? 'Exit History' : 'All Registry'}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by license plate, owner name, phone, ticket..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-750 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-lime-400"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="p-5 rounded-2xl bg-[#0D1527] border border-slate-800">
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/90 text-slate-400 border-b border-slate-800">
                <th className="py-3 px-4 font-semibold">Plate Number</th>
                <th className="py-3 px-4 font-semibold">Type</th>
                <th className="py-3 px-4 font-semibold">Registered Driver (Owner)</th>
                <th className="py-3 px-4 font-semibold">Contact Phone</th>
                <th className="py-3 px-4 font-semibold">Current Bay</th>
                <th className="py-3 px-4 font-semibold">Check-In Time</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 font-sans">
                    No matching vehicles found.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => {
                  const isParked = r.status === 'Parked';
                  return (
                    <tr
                      key={r.recordId}
                      className="hover:bg-slate-850/50 transition-colors"
                    >
                      <td className="py-3 px-4 font-bold text-white">
                        <span className="font-mono text-lime-400">{r.plateNumber}</span>
                      </td>
                      <td className="py-3 px-4 font-sans text-slate-300">
                        {r.vehicleType}
                      </td>
                      <td className="py-3 px-4 font-sans text-slate-200 font-medium">
                        {r.ownerName}
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-[11px]">
                        {r.ownerPhone}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
                          {r.slotCode}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-[11px]">
                        {r.entryTime}
                      </td>
                      <td className="py-3 px-4 font-sans">
                        {isParked ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-lime-400 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
                            Parked
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">
                            Exited · Paid ₹{r.totalFee}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-sans">
                        {isParked ? (
                          <button
                            onClick={() => onOpenExitModal(r)}
                            className="px-2.5 py-1 text-xs font-semibold text-slate-950 bg-lime-400 hover:bg-lime-300 rounded transition-colors cursor-pointer"
                          >
                            Checkout
                          </button>
                        ) : (
                          <button
                            onClick={() => setSelectedRecord(r)}
                            className="text-xs text-slate-400 hover:text-white"
                          >
                            Audit
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Inspection Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-[#0D1527] border border-slate-700 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-display font-bold text-white text-base">
                Audit Record {selectedRecord.ticketNumber}
              </h3>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Vehicle Plate</span>
                <span className="font-mono text-lime-400 font-bold">{selectedRecord.plateNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Owner Name</span>
                <span className="text-slate-200">{selectedRecord.ownerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Slot Code</span>
                <span className="font-mono text-slate-200">{selectedRecord.slotCode} ({selectedRecord.floorLevel})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Entry Timestamp</span>
                <span className="font-mono text-slate-300">{selectedRecord.entryTime}</span>
              </div>
              {selectedRecord.exitTime && (
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Exit Timestamp</span>
                  <span className="font-mono text-slate-300">{selectedRecord.exitTime}</span>
                </div>
              )}
              {selectedRecord.totalFee !== undefined && (
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Total Settled Fee</span>
                  <span className="font-mono font-bold text-lime-400">₹{selectedRecord.totalFee.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-lime-400 hover:bg-lime-300 rounded-lg"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
