import React from 'react';
import { X, Database, ShieldCheck, Cpu, GitFork, KeyRound, CheckCircle2, Layers } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#0D1527] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#080D1A]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-lime-400 text-slate-950 font-bold flex items-center justify-center font-display text-lg">
              P
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                About SmartPark DBMS Showcase
              </h3>
              <p className="text-xs text-slate-400">
                Database Management Systems (DBMS) Course & Architecture Project
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-5 text-xs text-slate-300 leading-relaxed">
          {/* Executive Overview */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <h4 className="font-semibold text-white text-sm flex items-center gap-2">
              <Database className="w-4 h-4 text-lime-400" />
              <span>How a DBMS Powers Modern Parking Operations</span>
            </h4>
            <p>
              SmartPark demonstrates how relational database principles turn high-velocity vehicle traffic, 
              sensor signals, and financial transactions into a consistent, audit-proof system. Without a relational 
              DBMS, concurrent parking entry attempts at multiple gates cause double-allocation collisions, lost records, 
              and billing disputes.
            </p>
          </div>

          {/* Core DBMS Principles Demonstrated */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-lime-400 text-xs">
                <Layers className="w-4 h-4" />
                <span>3rd Normal Form (3NF) Design</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Eliminates insertion, update, and deletion anomalies by separating vehicle owners, 
                vehicle specifications, physical parking bays, time sessions, and fiscal receipts into dedicated tables.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-lime-400 text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>ACID Concurrency & Row Locks</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Simulates <code className="text-slate-200">FOR UPDATE SKIP LOCKED</code> transactions so when two cars arrive simultaneously, 
                neither receives the same slot. Ensures 100% atomic entries and exits.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-lime-400 text-xs">
                <Cpu className="w-4 h-4" />
                <span>Triggers & Stored Procedures</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Business rules reside in the database layer. When a vehicle exit record completes, an automated trigger 
                immediately flips the parking bay status back to <code className="text-slate-200">&apos;Available&apos;</code>.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-lime-400 text-xs">
                <KeyRound className="w-4 h-4" />
                <span>Role-Based Access Control (RBAC)</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Differentiates between Parking Staff (check-in/checkout only) and System Admins (fee tier alteration, 
                slot maintenance, database backup snapshots, and fiscal audit reports).
              </p>
            </div>
          </div>

          {/* Academic Demo Disclaimer */}
          <div className="p-4 rounded-xl bg-amber-400/10 border border-amber-400/20 text-slate-300 space-y-1">
            <div className="font-semibold text-amber-300 text-xs">Demo Environment Notice</div>
            <p className="text-[11px] text-slate-400">
              This interactive dashboard is a student and engineering demonstration showcase. 
              All license plates, phone numbers, gate telemetry, and transactions are simulated mock data 
              running client-side for educational exploration.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 bg-[#080D1A] border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-lime-400 hover:bg-lime-300 rounded-lg transition-colors cursor-pointer"
          >
            Explore Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
