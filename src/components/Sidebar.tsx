import React from 'react';
import {
  LayoutDashboard,
  Grid3X3,
  Car,
  SquareParking,
  Receipt,
  BarChart3,
  Database,
  ShieldCheck,
  Settings,
  HelpCircle,
  Sparkles,
  Layers,
} from 'lucide-react';
import { UserRole } from '../types';

export type NavTab =
  | 'overview'
  | 'live-parking'
  | 'vehicles'
  | 'parking-slots'
  | 'payments'
  | 'reports'
  | 'database-design'
  | 'users-roles'
  | 'settings';

interface NavItemDef {
  id: NavTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  highlight?: boolean;
}

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenAbout: () => void;
  currentUserRole: UserRole;
  occupiedCount: number;
  totalSlots: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenAbout,
  currentUserRole,
  occupiedCount,
  totalSlots,
  isOpenMobile,
  onCloseMobile,
}) => {
  const occupancyPercentage = Math.round((occupiedCount / totalSlots) * 100) || 0;

  const navItems: NavItemDef[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'live-parking', label: 'Live Parking', icon: Grid3X3, badge: `${occupiedCount}/${totalSlots}` },
    { id: 'vehicles', label: 'Vehicles', icon: Car },
    { id: 'parking-slots', label: 'Parking Slots', icon: SquareParking },
    { id: 'payments', label: 'Payments', icon: Receipt },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'database-design', label: 'Database Design', icon: Database, highlight: true },
    { id: 'users-roles', label: 'Users & Roles', icon: ShieldCheck },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleTabClick = (tab: NavTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-[#080D1A] border-r border-slate-800/80 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Wordmark Zone */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-lime-400 text-slate-950 font-bold shadow-md shadow-lime-400/20">
              <span className="font-display text-lg tracking-tighter">P</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display text-lg font-bold tracking-tight text-white">SmartPark</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-lime-400/10 text-lime-400 border border-lime-400/20 font-semibold">
                  DBMS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 tracking-wide">Vehicle Management</p>
            </div>
          </div>
        </div>

        {/* System Notice / Demo Label */}
        <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
            <span>Interactive Demo System</span>
          </span>
          <span className="font-mono text-[10px] text-slate-400">Online</span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            const isHighlight = 'highlight' in item && item.highlight;

            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id as NavTab)}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors group text-left ${
                  isActive
                    ? 'bg-slate-800/90 text-white shadow-xs font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive
                        ? 'text-lime-400'
                        : isHighlight
                        ? 'text-lime-400/80 group-hover:text-lime-400'
                        : 'text-slate-400 group-hover:text-slate-300'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {/* Badges or tags */}
                {item.badge && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded text-xs ${
                      isActive
                        ? 'bg-lime-400/20 text-lime-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Utility: Live Capacity Gauge & DBMS Information Button */}
        <div className="p-3 border-t border-slate-800/80 space-y-3 bg-[#070B16]">
          {/* Capacity Mini-Widget */}
          <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400 font-medium">Deck Occupancy</span>
              <span className="font-mono text-lime-400 font-semibold">{occupancyPercentage}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  occupancyPercentage > 85 ? 'bg-amber-400' : 'bg-lime-400'
                }`}
                style={{ width: `${occupancyPercentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
              <span>{occupiedCount} Occupied</span>
              <span>{totalSlots - occupiedCount} Free</span>
            </div>
          </div>

          {/* About DBMS Project Button */}
          <button
            onClick={onOpenAbout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800/60 hover:bg-slate-800 rounded-lg border border-slate-700/60 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-lime-400" />
            <span>About DBMS Showcase</span>
          </button>

          {/* Current User Role Notice */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>Session Role:</span>
            <span className="font-medium text-slate-300">{currentUserRole}</span>
          </div>
        </div>
      </aside>
    </>
  );
};
