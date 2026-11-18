import fs from 'fs';
import path from 'path';
import {
  User,
  PickupRequest,
  CollectionRecord,
  RecyclerRecord,
  EPRRecord,
  CollectionCenter,
  AuditLog,
  UserRole
} from './types';

interface DatabaseSchema {
  users: (User & { passwordHash?: string })[];
  pickups: PickupRequest[];
  collections: CollectionRecord[];
  recyclers: RecyclerRecord[];
  epr: EPRRecord[];
  centers: CollectionCenter[];
  auditLogs: AuditLog[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

class GenericCollection<T extends { id: string }> {
  constructor(
    private getter: () => T[],
    private setter: (items: T[]) => void,
    private persist: () => void
  ) {}

  find(predicate?: (item: T) => boolean): T[] {
    const items = this.getter();
    return predicate ? items.filter(predicate) : [...items];
  }

  findById(id: string): T | undefined {
    return this.getter().find(item => item.id === id);
  }

  findOne(predicate: (item: T) => boolean): T | undefined {
    return this.getter().find(predicate);
  }

  insert(item: T): T {
    const items = this.getter();
    items.unshift(item); // latest first
    this.setter(items);
    this.persist();
    return item;
  }

  update(id: string, updates: Partial<T>): T | undefined {
    const items = this.getter();
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return undefined;
    items[index] = { ...items[index], ...updates };
    this.setter(items);
    this.persist();
    return items[index];
  }

  remove(id: string): boolean {
    const items = this.getter();
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return false;
    items.splice(index, 1);
    this.setter(items);
    this.persist();
    return true;
  }

  count(predicate?: (item: T) => boolean): number {
    return this.find(predicate).length;
  }
}

class NextDatabase {
  private data: DatabaseSchema = {
    users: [],
    pickups: [],
    collections: [],
    recyclers: [],
    epr: [],
    centers: [],
    auditLogs: []
  };

  public users!: GenericCollection<User & { passwordHash?: string }>;
  public pickups!: GenericCollection<PickupRequest>;
  public collections!: GenericCollection<CollectionRecord>;
  public recyclers!: GenericCollection<RecyclerRecord>;
  public epr!: GenericCollection<EPRRecord>;
  public centers!: GenericCollection<CollectionCenter>;
  public auditLogs!: GenericCollection<AuditLog>;

  constructor() {
    this.initCollections();
    this.load();
  }

  private initCollections() {
    this.users = new GenericCollection(
      () => this.data.users,
      items => { this.data.users = items; },
      () => this.save()
    );
    this.pickups = new GenericCollection(
      () => this.data.pickups,
      items => { this.data.pickups = items; },
      () => this.save()
    );
    this.collections = new GenericCollection(
      () => this.data.collections,
      items => { this.data.collections = items; },
      () => this.save()
    );
    this.recyclers = new GenericCollection(
      () => this.data.recyclers,
      items => { this.data.recyclers = items; },
      () => this.save()
    );
    this.epr = new GenericCollection(
      () => this.data.epr,
      items => { this.data.epr = items; },
      () => this.save()
    );
    this.centers = new GenericCollection(
      () => this.data.centers,
      items => { this.data.centers = items; },
      () => this.save()
    );
    this.auditLogs = new GenericCollection(
      () => this.data.auditLogs,
      items => { this.data.auditLogs = items; },
      () => this.save()
    );
  }

  private load() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      let fileToRead = DATA_FILE;
      if (!fs.existsSync(fileToRead)) {
        const altFile = path.resolve(process.cwd(), 'server', 'data', 'db.json');
        if (fs.existsSync(altFile)) {
          fileToRead = altFile;
        }
      }

      if (fs.existsSync(fileToRead)) {
        const raw = fs.readFileSync(fileToRead, 'utf-8');
        const parsed = JSON.parse(raw);
        this.data.users = parsed.users || [];
        this.data.pickups = parsed.pickups || [];
        this.data.collections = parsed.collections || [];
        this.data.recyclers = parsed.recyclers || [];
        this.data.epr = parsed.epr || [];
        this.data.centers = parsed.centers || [];
        this.data.auditLogs = parsed.auditLogs || [];
      }

      // Always ensure seed data exists (Vercel: db.json may be empty/minimal at runtime)
      this.ensureSeedData();

    } catch (err) {
      this.ensureSeedData();
    }
  }

  public save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving Next.js database:', err);
    }
  }

  public logAudit(
    actorId: string,
    actorName: string,
    actorRole: UserRole,
    action: string,
    entityType: string,
    entityId: string,
    previousValues?: any,
    updatedValues?: any
  ) {
    const entry: AuditLog = {
      id: 'audit_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      actorId,
      actorName,
      actorRole,
      action,
      entityType,
      entityId,
      previousValues,
      updatedValues,
      timestamp: new Date().toISOString()
    };
    this.auditLogs.insert(entry);
    return entry;
  }

  // Merge seed users/pickups if missing (non-destructive)
  // Uses pre-computed password hashes to avoid bcrypt cost on every serverless cold start
  private ensureSeedData() {
    // Pre-computed bcrypt hashes (cost factor 10) — avoids running bcrypt on every request
    const HASHES = {
      admin:    '$2a$10$Hhb4FCLMHcGQ.Saje1LfOe9qMLjTpXck5l1GYX6fz5OQT9ZcbbNGO', // Admin@123
      partner:  '$2a$10$Hhb4FCLMHcGQ.Saje1LfOeJmpYrYOZuehG99FNlfTC20MdRwmYJgW', // Partner@123
      recycler: '$2a$10$Hhb4FCLMHcGQ.Saje1LfOeyazQDlTQA8aDFVul.5DO15.5EUw2kc2', // Recycler@123
      user:     '$2a$10$Hhb4FCLMHcGQ.Saje1LfOehGyFe0c2pyCZvF9TGrmGYEzJXV9e.hO', // User@123
      citizen:  '$2b$10$6L3bkLIr.k.9Dhhg9M6FuuZQDzzNKkINUg.WniQcLH8.LY6wJHmN6', // Citizen@123
    };

    const SEED_USERS: (User & { passwordHash?: string })[] = [
      {
        id: 'usr_admin_01',
        name: 'Dr. Evelyn Vance',
        email: 'admin@nexus.eco',
        passwordHash: HASHES.admin,
        role: 'admin',
        status: 'active',
        phone: '+1 (555) 019-2831',
        organization: 'E-Waste Nexus Global Governance',
        createdAt: '2026-01-15T08:00:00.000Z'
      },
      {
        id: 'usr_partner_01',
        name: 'Marcus Sterling',
        email: 'partner@nexus.eco',
        passwordHash: HASHES.partner,
        role: 'partner',
        status: 'active',
        phone: '+1 (555) 342-8819',
        organization: 'GreenRoute Eco-Logistics Fleet',
        createdAt: '2026-01-18T10:15:00.000Z'
      },
      {
        id: 'usr_recycler_01',
        name: 'Elena Rostova',
        email: 'recycler@nexus.eco',
        passwordHash: HASHES.recycler,
        role: 'recycler',
        status: 'active',
        phone: '+1 (555) 871-3342',
        organization: 'AeroSmelt Rare-Earth Refining Corp',
        createdAt: '2026-01-20T12:00:00.000Z'
      },
      {
        id: 'usr_individual_01',
        name: 'Sarah Jenkins',
        email: 'user@nexus.eco',
        passwordHash: HASHES.user,
        role: 'individual',
        status: 'active',
        phone: '+1 (555) 612-9901',
        address: '420 Innovation Way, Silicon Valley, CA 94025',
        organization: 'Cognitive Dynamics Labs',
        createdAt: '2026-02-01T09:30:00.000Z'
      },
      {
        id: 'usr_citizen_01',
        name: 'Aarav Sharma',
        email: 'citizen@nexus.eco',
        passwordHash: HASHES.citizen,
        role: 'individual',
        status: 'active',
        phone: '+91 98101 23456',
        address: 'Flat 402, Green Valley Apartments, Sector 62, Noida, UP 201309',
        createdAt: '2026-02-05T10:00:00.000Z'
      }
    ];

    const SEED_PICKUPS: PickupRequest[] = [
      {
        id: 'pck_101',
        userId: 'usr_individual_01',
        userName: 'Sarah Jenkins',
        userEmail: 'user@nexus.eco',
        userPhone: '+1 (555) 612-9901',
        category: 'Printers and Office Electronics',
        estimatedQuantity: 2,
        estimatedWeightKg: 9,
        actualWeightKg: 9,
        address: '420 Innovation Way, Silicon Valley, CA 94025',
        scheduledDate: '2026-10-15',
        timeSlot: 'Morning (09:00 - 12:00)',
        specialInstructions: 'Old office printers.',
        assignedPartnerId: 'usr_partner_01',
        assignedPartnerName: 'GreenRoute Eco-Logistics Fleet',
        currentStatus: 'Certified',
        statusHistory: [
          { status: 'Requested', timestamp: '2026-10-10T10:00:00.000Z', changedBy: 'usr_individual_01', changedByName: 'Sarah Jenkins', note: 'Pickup request initialized' },
          { status: 'Assigned', timestamp: '2026-10-11T09:00:00.000Z', changedBy: 'usr_admin_01', changedByName: 'Dr. Evelyn Vance', note: 'Partner assigned' },
          { status: 'InTransit', timestamp: '2026-10-14T08:00:00.000Z', changedBy: 'usr_partner_01', changedByName: 'Marcus Sterling', note: 'En route to facility' },
          { status: 'Weighed', timestamp: '2026-10-15T10:00:00.000Z', changedBy: 'usr_recycler_01', changedByName: 'Elena Rostova', note: 'Weight confirmed: 9kg' },
          { status: 'Certified', timestamp: '2026-10-16T11:00:00.000Z', changedBy: 'usr_recycler_01', changedByName: 'Elena Rostova', note: 'EPR Certificate issued' }
        ],
        createdAt: '2026-10-10T10:00:00.000Z',
        updatedAt: '2026-10-16T11:00:00.000Z'
      },
      {
        id: 'pck_102',
        userId: 'usr_individual_01',
        userName: 'Sarah Jenkins',
        userEmail: 'user@nexus.eco',
        userPhone: '+1 (555) 612-9901',
        category: 'Laptops and Computers',
        estimatedQuantity: 5,
        estimatedWeightKg: 12.5,
        address: '420 Innovation Way, Silicon Valley, CA 94025',
        scheduledDate: '2026-11-10',
        timeSlot: 'Morning (09:00 - 12:00)',
        specialInstructions: 'Server rack chassis and 4 ThinkPad laptops. Data sanitized.',
        assignedPartnerId: 'usr_partner_01',
        assignedPartnerName: 'GreenRoute Eco-Logistics Fleet',
        currentStatus: 'Approved',
        statusHistory: [
          { status: 'Requested', timestamp: '2026-11-01T08:00:00.000Z', changedBy: 'usr_individual_01', changedByName: 'Sarah Jenkins', note: 'Pickup request initialized' },
          { status: 'Approved', timestamp: '2026-11-02T09:00:00.000Z', changedBy: 'usr_admin_01', changedByName: 'Dr. Evelyn Vance', note: 'Approved for fleet dispatch' }
        ],
        createdAt: '2026-11-01T08:00:00.000Z',
        updatedAt: '2026-11-02T09:00:00.000Z'
      },
      {
        id: 'pck_103',
        userId: 'usr_individual_01',
        userName: 'Sarah Jenkins',
        userEmail: 'user@nexus.eco',
        userPhone: '+1 (555) 612-9901',
        category: 'Televisions and Monitors',
        estimatedQuantity: 2,
        estimatedWeightKg: 15,
        address: '420 Innovation Way, Silicon Valley, CA 94025',
        scheduledDate: '2026-11-25',
        timeSlot: 'Afternoon (12:00 - 17:00)',
        specialInstructions: '2 large LED monitors from server room.',
        currentStatus: 'Requested',
        statusHistory: [
          { status: 'Requested', timestamp: '2026-11-15T10:00:00.000Z', changedBy: 'usr_individual_01', changedByName: 'Sarah Jenkins', note: 'Pickup scheduled' }
        ],
        createdAt: '2026-11-15T10:00:00.000Z',
        updatedAt: '2026-11-15T10:00:00.000Z'
      },
      {
        id: 'pick_citizen_demo_1',
        userId: 'usr_citizen_01',
        userName: 'Aarav Sharma',
        userEmail: 'citizen@nexus.eco',
        userPhone: '+91 98101 23456',
        category: 'Smartphones and Tablets',
        estimatedQuantity: 3,
        estimatedWeightKg: 0.9,
        actualWeightKg: 0.95,
        address: 'Flat 402, Green Valley Apartments, Sector 62, Noida, UP 201309',
        scheduledDate: '2026-11-25',
        timeSlot: 'Morning (09:00 - 12:00)',
        specialInstructions: '2 old iPhones and 1 Android. Factory reset done.',
        assignedPartnerId: 'usr_partner_01',
        assignedPartnerName: 'GreenRoute Eco-Logistics Fleet',
        currentStatus: 'Assigned',
        statusHistory: [
          { status: 'Requested', timestamp: '2026-11-18T17:00:00.000Z', changedBy: 'usr_citizen_01', changedByName: 'Aarav Sharma', note: 'Pickup booked online' },
          { status: 'Assigned', timestamp: '2026-11-18T18:00:00.000Z', changedBy: 'usr_admin_01', changedByName: 'Dr. Evelyn Vance', note: 'Partner assigned for doorstep collection' }
        ],
        createdAt: '2026-11-18T17:00:00.000Z',
        updatedAt: '2026-11-18T18:00:00.000Z'
      },
      {
        id: 'pick_citizen_demo_2',
        userId: 'usr_citizen_01',
        userName: 'Aarav Sharma',
        userEmail: 'citizen@nexus.eco',
        userPhone: '+91 98101 23456',
        category: 'Batteries and Chargers',
        estimatedQuantity: 5,
        estimatedWeightKg: 2.5,
        actualWeightKg: 2.6,
        address: 'Flat 402, Green Valley Apartments, Sector 62, Noida, UP 201309',
        scheduledDate: '2026-11-10',
        timeSlot: 'Afternoon (12:00 - 17:00)',
        specialInstructions: 'Laptop batteries and phone chargers',
        currentStatus: 'Completed',
        statusHistory: [
          { status: 'Requested', timestamp: '2026-11-05T10:00:00.000Z', changedBy: 'usr_citizen_01', changedByName: 'Aarav Sharma', note: 'Booked via app' },
          { status: 'Completed', timestamp: '2026-11-10T14:00:00.000Z', changedBy: 'usr_recycler_01', changedByName: 'Elena Rostova', note: 'Successfully recycled at facility' }
        ],
        createdAt: '2026-11-05T10:00:00.000Z',
        updatedAt: '2026-11-10T14:00:00.000Z'
      },
      {
        id: 'pick_citizen_demo_3',
        userId: 'usr_citizen_01',
        userName: 'Aarav Sharma',
        userEmail: 'citizen@nexus.eco',
        userPhone: '+91 98101 23456',
        category: 'Televisions and Monitors',
        estimatedQuantity: 1,
        estimatedWeightKg: 8.0,
        address: 'Flat 402, Green Valley Apartments, Sector 62, Noida, UP 201309',
        scheduledDate: '2026-11-28',
        timeSlot: 'Evening (17:00 - 20:00)',
        specialInstructions: 'Old 32-inch LED TV. Please bring 2 persons for heavy lifting.',
        currentStatus: 'Requested',
        statusHistory: [
          { status: 'Requested', timestamp: '2026-11-18T17:00:00.000Z', changedBy: 'usr_citizen_01', changedByName: 'Aarav Sharma', note: 'Scheduled via doorstep portal' }
        ],
        createdAt: '2026-11-18T17:00:00.000Z',
        updatedAt: '2026-11-18T17:00:00.000Z'
      },
      {
        id: 'pick_1794389136478_npz0',
        userId: 'usr_citizen_01',
        userName: 'Aarav Sharma',
        userEmail: 'citizen@nexus.eco',
        userPhone: '9805926846',
        category: 'Laptops and Computers',
        estimatedQuantity: 2,
        estimatedWeightKg: 5,
        address: 'Flat 402, Green Valley Apartments, Sector 62, Noida, Uttar Pradesh 201309',
        scheduledDate: '2026-11-13',
        timeSlot: 'Morning (09:00 - 12:00)',
        specialInstructions: 'Standard doorstep collection requested.',
        currentStatus: 'Requested',
        statusHistory: [
          { status: 'Requested', timestamp: '2026-11-11T09:25:36.478Z', changedBy: 'usr_citizen_01', changedByName: 'Aarav Sharma', note: 'Pickup request submitted via CPCB Chain-of-Custody Portal' }
        ],
        createdAt: '2026-11-11T09:25:36.478Z',
        updatedAt: '2026-11-11T09:25:36.478Z'
      },
      {
        id: 'pick_1794383454642_kwva',
        userId: 'usr_citizen_01',
        userName: 'Aarav Sharma',
        userEmail: 'citizen@nexus.eco',
        userPhone: '9805926846',
        category: 'Laptops and Computers',
        estimatedQuantity: 2,
        estimatedWeightKg: 5,
        address: 'Flat 402, Green Valley Apartments, Sector 62, Noida, Uttar Pradesh',
        scheduledDate: '2026-11-11',
        timeSlot: 'Morning (09:00 - 12:00)',
        specialInstructions: '',
        currentStatus: 'Certified',
        statusHistory: [
          { status: 'Requested', timestamp: '2026-11-11T07:50:54.642Z', changedBy: 'usr_citizen_01', changedByName: 'Aarav Sharma', note: 'Pickup request submitted' },
          { status: 'Assigned', timestamp: '2026-11-11T08:00:00.000Z', changedBy: 'usr_admin_01', changedByName: 'Dr. Evelyn Vance', note: 'Assigned to partner' },
          { status: 'InTransit', timestamp: '2026-11-11T09:00:00.000Z', changedBy: 'usr_partner_01', changedByName: 'Marcus Sterling', note: 'In transit' },
          { status: 'Weighed', timestamp: '2026-11-11T10:00:00.000Z', changedBy: 'usr_recycler_01', changedByName: 'Elena Rostova', note: 'Weighed at facility' },
          { status: 'Certified', timestamp: '2026-11-11T11:00:00.000Z', changedBy: 'usr_recycler_01', changedByName: 'Elena Rostova', note: 'EPR Certificate issued' }
        ],
        createdAt: '2026-11-11T07:50:54.642Z',
        updatedAt: '2026-11-11T11:00:00.000Z'
      }
    ];

    const SEED_CENTERS: CollectionCenter[] = [
      {
        id: 'cntr_01',
        name: 'Silicon Valley Central E-Waste Facility',
        slug: 'silicon-valley-central',
        address: '1020 Enterprise Way',
        city: 'Sunnyvale',
        state: 'CA',
        postalCode: '94089',
        phone: '+1 (408) 730-7262',
        email: 'sv-hub@nexus.eco',
        acceptedCategories: ['Smartphones and Tablets', 'Laptops and Computers', 'Batteries and Chargers', 'Printers and Office Electronics'],
        operatingHours: 'Mon - Fri: 08:00 - 18:00, Sat: 09:00 - 16:00',
        isVerified: true,
        latitude: 37.4085,
        longitude: -122.0263
      },
      {
        id: 'cntr_02',
        name: 'Bay Area Lithium & Battery Safe-Deposit Depot',
        slug: 'bay-area-lithium-depot',
        address: '550 7th Street',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94103',
        phone: '+1 (415) 554-6193',
        email: 'sf-batteries@nexus.eco',
        acceptedCategories: ['Batteries and Chargers', 'Smartphones and Tablets'],
        operatingHours: 'Mon - Sat: 09:00 - 17:00',
        isVerified: true,
        latitude: 37.7712,
        longitude: -122.4042
      },
      {
        id: 'cntr_03',
        name: 'Pacific Northwest Heavy Electronics Intake Hub',
        slug: 'pacific-northwest-hub',
        address: '2200 6th Ave S',
        city: 'Seattle',
        state: 'WA',
        postalCode: '98134',
        phone: '+1 (206) 684-3000',
        email: 'pnw-intake@nexus.eco',
        acceptedCategories: ['Televisions and Monitors', 'Printers and Office Electronics', 'Other Electronic Waste'],
        operatingHours: 'Mon - Sun: 07:30 - 19:00',
        isVerified: true,
        latitude: 47.5833,
        longitude: -122.3267
      },
      {
        id: 'cntr_04',
        name: 'Delhi NCR E-Waste Processing Hub',
        slug: 'delhi-ncr-hub',
        address: 'Plot 45, Sector 18, Industrial Area',
        city: 'Noida',
        state: 'UP',
        postalCode: '201301',
        phone: '+91 120-456-7890',
        email: 'delhi-hub@nexus.eco',
        acceptedCategories: ['Laptops and Computers', 'Smartphones and Tablets', 'Batteries and Chargers', 'Televisions and Monitors', 'Other Electronic Waste'],
        operatingHours: 'Mon - Sat: 09:00 - 18:00',
        isVerified: true,
        latitude: 28.5355,
        longitude: 77.3910
      },
      {
        id: 'cntr_05',
        name: 'Mumbai Coastal E-Waste Reclamation Center',
        slug: 'mumbai-coastal-center',
        address: 'B-12, MIDC Industrial Estate, Andheri East',
        city: 'Mumbai',
        state: 'MH',
        postalCode: '400093',
        phone: '+91 22-2836-4500',
        email: 'mumbai@nexus.eco',
        acceptedCategories: ['Printers and Office Electronics', 'Laptops and Computers', 'Televisions and Monitors', 'Other Electronic Waste'],
        operatingHours: 'Mon - Fri: 08:00 - 17:00',
        isVerified: true,
        latitude: 19.1136,
        longitude: 72.8697
      }
    ];

    const SEED_EPR: EPRRecord[] = [
      {
        id: 'epr_001',
        certificateNumber: 'CPCB-EPR-2026-593947',
        producerName: 'Cognitive Dynamics Labs',
        recyclerName: 'AeroSmelt Rare-Earth Refining Corp',
        creditsEarnedKg: 12.5,
        status: 'Active',
        issuedAt: '2026-10-20T10:00:00.000Z',
        pickupId: 'pck_102',
        category: 'Laptops and Computers',
        creditStatus: 'Available',
        approvalStatus: 'Approved'
      },
      {
        id: 'epr_002',
        certificateNumber: 'EPR-2026-401',
        producerName: 'GreenRoute Eco-Logistics Fleet',
        recyclerName: 'AeroSmelt Rare-Earth Refining Corp',
        creditsEarnedKg: 45,
        status: 'Active',
        issuedAt: '2026-09-15T09:00:00.000Z',
        category: 'Printers and Office Electronics',
        creditStatus: 'Available',
        approvalStatus: 'Approved'
      },
      {
        id: 'epr_003',
        certificateNumber: 'EPR-2026-402',
        producerName: 'AeroSmelt Rare-Earth Refining Corp',
        recyclerName: 'AeroSmelt Rare-Earth Refining Corp',
        creditsEarnedKg: 150,
        status: 'Active',
        issuedAt: '2026-08-01T08:00:00.000Z',
        category: 'Batteries and Chargers',
        creditStatus: 'Available',
        approvalStatus: 'Approved'
      },
      {
        id: 'epr_004',
        certificateNumber: 'EPR-2026-403',
        producerName: 'Sarah Jenkins',
        recyclerName: 'AeroSmelt Rare-Earth Refining Corp',
        creditsEarnedKg: 9,
        status: 'Active',
        issuedAt: '2026-10-16T11:00:00.000Z',
        pickupId: 'pck_101',
        category: 'Printers and Office Electronics',
        creditStatus: 'Available',
        approvalStatus: 'Approved'
      },
      {
        id: 'epr_citizen_001',
        certificateNumber: 'CPCB-EPR-2026-847291',
        producerName: 'Aarav Sharma',
        recyclerName: 'AeroSmelt Rare-Earth Refining Corp',
        creditsEarnedKg: 5,
        status: 'Active',
        issuedAt: '2026-11-11T11:00:00.000Z',
        pickupId: 'pick_1794383454642_kwva',
        category: 'Laptops and Computers',
        creditStatus: 'Available',
        approvalStatus: 'Approved'
      }
    ];

    // Merge users (don't duplicate existing ones)
    const existingUserIds = new Set(this.data.users.map(u => u.id));
    for (const u of SEED_USERS) {
      if (!existingUserIds.has(u.id)) {
        this.data.users.push(u);
      }
    }

    // Merge pickups (don't duplicate existing ones)
    const existingPickupIds = new Set(this.data.pickups.map(p => p.id));
    for (const p of SEED_PICKUPS) {
      if (!existingPickupIds.has(p.id)) {
        this.data.pickups.push(p);
      }
    }

    // Merge centers
    const existingCenterIds = new Set(this.data.centers.map(c => c.id));
    for (const c of SEED_CENTERS) {
      if (!existingCenterIds.has(c.id)) {
        this.data.centers.push(c);
      }
    }

    // Merge EPR
    const existingEprIds = new Set(this.data.epr.map(e => e.id));
    for (const e of SEED_EPR) {
      if (!existingEprIds.has(e.id)) {
        this.data.epr.push(e);
      }
    }
  }

  // Keep for backward compatibility
  public seedDefaultData() {
    this.ensureSeedData();
    this.save();
  }
}

// Global Singleton for Next.js (avoids multiple instances during dev hot-reloads)
const globalForDb = globalThis as unknown as { nextDb: NextDatabase | undefined };
export const db = globalForDb.nextDb ?? new NextDatabase();
if (process.env.NODE_ENV !== 'production') globalForDb.nextDb = db;
