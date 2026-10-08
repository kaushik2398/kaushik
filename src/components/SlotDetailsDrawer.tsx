import React from 'react';
import {
  X,
  SquareParking,
  Car,
  Clock,
  Zap,
  Shield,
  Wrench,
  AlertCircle,
  CheckCircle2,
  Calendar,
  LogOut,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { ParkingSlot, ParkingRecord } from '../types';

interface SlotDetailsDrawerProps {
  slot: ParkingSlot | null;
  activeRecord?: ParkingRecord;
  onClose: () => void;
  onToggleStatus: (slotId: string, newStatus: ParkingSlot['status']) => void;
  onOpenExitForRecord?: (record: ParkingRecord) => void;
  onOpenEntryForSlot?: (slot: ParkingSlot) => void;
}

export const SlotDetailsDrawer: React.FC<SlotDetailsDrawerProps> = ({
  slot,
  activeRecord,
  onClose,
  onToggleStatus,
  onOpenExitForRecord,
  onOpenEntryForSlot,
}) => {
  if (!slot) return null;

  const getStatusBadge = () => {
    switch (slot.status) {
      case 'Available':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-lime-400/10 text-lime-400 border border-lime-400/30">
            <CheckCircle2 className="w-3.5 h-3.5" /> Available
          </span>
        );
      case 'Occupied':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <Car className="w-3.5 h-3.5" /> Occupied
          </span>
        );
      case 'Reserved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-400 border border-amber-400/30">
            <Shield className="w-3.5 h-3.5" /> Reserved
          </span>
        );
      case 'Maintenance':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/20 text-slate-400 border border-slate-600/30">
            <Wrench className="w-3.5 h-3.5" /> Maintenance
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-[#0B1224] border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 text-slate-100">
      {/* Drawer Header */}
      <div className="flex items-center justify-between p-5 border-b border-slate-800/80 bg-[#080D1A]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-lime-400 text-lg">
            {slot.slotCode}
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-white">
              Slot {slot.slotCode}
            </h3>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-lime-400" />
              <span>{slot.floorLevel}</span> · <span>{slot.slotType}</span>
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-850 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 p-5 overflow-y-auto space-y-5">
        {/* Current State Card */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Current Bay Status</span>
            {getStatusBadge()}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
            <div>
              <span className="text-slate-400 text-[11px]">Base Hourly Rate</span>
              <div className="font-mono font-semibold text-white mt-0.5">₹{slot.hourlyRate}/hr</div>
            </div>
            <div>
              <span className="text-slate-400 text-[11px]">Telemetry Sensor</span>
              <div className="font-mono text-slate-300 mt-0.5">{slot.sensorId}</div>
            </div>
          </div>
        </div>

        {/* Occupied Vehicle Information (if active) */}
        {slot.status === 'Occupied' && (
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              <Car className="w-4 h-4 text-lime-400" />
              <span>Active Parked Vehicle</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-slate-400">License Plate</span>
                <span className="font-mono font-bold text-lime-400 text-sm">
                  {slot.currentVehiclePlate || activeRecord?.plateNumber || 'MH-12-DE-4412'}
                </span>
              </div>
              {activeRecord && (
                <>
                  <div className="flex justify-between items-center py-1 border-b border-slate-800">
                    <span className="text-slate-400">Ticket Number</span>
                    <span className="font-mono text-slate-200">{activeRecord.ticketNumber}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-800">
                    <span className="text-slate-400">Vehicle Type</span>
                    <span className="font-medium text-slate-200">{activeRecord.vehicleType}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-800">
                    <span className="text-slate-400">Owner Name</span>
                    <span className="text-slate-200">{activeRecord.ownerName}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-800">
                    <span className="text-slate-400">Entry Timestamp</span>
                    <span className="font-mono text-slate-300 text-[11px]">{activeRecord.entryTime}</span>
                  </div>
                </>
              )}
            </div>

            {activeRecord && onOpenExitForRecord && (
              <button
                onClick={() => {
                  onClose();
                  onOpenExitForRecord(activeRecord);
                }}
                className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-950 bg-lime-400 hover:bg-lime-300 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Process Vehicle Exit & Payment</span>
              </button>
            )}
          </div>
        )}

        {/* If Available, prompt to allocate */}
        {slot.status === 'Available' && onOpenEntryForSlot && (
          <div className="p-4 rounded-xl bg-lime-400/5 border border-lime-400/20 text-center space-y-2">
            <p className="text-xs text-slate-300">
              This slot is ready for immediate vehicle check-in.
            </p>
            <button
              onClick={() => {
                onClose();
                onOpenEntryForSlot(slot);
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-950 bg-lime-400 hover:bg-lime-300 rounded-lg transition-colors cursor-pointer"
            >
              <span>Allocate Vehicle to {slot.slotCode}</span>
            </button>
          </div>
        )}

        {/* Status Override / Admin Controls */}
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2.5">
          <div className="text-xs font-semibold text-slate-300">Slot Administration</div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Change slot state directly for maintenance or VIP reservation. System availability counters automatically synchronize in real time.
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {slot.status !== 'Available' && (
              <button
                onClick={() => onToggleStatus(slot.slotId, 'Available')}
                className="px-2.5 py-1.5 text-xs font-medium text-lime-400 bg-lime-400/10 hover:bg-lime-400/20 border border-lime-400/30 rounded-lg transition-colors text-center"
              >
                Mark Available
              </button>
            )}
            {slot.status !== 'Maintenance' && (
              <button
                onClick={() => onToggleStatus(slot.slotId, 'Maintenance')}
                className="px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg transition-colors text-center"
              >
                Set Maintenance
              </button>
            )}
            {slot.status !== 'Reserved' && (
              <button
                onClick={() => onToggleStatus(slot.slotId, 'Reserved')}
                className="px-2.5 py-1.5 text-xs font-medium text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 rounded-lg transition-colors text-center"
              >
                Mark Reserved
              </button>
            )}
          </div>
        </div>

        {/* DBMS Schema Reference Note */}
        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
          <div className="font-mono text-lime-400 font-medium">DBMS Integrity:</div>
          <div>Table: <code className="text-slate-300">parking_slots</code></div>
          <div>PK: <code className="text-slate-300">slot_id = &apos;{slot.slotId}&apos;</code></div>
          <div>Check constraint: <code className="text-slate-300">status IN (&apos;Available&apos;, &apos;Occupied&apos;, &apos;Reserved&apos;, &apos;Maintenance&apos;)</code></div>
        </div>
      </div>
    </div>
  );
};
