import React, { useState, useEffect, useRef } from 'react';
import { animate } from 'animejs';
import {
  ParkingSlot,
  ParkingRecord,
  Payment,
  UserRole,
  LocationSite,
  NotificationItem,
} from './types';
import {
  SITES,
  INITIAL_SLOTS,
  INITIAL_RECORDS,
  INITIAL_PAYMENTS,
  INITIAL_NOTIFICATIONS,
} from './data/mockData';
import { Sidebar, NavTab } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { VehicleEntryModal } from './components/VehicleEntryModal';
import { VehicleExitModal } from './components/VehicleExitModal';
import { TicketModal } from './components/TicketModal';
import { ReceiptModal } from './components/ReceiptModal';
import { SlotDetailsDrawer } from './components/SlotDetailsDrawer';
import { AboutModal } from './components/AboutModal';

// Views
import { OverviewView } from './views/OverviewView';
import { LiveParkingView } from './views/LiveParkingView';
import { VehiclesView } from './views/VehiclesView';
import { ParkingSlotsView } from './views/ParkingSlotsView';
import { PaymentsView } from './views/PaymentsView';
import { ReportsView } from './views/ReportsView';
import { DatabaseDesignView } from './views/DatabaseDesignView';
import { UsersRolesView } from './views/UsersRolesView';
import { SettingsView } from './views/SettingsView';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');
  const [slots, setSlots] = useState<ParkingSlot[]>(INITIAL_SLOTS);
  const [records, setRecords] = useState<ParkingRecord[]>(INITIAL_RECORDS);
  const [payments, setPayments] = useState<Payment[]>(INITIAL_PAYMENTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [selectedSite, setSelectedSite] = useState<LocationSite>(SITES[0]);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('System Admin');

  // Modals & Drawers state
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [inspectedSlot, setInspectedSlot] = useState<ParkingSlot | null>(null);
  const [preSelectedExitRecord, setPreSelectedExitRecord] = useState<ParkingRecord | null>(null);
  const [preSelectedEntrySlot, setPreSelectedEntrySlot] = useState<ParkingSlot | null>(null);
  const [activeTicket, setActiveTicket] = useState<ParkingRecord | null>(null);
  const [activeReceipt, setActiveReceipt] = useState<Payment | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const mainContentRef = useRef<HTMLDivElement>(null);

  // Purposeful tab transition with Anime.js
  useEffect(() => {
    if (!mainContentRef.current) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    animate(mainContentRef.current, {
      opacity: [0, 1],
      translateY: [8, 0],
      duration: 250,
      ease: 'outQuad',
    });
  }, [currentTab]);

  // Derived counts
  const occupiedCount = slots.filter((s) => s.status === 'Occupied').length;
  const availableSlots = slots.filter((s) => s.status === 'Available');
  const parkedRecords = records.filter((r) => r.status === 'Parked');

  // Page titles
  const pageTitles: Record<NavTab, string> = {
    overview: 'Operations Overview',
    'live-parking': 'Live Slot Map',
    vehicles: 'Vehicle & Owner Registry',
    'parking-slots': 'Slot Inventory & Sensors',
    payments: 'Payment Ledger',
    reports: 'Activity & Revenue Reports',
    'database-design': 'Database Design & Schema',
    'users-roles': 'Users & Role Management',
    settings: 'Tariffs & Policies',
  };

  // Handlers
  const handleConfirmEntry = (newRecord: ParkingRecord) => {
    setRecords((prev) => [newRecord, ...prev]);

    // Update slot status in DB simulation
    setSlots((prev) =>
      prev.map((s) =>
        s.slotId === newRecord.slotId
          ? { ...s, status: 'Occupied', currentVehiclePlate: newRecord.plateNumber }
          : s
      )
    );

    // Add activity notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Vehicle ${newRecord.plateNumber} Checked In`,
      message: `Bay ${newRecord.slotCode} (${newRecord.floorLevel}) locked and allocated. Ticket ${newRecord.ticketNumber} printed.`,
      timestamp: 'Just now',
      type: 'success',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Display ticket
    setActiveTicket(newRecord);
  };

  const handleConfirmExit = (completedRecord: ParkingRecord, newPayment: Payment) => {
    setRecords((prev) =>
      prev.map((r) => (r.recordId === completedRecord.recordId ? completedRecord : r))
    );

    setPayments((prev) => [newPayment, ...prev]);

    // Free the slot in DB simulation
    setSlots((prev) =>
      prev.map((s) =>
        s.slotId === completedRecord.slotId
          ? { ...s, status: 'Available', currentVehiclePlate: undefined }
          : s
      )
    );

    // Add activity notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Checkout Completed: ${completedRecord.plateNumber}`,
      message:
        currentUserRole === 'System Admin'
          ? `Fee ₹${newPayment.amount.toFixed(2)} collected via ${newPayment.paymentMethod}. Bay ${completedRecord.slotCode} auto-released.`
          : `Settlement verified via ${newPayment.paymentMethod}. Bay ${completedRecord.slotCode} auto-released.`,
      timestamp: 'Just now',
      type: 'success',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Display receipt
    setActiveReceipt(newPayment);
  };

  const handleToggleSlotStatus = (slotId: string, newStatus: ParkingSlot['status']) => {
    setSlots((prev) =>
      prev.map((s) =>
        s.slotId === slotId
          ? {
              ...s,
              status: newStatus,
              currentVehiclePlate: newStatus === 'Available' ? undefined : s.currentVehiclePlate,
            }
          : s
      )
    );
    if (inspectedSlot && inspectedSlot.slotId === slotId) {
      setInspectedSlot((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleAddSlot = (newSlot: ParkingSlot) => {
    setSlots((prev) => [...prev, newSlot]);
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `New Slot Defined: ${newSlot.slotCode}`,
      message: `Bay added to ${newSlot.floorLevel} with base tariff ₹${newSlot.hourlyRate}/hr.`,
      timestamp: 'Just now',
      type: 'info',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleToggleUserRole = () => {
    setCurrentUserRole((prev) => (prev === 'System Admin' ? 'Parking Staff' : 'System Admin'));
  };

  const handleResetData = () => {
    setSlots(INITIAL_SLOTS);
    setRecords(INITIAL_RECORDS);
    setPayments(INITIAL_PAYMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
  };

  const handleGenerateTraffic = () => {
    const freeSlots = slots.filter((s) => s.status === 'Available');
    if (freeSlots.length === 0) return;

    const sampleVehicles = [
      { plate: `KA-01-EZ-${Math.floor(1000 + Math.random() * 9000)}`, name: 'Nikhil Kashyap', phone: '+91 98450 71822', type: 'EV' as const },
      { plate: `MH-02-BQ-${Math.floor(1000 + Math.random() * 9000)}`, name: 'Aditi Sengupta', phone: '+91 98200 11928', type: 'Sedan' as const },
      { plate: `DL-10-XY-${Math.floor(1000 + Math.random() * 9000)}`, name: 'Taranjeet Oberoi', phone: '+91 98110 55431', type: 'SUV' as const },
    ];

    const toAdd = Math.min(freeSlots.length, sampleVehicles.length);
    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').slice(0, 19);

    const updatedSlots = [...slots];
    const newRecordsList: ParkingRecord[] = [];

    for (let i = 0; i < toAdd; i++) {
      const targetSlot = freeSlots[i];
      const veh = sampleVehicles[i];
      const slotIdx = updatedSlots.findIndex((s) => s.slotId === targetSlot.slotId);

      if (slotIdx !== -1) {
        updatedSlots[slotIdx] = {
          ...updatedSlots[slotIdx],
          status: 'Occupied',
          currentVehiclePlate: veh.plate,
        };

        const rec: ParkingRecord = {
          recordId: `rec-${Date.now()}-${i}`,
          ticketNumber: `TKT-2026-${Math.floor(2000 + Math.random() * 7000)}`,
          vehicleId: `veh-${Date.now()}-${i}`,
          plateNumber: veh.plate,
          ownerName: veh.name,
          ownerPhone: veh.phone,
          vehicleType: veh.type,
          slotId: targetSlot.slotId,
          slotCode: targetSlot.slotCode,
          floorLevel: targetSlot.floorLevel,
          entryTime: timestamp,
          status: 'Parked',
          paymentStatus: 'Pending',
          staffId: 'staff-01',
        };
        newRecordsList.push(rec);
      }
    }

    setSlots(updatedSlots);
    setRecords((prev) => [...newRecordsList, ...prev]);

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Simulated Traffic Batch (${toAdd} Vehicles)`,
      message: `Simulated boom barrier sensors checked in ${toAdd} vehicles concurrently.`,
      timestamp: 'Just now',
      type: 'info',
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const handleOpenExitForRecord = (record?: ParkingRecord) => {
    setPreSelectedExitRecord(record || null);
    setIsExitModalOpen(true);
  };

  const handleOpenEntryForSlot = (slot?: ParkingSlot) => {
    setPreSelectedEntrySlot(slot || null);
    setIsEntryModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0A0F1D] text-slate-100 flex flex-col antialiased">
      <div className="flex flex-1 min-h-screen">
        {/* Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          onOpenAbout={() => setIsAboutModalOpen(true)}
          currentUserRole={currentUserRole}
          occupiedCount={occupiedCount}
          totalSlots={slots.length}
          isOpenMobile={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0A0F1D]">
          {/* Top Bar */}
          <TopBar
            pageTitle={pageTitles[currentTab]}
            sites={SITES}
            selectedSite={selectedSite}
            onSelectSite={setSelectedSite}
            currentUserRole={currentUserRole}
            onToggleUserRole={handleToggleUserRole}
            notifications={notifications}
            onMarkNotificationRead={(id) =>
              setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read: true } : n))
              )
            }
            onOpenEntryModal={() => {
              setPreSelectedEntrySlot(null);
              setIsEntryModalOpen(true);
            }}
            onOpenExitModal={() => handleOpenExitForRecord()}
            onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            onOpenAboutModal={() => setIsAboutModalOpen(true)}
          />

          {/* Sub-Header / Demo Banner */}
          <div className="bg-[#080D1A] border-b border-slate-800/80 px-4 md:px-6 py-1.5 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-lime-400" />
              <span>SmartPark — Vehicle Management System</span>
            </div>
            <div className="flex items-center gap-3 font-mono">
              <span className="hidden sm:inline">System State: Active</span>
              <span className="text-lime-400">Gate Telemetry Online</span>
            </div>
          </div>

          {/* Page Body */}
          <main ref={mainContentRef} className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {currentTab === 'overview' && (
              <OverviewView
                slots={slots}
                records={records}
                payments={payments}
                currentUserRole={currentUserRole}
                onOpenEntryModal={() => {
                  setPreSelectedEntrySlot(null);
                  setIsEntryModalOpen(true);
                }}
                onOpenExitModal={(rec) => handleOpenExitForRecord(rec)}
                onNavigateToTab={(tab) => setCurrentTab(tab as NavTab)}
                onInspectSlot={(slot) => setInspectedSlot(slot)}
              />
            )}

            {currentTab === 'live-parking' && (
              <LiveParkingView
                slots={slots}
                records={records}
                onSelectSlot={(slot) => setInspectedSlot(slot)}
                onOpenEntryForSlot={(slot) => handleOpenEntryForSlot(slot)}
              />
            )}

            {currentTab === 'vehicles' && (
              <VehiclesView
                records={records}
                onOpenExitModal={(rec) => handleOpenExitForRecord(rec)}
              />
            )}

            {currentTab === 'parking-slots' && (
              <ParkingSlotsView
                slots={slots}
                onToggleStatus={handleToggleSlotStatus}
                onAddSlot={handleAddSlot}
                onInspectSlot={(slot) => setInspectedSlot(slot)}
              />
            )}

            {currentTab === 'payments' && (
              <PaymentsView
                payments={payments}
                currentUserRole={currentUserRole}
                onOpenReceipt={(payment) => setActiveReceipt(payment)}
              />
            )}

            {currentTab === 'reports' && (
              <ReportsView
                records={records}
                payments={payments}
                currentUserRole={currentUserRole}
              />
            )}

            {currentTab === 'database-design' && (
              <DatabaseDesignView
                slots={slots}
                records={records}
                payments={payments}
              />
            )}

            {currentTab === 'users-roles' && (
              <UsersRolesView
                currentUserRole={currentUserRole}
                onToggleUserRole={handleToggleUserRole}
              />
            )}

            {currentTab === 'settings' && (
              <SettingsView
                onResetData={handleResetData}
                onGenerateTraffic={handleGenerateTraffic}
              />
            )}
          </main>
        </div>
      </div>

      {/* Global Modals & Drawers */}
      <VehicleEntryModal
        isOpen={isEntryModalOpen}
        onClose={() => setIsEntryModalOpen(false)}
        availableSlots={availableSlots}
        preSelectedSlot={preSelectedEntrySlot}
        onConfirmEntry={handleConfirmEntry}
      />

      <VehicleExitModal
        isOpen={isExitModalOpen}
        onClose={() => setIsExitModalOpen(false)}
        parkedRecords={parkedRecords}
        slots={slots}
        preSelectedRecord={preSelectedExitRecord}
        currentUserRole={currentUserRole}
        onConfirmExit={handleConfirmExit}
      />

      <TicketModal
        record={activeTicket}
        onClose={() => setActiveTicket(null)}
      />

      <ReceiptModal
        payment={activeReceipt}
        onClose={() => setActiveReceipt(null)}
      />

      <SlotDetailsDrawer
        slot={inspectedSlot}
        activeRecord={records.find(
          (r) => r.slotId === inspectedSlot?.slotId && r.status === 'Parked'
        )}
        onClose={() => setInspectedSlot(null)}
        onToggleStatus={handleToggleSlotStatus}
        onOpenExitForRecord={(rec) => handleOpenExitForRecord(rec)}
        onOpenEntryForSlot={(slot) => handleOpenEntryForSlot(slot)}
      />

      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />
    </div>
  );
}
