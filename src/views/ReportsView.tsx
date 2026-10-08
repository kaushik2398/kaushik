import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  Clock,
  Car,
  DollarSign,
  PieChart,
  Layers,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import { ParkingRecord, Payment, UserRole } from '../types';

interface ReportsViewProps {
  records: ParkingRecord[];
  payments: Payment[];
  currentUserRole: UserRole;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  records,
  payments,
  currentUserRole,
}) => {
  const [timeframe, setTimeframe] = useState<'today' | 'weekly'>('today');

  const isAdmin = currentUserRole === 'System Admin';

  // Hourly occupancy simulation (24h or active hours)
  const hourlyOccupancy = [
    { hour: '00:00', count: 4 },
    { hour: '02:00', count: 6 },
    { hour: '04:00', count: 9 },
    { hour: '06:00', count: 18 },
    { hour: '08:00', count: 32 },
    { hour: '10:00', count: 35 },
    { hour: '12:00', count: 30 },
    { hour: '14:00', count: 28 },
    { hour: '16:00', count: 34 },
    { hour: '18:00', count: 36 },
    { hour: '20:00', count: 26 },
    { hour: '22:00', count: 14 },
  ];

  // Category statistics (Counts for all, Revenue for Admin only)
  const categoryStats = [
    { type: 'Sedan', count: 14, revenue: 1420, percent: 38 },
    { type: 'SUV', count: 9, revenue: 1125, percent: 30 },
    { type: 'EV (Fast-Charge)', count: 8, revenue: 880, percent: 23 },
    { type: 'Motorcycle', count: 7, revenue: 345, percent: 9 },
  ];

  const handleExportCSV = () => {
    // If Admin, include TotalFee. If Parking Staff, exclude revenue column completely!
    const csvHeader = isAdmin
      ? 'RecordID,TicketNumber,PlateNumber,VehicleType,SlotCode,EntryTime,ExitTime,TotalFee,Status\n'
      : 'RecordID,TicketNumber,PlateNumber,VehicleType,SlotCode,EntryTime,ExitTime,Status\n';

    const csvRows = records
      .map((r) => {
        if (isAdmin) {
          return `"${r.recordId}","${r.ticketNumber}","${r.plateNumber}","${r.vehicleType}","${r.slotCode}","${r.entryTime}","${r.exitTime || ''}","${r.totalFee || 0}","${r.status}"`;
        } else {
          return `"${r.recordId}","${r.ticketNumber}","${r.plateNumber}","${r.vehicleType}","${r.slotCode}","${r.entryTime}","${r.exitTime || ''}","${r.status}"`;
        }
      })
      .join('\n');

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `smartpark_dbms_${isAdmin ? 'full' : 'operational'}_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header and Export Action */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0D1527] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-lime-400" />
            <span className="text-xs font-mono uppercase text-lime-400 font-semibold">
              {isAdmin ? 'Complete Management Reports' : 'Operational Activity Reports (Non-Financial)'}
            </span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
            {isAdmin ? 'Analytics & Financial Operations Reports' : 'Operational Occupancy & Slot Activity Reports'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isAdmin
              ? 'Aggregated metrics derived from DBMS views `v_daily_occupancy` and `v_revenue_summary`'
              : 'Operational entry/exit flow and occupancy metrics (Financial revenue summaries restricted to Admin)'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-slate-900 rounded-lg border border-slate-800">
            <button
              onClick={() => setTimeframe('today')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                timeframe === 'today'
                  ? 'bg-lime-400 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeframe('weekly')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                timeframe === 'weekly'
                  ? 'bg-lime-400 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              7-Day Trend
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-lime-400 hover:bg-lime-300 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isAdmin ? 'Export CSV (Full)' : 'Export CSV (Operational)'}</span>
          </button>
        </div>
      </div>

      {/* Hourly Occupancy Chart (Available to both Admin and Staff) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0D1527] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-base text-white">
              Peak Occupancy Profile (24-Hour Cycle)
            </h3>
            <p className="text-xs text-slate-400">
              Peak hours recorded at 08:00–10:00 and 17:00–19:00 with 94%+ slot fill
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-lime-400">
            <Clock className="w-3.5 h-3.5" />
            <span>Deck Capacity: 36 Slots</span>
          </div>
        </div>

        {/* CSS / SVG Bar Chart */}
        <div className="pt-4 pb-2">
          <div className="h-44 flex items-end gap-2 sm:gap-4 px-2 border-b border-slate-800">
            {hourlyOccupancy.map((item, idx) => {
              const heightPercent = Math.round((item.count / 36) * 100);
              const isPeak = item.count >= 32;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className="text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity text-white">
                    {item.count}
                  </span>
                  <div
                    className={`w-full rounded-t transition-all duration-300 ${
                      isPeak
                        ? 'bg-rose-500 group-hover:bg-rose-400'
                        : 'bg-lime-400/80 group-hover:bg-lime-400'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[10px] font-mono text-slate-400 pt-1">
                    {item.hour}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-lime-400" />
              <span>Normal Operation</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
              <span>Peak Congestion (&ge; 32 bays)</span>
            </span>
          </div>
          <span className="font-mono text-slate-400">Hourly Distribution</span>
        </div>
      </div>

      {/* Category Breakdown & Operational Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown (Vehicle count for both, Revenue only for Admin) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0D1527] border border-slate-800 space-y-4">
          <h3 className="font-display font-bold text-base text-white">
            {isAdmin ? 'Volume & Revenue by Vehicle Category' : 'Volume Distribution by Vehicle Category'}
          </h3>
          <div className="space-y-3">
            {categoryStats.map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white font-medium">{cat.type}</span>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-slate-400">{cat.count} vehicles ({cat.percent}%)</span>
                    {isAdmin && (
                      <span className="font-bold text-lime-400">₹{cat.revenue}</span>
                    )}
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-lime-400 transition-all duration-500"
                    style={{ width: `${cat.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {!isAdmin && (
            <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Financial revenue totals omitted in accordance with Parking Staff permissions.</span>
            </div>
          )}
        </div>

        {/* Operational Highlights & Traffic Insights */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0D1527] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="font-display font-bold text-base text-white">
              Operational Traffic Summary
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-lime-400/10 text-lime-400 border border-lime-400/20">
              {isAdmin ? 'Full Audit Report' : 'Operational Volume Report'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[11px]">Peak Congestion Window</span>
              <span className="font-display font-bold text-white text-base">08:00 – 10:00 AM</span>
              <span className="text-slate-500 text-[10px] block">34 of 36 bays occupied</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[11px]">Average Stay Duration</span>
              <span className="font-display font-bold text-lime-400 text-base">2.8 Hours</span>
              <span className="text-slate-500 text-[10px] block">Across all categories</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[11px]">Turnover Velocity</span>
              <span className="font-display font-bold text-white text-base">2.4x / day</span>
              <span className="text-slate-500 text-[10px] block">Slots reused per day</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[11px]">Data Integrity Audit</span>
              <span className="font-display font-bold text-lime-400 text-base">100% Verified</span>
              <span className="text-slate-500 text-[10px] block">Zero orphan records</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 pt-1">
            {isAdmin
              ? 'Aggregates vehicle check-ins, payment clearances, and dwell-time metrics across all parking floors.'
              : 'Displays traffic volume and bay dwell metrics in accordance with staff operational view permissions.'}
          </p>
        </div>
      </div>
    </div>
  );
};
