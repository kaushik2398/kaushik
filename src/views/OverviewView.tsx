import React, { useState, useEffect, useRef } from 'react';
import {
  Car,
  SquareParking,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  LogOut,
  ChevronRight,
  Sparkles,
  Layers,
  Zap,
  Shield,
  Activity,
  ArrowUpDown,
} from 'lucide-react';
import { animate, stagger } from 'animejs';
import { ParkingSlot, ParkingRecord, Payment, UserRole } from '../types';

interface OverviewViewProps {
  slots: ParkingSlot[];
  records: ParkingRecord[];
  payments: Payment[];
  currentUserRole: UserRole;
  onOpenEntryModal: () => void;
  onOpenExitModal: (record?: ParkingRecord) => void;
  onNavigateToTab: (tab: string) => void;
  onInspectSlot: (slot: ParkingSlot) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  slots,
  records,
  payments,
  currentUserRole,
  onOpenEntryModal,
  onOpenExitModal,
  onNavigateToTab,
  onInspectSlot,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Parked' | 'Completed'>('All');
  const [sortField, setSortField] = useState<'entryTime' | 'plateNumber'>('entryTime');
  const [sortAsc, setSortAsc] = useState(false);
  const metricCardsRef = useRef<HTMLDivElement>(null);

  // Calculate metrics
  const totalSlots = slots.length;
  const occupiedSlots = slots.filter((s) => s.status === 'Occupied').length;
  const availableSlots = slots.filter((s) => s.status === 'Available').length;
  const vehiclesInside = records.filter((r) => r.status === 'Parked').length;
  const revenueToday = payments.reduce((acc, curr) => acc + curr.amount, 0);

  // Floor stats
  const l1Slots = slots.filter((s) => s.floorLevel === 'Level 1');
  const l1Occupied = l1Slots.filter((s) => s.status === 'Occupied').length;
  const l2Slots = slots.filter((s) => s.floorLevel === 'Level 2');
  const l2Occupied = l2Slots.filter((s) => s.status === 'Occupied').length;
  const l3Slots = slots.filter((s) => s.floorLevel === 'Level 3');
  const l3Occupied = l3Slots.filter((s) => s.status === 'Occupied').length;

  useEffect(() => {
    if (!metricCardsRef.current) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    animate(metricCardsRef.current.children, {
      opacity: [0, 1],
      translateY: [16, 0],
      delay: stagger(80),
      duration: 500,
      ease: 'outCubic',
    });
  }, []);

  // Filter and sort records
  const filteredRecords = records
    .filter((r) => {
      if (statusFilter !== 'All' && r.status !== statusFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        r.plateNumber.toLowerCase().includes(q) ||
        r.ownerName.toLowerCase().includes(q) ||
        r.slotCode.toLowerCase().includes(q) ||
        r.ticketNumber.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortField === 'entryTime') {
        return sortAsc
          ? a.entryTime.localeCompare(b.entryTime)
          : b.entryTime.localeCompare(a.entryTime);
      }
      return sortAsc
        ? a.plateNumber.localeCompare(b.plateNumber)
        : b.plateNumber.localeCompare(a.plateNumber);
    });

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0E172C] to-[#0A0F1D] border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-lime-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
              <span className="text-xs uppercase tracking-wider text-lime-400 font-semibold">
                Live Deck Operations
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Operational Overview
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Live capacity monitoring, automatic slot allocation, and transaction logs across all 3 parking levels.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenEntryModal}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-950 bg-lime-400 hover:bg-lime-300 rounded-xl shadow-md shadow-lime-400/20 transition-all cursor-pointer"
            >
              <Car className="w-4 h-4 stroke-[2.5]" />
              <span>Register Entry</span>
            </button>
            <button
              onClick={() => onOpenExitModal()}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-200 bg-slate-800/90 hover:bg-slate-750 border border-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-amber-400" />
              <span>Process Exit</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div ref={metricCardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Occupied Slots */}
        <div className="p-5 rounded-xl bg-[#0D1527] border border-slate-800/90 shadow-sm relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Occupied Slots</span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold text-white tracking-tight">
              {occupiedSlots}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              / {totalSlots} total
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>Utilization rate</span>
            <span className="font-mono font-semibold text-rose-400">
              {Math.round((occupiedSlots / totalSlots) * 100)}%
            </span>
          </div>
          <div className="w-full h-1 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
            <div
              className="h-full bg-rose-400 transition-all duration-500"
              style={{ width: `${(occupiedSlots / totalSlots) * 100}%` }}
            />
          </div>
          <div className="mt-2 text-[10px] text-slate-400 font-mono">
            Demo Sample Data · Syncs with slot map
          </div>
        </div>

        {/* Available Slots */}
        <div className="p-5 rounded-xl bg-[#0D1527] border border-slate-800/90 shadow-sm relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Available Slots</span>
            <div className="p-2 rounded-lg bg-lime-400/10 text-lime-400 border border-lime-400/20">
              <SquareParking className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold text-lime-400 tracking-tight">
              {availableSlots}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              bays open
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>Vacant capacity</span>
            <span className="font-mono font-semibold text-lime-400">
              {Math.round((availableSlots / totalSlots) * 100)}%
            </span>
          </div>
          <div className="w-full h-1 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
            <div
              className="h-full bg-lime-400 transition-all duration-500"
              style={{ width: `${(availableSlots / totalSlots) * 100}%` }}
            />
          </div>
          <div className="mt-2 text-[10px] text-slate-400 font-mono">
            Ready for instant auto-allocation
          </div>
        </div>

        {/* Vehicles Inside */}
        <div className="p-5 rounded-xl bg-[#0D1527] border border-slate-800/90 shadow-sm relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Vehicles Inside</span>
            <div className="p-2 rounded-lg bg-sky-400/10 text-sky-400 border border-sky-400/20">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold text-white tracking-tight">
              {vehiclesInside}
            </span>
            <span className="text-xs text-sky-400 font-mono flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> Live
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>Avg dwell duration</span>
            <span className="font-mono text-slate-200">1h 48m</span>
          </div>
          <div className="w-full h-1 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
            <div
              className="h-full bg-sky-400 transition-all duration-500"
              style={{ width: '65%' }}
            />
          </div>
          <div className="mt-2 text-[10px] text-slate-400 font-mono">
            Active session records in memory
          </div>
        </div>

        {/* 4th Card: Admin gets Revenue Today, Staff gets Entries Today */}
        {currentUserRole === 'System Admin' ? (
          <div className="p-5 rounded-xl bg-[#0D1527] border border-slate-800/90 shadow-sm relative overflow-hidden group hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">Revenue Today (Demo)</span>
              <div className="p-2 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold text-amber-300 tracking-tight">
                ₹{revenueToday.toFixed(0)}
              </span>
              <span className="text-xs text-lime-400 font-mono flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> +14%
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
              <span>Transactions logged</span>
              <span className="font-mono text-slate-200">{payments.length} receipts</span>
            </div>
            <div className="w-full h-1 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-amber-400 transition-all duration-500"
                style={{ width: '80%' }}
              />
            </div>
            <div className="mt-2 text-[10px] text-slate-400 font-mono">
              Simulated fiscal collections · Admin only
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-xl bg-[#0D1527] border border-slate-800/90 shadow-sm relative overflow-hidden group hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">Entries Today (Operational)</span>
              <div className="p-2 rounded-lg bg-lime-400/10 text-lime-400 border border-lime-400/20">
                <Car className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold text-lime-400 tracking-tight">
                {records.length}
              </span>
              <span className="text-xs text-lime-400 font-mono flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> Active gate
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
              <span>Completed check-outs</span>
              <span className="font-mono text-slate-200">
                {records.filter((r) => r.status === 'Completed').length} vehicles
              </span>
            </div>
            <div className="w-full h-1 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-lime-400 transition-all duration-500"
                style={{ width: `${Math.min(100, records.length * 6)}%` }}
              />
            </div>
            <div className="mt-2 text-[10px] text-slate-400 font-mono">
              Operational gate count (Financial figures restricted)
            </div>
          </div>
        )}
      </div>

      {/* Middle Section: Floor Levels Summary */}
      <div className="p-5 rounded-xl bg-[#0D1527] border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-bold text-base text-white">Deck Level Utilization</h3>
            <p className="text-xs text-slate-400">Real-time occupancy distribution across structural floors</p>
          </div>
          <button
            onClick={() => onNavigateToTab('live-parking')}
            className="text-xs font-semibold text-lime-400 hover:text-lime-300 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Interactive Visual Slot Map</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Level 1 */}
          <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-lime-400" />
                <span className="font-semibold text-xs text-white">Level 1 (Ground)</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {l1Occupied}/{l1Slots.length} ({Math.round((l1Occupied / l1Slots.length) * 100)}%)
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-lime-400"
                style={{ width: `${(l1Occupied / l1Slots.length) * 100}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span>EV Fast Charging + Accessible</span>
              <span className="text-lime-400 font-mono">{l1Slots.length - l1Occupied} free</span>
            </div>
          </div>

          {/* Level 2 */}
          <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                <span className="font-semibold text-xs text-white">Level 2 (Mid Deck)</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {l2Occupied}/{l2Slots.length} ({Math.round((l2Occupied / l2Slots.length) * 100)}%)
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-400"
                style={{ width: `${(l2Occupied / l2Slots.length) * 100}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span>Standard + High Capacity</span>
              <span className="text-sky-300 font-mono">{l2Slots.length - l2Occupied} free</span>
            </div>
          </div>

          {/* Level 3 */}
          <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="font-semibold text-xs text-white">Level 3 (Rooftop)</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {l3Occupied}/{l3Slots.length} ({Math.round((l3Occupied / l3Slots.length) * 100)}%)
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400"
                style={{ width: `${(l3Occupied / l3Slots.length) * 100}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span>VIP Executive & Long-Stay</span>
              <span className="text-amber-300 font-mono">{l3Slots.length - l3Occupied} free</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="p-5 rounded-xl bg-[#0D1527] border border-slate-800 space-y-4">
        {/* Table Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-display font-bold text-base text-white">
              Recent Parking Activity
            </h3>
            <p className="text-xs text-slate-400">
              Audit log of vehicle entries, active stays, and gate exits
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search plate, owner, slot..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-750 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-lime-400"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex items-center p-0.5 bg-slate-900 rounded-lg border border-slate-750">
              {(['All', 'Parked', 'Completed'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    statusFilter === filter
                      ? 'bg-slate-800 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/90 text-slate-400 border-b border-slate-800">
                <th
                  onClick={() => {
                    if (sortField === 'plateNumber') setSortAsc(!sortAsc);
                    else {
                      setSortField('plateNumber');
                      setSortAsc(true);
                    }
                  }}
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Plate Number</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 font-semibold">Owner / Driver</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Bay / Level</th>
                <th
                  onClick={() => {
                    if (sortField === 'entryTime') setSortAsc(!sortAsc);
                    else {
                      setSortField('entryTime');
                      setSortAsc(false);
                    }
                  }}
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Entry Time</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 font-semibold">Stay Status</th>
                <th className="py-3 px-4 font-semibold">Payment State</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 font-sans">
                    No matching activity records found. Try adjusting search filters.
                  </td>
                </tr>
              ) : (
                filteredRecords.slice(0, 8).map((record) => {
                  const isParked = record.status === 'Parked';
                  return (
                    <tr
                      key={record.recordId}
                      className="hover:bg-slate-850/50 transition-colors"
                    >
                      <td className="py-3 px-4 font-bold text-white">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-lime-400">{record.plateNumber}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-sans text-slate-300">
                        {record.ownerName}
                      </td>
                      <td className="py-3 px-4 font-sans text-slate-400">
                        {record.vehicleType}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
                          {record.slotCode}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-[11px]">
                        {record.entryTime.slice(11)}
                      </td>
                      <td className="py-3 px-4 font-sans">
                        {isParked ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-lime-400 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
                            Parked
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">
                            Exited ({record.durationMinutes}m)
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-sans">
                        {record.paymentStatus === 'Paid' ? (
                          <span className="text-[11px] text-lime-400 font-mono">
                            {currentUserRole === 'System Admin' ? `Paid (₹${record.totalFee})` : 'Settled / Paid'}
                          </span>
                        ) : (
                          <span className="text-[11px] text-amber-400 font-mono">
                            {currentUserRole === 'System Admin' ? 'Accruing' : 'Active / Pending'}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-sans">
                        {isParked ? (
                          <button
                            onClick={() => onOpenExitModal(record)}
                            className="px-2.5 py-1 text-xs font-semibold text-slate-950 bg-lime-400 hover:bg-lime-300 rounded transition-colors cursor-pointer"
                          >
                            Exit / Pay
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400">Settled</span>
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
    </div>
  );
};
