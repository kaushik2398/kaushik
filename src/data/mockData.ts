import { ParkingSlot, ParkingRecord, Payment, StaffUser, LocationSite, NotificationItem } from '../types';

export const SITES: LocationSite[] = [
  {
    id: 'site-1',
    name: 'Terminal 2 — Central Plaza Deck',
    address: 'Gate 4, Airport Boulevard, North Wing',
    totalCapacity: 36,
    operatingHours: '24/7 Continuous Operation',
  },
  {
    id: 'site-2',
    name: 'Metro Hub — Tower B Basement',
    address: 'Station Square, Rapid Transit Complex',
    totalCapacity: 48,
    operatingHours: '05:00 AM – 01:00 AM',
  },
  {
    id: 'site-3',
    name: 'East Campus Innovation Deck',
    address: 'Research Park Way, Tech Corridor',
    totalCapacity: 30,
    operatingHours: '24/7 Access',
  },
];

// Initial 36 parking slots across 3 levels
export const INITIAL_SLOTS: ParkingSlot[] = [
  // LEVEL 1 (Ground - Fast Access & EV Priority)
  { slotId: 'slot-101', slotCode: 'L1-01', floorLevel: 'Level 1', slotType: 'EV Charging', hourlyRate: 35, status: 'Occupied', currentVehiclePlate: 'MH-12-DE-4412', sensorId: 'SNS-101-L1' },
  { slotId: 'slot-102', slotCode: 'L1-02', floorLevel: 'Level 1', slotType: 'EV Charging', hourlyRate: 35, status: 'Occupied', currentVehiclePlate: 'KA-03-MB-9021', sensorId: 'SNS-102-L1' },
  { slotId: 'slot-103', slotCode: 'L1-03', floorLevel: 'Level 1', slotType: 'EV Charging', hourlyRate: 35, status: 'Available', sensorId: 'SNS-103-L1' },
  { slotId: 'slot-104', slotCode: 'L1-04', floorLevel: 'Level 1', slotType: 'Accessible', hourlyRate: 20, status: 'Occupied', currentVehiclePlate: 'DL-01-AX-3309', sensorId: 'SNS-104-L1' },
  { slotId: 'slot-105', slotCode: 'L1-05', floorLevel: 'Level 1', slotType: 'Accessible', hourlyRate: 20, status: 'Available', sensorId: 'SNS-105-L1' },
  { slotId: 'slot-106', slotCode: 'L1-06', floorLevel: 'Level 1', slotType: 'Standard', hourlyRate: 25, status: 'Occupied', currentVehiclePlate: 'MH-14-GH-7819', sensorId: 'SNS-106-L1' },
  { slotId: 'slot-107', slotCode: 'L1-07', floorLevel: 'Level 1', slotType: 'Standard', hourlyRate: 25, status: 'Occupied', currentVehiclePlate: 'TN-07-CS-1120', sensorId: 'SNS-107-L1' },
  { slotId: 'slot-108', slotCode: 'L1-08', floorLevel: 'Level 1', slotType: 'Standard', hourlyRate: 25, status: 'Available', sensorId: 'SNS-108-L1' },
  { slotId: 'slot-109', slotCode: 'L1-09', floorLevel: 'Level 1', slotType: 'Compact', hourlyRate: 15, status: 'Occupied', currentVehiclePlate: 'KA-05-EX-4921', sensorId: 'SNS-109-L1' },
  { slotId: 'slot-110', slotCode: 'L1-10', floorLevel: 'Level 1', slotType: 'Compact', hourlyRate: 15, status: 'Available', sensorId: 'SNS-110-L1' },
  { slotId: 'slot-111', slotCode: 'L1-11', floorLevel: 'Level 1', slotType: 'VIP', hourlyRate: 50, status: 'Reserved', sensorId: 'SNS-111-L1' },
  { slotId: 'slot-112', slotCode: 'L1-12', floorLevel: 'Level 1', slotType: 'Standard', hourlyRate: 25, status: 'Maintenance', sensorId: 'SNS-112-L1' },

  // LEVEL 2 (Mid - Standard & High Capacity)
  { slotId: 'slot-201', slotCode: 'L2-01', floorLevel: 'Level 2', slotType: 'Standard', hourlyRate: 25, status: 'Occupied', currentVehiclePlate: 'HR-26-BR-9901', sensorId: 'SNS-201-L2' },
  { slotId: 'slot-202', slotCode: 'L2-02', floorLevel: 'Level 2', slotType: 'Standard', hourlyRate: 25, status: 'Occupied', currentVehiclePlate: 'GJ-01-TY-4521', sensorId: 'SNS-202-L2' },
  { slotId: 'slot-203', slotCode: 'L2-03', floorLevel: 'Level 2', slotType: 'Standard', hourlyRate: 25, status: 'Available', sensorId: 'SNS-203-L2' },
  { slotId: 'slot-204', slotCode: 'L2-04', floorLevel: 'Level 2', slotType: 'Standard', hourlyRate: 25, status: 'Available', sensorId: 'SNS-204-L2' },
  { slotId: 'slot-205', slotCode: 'L2-05', floorLevel: 'Level 2', slotType: 'Standard', hourlyRate: 25, status: 'Occupied', currentVehiclePlate: 'UP-32-KN-6743', sensorId: 'SNS-205-L2' },
  { slotId: 'slot-206', slotCode: 'L2-06', floorLevel: 'Level 2', slotType: 'Standard', hourlyRate: 25, status: 'Available', sensorId: 'SNS-206-L2' },
  { slotId: 'slot-207', slotCode: 'L2-07', floorLevel: 'Level 2', slotType: 'Compact', hourlyRate: 15, status: 'Occupied', currentVehiclePlate: 'WB-02-AK-8182', sensorId: 'SNS-207-L2' },
  { slotId: 'slot-208', slotCode: 'L2-08', floorLevel: 'Level 2', slotType: 'Compact', hourlyRate: 15, status: 'Available', sensorId: 'SNS-208-L2' },
  { slotId: 'slot-209', slotCode: 'L2-09', floorLevel: 'Level 2', slotType: 'EV Charging', hourlyRate: 35, status: 'Available', sensorId: 'SNS-209-L2' },
  { slotId: 'slot-210', slotCode: 'L2-10', floorLevel: 'Level 2', slotType: 'EV Charging', hourlyRate: 35, status: 'Occupied', currentVehiclePlate: 'KL-07-ZZ-1004', sensorId: 'SNS-210-L2' },
  { slotId: 'slot-211', slotCode: 'L2-11', floorLevel: 'Level 2', slotType: 'Standard', hourlyRate: 25, status: 'Available', sensorId: 'SNS-211-L2' },
  { slotId: 'slot-212', slotCode: 'L2-12', floorLevel: 'Level 2', slotType: 'Standard', hourlyRate: 25, status: 'Reserved', sensorId: 'SNS-212-L2' },

  // LEVEL 3 (Upper - Long Stay & Executive)
  { slotId: 'slot-301', slotCode: 'L3-01', floorLevel: 'Level 3', slotType: 'VIP', hourlyRate: 50, status: 'Occupied', currentVehiclePlate: 'TS-09-VIP-0007', sensorId: 'SNS-301-L3' },
  { slotId: 'slot-302', slotCode: 'L3-02', floorLevel: 'Level 3', slotType: 'VIP', hourlyRate: 50, status: 'Occupied', currentVehiclePlate: 'MH-01-EE-8899', sensorId: 'SNS-302-L3' },
  { slotId: 'slot-303', slotCode: 'L3-03', floorLevel: 'Level 3', slotType: 'Standard', hourlyRate: 20, status: 'Available', sensorId: 'SNS-303-L3' },
  { slotId: 'slot-304', slotCode: 'L3-04', floorLevel: 'Level 3', slotType: 'Standard', hourlyRate: 20, status: 'Available', sensorId: 'SNS-304-L3' },
  { slotId: 'slot-305', slotCode: 'L3-05', floorLevel: 'Level 3', slotType: 'Standard', hourlyRate: 20, status: 'Available', sensorId: 'SNS-305-L3' },
  { slotId: 'slot-306', slotCode: 'L3-06', floorLevel: 'Level 3', slotType: 'Standard', hourlyRate: 20, status: 'Occupied', currentVehiclePlate: 'DL-03-CC-5122', sensorId: 'SNS-306-L3' },
  { slotId: 'slot-307', slotCode: 'L3-07', floorLevel: 'Level 3', slotType: 'Compact', hourlyRate: 15, status: 'Available', sensorId: 'SNS-307-L3' },
  { slotId: 'slot-308', slotCode: 'L3-08', floorLevel: 'Level 3', slotType: 'Compact', hourlyRate: 15, status: 'Available', sensorId: 'SNS-308-L3' },
  { slotId: 'slot-309', slotCode: 'L3-09', floorLevel: 'Level 3', slotType: 'Accessible', hourlyRate: 20, status: 'Available', sensorId: 'SNS-309-L3' },
  { slotId: 'slot-310', slotCode: 'L3-10', floorLevel: 'Level 3', slotType: 'Standard', hourlyRate: 20, status: 'Maintenance', sensorId: 'SNS-310-L3' },
  { slotId: 'slot-311', slotCode: 'L3-11', floorLevel: 'Level 3', slotType: 'Standard', hourlyRate: 20, status: 'Available', sensorId: 'SNS-311-L3' },
  { slotId: 'slot-312', slotCode: 'L3-12', floorLevel: 'Level 3', slotType: 'Standard', hourlyRate: 20, status: 'Available', sensorId: 'SNS-312-L3' },
];

export const INITIAL_RECORDS: ParkingRecord[] = [
  // Currently parked (active)
  {
    recordId: 'rec-101',
    ticketNumber: 'TKT-2026-1044',
    vehicleId: 'veh-101',
    plateNumber: 'MH-12-DE-4412',
    ownerName: 'Vikramaditya Rao',
    ownerPhone: '+91 98230 45812',
    vehicleType: 'EV',
    slotId: 'slot-101',
    slotCode: 'L1-01',
    floorLevel: 'Level 1',
    entryTime: '2026-10-08 05:22:10',
    status: 'Parked',
    paymentStatus: 'Pending',
    staffId: 'staff-01',
  },
  {
    recordId: 'rec-102',
    ticketNumber: 'TKT-2026-1045',
    vehicleId: 'veh-102',
    plateNumber: 'KA-03-MB-9021',
    ownerName: 'Ananya Sharma',
    ownerPhone: '+91 97401 23908',
    vehicleType: 'EV',
    slotId: 'slot-102',
    slotCode: 'L1-02',
    floorLevel: 'Level 1',
    entryTime: '2026-10-08 05:40:15',
    status: 'Parked',
    paymentStatus: 'Pending',
    staffId: 'staff-01',
  },
  {
    recordId: 'rec-103',
    ticketNumber: 'TKT-2026-1048',
    vehicleId: 'veh-103',
    plateNumber: 'DL-01-AX-3309',
    ownerName: 'Harpreet Singh',
    ownerPhone: '+91 98112 77412',
    vehicleType: 'Sedan',
    slotId: 'slot-104',
    slotCode: 'L1-04',
    floorLevel: 'Level 1',
    entryTime: '2026-10-08 06:12:00',
    status: 'Parked',
    paymentStatus: 'Pending',
    staffId: 'staff-02',
  },
  {
    recordId: 'rec-104',
    ticketNumber: 'TKT-2026-1051',
    vehicleId: 'veh-104',
    plateNumber: 'MH-14-GH-7819',
    ownerName: 'Pooja Kulkarni',
    ownerPhone: '+91 99224 81920',
    vehicleType: 'SUV',
    slotId: 'slot-106',
    slotCode: 'L1-06',
    floorLevel: 'Level 1',
    entryTime: '2026-10-08 06:35:40',
    status: 'Parked',
    paymentStatus: 'Pending',
    staffId: 'staff-02',
  },
  {
    recordId: 'rec-105',
    ticketNumber: 'TKT-2026-1055',
    vehicleId: 'veh-105',
    plateNumber: 'TN-07-CS-1120',
    ownerName: 'Karthik Ramanathan',
    ownerPhone: '+91 94441 62890',
    vehicleType: 'Sedan',
    slotId: 'slot-107',
    slotCode: 'L1-07',
    floorLevel: 'Level 1',
    entryTime: '2026-10-08 06:48:22',
    status: 'Parked',
    paymentStatus: 'Pending',
    staffId: 'staff-01',
  },
  {
    recordId: 'rec-106',
    ticketNumber: 'TKT-2026-1059',
    vehicleId: 'veh-106',
    plateNumber: 'KA-05-EX-4921',
    ownerName: 'Deepak Varma',
    ownerPhone: '+91 98862 33145',
    vehicleType: 'Motorcycle',
    slotId: 'slot-109',
    slotCode: 'L1-09',
    floorLevel: 'Level 1',
    entryTime: '2026-10-08 07:01:10',
    status: 'Parked',
    paymentStatus: 'Pending',
    staffId: 'staff-02',
  },
  {
    recordId: 'rec-107',
    ticketNumber: 'TKT-2026-1062',
    vehicleId: 'veh-107',
    plateNumber: 'HR-26-BR-9901',
    ownerName: 'Rohan Mehra',
    ownerPhone: '+91 98180 54109',
    vehicleType: 'SUV',
    slotId: 'slot-201',
    slotCode: 'L2-01',
    floorLevel: 'Level 2',
    entryTime: '2026-10-08 04:15:00',
    status: 'Parked',
    paymentStatus: 'Pending',
    staffId: 'staff-01',
  },
  {
    recordId: 'rec-108',
    ticketNumber: 'TKT-2026-1066',
    vehicleId: 'veh-108',
    plateNumber: 'GJ-01-TY-4521',
    ownerName: 'Bhavin Patel',
    ownerPhone: '+91 98250 19844',
    vehicleType: 'Sedan',
    slotId: 'slot-202',
    slotCode: 'L2-02',
    floorLevel: 'Level 2',
    entryTime: '2026-10-08 04:55:18',
    status: 'Parked',
    paymentStatus: 'Pending',
    staffId: 'staff-01',
  },
  {
    recordId: 'rec-109',
    ticketNumber: 'TKT-2026-1070',
    vehicleId: 'veh-109',
    plateNumber: 'UP-32-KN-6743',
    ownerName: 'Alok Srivastava',
    ownerPhone: '+91 94150 78201',
    vehicleType: 'Sedan',
    slotId: 'slot-205',
    slotCode: 'L2-05',
    floorLevel: 'Level 2',
    entryTime: '2026-10-08 05:10:33',
    status: 'Parked',
    paymentStatus: 'Pending',
    staffId: 'staff-01',
  },
  {
    recordId: 'rec-110',
    ticketNumber: 'TKT-2026-1073',
    vehicleId: 'veh-110',
    plateNumber: 'WB-02-AK-8182',
    ownerName: 'Debarati Roy',
    ownerPhone: '+91 98300 23491',
    vehicleType: 'Motorcycle',
    slotId: 'slot-207',
    slotCode: 'L2-07',
    floorLevel: 'Level 2',
    entryTime: '2026-10-08 05:45:00',
    status: 'Parked',
    paymentStatus: 'Pending',
    staffId: 'staff-02',
  },
  {
    recordId: 'rec-111',
    ticketNumber: 'TKT-2026-1078',
    vehicleId: 'veh-111',
    plateNumber: 'KL-07-ZZ-1004',
    ownerName: 'Mathew Thomas',
    ownerPhone: '+91 94470 51922',
    vehicleType: 'EV',
    slotId: 'slot-210',
    slotCode: 'L2-10',
    floorLevel: 'Level 2',
    entryTime: '2026-10-08 06:15:10',
    status: 'Parked',
    paymentStatus: 'Pending',
    staffId: 'staff-01',
  },
  {
    recordId: 'rec-112',
    ticketNumber: 'TKT-2026-1081',
    vehicleId: 'veh-112',
    plateNumber: 'TS-09-VIP-0007',
    ownerName: 'Dr. Srinivas Reddy',
    ownerPhone: '+91 98490 66321',
    vehicleType: 'Sedan',
    slotId: 'slot-301',
    slotCode: 'L3-01',
    floorLevel: 'Level 3',
    entryTime: '2026-10-08 03:30:00',
    status: 'Parked',
    paymentStatus: 'Pending',
    staffId: 'staff-01',
  },
  {
    recordId: 'rec-113',
    ticketNumber: 'TKT-2026-1085',
    vehicleId: 'veh-113',
    plateNumber: 'MH-01-EE-8899',
    ownerName: 'Farhan Contractor',
    ownerPhone: '+91 98200 44102',
    vehicleType: 'SUV',
    slotId: 'slot-302',
    slotCode: 'L3-02',
    floorLevel: 'Level 3',
    entryTime: '2026-10-08 04:00:25',
    status: 'Parked',
    paymentStatus: 'Pending',
    staffId: 'staff-02',
  },
  {
    recordId: 'rec-114',
    ticketNumber: 'TKT-2026-1089',
    vehicleId: 'veh-114',
    plateNumber: 'DL-03-CC-5122',
    ownerName: 'Simran Bajaj',
    ownerPhone: '+91 98711 02938',
    vehicleType: 'Sedan',
    slotId: 'slot-306',
    slotCode: 'L3-06',
    floorLevel: 'Level 3',
    entryTime: '2026-10-08 05:15:12',
    status: 'Parked',
    paymentStatus: 'Pending',
    staffId: 'staff-01',
  },

  // Completed & Exited Records (Historical)
  {
    recordId: 'rec-091',
    ticketNumber: 'TKT-2026-1031',
    vehicleId: 'veh-091',
    plateNumber: 'MH-02-CD-1234',
    ownerName: 'Rajesh Nair',
    ownerPhone: '+91 98210 55432',
    vehicleType: 'Sedan',
    slotId: 'slot-108',
    slotCode: 'L1-08',
    floorLevel: 'Level 1',
    entryTime: '2026-10-08 01:10:00',
    exitTime: '2026-10-08 04:30:00',
    durationMinutes: 200,
    totalFee: 100,
    status: 'Completed',
    paymentId: 'pay-2026-001',
    paymentStatus: 'Paid',
    staffId: 'staff-01',
  },
  {
    recordId: 'rec-092',
    ticketNumber: 'TKT-2026-1033',
    vehicleId: 'veh-092',
    plateNumber: 'KA-01-HG-9011',
    ownerName: 'Sanjay Hegde',
    ownerPhone: '+91 98450 11923',
    vehicleType: 'SUV',
    slotId: 'slot-203',
    slotCode: 'L2-03',
    floorLevel: 'Level 2',
    entryTime: '2026-10-08 02:00:15',
    exitTime: '2026-10-08 05:15:00',
    durationMinutes: 195,
    totalFee: 125,
    status: 'Completed',
    paymentId: 'pay-2026-002',
    paymentStatus: 'Paid',
    staffId: 'staff-01',
  },
  {
    recordId: 'rec-093',
    ticketNumber: 'TKT-2026-1035',
    vehicleId: 'veh-093',
    plateNumber: 'DL-08-KL-7721',
    ownerName: 'Amit Chopra',
    ownerPhone: '+91 98100 90281',
    vehicleType: 'EV',
    slotId: 'slot-103',
    slotCode: 'L1-03',
    floorLevel: 'Level 1',
    entryTime: '2026-10-08 02:30:00',
    exitTime: '2026-10-08 06:00:00',
    durationMinutes: 210,
    totalFee: 140,
    status: 'Completed',
    paymentId: 'pay-2026-003',
    paymentStatus: 'Paid',
    staffId: 'staff-02',
  },
  {
    recordId: 'rec-094',
    ticketNumber: 'TKT-2026-1038',
    vehicleId: 'veh-094',
    plateNumber: 'TN-09-RT-3419',
    ownerName: 'Meenakshi Sundaram',
    ownerPhone: '+91 94440 22391',
    vehicleType: 'Motorcycle',
    slotId: 'slot-110',
    slotCode: 'L1-10',
    floorLevel: 'Level 1',
    entryTime: '2026-10-08 03:00:00',
    exitTime: '2026-10-08 05:30:00',
    durationMinutes: 150,
    totalFee: 45,
    status: 'Completed',
    paymentId: 'pay-2026-004',
    paymentStatus: 'Paid',
    staffId: 'staff-02',
  },
  {
    recordId: 'rec-095',
    ticketNumber: 'TKT-2026-1040',
    vehicleId: 'veh-095',
    plateNumber: 'GJ-06-WE-6060',
    ownerName: 'Kinjal Joshi',
    ownerPhone: '+91 98240 77123',
    vehicleType: 'Sedan',
    slotId: 'slot-303',
    slotCode: 'L3-03',
    floorLevel: 'Level 3',
    entryTime: '2026-10-07 22:00:00',
    exitTime: '2026-10-08 04:00:00',
    durationMinutes: 360,
    totalFee: 180,
    status: 'Completed',
    paymentId: 'pay-2026-005',
    paymentStatus: 'Paid',
    staffId: 'staff-01',
  },
];

export const INITIAL_PAYMENTS: Payment[] = [
  {
    paymentId: 'pay-2026-001',
    recordId: 'rec-091',
    ticketNumber: 'TKT-2026-1031',
    plateNumber: 'MH-02-CD-1234',
    amount: 100,
    paymentMethod: 'Fastag / RFID',
    paymentStatus: 'Paid',
    transactionReference: 'FTG-984102941-TXN',
    paymentTime: '2026-10-08 04:30:12',
    staffName: 'Sujit Dohale (Gate 1)',
  },
  {
    paymentId: 'pay-2026-002',
    recordId: 'rec-092',
    ticketNumber: 'TKT-2026-1033',
    plateNumber: 'KA-01-HG-9011',
    amount: 125,
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    transactionReference: 'CC-VISA-8829-AUTH',
    paymentTime: '2026-10-08 05:15:20',
    staffName: 'Sujit Dohale (Gate 1)',
  },
  {
    paymentId: 'pay-2026-003',
    recordId: 'rec-093',
    ticketNumber: 'TKT-2026-1035',
    plateNumber: 'DL-08-KL-7721',
    amount: 140,
    paymentMethod: 'UPI / QR',
    paymentStatus: 'Paid',
    transactionReference: 'UPI-29481903421@icici',
    paymentTime: '2026-10-08 06:00:45',
    staffName: 'Sujit Dohale (Gate 2)',
  },
  {
    paymentId: 'pay-2026-004',
    recordId: 'rec-094',
    ticketNumber: 'TKT-2026-1038',
    plateNumber: 'TN-09-RT-3419',
    amount: 45,
    paymentMethod: 'Cash',
    paymentStatus: 'Paid',
    transactionReference: 'CSH-RECEIPT-4091',
    paymentTime: '2026-10-08 05:30:05',
    staffName: 'Sujit Dohale (Gate 2)',
  },
  {
    paymentId: 'pay-2026-005',
    recordId: 'rec-095',
    ticketNumber: 'TKT-2026-1040',
    plateNumber: 'GJ-06-WE-6060',
    amount: 180,
    paymentMethod: 'Fastag / RFID',
    paymentStatus: 'Paid',
    transactionReference: 'FTG-881203991-TXN',
    paymentTime: '2026-10-08 04:00:32',
    staffName: 'Sujit Dohale (Gate 1)',
  },
];

export const INITIAL_STAFF: StaffUser[] = [
  {
    staffId: 'staff-admin',
    username: 'kaushik.nigde',
    fullName: 'Kaushik Nigde',
    role: 'System Admin',
    shift: 'General (09:00 - 18:00)',
    assignedGate: 'Central Control Hub',
    isActive: true,
  },
  {
    staffId: 'staff-01',
    username: 'sujit.dohale',
    fullName: 'Sujit Dohale',
    role: 'Parking Staff',
    shift: 'Morning (06:00 - 14:00)',
    assignedGate: 'Entry/Exit Gate 1',
    isActive: true,
  },
  {
    staffId: 'staff-02',
    username: 'sujit.dohale2',
    fullName: 'Sujit Dohale',
    role: 'Parking Staff',
    shift: 'Evening (14:00 - 22:00)',
    assignedGate: 'Entry/Exit Gate 2',
    isActive: true,
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Slot L1-01 Auto-Allocated',
    message: 'Vehicle MH-12-DE-4412 assigned to EV Charging bay by automatic allocation rule.',
    timestamp: '15 mins ago',
    type: 'success',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'Slot L3-10 Flagged for Sensor Check',
    message: 'Maintenance state toggled for slot L3-10 ultrasonic telemetry verification.',
    timestamp: '42 mins ago',
    type: 'warning',
    read: false,
  },
  {
    id: 'notif-3',
    title: 'Automated Snapshot Checkpoint Completed',
    message: 'System checkpoint completed and verified record integrity across all bays.',
    timestamp: '2 hours ago',
    type: 'info',
    read: true,
  },
];

export const SQL_EXAMPLES = [
  {
    id: 'alloc',
    title: '01. Concurrency-Safe Slot Allocation',
    description: 'Selects the closest available slot for vehicle type and locks row to prevent race conditions.',
    code: `-- Finds the nearest available slot matching vehicle requirements with row lock
BEGIN TRANSACTION;

SELECT slot_id, slot_code, hourly_rate
FROM parking_slots
WHERE status = 'Available'
  AND floor_level = 'Level 1'
  AND (slot_type = 'EV Charging' OR slot_type = 'Standard')
ORDER BY slot_id ASC
LIMIT 1
FOR UPDATE SKIP LOCKED;

-- Atomically reserve the slot and insert parking record
UPDATE parking_slots
SET status = 'Occupied',
    current_vehicle_plate = 'MH-12-DE-4412'
WHERE slot_id = 'slot-101';

INSERT INTO parking_records (
    record_id, ticket_number, vehicle_id, slot_id, 
    entry_time, status, staff_id
) VALUES (
    'rec-101', 'TKT-2026-1044', 'veh-101', 'slot-101', 
    NOW(), 'Parked', 'staff-01'
);

COMMIT;`,
  },
  {
    id: 'fee',
    title: '02. Dynamic Parking Fee Calculation Function',
    description: 'Computes billable fee based on ceiling hours, base slot rate, and vehicle type multipliers.',
    code: `CREATE OR REPLACE FUNCTION calculate_parking_fee(
    p_record_id VARCHAR(50),
    p_exit_time TIMESTAMP
) RETURNS DECIMAL(10, 2) AS $$
DECLARE
    v_entry_time TIMESTAMP;
    v_hourly_rate DECIMAL(10, 2);
    v_vehicle_type VARCHAR(20);
    v_duration_mins INT;
    v_billable_hours INT;
    v_type_multiplier DECIMAL(3, 2) := 1.0;
    v_total_fee DECIMAL(10, 2);
BEGIN
    -- Query entry time, slot base rate, and vehicle type in single joined query
    SELECT pr.entry_time, ps.hourly_rate, v.vehicle_type
    INTO v_entry_time, v_hourly_rate, v_vehicle_type
    FROM parking_records pr
    JOIN parking_slots ps ON pr.slot_id = ps.slot_id
    JOIN vehicles v ON pr.vehicle_id = v.vehicle_id
    WHERE pr.record_id = p_record_id;

    -- Calculate duration in minutes
    v_duration_mins := EXTRACT(EPOCH FROM (p_exit_time - v_entry_time)) / 60;

    -- 15-minute free grace period
    IF v_duration_mins <= 15 THEN
        RETURN 0.00;
    END IF;

    -- Ceiling hours (any partial hour counts as 1 full billable hour)
    v_billable_hours := CEIL(v_duration_mins / 60.0);

    -- Apply vehicle category multipliers
    IF v_vehicle_type = 'SUV' THEN
        v_type_multiplier := 1.25;
    ELSIF v_vehicle_type = 'EV' THEN
        v_type_multiplier := 1.10; -- Includes base charging buffer
    ELSIF v_vehicle_type = 'Motorcycle' THEN
        v_type_multiplier := 0.60;
    END IF;

    v_total_fee := (v_billable_hours * v_hourly_rate) * v_type_multiplier;
    RETURN ROUND(v_total_fee, 2);
END;
$$ LANGUAGE plpgsql;`,
  },
  {
    id: 'trigger',
    title: '03. Automated Slot-Status Triggers',
    description: 'Triggers that immediately update parking slot status when a vehicle enters or exits.',
    code: `-- Trigger on vehicle exit to automatically free up slot
CREATE OR REPLACE FUNCTION trg_on_vehicle_exit_free_slot()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'Completed' AND OLD.status = 'Parked' THEN
        UPDATE parking_slots
        SET status = 'Available',
            current_vehicle_plate = NULL
        WHERE slot_id = NEW.slot_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_parking_record_exit
AFTER UPDATE OF status, exit_time ON parking_records
FOR EACH ROW
WHEN (NEW.status = 'Completed')
EXECUTE FUNCTION trg_on_vehicle_exit_free_slot();`,
  },
];
