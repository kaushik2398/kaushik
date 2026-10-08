import React, { useState } from 'react';
import {
  SquareParking,
  Plus,
  Filter,
  CheckCircle2,
  Car,
  Shield,
  Wrench,
  Search,
  Zap,
  Tag,
} from 'lucide-react';
import { ParkingSlot, SlotStatus, SlotType } from '../types';

interface ParkingSlotsViewProps {
  slots: ParkingSlot[];
  onToggleStatus: (slotId: string, newStatus: SlotStatus) => void;
  onAddSlot: (slot: ParkingSlot) => void;
  onInspectSlot: (slot: ParkingSlot) => void;
}

export const ParkingSlotsView: React.FC<ParkingSlotsViewProps> = ({
  slots,
  onToggleStatus,
  onAddSlot,
  onInspectSlot,
}) => {
  const [floorFilter, setFloorFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New slot form state
  const [newSlotCode, setNewSlotCode] = useState('');
  const [newFloor, setNewFloor] = useState<'Level 1' | 'Level 2' | 'Level 3'>('Level 1');
  const [newType, setNewType] = useState<SlotType>('Standard');
  const [newRate, setNewRate] = useState(25);

  const filteredSlots = slots.filter((s) => {
    if (floorFilter !== 'All' && s.floorLevel !== floorFilter) return false;
    if (statusFilter !== 'All' && s.status !== statusFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.slotCode.toLowerCase().includes(q) ||
      s.sensorId.toLowerCase().includes(q) ||
      (s.currentVehiclePlate && s.currentVehiclePlate.toLowerCase().includes(q))
    );
  });

  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlotCode.trim()) return;

    const newSlot: ParkingSlot = {
      slotId: `slot-${Date.now()}`,
      slotCode: newSlotCode.toUpperCase().trim(),
      floorLevel: newFloor,
      slotType: newType,
      hourlyRate: Number(newRate) || 25,
      status: 'Available',
      sensorId: `SNS-${Math.floor(100 + Math.random() * 900)}-${newFloor.replace(' ', '')}`,
    };

    onAddSlot(newSlot);
    setShowAddModal(false);
    setNewSlotCode('');
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0D1527] border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
              Parking Slot Inventory
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Table schema: <code className="text-slate-300">parking_slots (slot_id PK, slot_code, floor_level, slot_type, hourly_rate, status)</code>
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-lime-400 hover:bg-lime-300 rounded-lg shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Slot Definition</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800">
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search code, sensor, plate..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-750 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-lime-400"
            />
          </div>

          <select
            value={floorFilter}
            onChange={(e) => setFloorFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-900 border border-slate-750 rounded-lg text-xs text-slate-200"
          >
            <option value="All">All Floors</option>
            <option value="Level 1">Level 1</option>
            <option value="Level 2">Level 2</option>
            <option value="Level 3">Level 3</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-900 border border-slate-750 rounded-lg text-xs text-slate-200"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
            <option value="Reserved">Reserved</option>
            <option value="Maintenance">Maintenance</option>
          </select>

          <span className="text-xs text-slate-400 font-mono ml-auto">
            Showing {filteredSlots.length} of {slots.length} bays
          </span>
        </div>
      </div>

      {/* Slots Table */}
      <div className="p-5 rounded-2xl bg-[#0D1527] border border-slate-800">
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/90 text-slate-400 border-b border-slate-800">
                <th className="py-3 px-4 font-semibold">Slot Code</th>
                <th className="py-3 px-4 font-semibold">Floor Deck</th>
                <th className="py-3 px-4 font-semibold">Bay Category</th>
                <th className="py-3 px-4 font-semibold">Base Rate</th>
                <th className="py-3 px-4 font-semibold">State</th>
                <th className="py-3 px-4 font-semibold">Active Vehicle</th>
                <th className="py-3 px-4 font-semibold">Sensor Telemetry</th>
                <th className="py-3 px-4 font-semibold text-right">Quick Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredSlots.map((slot) => {
                const isAvail = slot.status === 'Available';
                const isOcc = slot.status === 'Occupied';
                const isMaint = slot.status === 'Maintenance';

                return (
                  <tr
                    key={slot.slotId}
                    className="hover:bg-slate-850/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-bold text-white">
                      <button
                        onClick={() => onInspectSlot(slot)}
                        className="text-lime-400 hover:underline cursor-pointer"
                      >
                        {slot.slotCode}
                      </button>
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-300">
                      {slot.floorLevel}
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-300">
                      {slot.slotType}
                    </td>
                    <td className="py-3 px-4 text-slate-200">
                      ₹{slot.hourlyRate}/hr
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          isAvail
                            ? 'bg-lime-400/10 text-lime-400 border border-lime-400/20'
                            : isOcc
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : isMaint
                            ? 'bg-slate-800 text-slate-400 border border-slate-700'
                            : 'bg-amber-400/10 text-amber-300 border border-amber-400/20'
                        }`}
                      >
                        {slot.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {slot.currentVehiclePlate ? (
                        <span className="font-bold text-lime-400">{slot.currentVehiclePlate}</span>
                      ) : (
                        <span className="text-slate-400 font-sans text-[11px]">— Vacant —</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {slot.sensorId}
                    </td>
                    <td className="py-3 px-4 text-right font-sans">
                      <div className="flex items-center justify-end gap-1.5">
                        {!isOcc && (
                          <button
                            onClick={() =>
                              onToggleStatus(
                                slot.slotId,
                                isAvail ? 'Maintenance' : 'Available'
                              )
                            }
                            className="px-2 py-1 text-[11px] rounded bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          >
                            {isAvail ? 'Maint' : 'Set Avail'}
                          </button>
                        )}
                        <button
                          onClick={() => onInspectSlot(slot)}
                          className="px-2 py-1 text-[11px] rounded bg-slate-800 text-lime-400 hover:bg-slate-750 transition-colors cursor-pointer"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Slot Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-[#0D1527] border border-slate-700 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-display font-bold text-white text-base">
                Define New Parking Bay
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSlot} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Slot Identifier Code (e.g. L1-13)
                </label>
                <input
                  type="text"
                  required
                  value={newSlotCode}
                  onChange={(e) => setNewSlotCode(e.target.value)}
                  placeholder="L1-13"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Floor Level
                </label>
                <select
                  value={newFloor}
                  onChange={(e) => setNewFloor(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                >
                  <option value="Level 1">Level 1 (Ground)</option>
                  <option value="Level 2">Level 2 (Mid)</option>
                  <option value="Level 3">Level 3 (Rooftop)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Category
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                >
                  <option value="Standard">Standard</option>
                  <option value="EV Charging">EV Fast Charging</option>
                  <option value="Accessible">Accessible</option>
                  <option value="Compact">Compact / Motorcycle</option>
                  <option value="VIP">VIP Executive</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Base Hourly Tariff (₹)
                </label>
                <input
                  type="number"
                  min="10"
                  max="150"
                  value={newRate}
                  onChange={(e) => setNewRate(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-slate-950 bg-lime-400 hover:bg-lime-300 rounded-lg"
                >
                  Save Bay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
