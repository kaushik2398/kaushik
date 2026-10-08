import React, { useState } from 'react';
import {
  X,
  PlusCircle,
  Car,
  User,
  Phone,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
} from 'lucide-react';
import { ParkingSlot, ParkingRecord, VehicleType } from '../types';
import { WheelLoader } from './WheelLoader';

interface VehicleEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableSlots: ParkingSlot[];
  preSelectedSlot?: ParkingSlot | null;
  onConfirmEntry: (record: ParkingRecord) => void;
}

export const VehicleEntryModal: React.FC<VehicleEntryModalProps> = ({
  isOpen,
  onClose,
  availableSlots,
  preSelectedSlot,
  onConfirmEntry,
}) => {
  const [plateNumber, setPlateNumber] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType>('Sedan');
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState<string>(
    preSelectedSlot?.slotId || 'auto'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  // Filter compatible slots
  const compatibleSlots = availableSlots.filter((slot) => {
    if (vehicleType === 'EV') return true; // Can park in EV or standard
    if (vehicleType === 'Motorcycle') return slot.slotType === 'Compact' || slot.slotType === 'Standard';
    return slot.slotType !== 'Compact'; // SUVs / sedans prefer standard/VIP/accessible
  });

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!plateNumber.trim()) {
      errs.plateNumber = 'Vehicle license plate is required';
    } else if (plateNumber.trim().length < 4) {
      errs.plateNumber = 'Plate format is too short (min 4 characters)';
    }

    if (!ownerName.trim()) {
      errs.ownerName = 'Driver / Owner name is required';
    }

    if (!ownerPhone.trim()) {
      errs.ownerPhone = 'Contact phone number is required';
    }

    if (availableSlots.length === 0) {
      errs.general = 'Deck is currently at 100% capacity. No available slots.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate DBMS Row Locking & Transaction
    setTimeout(() => {
      let assignedSlot: ParkingSlot;

      if (selectedSlotId === 'auto' || !selectedSlotId) {
        // Automatic allocation: Find preferred slot for vehicle type
        const preferred =
          vehicleType === 'EV'
            ? availableSlots.find((s) => s.slotType === 'EV Charging') || availableSlots[0]
            : vehicleType === 'Motorcycle'
            ? availableSlots.find((s) => s.slotType === 'Compact') || availableSlots[0]
            : availableSlots.find((s) => s.slotType === 'Standard') || availableSlots[0];

        assignedSlot = preferred || availableSlots[0];
      } else {
        const found = availableSlots.find((s) => s.slotId === selectedSlotId);
        assignedSlot = found || availableSlots[0];
      }

      const now = new Date();
      const timestamp = now.toISOString().replace('T', ' ').slice(0, 19);
      const ticketNum = `TKT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      const newRecord: ParkingRecord = {
        recordId: `rec-${Date.now()}`,
        ticketNumber: ticketNum,
        vehicleId: `veh-${Date.now()}`,
        plateNumber: plateNumber.toUpperCase().trim(),
        ownerName: ownerName.trim(),
        ownerPhone: ownerPhone.trim(),
        vehicleType,
        slotId: assignedSlot.slotId,
        slotCode: assignedSlot.slotCode,
        floorLevel: assignedSlot.floorLevel,
        entryTime: timestamp,
        status: 'Parked',
        paymentStatus: 'Pending',
        staffId: 'staff-01',
      };

      setIsSubmitting(false);
      onConfirmEntry(newRecord);
      onClose();
    }, 750);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-[#0D1527] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#080D1A]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-lime-400/10 text-lime-400 border border-lime-400/20">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                Register Vehicle Entry
              </h3>
              <p className="text-xs text-slate-400">
                DBMS Concurrency-Safe Slot Allocation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body or Loading Wheel */}
        {isSubmitting ? (
          <div className="p-10 flex flex-col items-center justify-center">
            <WheelLoader
              size={84}
              label="Allocating Optimal Parking Slot..."
              subtext="Executing atomic transaction: SELECT FOR UPDATE SKIP LOCKED"
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {errors.general && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errors.general}</span>
              </div>
            )}

            {/* License Plate Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Vehicle Plate Number <span className="text-lime-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. MH-12-DE-4412 or CA-7XYZ"
                  className={`w-full px-3.5 py-2.5 bg-slate-900 border rounded-lg text-sm font-mono tracking-wider text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-lime-400 transition-all ${
                    errors.plateNumber ? 'border-rose-500' : 'border-slate-700'
                  }`}
                />
              </div>
              {errors.plateNumber && (
                <p className="mt-1 text-[11px] text-rose-400">{errors.plateNumber}</p>
              )}
            </div>

            {/* Vehicle Type Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Vehicle Category
              </label>
              <div className="grid grid-cols-5 gap-2">
                {(['Sedan', 'SUV', 'EV', 'Motorcycle', 'Van'] as VehicleType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setVehicleType(type)}
                    className={`py-2 px-1 text-center rounded-lg border text-xs font-medium transition-colors ${
                      vehicleType === type
                        ? 'bg-lime-400 text-slate-950 border-lime-400 font-semibold'
                        : 'bg-slate-900/60 text-slate-300 border-slate-750 hover:bg-slate-800'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Owner Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Owner / Driver Name <span className="text-lime-400">*</span>
                </label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="Full name"
                  className={`w-full px-3 py-2 bg-slate-900 border rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-lime-400 ${
                    errors.ownerName ? 'border-rose-500' : 'border-slate-700'
                  }`}
                />
                {errors.ownerName && (
                  <p className="mt-1 text-[11px] text-rose-400">{errors.ownerName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mobile Number <span className="text-lime-400">*</span>
                </label>
                <input
                  type="tel"
                  value={ownerPhone}
                  onChange={(e) => setOwnerPhone(e.target.value)}
                  placeholder="+91 98XXX XXXXX"
                  className={`w-full px-3 py-2 bg-slate-900 border rounded-lg text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-lime-400 ${
                    errors.ownerPhone ? 'border-rose-500' : 'border-slate-700'
                  }`}
                />
                {errors.ownerPhone && (
                  <p className="mt-1 text-[11px] text-rose-400">{errors.ownerPhone}</p>
                )}
              </div>
            </div>

            {/* Slot Allocation Strategy */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Parking Slot Allocation
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {availableSlots.length} bays available
                </span>
              </div>
              <select
                value={selectedSlotId}
                onChange={(e) => setSelectedSlotId(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-2 focus:ring-lime-400"
              >
                <option value="auto">
                  ⚡ Auto-allocate optimal slot (Nearest & Type-matched)
                </option>
                {compatibleSlots.map((slot) => (
                  <option key={slot.slotId} value={slot.slotId}>
                    {slot.slotCode} — {slot.floorLevel} ({slot.slotType} · ₹{slot.hourlyRate}/hr)
                  </option>
                ))}
              </select>
            </div>

            {/* Demo Notice Note */}
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
              <span>
                Simulates real-time vehicle entry check-in and automatic slot status reservation.
              </span>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-850 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-slate-950 bg-lime-400 hover:bg-lime-300 rounded-lg shadow-md shadow-lime-400/20 transition-all cursor-pointer"
              >
                Confirm Entry & Generate Ticket
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
