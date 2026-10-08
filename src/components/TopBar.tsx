import React, { useState, useEffect } from 'react';
import {
  Menu,
  Bell,
  Clock,
  MapPin,
  ChevronDown,
  User,
  PlusCircle,
  LogOut,
  Database,
  CheckCircle2,
  AlertTriangle,
  Info,
  Shield,
  Layers,
} from 'lucide-react';
import { LocationSite, UserRole, NotificationItem } from '../types';

interface TopBarProps {
  pageTitle: string;
  sites: LocationSite[];
  selectedSite: LocationSite;
  onSelectSite: (site: LocationSite) => void;
  currentUserRole: UserRole;
  onToggleUserRole: () => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  onOpenEntryModal: () => void;
  onOpenExitModal: () => void;
  onToggleMobileSidebar: () => void;
  onOpenAboutModal: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  pageTitle,
  sites,
  selectedSite,
  onSelectSite,
  currentUserRole,
  onToggleUserRole,
  notifications,
  onMarkNotificationRead,
  onOpenEntryModal,
  onOpenExitModal,
  onToggleMobileSidebar,
  onOpenAboutModal,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [showSiteDropdown, setShowSiteDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
      setCurrentDate(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-[#0A0F1D]/90 backdrop-blur-md border-b border-slate-800/80">
      {/* Left: Mobile hamburger & Page Title / Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 lg:hidden focus:outline-none focus:ring-2 focus:ring-lime-400"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="font-display text-lg md:text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>{pageTitle}</span>
            <span className="hidden sm:inline-flex items-center text-[10px] font-mono px-2 py-0.5 rounded bg-lime-400/10 text-lime-400 border border-lime-400/20">
              Demo Mode
            </span>
          </h1>
        </div>
      </div>

      {/* Middle: Location Selector */}
      <div className="relative hidden md:block">
        <button
          onClick={() => setShowSiteDropdown(!showSiteDropdown)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900/80 hover:bg-slate-850 rounded-lg border border-slate-700/80 hover:border-slate-600 transition-colors"
          aria-expanded={showSiteDropdown}
          aria-haspopup="true"
        >
          <MapPin className="w-3.5 h-3.5 text-lime-400" />
          <span className="truncate max-w-[180px]">{selectedSite.name}</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>

        {showSiteDropdown && (
          <div className="absolute left-0 mt-2 w-72 p-1.5 bg-[#0F172A] border border-slate-700 rounded-lg shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Select Parking Deck
            </div>
            {sites.map((site) => (
              <button
                key={site.id}
                onClick={() => {
                  onSelectSite(site);
                  setShowSiteDropdown(false);
                }}
                className={`w-full text-left px-2.5 py-2 rounded text-xs transition-colors ${
                  site.id === selectedSite.id
                    ? 'bg-lime-400/10 text-lime-300 font-medium'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="font-semibold">{site.name}</div>
                <div className="text-[11px] text-slate-400 truncate">{site.address}</div>
                <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                  Capacity: {site.totalCapacity} Slots · {site.operatingHours}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Controls: Live Clock, Gate Actions, Notifications, User Role */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live Clock */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900/70 border border-slate-800 text-xs text-slate-300 font-mono">
          <Clock className="w-3.5 h-3.5 text-lime-400" />
          <span>{currentDate}</span>
          <span className="text-slate-500">|</span>
          <span className="text-lime-300 font-semibold">{currentTime}</span>
        </div>

        {/* Quick Vehicle Entry Button */}
        <button
          onClick={onOpenEntryModal}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-lime-400 hover:bg-lime-300 active:scale-95 rounded-lg shadow-xs shadow-lime-400/20 transition-all cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5 stroke-[2.5]" />
          <span className="hidden sm:inline">Vehicle Entry</span>
          <span className="sm:hidden">Entry</span>
        </button>

        {/* Quick Vehicle Exit Button */}
        <button
          onClick={onOpenExitModal}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Vehicle Exit</span>
          <span className="sm:hidden">Exit</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-850 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-lime-400" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 p-2 bg-[#0F172A] border border-slate-700 rounded-lg shadow-xl z-50">
              <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-800">
                <span className="text-xs font-semibold text-slate-200">System Activity</span>
                <span className="text-[10px] text-slate-400 font-mono">DBMS Audit Feed</span>
              </div>
              <div className="divide-y divide-slate-800/60 max-h-64 overflow-y-auto">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onMarkNotificationRead(item.id)}
                    className={`p-2.5 text-left text-xs transition-colors cursor-pointer hover:bg-slate-800/60 ${
                      item.read ? 'opacity-60' : 'bg-slate-850/40'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {item.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
                      ) : item.type === 'warning' ? (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      ) : (
                        <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-semibold text-slate-200 text-xs">{item.title}</div>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                          {item.message}
                        </p>
                        <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                          {item.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-lg hover:bg-slate-800 border border-slate-800/80 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-slate-800 border border-lime-400/40 flex items-center justify-center text-lime-400 text-xs font-bold">
              {currentUserRole === 'System Admin' ? 'K' : 'S'}
            </div>
            <span className="hidden xl:inline text-xs font-medium text-slate-200">
              {currentUserRole}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 p-2 bg-[#0F172A] border border-slate-700 rounded-lg shadow-xl z-50">
              <div className="px-2 py-1.5 border-b border-slate-800 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-lime-400/60 flex items-center justify-center text-lime-400 text-sm font-bold shadow-inner shrink-0">
                  {currentUserRole === 'System Admin' ? 'K' : 'S'}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-200 truncate">
                    {currentUserRole === 'System Admin' ? 'Kaushik Nigde' : 'Sujit Dohale'}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono truncate">
                    {currentUserRole === 'System Admin' ? 'admin.kaushik@smartpark' : 'staff.sujit@gate1'}
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-lime-400">
                    <Shield className="w-3 h-3" />
                    <span>Role: {currentUserRole}</span>
                  </div>
                </div>
              </div>

              <div className="p-1 space-y-1">
                <button
                  onClick={() => {
                    onToggleUserRole();
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded text-xs text-slate-300 hover:bg-slate-800 flex items-center justify-between"
                >
                  <span>Switch Role to {currentUserRole === 'System Admin' ? 'Parking Staff' : 'System Admin'}</span>
                  <span className="text-[10px] font-mono text-lime-400">Toggle</span>
                </button>
                <button
                  onClick={() => {
                    onOpenAboutModal();
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                >
                  <Database className="w-3.5 h-3.5 text-lime-400" />
                  <span>DBMS Architecture Guide</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
