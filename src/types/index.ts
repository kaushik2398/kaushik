export type VehicleType = 'Sedan' | 'SUV' | 'EV' | 'Motorcycle' | 'Van';

export type SlotStatus = 'Available' | 'Occupied' | 'Reserved' | 'Maintenance';

export type SlotType = 'Standard' | 'EV Charging' | 'Accessible' | 'Compact' | 'VIP';

export type RecordStatus = 'Parked' | 'Completed' | 'Cancelled';

export type PaymentMethod = 'Fastag / RFID' | 'Credit Card' | 'UPI / QR' | 'Cash';

export type PaymentStatus = 'Paid' | 'Pending' | 'Waived';

export type UserRole = 'System Admin' | 'Parking Staff';

export interface Owner {
  ownerId: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  createdAt: string;
}

export interface Vehicle {
  vehicleId: string;
  plateNumber: string;
  vehicleType: VehicleType;
  makeModel: string;
  color: string;
  ownerId: string;
  registeredDate: string;
}

export interface ParkingSlot {
  slotId: string;
  slotCode: string; // e.g. "L1-01", "L2-14"
  floorLevel: 'Level 1' | 'Level 2' | 'Level 3';
  slotType: SlotType;
  hourlyRate: number;
  status: SlotStatus;
  currentVehiclePlate?: string;
  sensorId: string;
}

export interface ParkingRecord {
  recordId: string;
  ticketNumber: string;
  vehicleId: string;
  plateNumber: string;
  ownerName: string;
  ownerPhone: string;
  vehicleType: VehicleType;
  slotId: string;
  slotCode: string;
  floorLevel: string;
  entryTime: string;
  exitTime?: string;
  durationMinutes?: number;
  totalFee?: number;
  status: RecordStatus;
  paymentId?: string;
  paymentStatus: PaymentStatus;
  staffId: string;
}

export interface Payment {
  paymentId: string;
  recordId: string;
  ticketNumber: string;
  plateNumber: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionReference: string;
  paymentTime: string;
  staffName: string;
}

export interface StaffUser {
  staffId: string;
  username: string;
  fullName: string;
  role: UserRole;
  shift: string;
  assignedGate: string;
  isActive: boolean;
  avatarUrl?: string;
}

export interface LocationSite {
  id: string;
  name: string;
  address: string;
  totalCapacity: number;
  operatingHours: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'warning' | 'success';
  read: boolean;
}
