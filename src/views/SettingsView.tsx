import React, { useState } from 'react';
import {
  Settings,
  DollarSign,
  Clock,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Sliders,
  Shield,
  Layers,
} from 'lucide-react';
import { WheelLoader } from '../components/WheelLoader';

interface SettingsViewProps {
  onResetData: () => void;
  onGenerateTraffic: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onResetData,
  onGenerateTraffic,
}) => {
  const [gracePeriod, setGracePeriod] = useState(15);
  const [lostTicketFee, setLostTicketFee] = useState(300);
  const [sedanRate, setSedanRate] = useState(25);
  const [suvRate, setSuvRate] = useState(35);
  const [evRate, setEvRate] = useState(35);
  const [motoRate, setMotoRate] = useState(15);
  const [allocationPolicy, setAllocationPolicy] = useState('nearest');
  const [isSaved, setIsSaved] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleResetWithAnimation = () => {
    setIsResetting(true);
    setTimeout(() => {
      onResetData();
      setIsResetting(false);
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0D1527] border border-slate-800">
        <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
          System Configuration & Pricing Tariffs
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Adjust billing multipliers, automated allocation policies, and manage demo database seeding.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings Form */}
        <form onSubmit={handleSave} className="lg:col-span-2 space-y-6">
          {/* Rate Cards */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#0D1527] border border-slate-800 space-y-4">
            <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-lime-400" />
              <span>Base Hourly Rates by Vehicle Category</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Sedan / Hatchback (₹/hr)
                </label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  value={sedanRate}
                  onChange={(e) => setSedanRate(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-750 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  SUV / Large Vehicles (₹/hr)
                </label>
                <input
                  type="number"
                  min="10"
                  max="150"
                  value={suvRate}
                  onChange={(e) => setSuvRate(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-750 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  EV Fast Charging Bay (₹/hr)
                </label>
                <input
                  type="number"
                  min="10"
                  max="150"
                  value={evRate}
                  onChange={(e) => setEvRate(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-750 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Motorcycle / Two-Wheeler (₹/hr)
                </label>
                <input
                  type="number"
                  min="5"
                  max="50"
                  value={motoRate}
                  onChange={(e) => setMotoRate(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-750 rounded-lg text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Operational Rules */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#0D1527] border border-slate-800 space-y-4">
            <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-lime-400" />
              <span>Operational & Allocation Policy</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Free Grace Period (Minutes)
                </label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={gracePeriod}
                  onChange={(e) => setGracePeriod(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-750 rounded-lg text-white font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Vehicles that exit within this grace window are not billed.
                </p>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Lost Ticket Penalty Tariff (₹)
                </label>
                <input
                  type="number"
                  min="100"
                  max="1000"
                  value={lostTicketFee}
                  onChange={(e) => setLostTicketFee(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-750 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Automated Slot Allocation Strategy
                </label>
                <select
                  value={allocationPolicy}
                  onChange={(e) => setAllocationPolicy(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-750 rounded-lg text-white"
                >
                  <option value="nearest">Nearest to Gate (Level 1 ground floor priority)</option>
                  <option value="balanced">Deck Load Balancing (Distribute evenly across Levels 1, 2, 3)</option>
                  <option value="vip">VIP Priority (Reserve Level 3 for long stay)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              {isSaved ? (
                <span className="text-xs text-lime-400 flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  Configuration saved in database
                </span>
              ) : (
                <span className="text-[11px] text-slate-400">
                  Settings apply to all newly registered sessions.
                </span>
              )}

              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-slate-950 bg-lime-400 hover:bg-lime-300 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Save Tariffs
              </button>
            </div>
          </div>
        </form>

        {/* Demo Seed Controls */}
        <div className="space-y-6">
          <div className="p-5 sm:p-6 rounded-2xl bg-[#0D1527] border border-slate-800 space-y-4">
            <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-lime-400" />
              <span>Demo Dataset Management</span>
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              Reset the sample database to initial baseline state, or inject simulated rush-hour vehicle traffic to test capacity limits.
            </p>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={onGenerateTraffic}
                className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-lime-400" />
                <span>Simulate 3 Incoming Vehicles</span>
              </button>

              <button
                onClick={handleResetWithAnimation}
                disabled={isResetting}
                className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
                <span>{isResetting ? 'Resetting Schema...' : 'Reset to Default Demo State'}</span>
              </button>
            </div>

            <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800">
              * Operates purely in-memory. No live database connection is made.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
