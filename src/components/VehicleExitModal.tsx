import React, { useState, useEffect } from 'react';
import {
  X,
  LogOut,
  Search,
  Clock,
  Car,
  Receipt,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  QrCode,
  DollarSign,
  Radio,
  Sparkles,
} from 'lucide-react';
import { ParkingRecord, ParkingSlot, Payment, PaymentMethod, UserRole } from '../types';
import { WheelLoader } from './WheelLoader';

interface VehicleExitModalProps {
  isOpen: boolean;
  onClose: () => void;
  parkedRecords: ParkingRecord[];
  slots: ParkingSlot[];
  preSelectedRecord?: ParkingRecord | null;
  currentUserRole?: UserRole;
  onConfirmExit: (record: ParkingRecord, payment: Payment) => void;
}

export const VehicleExitModal: React.FC<VehicleExitModalProps> = ({
  isOpen,
  onClose,
  parkedRecords,
  slots,
  preSelectedRecord,
  currentUserRole = 'System Admin',
  onConfirmExit,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecordId, setSelectedRecordId] = useState<string>(
    preSelectedRecord?.recordId || ''
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Fastag / RFID');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTimeStr, setCurrentTimeStr] = useState('');

  useEffect(() => {
    if (preSelectedRecord) {
      setSelectedRecordId(preSelectedRecord.recordId);
    } else if (parkedRecords.length > 0 && !selectedRecordId) {
      setSelectedRecordId(parkedRecords[0].recordId);
    }
  }, [preSelectedRecord, parkedRecords]);

  useEffect(() => {
    const now = new Date();
    setCurrentTimeStr(now.toISOString().replace('T', ' ').slice(0, 19));
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredRecords = parkedRecords.filter(
    (r) =>
      r.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedRecord = parkedRecords.find((r) => r.recordId === selectedRecordId);
  const slot = slots.find((s) => s.slotId === selectedRecord?.slotId);

  // Calculate parking duration and fee using DBMS algorithm formula
  let durationMinutes = 90;
  let billableHours = 2;
  let baseRate = slot?.hourlyRate || 25;
  let typeMultiplier = 1.0;
  let calculatedFee = 50;

  if (selectedRecord) {
    const entryDate = new Date(selectedRecord.entryTime.replace(' ', 'T'));
    const nowDate = new Date();
    const diffMs = Math.max(0, nowDate.getTime() - entryDate.getTime());
    durationMinutes = Math.max(12, Math.floor(diffMs / (1000 * 60)));

    // Ceiling billable hours
    billableHours = Math.max(1, Math.ceil(durationMinutes / 60));

    // Multiplier per vehicle type
    if (selectedRecord.vehicleType === 'SUV') typeMultiplier = 1.25;
    else if (selectedRecord.vehicleType === 'EV') typeMultiplier = 1.1;
    else if (selectedRecord.vehicleType === 'Motorcycle') typeMultiplier = 0.6;
    else typeMultiplier = 1.0;

    calculatedFee = Math.round(billableHours * baseRate * typeMultiplier);
  }

  const handleProcessCheckout = () => {
    if (!selectedRecord) return;

    setIsProcessing(true);

    setTimeout(() => {
      const now = new Date();
      const exitTimestamp = now.toISOString().replace('T', ' ').slice(0, 19);
      const paymentId = `pay-2026-${Math.floor(100 + Math.random() * 900)}`;

      let refCode = 'TXN-';
      if (paymentMethod === 'Fastag / RFID') refCode = `FTG-${Math.floor(100000000 + Math.random() * 900000000)}-TXN`;
      else if (paymentMethod === 'UPI / QR') refCode = `UPI-${Math.floor(100000000 + Math.random() * 900000000)}@smartpark`;
      else if (paymentMethod === 'Credit Card') refCode = `CC-AUTH-${Math.floor(1000 + Math.random() * 9000)}`;
      else refCode = `CSH-REC-${Math.floor(1000 + Math.random() * 9000)}`;

      const completedRecord: ParkingRecord = {
        ...selectedRecord,
        exitTime: exitTimestamp,
        durationMinutes,
        totalFee: calculatedFee,
        status: 'Completed',
        paymentStatus: 'Paid',
        paymentId,
      };

      const newPayment: Payment = {
        paymentId,
        recordId: selectedRecord.recordId,
        ticketNumber: selectedRecord.ticketNumber,
        plateNumber: selectedRecord.plateNumber,
        amount: calculatedFee,
        paymentMethod,
        paymentStatus: 'Paid',
        transactionReference: refCode,
        paymentTime: exitTimestamp,
        staffName: 'Sujit Dohale (Gate Exit 1)',
      };

      setIsProcessing(false);
      onConfirmExit(completedRecord, newPayment);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-[#0D1527] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#080D1A]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20">
              <LogOut className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                Process Vehicle Exit & Fee
              </h3>
              <p className="text-xs text-slate-400">
                DBMS Dynamic Stored Procedure Calculation & Trigger Release
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {isProcessing ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <WheelLoader
              size={84}
              label="Settling Parking Ledger & Freeing Bay..."
              subtext="Executing trigger: trg_on_vehicle_exit_free_slot()"
            />
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {parkedRecords.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <Car className="w-10 h-10 text-slate-500 mx-auto" />
                <h4 className="font-semibold text-slate-300">No Active Vehicles Parked</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  All bays are currently available. Register a vehicle entry first to demo the checkout flow.
                </p>
              </div>
            ) : (
              <>
                {/* Search / Select Active Parked Vehicle */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Select Parked Vehicle by Plate or Ticket
                  </label>
                  <div className="relative mb-2">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Filter by plate number, ticket or driver..."
                      className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-lime-400"
                    />
                  </div>

                  <div className="max-h-32 overflow-y-auto border border-slate-800 rounded-lg divide-y divide-slate-800/80 bg-slate-900/60">
                    {filteredRecords.map((r) => (
                      <button
                        key={r.recordId}
                        type="button"
                        onClick={() => setSelectedRecordId(r.recordId)}
                        className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs transition-colors cursor-pointer ${
                          selectedRecordId === r.recordId
                            ? 'bg-lime-400/10 text-lime-300 font-semibold'
                            : 'hover:bg-slate-800/60 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold">{r.plateNumber}</span>
                          <span className="text-slate-500">·</span>
                          <span className="text-slate-400">{r.ownerName}</span>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-[11px]">
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                            Slot {r.slotCode}
                          </span>
                          <span className="text-slate-400">{r.ticketNumber}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Vehicle Calculation Summary */}
                {selectedRecord && (
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div>
                        <span className="text-xs text-slate-400">Selected Vehicle</span>
                        <div className="font-mono font-bold text-white text-base">
                          {selectedRecord.plateNumber} ({selectedRecord.vehicleType})
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400">Assigned Slot</span>
                        <div className="font-mono font-bold text-lime-400 text-base">
                          {selectedRecord.slotCode} · {selectedRecord.floorLevel}
                        </div>
                      </div>
                    </div>

                    {/* Duration and Pricing Breakdown */}
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="p-2 rounded-lg bg-slate-850/60 border border-slate-800">
                        <span className="text-slate-400 text-[10px]">Entry Time</span>
                        <div className="font-mono text-slate-200 mt-0.5 truncate text-[11px]">
                          {selectedRecord.entryTime.slice(11)}
                        </div>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-850/60 border border-slate-800">
                        <span className="text-slate-400 text-[10px]">Elapsed Time</span>
                        <div className="font-mono font-semibold text-lime-400 mt-0.5">
                          {Math.floor(durationMinutes / 60)}h {durationMinutes % 60}m
                        </div>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-850/60 border border-slate-800">
                        <span className="text-slate-400 text-[10px]">Billable Hours</span>
                        <div className="font-mono font-semibold text-white mt-0.5">
                          {billableHours} hr ({baseRate}₹/h)
                        </div>
                      </div>
                    </div>

                    {/* Calculated Fee Total Callout */}
                    <div className="p-3 bg-gradient-to-r from-lime-400/10 via-lime-400/5 to-transparent border border-lime-400/30 rounded-lg flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-lime-300">
                          Calculated Parking Fee
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {billableHours}h × ₹{baseRate} × {typeMultiplier}x ({selectedRecord.vehicleType})
                        </div>
                      </div>
                      <div className="text-2xl font-mono font-extrabold text-lime-400">
                        ₹{calculatedFee.toFixed(2)}
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Method Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Settlement Payment Method
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(
                      [
                        { id: 'Fastag / RFID', icon: Radio, desc: 'Auto RFID Gate' },
                        { id: 'UPI / QR', icon: QrCode, desc: 'Instant UPI QR' },
                        { id: 'Credit Card', icon: CreditCard, desc: 'Chip / NFC POS' },
                        { id: 'Cash', icon: DollarSign, desc: 'Manual Cash' },
                      ] as const
                    ).map((pm) => {
                      const Icon = pm.icon;
                      const isSelected = paymentMethod === pm.id;
                      return (
                        <button
                          key={pm.id}
                          type="button"
                          onClick={() => setPaymentMethod(pm.id)}
                          className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-lime-400/15 border-lime-400 text-white'
                              : 'bg-slate-900 border-slate-750 text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 font-semibold text-xs text-white">
                            <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-lime-400' : 'text-slate-400'}`} />
                            <span className="truncate">{pm.id}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{pm.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-850 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleProcessCheckout}
                    disabled={!selectedRecord}
                    className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-slate-950 bg-lime-400 hover:bg-lime-300 disabled:opacity-50 disabled:pointer-events-none rounded-lg shadow-md shadow-lime-400/20 transition-all cursor-pointer"
                  >
                    <Receipt className="w-4 h-4" />
                    <span>Collect ₹{calculatedFee} & Open Boom Barrier</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
