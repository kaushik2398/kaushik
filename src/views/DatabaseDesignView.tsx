import React, { useState } from 'react';
import {
  Database,
  Layers,
  Key,
  Link,
  Code2,
  CheckCircle2,
  Copy,
  Check,
  ShieldAlert,
  ArrowRight,
  GitBranch,
  Table as TableIcon,
  Sparkles,
} from 'lucide-react';
import { SQL_EXAMPLES, INITIAL_SLOTS, INITIAL_RECORDS, INITIAL_PAYMENTS } from '../data/mockData';
import { ParkingSlot, ParkingRecord, Payment } from '../types';

interface DatabaseDesignViewProps {
  slots?: ParkingSlot[];
  records?: ParkingRecord[];
  payments?: Payment[];
  initialTab?: 'er' | '3nf' | 'sql' | 'ddl';
}

export const DatabaseDesignView: React.FC<DatabaseDesignViewProps> = ({
  slots = INITIAL_SLOTS,
  records = INITIAL_RECORDS,
  payments = INITIAL_PAYMENTS,
  initialTab = 'er',
}) => {
  const [activeTab, setActiveTab] = useState<'er' | '3nf' | 'sql' | 'ddl'>(initialTab);
  const [selectedEntity, setSelectedEntity] = useState<string>('ParkingRecord');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Schema definitions
  const entities = [
    {
      name: 'Owner',
      tableName: 'owners',
      desc: 'Stores vehicle owner identity and contact details independently of vehicle registrations.',
      pk: 'owner_id (VARCHAR)',
      attributes: [
        { name: 'owner_id', type: 'VARCHAR(36)', isPk: true, isFk: false, desc: 'Primary Key uniquely identifying citizen/driver' },
        { name: 'full_name', type: 'VARCHAR(100)', isPk: false, isFk: false, desc: 'Full legal name' },
        { name: 'phone_number', type: 'VARCHAR(20)', isPk: false, isFk: false, desc: 'Contact mobile number with country code' },
        { name: 'email', type: 'VARCHAR(100)', isPk: false, isFk: false, desc: 'Email address for digital ticket notifications' },
        { name: 'created_at', type: 'TIMESTAMP', isPk: false, isFk: false, desc: 'Registration timestamp' },
      ],
      relations: [
        { target: 'Vehicle', cardinality: '1 : N', desc: 'One owner can register one or multiple vehicles.' },
      ],
    },
    {
      name: 'Vehicle',
      tableName: 'vehicles',
      desc: 'Stores physical vehicle attributes without repeating owner addresses or parking sessions.',
      pk: 'vehicle_id (VARCHAR)',
      attributes: [
        { name: 'vehicle_id', type: 'VARCHAR(36)', isPk: true, isFk: false, desc: 'Primary Key internal identifier' },
        { name: 'plate_number', type: 'VARCHAR(20)', isPk: false, isFk: false, desc: 'Unique vehicle registration mark (UK/India/US standard)' },
        { name: 'vehicle_type', type: 'VARCHAR(20)', isPk: false, isFk: false, desc: 'ENUM: Sedan, SUV, EV, Motorcycle, Van' },
        { name: 'color', type: 'VARCHAR(30)', isPk: false, isFk: false, desc: 'Vehicle exterior color' },
        { name: 'owner_id', type: 'VARCHAR(36)', isPk: false, isFk: true, desc: 'Foreign Key linking to owners.owner_id' },
      ],
      relations: [
        { target: 'Owner', cardinality: 'N : 1', desc: 'Belongs to exactly one registered owner.' },
        { target: 'ParkingRecord', cardinality: '1 : N', desc: 'Can enter parking deck multiple times across history.' },
      ],
    },
    {
      name: 'ParkingSlot',
      tableName: 'parking_slots',
      desc: 'Defines the structural parking bays, location coordinates, and tariff properties.',
      pk: 'slot_id (VARCHAR)',
      attributes: [
        { name: 'slot_id', type: 'VARCHAR(36)', isPk: true, isFk: false, desc: 'Primary Key unique bay identifier' },
        { name: 'slot_code', type: 'VARCHAR(10)', isPk: false, isFk: false, desc: 'Physical sign code (e.g. L1-01, L2-05)' },
        { name: 'floor_level', type: 'VARCHAR(20)', isPk: false, isFk: false, desc: 'Floor identifier: Level 1, Level 2, Level 3' },
        { name: 'slot_type', type: 'VARCHAR(20)', isPk: false, isFk: false, desc: 'Standard, EV Charging, Accessible, Compact, VIP' },
        { name: 'hourly_rate', type: 'DECIMAL(6,2)', isPk: false, isFk: false, desc: 'Base fee per billable hour' },
        { name: 'status', type: 'VARCHAR(20)', isPk: false, isFk: false, desc: 'CHECK: Available, Occupied, Reserved, Maintenance' },
        { name: 'sensor_id', type: 'VARCHAR(30)', isPk: false, isFk: false, desc: 'Ultrasonic floor sensor telemetry ID' },
      ],
      relations: [
        { target: 'ParkingRecord', cardinality: '1 : N', desc: 'A slot accommodates multiple vehicle parking sessions over time.' },
      ],
    },
    {
      name: 'ParkingRecord',
      tableName: 'parking_records',
      desc: 'Core transaction fact table recording each vehicle stay session from entry boom barrier to exit.',
      pk: 'record_id (VARCHAR)',
      attributes: [
        { name: 'record_id', type: 'VARCHAR(36)', isPk: true, isFk: false, desc: 'Primary Key of parking session' },
        { name: 'ticket_number', type: 'VARCHAR(30)', isPk: false, isFk: false, desc: 'Barcode / QR readable ticket token' },
        { name: 'vehicle_id', type: 'VARCHAR(36)', isPk: false, isFk: true, desc: 'Foreign Key linking to vehicles.vehicle_id' },
        { name: 'slot_id', type: 'VARCHAR(36)', isPk: false, isFk: true, desc: 'Foreign Key linking to parking_slots.slot_id' },
        { name: 'staff_id', type: 'VARCHAR(36)', isPk: false, isFk: true, desc: 'Foreign Key linking to staff_users.staff_id' },
        { name: 'entry_time', type: 'TIMESTAMP', isPk: false, isFk: false, desc: 'Gate barrier opening timestamp' },
        { name: 'exit_time', type: 'TIMESTAMP', isPk: false, isFk: false, desc: 'Exit gate barrier timestamp (NULL while parked)' },
        { name: 'duration_minutes', type: 'INT', isPk: false, isFk: false, desc: 'Total elapsed minutes' },
        { name: 'total_fee', type: 'DECIMAL(8,2)', isPk: false, isFk: false, desc: 'Calculated parking fee' },
        { name: 'status', type: 'VARCHAR(20)', isPk: false, isFk: false, desc: 'Parked, Completed, Cancelled' },
      ],
      relations: [
        { target: 'Vehicle', cardinality: 'N : 1', desc: 'Each record belongs to one specific vehicle.' },
        { target: 'ParkingSlot', cardinality: 'N : 1', desc: 'Allocated to one specific parking bay.' },
        { target: 'Payment', cardinality: '1 : 1', desc: 'A completed parking record generates exactly one payment settlement.' },
      ],
    },
    {
      name: 'Payment',
      tableName: 'payments',
      desc: 'Stores fiscal transaction receipts and payment channel references.',
      pk: 'payment_id (VARCHAR)',
      attributes: [
        { name: 'payment_id', type: 'VARCHAR(36)', isPk: true, isFk: false, desc: 'Primary Key fiscal settlement ID' },
        { name: 'record_id', type: 'VARCHAR(36)', isPk: false, isFk: true, desc: 'Foreign Key linking to parking_records.record_id' },
        { name: 'amount', type: 'DECIMAL(8,2)', isPk: false, isFk: false, desc: 'Monetary amount collected' },
        { name: 'payment_method', type: 'VARCHAR(30)', isPk: false, isFk: false, desc: 'Fastag / RFID, Credit Card, UPI / QR, Cash' },
        { name: 'payment_status', type: 'VARCHAR(20)', isPk: false, isFk: false, desc: 'Paid, Pending, Waived' },
        { name: 'transaction_reference', type: 'VARCHAR(80)', isPk: false, isFk: false, desc: 'External bank / gateway authorization token' },
        { name: 'payment_time', type: 'TIMESTAMP', isPk: false, isFk: false, desc: 'Fiscal confirmation timestamp' },
      ],
      relations: [
        { target: 'ParkingRecord', cardinality: '1 : 1', desc: 'Settles one completed parking session.' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0D1527] border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-lime-400" />
              <span className="text-xs font-mono uppercase text-lime-400 font-semibold">
                DBMS Architectural Showcase
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Relational Schema & 3NF Normalization
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Explore the Entity-Relationship (ER) model, mathematical 3NF proof, schema design, and illustrative database routines.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap items-center p-1 bg-slate-900 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('er')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'er'
                  ? 'bg-lime-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ER Diagram
            </button>
            <button
              onClick={() => setActiveTab('3nf')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === '3nf'
                  ? 'bg-lime-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              3NF Proof
            </button>
            <button
              onClick={() => setActiveTab('sql')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'sql'
                  ? 'bg-lime-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              SQL Routines
            </button>
            <button
              onClick={() => setActiveTab('ddl')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'ddl'
                  ? 'bg-lime-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              DDL Script
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Interactive ER Diagram */}
      {activeTab === 'er' && (
        <div className="space-y-6">
          {/* Visual Entity-Relationship Diagram Map */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#0D1527] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-base text-white">
                  Entity-Relationship (ER) Schema Model
                </h3>
                <p className="text-xs text-slate-400">
                  Click any entity box below to inspect its primary keys, foreign keys, and referential constraints.
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-lime-400/10 text-lime-400 border border-lime-400/20">
                Core Entity Model
              </span>
            </div>

            {/* Entity Visual Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
              {entities.map((ent) => {
                const isSelected = selectedEntity === ent.name;
                return (
                  <button
                    key={ent.name}
                    onClick={() => setSelectedEntity(ent.name)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-lime-400/10 border-lime-400 shadow-md shadow-lime-400/10'
                        : 'bg-slate-900/80 border-slate-750 hover:bg-slate-850 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <TableIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-lime-400' : 'text-slate-400'}`} />
                        <span className="font-bold text-xs text-white">{ent.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{ent.attributes.length} cols</span>
                    </div>

                    <div className="font-mono text-[10px] text-lime-400 truncate">
                      PK: {ent.pk}
                    </div>

                    <div className="text-[11px] text-slate-400 mt-2 line-clamp-2">
                      {ent.desc}
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                      <span>Table: {ent.tableName}</span>
                      <span className="text-lime-400">Inspect &rarr;</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Cardinality Relationships Summary Diagram */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
              <div className="font-semibold text-slate-200 flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-lime-400" />
                <span>Relationship Cardinalities & Foreign Key Mappings</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="font-mono font-bold text-lime-400">Owner (1) &mdash; (N) Vehicle</div>
                  <p className="text-[11px] text-slate-400 mt-1">Links vehicle to owner record</p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="font-mono font-bold text-lime-400">Vehicle (1) &mdash; (N) Record</div>
                  <p className="text-[11px] text-slate-400 mt-1">Links parking entry to registered vehicle</p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="font-mono font-bold text-lime-400">Slot (1) &mdash; (N) Record</div>
                  <p className="text-[11px] text-slate-400 mt-1">Links parking session to allocated bay</p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="font-mono font-bold text-lime-400">Record (1) &mdash; (1) Payment</div>
                  <p className="text-[11px] text-slate-400 mt-1">Settles completed session with payment</p>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Entity Inspector */}
          {(() => {
            const ent = entities.find((e) => e.name === selectedEntity) || entities[0];
            return (
              <div className="p-5 sm:p-6 rounded-2xl bg-[#0D1527] border border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                      <TableIcon className="w-4 h-4 text-lime-400" />
                      <span>Table: <code className="text-lime-300 font-mono">{ent.tableName}</code> ({ent.name})</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{ent.desc}</p>
                  </div>
                  <span className="font-mono text-xs text-lime-400 bg-lime-400/10 px-2 py-1 rounded border border-lime-400/20">
                    Primary Key: {ent.pk}
                  </span>
                </div>

                {/* Attributes Table */}
                <div className="overflow-x-auto rounded-lg border border-slate-800">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                        <th className="py-2.5 px-4 font-semibold">Column Name</th>
                        <th className="py-2.5 px-4 font-semibold">Data Type</th>
                        <th className="py-2.5 px-4 font-semibold">Key Role</th>
                        <th className="py-2.5 px-4 font-semibold">Description & Constraints</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {ent.attributes.map((attr) => (
                        <tr key={attr.name} className="hover:bg-slate-850/40">
                          <td className="py-2.5 px-4 font-bold text-white">
                            {attr.name}
                          </td>
                          <td className="py-2.5 px-4 text-lime-400">
                            {attr.type}
                          </td>
                          <td className="py-2.5 px-4 font-sans">
                            {attr.isPk ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-lime-400 bg-lime-400/10 px-2 py-0.5 rounded border border-lime-400/20">
                                <Key className="w-3 h-3" /> PK
                              </span>
                            ) : attr.isFk ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-400 bg-sky-400/10 px-2 py-0.5 rounded border border-sky-400/20">
                                <Link className="w-3 h-3" /> FK
                              </span>
                            ) : (
                              <span className="text-[11px] text-slate-400">&mdash;</span>
                            )}
                          </td>
                          <td className="py-2.5 px-4 font-sans text-slate-300">
                            {attr.desc}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Tab 2: 3NF Normalization Proof & Anomaly Prevention */}
      {activeTab === '3nf' && (
        <div className="space-y-6">
          <div className="p-5 sm:p-6 rounded-2xl bg-[#0D1527] border border-slate-800 space-y-4">
            <h3 className="font-display font-bold text-lg text-white">
              Database Normalization to 3rd Normal Form (3NF)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              In naive parking systems, developers frequently store driver contact details, vehicle specifications, and slot rates 
              inside a single flat spreadsheet or single parking ticket table. SmartPark decomposes this design into 3NF, 
              guaranteeing data integrity and preventing anomalous states.
            </p>

            {/* The 3 Steps of Normalization */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">1st Normal Form (1NF)</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-lime-400/10 text-lime-400">
                    Atomic Attributes
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Every column contains only atomic (indivisible) values. Multiple phone numbers or repeating arrays of parked vehicles 
                  are moved to separate rows. Every table enforces a unique primary key.
                </p>
                <div className="text-[10px] font-mono text-lime-400 pt-1">
                  &check; No repeating groups · Atomic columns
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">2nd Normal Form (2NF)</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-lime-400/10 text-lime-400">
                    No Partial Dependencies
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  In 1NF, every non-key column must depend fully on the primary key, not just a subset of a composite key. 
                  Slot tariff rules are decoupled from session timestamps.
                </p>
                <div className="text-[10px] font-mono text-lime-400 pt-1">
                  &check; Full functional dependency on Candidate Key
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">3rd Normal Form (3NF)</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-lime-400/10 text-lime-400">
                    No Transitive Dependencies
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Non-key attributes must never depend on other non-key attributes ($X \to Y \to Z$). 
                  For example: <code className="text-slate-300">record_id &rarr; vehicle_id &rarr; owner_phone</code>. 
                  Driver details are separated into <code className="text-slate-300">owners</code> so changing a phone number touches exactly 1 row.
                </p>
                <div className="text-[10px] font-mono text-lime-400 pt-1">
                  &check; Zero transitive dependencies
                </div>
              </div>
            </div>

            {/* Anomaly Analysis Matrix */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <h4 className="font-semibold text-sm text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>How 3NF Prevents Database Anomalies</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {/* Insertion Anomaly */}
                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5">
                  <span className="font-bold text-amber-300 text-xs">1. Insertion Anomaly</span>
                  <p className="text-slate-400 text-[11px]">
                    <strong className="text-slate-300">Without 3NF:</strong> Cannot register a newly purchased vehicle or newly constructed parking bay without generating an artificial dummy parking session record.
                  </p>
                  <p className="text-lime-400 text-[11px]">
                    <strong className="text-slate-200">With 3NF:</strong> Bays and vehicles exist independently in <code className="text-slate-300">parking_slots</code> and <code className="text-slate-300">vehicles</code> prior to any visit.
                  </p>
                </div>

                {/* Update Anomaly */}
                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5">
                  <span className="font-bold text-amber-300 text-xs">2. Update Anomaly</span>
                  <p className="text-slate-400 text-[11px]">
                    <strong className="text-slate-300">Without 3NF:</strong> If an owner updates their mobile phone number, 20 historical parking ticket rows must be modified. If any row is skipped, contradictory records arise.
                  </p>
                  <p className="text-lime-400 text-[11px]">
                    <strong className="text-slate-200">With 3NF:</strong> Update exactly 1 row in <code className="text-slate-300">owners</code>. All historical foreign keys instantly reflect the single source of truth.
                  </p>
                </div>

                {/* Deletion Anomaly */}
                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5">
                  <span className="font-bold text-amber-300 text-xs">3. Deletion Anomaly</span>
                  <p className="text-slate-400 text-[11px]">
                    <strong className="text-slate-300">Without 3NF:</strong> Deleting an old parking ticket purges the driver contact and vehicle model from existence if they only parked once.
                  </p>
                  <p className="text-lime-400 text-[11px]">
                    <strong className="text-slate-200">With 3NF:</strong> Deleting or archiving completed <code className="text-slate-300">parking_records</code> preserves the owner and vehicle registry intact.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Illustrative SQL Snippets */}
      {activeTab === 'sql' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <span>
              Production-grade SQL scripts demonstrating transactions, PL/pgSQL stored procedures, and trigger cascades.
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">
              Illustrative Examples · Course Showcase
            </span>
          </div>

          <div className="space-y-4">
            {SQL_EXAMPLES.map((example) => (
              <div
                key={example.id}
                className="p-5 rounded-2xl bg-[#0D1527] border border-slate-800 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
                  <div>
                    <h4 className="font-display font-bold text-sm text-white">
                      {example.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {example.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy(example.id, example.code)}
                    className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    {copiedId === example.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-lime-400" />
                        <span className="text-lime-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy SQL</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-850 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
                  {example.code}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Complete DDL Script */}
      {activeTab === 'ddl' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0D1527] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-display font-bold text-base text-white">
                Complete PostgreSQL / ANSI SQL DDL Script
              </h3>
              <p className="text-xs text-slate-400">
                Schema definition with primary keys, foreign key constraints, indexes, and check constraints.
              </p>
            </div>
            <button
              onClick={() => handleCopy('ddl', fullDdlScript)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-lime-400 hover:bg-lime-300 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedId === 'ddl' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId === 'ddl' ? 'Copied Script' : 'Copy Full DDL'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-850 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed max-h-[500px]">
            {fullDdlScript}
          </pre>
        </div>
      )}
    </div>
  );
};

const fullDdlScript = `-- ==========================================================
-- SMARTPARK DBMS: 3NF RELATIONAL SCHEMA DEFINITION
-- Target DBMS: PostgreSQL 14+ / MySQL 8.0+ ANSI SQL Compatible
-- ==========================================================

-- 1. OWNERS TABLE
CREATE TABLE owners (
    owner_id VARCHAR(36) PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. VEHICLES TABLE
CREATE TABLE vehicles (
    vehicle_id VARCHAR(36) PRIMARY KEY,
    plate_number VARCHAR(20) UNIQUE NOT NULL,
    vehicle_type VARCHAR(20) NOT NULL CHECK (vehicle_type IN ('Sedan', 'SUV', 'EV', 'Motorcycle', 'Van')),
    make_model VARCHAR(50),
    color VARCHAR(30),
    owner_id VARCHAR(36) NOT NULL,
    registered_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_vehicle_owner FOREIGN KEY (owner_id) 
        REFERENCES owners (owner_id) ON DELETE CASCADE
);

-- 3. PARKING SLOTS TABLE
CREATE TABLE parking_slots (
    slot_id VARCHAR(36) PRIMARY KEY,
    slot_code VARCHAR(10) UNIQUE NOT NULL,
    floor_level VARCHAR(20) NOT NULL,
    slot_type VARCHAR(20) NOT NULL CHECK (slot_type IN ('Standard', 'EV Charging', 'Accessible', 'Compact', 'VIP')),
    hourly_rate DECIMAL(6, 2) NOT NULL DEFAULT 25.00,
    status VARCHAR(20) NOT NULL DEFAULT 'Available' 
        CHECK (status IN ('Available', 'Occupied', 'Reserved', 'Maintenance')),
    sensor_id VARCHAR(30) UNIQUE NOT NULL
);

-- 4. STAFF USERS TABLE
CREATE TABLE staff_users (
    staff_id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(30) NOT NULL CHECK (role IN ('System Admin', 'Parking Staff')),
    shift VARCHAR(30),
    is_active BOOLEAN DEFAULT TRUE
);

-- 5. PARKING RECORDS (TRANSACTION SESSIONS) TABLE
CREATE TABLE parking_records (
    record_id VARCHAR(36) PRIMARY KEY,
    ticket_number VARCHAR(30) UNIQUE NOT NULL,
    vehicle_id VARCHAR(36) NOT NULL,
    slot_id VARCHAR(36) NOT NULL,
    staff_id VARCHAR(36),
    entry_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    exit_time TIMESTAMP,
    duration_minutes INT,
    total_fee DECIMAL(8, 2) DEFAULT 0.00,
    status VARCHAR(20) NOT NULL DEFAULT 'Parked' 
        CHECK (status IN ('Parked', 'Completed', 'Cancelled')),
    CONSTRAINT fk_record_vehicle FOREIGN KEY (vehicle_id) 
        REFERENCES vehicles (vehicle_id),
    CONSTRAINT fk_record_slot FOREIGN KEY (slot_id) 
        REFERENCES parking_slots (slot_id),
    CONSTRAINT fk_record_staff FOREIGN KEY (staff_id) 
        REFERENCES staff_users (staff_id)
);

-- 6. PAYMENTS TABLE
CREATE TABLE payments (
    payment_id VARCHAR(36) PRIMARY KEY,
    record_id VARCHAR(36) UNIQUE NOT NULL,
    amount DECIMAL(8, 2) NOT NULL,
    payment_method VARCHAR(30) NOT NULL 
        CHECK (payment_method IN ('Fastag / RFID', 'Credit Card', 'UPI / QR', 'Cash')),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'Paid' 
        CHECK (payment_status IN ('Paid', 'Pending', 'Waived')),
    transaction_reference VARCHAR(80) UNIQUE NOT NULL,
    payment_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payment_record FOREIGN KEY (record_id) 
        REFERENCES parking_records (record_id) ON DELETE RESTRICT
);

-- B-TREE PERFORMANCE INDEXES
CREATE INDEX idx_records_status ON parking_records (status);
CREATE INDEX idx_records_entry_time ON parking_records (entry_time);
CREATE INDEX idx_slots_floor_status ON parking_slots (floor_level, status);
CREATE INDEX idx_payments_time ON payments (payment_time);`;
