import React, { useState } from 'react';
import {
  Grid3X3,
  Car,
  SquareParking,
  Shield,
  Wrench,
  CheckCircle2,
  Filter,
  Zap,
  Accessibility,
  Crown,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';
import { ParkingSlot, ParkingRecord, SlotStatus, SlotType } from '../types';

interface LiveParkingViewProps {
  slots: ParkingSlot[];
  records: ParkingRecord[];
  onSelectSlot: (slot: ParkingSlot) => void;
  onOpenEntryForSlot: (slot: ParkingSlot) => void;
}

export const LiveParkingView: React.FC<LiveParkingViewProps> = ({
  slots,
  records,
  onSelectSlot,
  onOpenEntryForSlot,
}) => {
  const [selectedFloor, setSelectedFloor] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');

  // Filter slots
  const filteredSlots = slots.filter((slot) => {
    if (selectedFloor !== 'All' && slot.floorLevel !== selectedFloor) return false;
    if (statusFilter !== 'All' && slot.status !== statusFilter) return false;
    if (typeFilter !== 'All' && slot.slotType !== typeFilter) return false;
    return true;
  });

  const getSlotTypeIcon = (type: SlotType) => {
    switch (type) {
      case 'EV Charging':
        return <Zap className="w-3.5 h-3.5 text-lime-400" />;
      case 'Accessible':
        return <Accessibility className="w-3.5 h-3.5 text-sky-400" />;
      case 'VIP':
        return <Crown className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return null;
    }
  };

  const getSlotStatusBadge = (status: SlotStatus) => {
    switch (status) {
      case 'Available':
        return {
          bg: 'bg-lime-950/40 hover:bg-lime-900/50 border-lime-500/40',
          text: 'text-lime-400',
          indicatorBg: 'bg-lime-400/20 text-lime-400 border border-lime-400/30',
          icon: CheckCircle2,
          label: 'Available',
        };
      case 'Occupied':
        return {
          bg: 'bg-rose-950/30 hover:bg-rose-900/40 border-rose-500/40',
          text: 'text-rose-400',
          indicatorBg: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
          icon: Car,
          label: 'Occupied',
        };
      case 'Reserved':
        return {
          bg: 'bg-amber-950/30 hover:bg-amber-900/40 border-amber-500/40',
          text: 'text-amber-400',
          indicatorBg: 'bg-amber-400/20 text-amber-300 border border-amber-400/30',
          icon: Shield,
          label: 'Reserved',
        };
      case 'Maintenance':
        return {
          bg: 'bg-slate-900/60 hover:bg-slate-850/80 border-slate-700/60',
          text: 'text-slate-400',
          indicatorBg: 'bg-slate-800 text-slate-400 border border-slate-700',
          icon: Wrench,
          label: 'Maintenance',
        };
    }
  };

  // Group by level for visual map display
  const levels = ['Level 1', 'Level 2', 'Level 3'] as const;

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0D1527] border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
              Interactive Live Slot Map
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select any parking bay to inspect sensor telemetry, vehicle license, or initiate checkout.
            </p>
          </div>

          {/* Level Switcher Segmented Control */}
          <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800">
            {['All', 'Level 1', 'Level 2', 'Level 3'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedFloor(lvl)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  selectedFloor === lvl
                    ? 'bg-lime-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lvl === 'All' ? 'All Floors' : lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Filters and Accessible Legend */}
        <div className="pt-3 border-t border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Status and Type Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" />
              <span>Filters:</span>
            </span>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-900 border border-slate-750 rounded-lg text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-lime-400"
            >
              <option value="All">All States</option>
              <option value="Available">Available Only</option>
              <option value="Occupied">Occupied Only</option>
              <option value="Reserved">Reserved Only</option>
              <option value="Maintenance">Maintenance Only</option>
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-900 border border-slate-750 rounded-lg text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-lime-400"
            >
              <option value="All">All Bay Types</option>
              <option value="Standard">Standard</option>
              <option value="EV Charging">EV Fast Charging</option>
              <option value="Accessible">Accessible</option>
              <option value="Compact">Compact / 2W</option>
              <option value="VIP">VIP Executive</option>
            </select>
          </div>

          {/* Accessible Legend - NEVER color alone, always explicit icon + label */}
          <div className="flex flex-wrap items-center gap-3 text-xs bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[11px] font-semibold">Legend:</span>
            <div className="flex items-center gap-1.5 text-lime-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="font-medium">Available</span>
            </div>
            <div className="flex items-center gap-1.5 text-rose-400">
              <Car className="w-3.5 h-3.5" />
              <span className="font-medium">Occupied</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-400">
              <Shield className="w-3.5 h-3.5" />
              <span className="font-medium">Reserved</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Wrench className="w-3.5 h-3.5" />
              <span className="font-medium">Maintenance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Slot Grid by Floors */}
      <div className="space-y-6">
        {levels.map((lvl) => {
          if (selectedFloor !== 'All' && selectedFloor !== lvl) return null;
          const levelSlots = filteredSlots.filter((s) => s.floorLevel === lvl);
          if (levelSlots.length === 0) return null;

          const occ = levelSlots.filter((s) => s.status === 'Occupied').length;

          return (
            <div
              key={lvl}
              className="p-5 rounded-2xl bg-[#0D1527] border border-slate-800 space-y-4"
            >
              {/* Floor Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-lime-400" />
                  <h3 className="font-display font-bold text-base text-white">
                    {lvl} Parking Deck
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    ({lvl === 'Level 1' ? 'Ground · EV Fast-Track' : lvl === 'Level 2' ? 'Mid · High Density' : 'Rooftop · VIP & Long Stay'})
                  </span>
                </div>
                <div className="text-xs font-mono text-slate-300">
                  <span className="text-lime-400 font-semibold">{levelSlots.length - occ} Free</span>
                  <span className="text-slate-500"> / </span>
                  <span>{levelSlots.length} Total</span>
                </div>
              </div>

              {/* Grid of Slots */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {levelSlots.map((slot) => {
                  const badge = getSlotStatusBadge(slot.status);
                  const Icon = badge.icon;
                  const isOccupied = slot.status === 'Occupied';

                  return (
                    <button
                      key={slot.slotId}
                      onClick={() => onSelectSlot(slot)}
                      className={`p-3 rounded-xl border text-left transition-all duration-150 relative group cursor-pointer focus:outline-none focus:ring-2 focus:ring-lime-400 ${badge.bg}`}
                    >
                      {/* Top Code & Type Icon */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono font-bold text-base text-white tracking-wide">
                          {slot.slotCode}
                        </span>
                        <div className="flex items-center gap-1">
                          {getSlotTypeIcon(slot.slotType)}
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-1 ${badge.indicatorBg}`}>
                            <Icon className="w-3 h-3" />
                            <span>{badge.label}</span>
                          </span>
                        </div>
                      </div>

                      {/* Middle: Vehicle or Rate */}
                      <div className="min-h-[38px] flex flex-col justify-center">
                        {isOccupied ? (
                          <div>
                            <div className="text-[10px] text-slate-400 uppercase">License</div>
                            <div className="font-mono font-bold text-lime-400 text-xs truncate">
                              {slot.currentVehiclePlate || 'PARKED'}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="text-[10px] text-slate-400 uppercase">Rate</div>
                            <div className="font-mono text-xs text-slate-200">
                              ₹{slot.hourlyRate}/hr · {slot.slotType}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Bottom Sensor Telemetry */}
                      <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>{slot.sensorId.slice(0, 7)}</span>
                        <span className="text-slate-400 group-hover:text-lime-400 transition-colors">
                          Inspect &rarr;
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
