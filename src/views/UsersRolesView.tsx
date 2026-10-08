import React, { useState } from 'react';
import {
  ShieldCheck,
  UserCheck,
  Key,
  Database,
  Lock,
  RefreshCw,
  Archive,
  CheckCircle2,
  AlertTriangle,
  HardDrive,
  Cpu,
  Layers,
  FileText,
  User,
} from 'lucide-react';
import { StaffUser, UserRole } from '../types';
import { INITIAL_STAFF } from '../data/mockData';
import { WheelLoader } from '../components/WheelLoader';

interface UsersRolesViewProps {
  currentUserRole: UserRole;
  onToggleUserRole: () => void;
}

export const UsersRolesView: React.FC<UsersRolesViewProps> = ({
  currentUserRole,
  onToggleUserRole,
}) => {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [lastBackupTime, setLastBackupTime] = useState('2026-10-08 04:00:00 (Checkpoint #892)');
  const [backupSuccess, setBackupSuccess] = useState(false);

  // Exact 14 permissions from specification
  const permissions = [
    { feature: 'View overview and live parking-slot status', admin: 'Yes', staff: 'Yes', note: 'Essential real-time bay awareness' },
    { feature: 'Register owners and vehicles', admin: 'Yes', staff: 'Yes', note: 'Customer onboarding at gate or counter' },
    { feature: 'Record vehicle entry and exit', admin: 'Yes', staff: 'Yes', note: 'Boom barrier telemetry registration' },
    { feature: 'Assign and release parking slots', admin: 'Yes', staff: 'Yes', note: 'Automatic or manual bay allocation' },
    { feature: 'View parking records', admin: 'All records', staff: 'Operational records', note: 'Staff limited to active operational rows' },
    { feature: 'Record payments', admin: 'Yes', staff: 'Yes', note: 'Point of sale and RFID gate validation' },
    { feature: 'View payment status and relevant transaction details', admin: 'Yes', staff: 'Yes, for operational work', note: 'Verification token without aggregate financial totals' },
    { feature: 'View revenue totals, revenue cards, and revenue charts', admin: 'Yes', staff: 'No', note: 'Strictly restricted to Admin management' },
    { feature: 'View daily operational reports without revenue', admin: 'Yes', staff: 'Yes', note: 'Occupancy peak charts and flow analysis' },
    { feature: 'View revenue reports and financial summaries', admin: 'Yes', staff: 'No', note: 'Fiscal reconciliation and ledger exports' },
    { feature: 'Manage users and assign roles', admin: 'Yes', staff: 'No', note: 'RBAC credential creation and shifts' },
    { feature: 'Change system settings and parking-fee rules', admin: 'Yes', staff: 'No', note: 'Tariffs, grace periods, and lost ticket fees' },
    { feature: 'Manage database backups and restore', admin: 'Yes', staff: 'No', note: 'Data archives and point-in-time recovery' },
    { feature: 'View audit and transaction logs', admin: 'Yes', staff: 'No', note: 'System-wide compliance audit ledger' },
  ];

  const handleRunManualBackup = () => {
    setIsBackingUp(true);
    setBackupSuccess(false);

    setTimeout(() => {
      setIsBackingUp(false);
      setBackupSuccess(true);
      const now = new Date();
      setLastBackupTime(
        `${now.toISOString().replace('T', ' ').slice(0, 19)} (Checkpoint #${Math.floor(1000 + Math.random() * 9000)})`
      );
      setTimeout(() => setBackupSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header and Current Role State */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0D1527] border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-lime-400" />
              <span className="text-xs font-mono uppercase text-lime-400 font-semibold">
                Access Control & DBMS Integrity
              </span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
              Users, Roles & Transaction Management
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Enforces strict least-privilege security between operational attendants and system administrators.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Active UI Session</span>
              <span className="font-mono text-xs font-bold text-lime-400">
                {currentUserRole}
              </span>
            </div>
            <button
              onClick={onToggleUserRole}
              className="px-3 py-1.5 text-xs font-bold text-slate-950 bg-lime-400 hover:bg-lime-300 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Switch to {currentUserRole === 'System Admin' ? 'Parking Staff' : 'Admin'}
            </button>
          </div>
        </div>
      </div>

      {/* Role Descriptions Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Admin Card */}
        <div className={`p-5 rounded-2xl border transition-all ${
          currentUserRole === 'System Admin'
            ? 'bg-lime-400/5 border-lime-400/40 shadow-sm'
            : 'bg-[#0D1527] border-slate-800'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-lime-400/10 text-lime-400 border border-lime-400/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-white">System Admin</h3>
                <span className="text-[10px] font-mono text-lime-400">Full System & Financial Authority</span>
              </div>
            </div>
            {currentUserRole === 'System Admin' && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-lime-400/20 text-lime-300 font-semibold">
                ACTIVE ROLE
              </span>
            )}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Manages the system, users, permissions, parking areas, fee rules, all records and reports, revenue and financial summaries, audit logs, and database backup and recovery.
          </p>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap gap-1.5 text-[10px] font-mono text-slate-400">
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Financial Visibility</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">WAL Snapshots</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Tariff Config</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">User RBAC</span>
          </div>
        </div>

        {/* Parking Staff Card */}
        <div className={`p-5 rounded-2xl border transition-all ${
          currentUserRole === 'Parking Staff'
            ? 'bg-lime-400/5 border-lime-400/40 shadow-sm'
            : 'bg-[#0D1527] border-slate-800'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-sky-400/10 text-sky-400 border border-sky-400/20">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-white">Parking Staff</h3>
                <span className="text-[10px] font-mono text-sky-400">Daily Operations & Gate Attendant</span>
              </div>
            </div>
            {currentUserRole === 'Parking Staff' && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-400/20 text-sky-300 font-semibold">
                ACTIVE ROLE
              </span>
            )}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Handles daily parking operations, including registering owners and vehicles, recording entry and exit, assigning and releasing slots, recording payments, and viewing operational records and non-financial reports. Staff cannot manage users, change system-wide settings or fee rules, access backup and restore controls, view audit logs, or view revenue.
          </p>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap gap-1.5 text-[10px] font-mono text-slate-400">
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Gate Check-in</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Barrier Release</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Record Payments</span>
            <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">No Revenue Access</span>
          </div>
        </div>
      </div>

      {/* Authorized Personnel & Attendant Directory */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0D1527] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-lime-400" />
              <span>Assigned Personnel Directory</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Current operational staff and administrators assigned to smart deck control.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-lime-400/10 text-lime-400 border border-lime-400/20">
            Active Accounts
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Admin Card */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-lime-400/30 flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-lime-400/10 border border-lime-400/40 flex items-center justify-center text-lime-400 font-bold text-base shrink-0 shadow-inner">
                K
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">Kaushik Nigde</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-lime-400/20 text-lime-300 font-semibold">
                    System Admin
                  </span>
                </div>
                <div className="text-xs text-slate-300">
                  Central Control Hub · General Shift (09:00 - 18:00)
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  admin.kaushik@smartpark · Full Administrative Authority
                </div>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-lime-400 mt-1.5 shrink-0" title="Active" />
          </div>

          {/* Staff Card */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-sky-400/30 flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-400/10 border border-sky-400/40 flex items-center justify-center text-sky-400 font-bold text-base shrink-0 shadow-inner">
                S
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">Sujit Dohale</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-400/20 text-sky-300 font-semibold">
                    Parking Staff
                  </span>
                </div>
                <div className="text-xs text-slate-300">
                  Entry/Exit Gate 1 & 2 · Morning & Evening Shifts
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  staff.sujit@smartpark · Operational Gate Attendant
                </div>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-lime-400 mt-1.5 shrink-0" title="Active" />
          </div>
        </div>
      </div>

      {/* Role Permissions Table */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0D1527] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h3 className="font-display font-bold text-base text-white">
              Role Permissions Matrix
            </h3>
            <p className="text-xs text-slate-400">
              Formally enforces capability boundaries across the SmartPark DBMS interface.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-lime-400/10 text-lime-400 border border-lime-400/20">
            14 System Capabilities
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                <th className="py-3 px-4 font-semibold">Dashboard feature or action</th>
                <th className="py-3 px-4 font-semibold text-center w-28">Admin</th>
                <th className="py-3 px-4 font-semibold text-center w-48">Parking Staff</th>
                <th className="py-3 px-4 font-semibold">Operational Context</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {permissions.map((perm, idx) => {
                const isAdminYes = perm.admin.toLowerCase().includes('yes') || perm.admin.toLowerCase().includes('all');
                const isStaffYes = perm.staff.toLowerCase().includes('yes') || perm.staff.toLowerCase().includes('operational');

                return (
                  <tr key={idx} className="hover:bg-slate-850/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-white font-sans">
                      {perm.feature}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 font-bold ${
                        isAdminYes ? 'text-lime-400' : 'text-slate-500'
                      }`}>
                        {perm.admin}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 font-medium ${
                        perm.staff === 'No'
                          ? 'text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20'
                          : perm.staff.includes('operational')
                          ? 'text-sky-300'
                          : 'text-lime-400'
                      }`}>
                        {perm.staff}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-sans text-[11px]">
                      {perm.note}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transactions and Backups Explanation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transactions & ACID */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0D1527] border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-white font-display font-bold text-base">
            <Lock className="w-4 h-4 text-lime-400" />
            <span>Transaction Management & Consistency</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            In SmartPark, transactions guarantee that related operations remain 100% consistent. 
            For example, <strong>assigning a parking slot and creating a parking record should either both succeed or both fail</strong>.
          </p>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1.5">
            <div className="text-lime-400 font-bold">-- Atomic Vehicle Check-In Unit of Work</div>
            <div>BEGIN TRANSACTION;</div>
            <div className="text-slate-400">  -- 1. Reserve bay with concurrency row-lock</div>
            <div>  UPDATE parking_slots SET status = &apos;Occupied&apos; WHERE slot_id = &apos;slot-101&apos;;</div>
            <div className="text-slate-400">  -- 2. Insert parking session fact</div>
            <div>  INSERT INTO parking_records (record_id, ticket_number, slot_id, ...) VALUES (...);</div>
            <div className="text-slate-400">  -- If hardware gate faults: ROLLBACK; Else:</div>
            <div>COMMIT;</div>
          </div>

          <p className="text-[11px] text-slate-400">
            If the gate barrier sensor reports a failure during ticket print, the transaction rolls back immediately, 
            leaving the parking bay free for other incoming vehicles.
          </p>
        </div>

        {/* Database Backups & Restore */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0D1527] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-display font-bold text-base">
              <HardDrive className="w-4 h-4 text-lime-400" />
              <span>Backup Management & Disaster Recovery</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-lime-400/10 text-lime-400 border border-lime-400/20">
              Admin Exclusive
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Database backup and restoration is strictly an <strong>Admin capability</strong>. Backups preserve point-in-time state 
            for all system tables (<code className="text-slate-200">owners</code>, <code className="text-slate-200">vehicles</code>, <code className="text-slate-200">parking_slots</code>, <code className="text-slate-200">parking_records</code>, and <code className="text-slate-200">payments</code>).
          </p>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Last Verified Snapshot:</span>
              <span className="font-mono text-white text-[11px]">{lastBackupTime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Disaster Recovery RPO:</span>
              <span className="font-mono text-slate-300">&lt; 1 minute (Continuous Journal Archiving)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Referential Integrity:</span>
              <span className="text-lime-400 font-bold">&check; Validated</span>
            </div>
          </div>

          {backupSuccess && (
            <div className="p-3 rounded-lg bg-lime-400/10 border border-lime-400/30 text-xs text-lime-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-lime-400" />
              <span>Database checkpoint written successfully. Zero transaction loss verified.</span>
            </div>
          )}

          {isBackingUp ? (
            <WheelLoader
              size={64}
              label="Generating Database Snapshot..."
              subtext="Verifying table and index integrity"
            />
          ) : (
            <button
              onClick={handleRunManualBackup}
              disabled={currentUserRole !== 'System Admin'}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-950 bg-lime-400 hover:bg-lime-300 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-all cursor-pointer shadow-sm"
            >
              <Archive className="w-4 h-4" />
              <span>
                {currentUserRole === 'System Admin'
                  ? 'Trigger Manual Database Snapshot'
                  : 'Admin Privileges Required to Manage Backups'}
              </span>
            </button>
          )}

          <p className="text-[11px] text-slate-400 text-center">
            {currentUserRole === 'Parking Staff'
              ? 'Backup creation, log shipping, and schema restores are disabled for Parking Staff.'
              : 'Writes a consistent checkpoint record and archives recent transactions to persistent storage.'}
          </p>
        </div>
      </div>
    </div>
  );
};
