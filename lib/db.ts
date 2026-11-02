import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
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

      // Check root data/db.json first or server/data/db.json
      let fileToRead = DATA_FILE;
      if (!fs.existsSync(fileToRead)) {
        const altFile = path.resolve(process.cwd(), 'server', 'data', 'db.json');
        if (fs.existsSync(altFile)) {
          fileToRead = altFile;
        }
      }

      if (fs.existsSync(fileToRead)) {
        const raw = fs.readFileSync(fileToRead, 'utf-8');
        this.data = JSON.parse(raw);
        this.data.users = this.data.users || [];
        this.data.pickups = this.data.pickups || [];
        this.data.collections = this.data.collections || [];
        this.data.recyclers = this.data.recyclers || [];
        this.data.epr = this.data.epr || [];
        this.data.centers = this.data.centers || [];
        this.data.auditLogs = this.data.auditLogs || [];
      } else {
        this.seedDefaultData();
      }
    } catch (err) {
      this.seedDefaultData();
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

  public seedDefaultData() {
    const salt = bcrypt.genSaltSync(10);
    this.data.users = [
      {
        id: 'usr_admin_01',
        name: 'Dr. Evelyn Vance',
        email: 'admin@nexus.eco',
        passwordHash: bcrypt.hashSync('Admin@123', salt),
        role: 'admin',
        status: 'active',
        phone: '+1 (555) 019-2831',
        organization: 'E-Waste Nexus Global Governance',
        createdAt: new Date().toISOString()
      },
      {
        id: 'usr_partner_01',
        name: 'Marcus Sterling',
        email: 'partner@nexus.eco',
        passwordHash: bcrypt.hashSync('Partner@123', salt),
        role: 'partner',
        status: 'active',
        phone: '+1 (555) 342-8819',
        organization: 'GreenRoute Eco-Logistics Fleet',
        createdAt: new Date().toISOString()
      },
      {
        id: 'usr_recycler_01',
        name: 'Elena Rostova',
        email: 'recycler@nexus.eco',
        passwordHash: bcrypt.hashSync('Recycler@123', salt),
        role: 'recycler',
        status: 'active',
        phone: '+1 (555) 871-3342',
        organization: 'AeroSmelt Rare-Earth Refining Corp',
        createdAt: new Date().toISOString()
      },
      {
        id: 'usr_individual_01',
        name: 'Sarah Jenkins',
        email: 'user@nexus.eco',
        passwordHash: bcrypt.hashSync('User@123', salt),
        role: 'individual',
        status: 'active',
        phone: '+1 (555) 612-9901',
        address: '420 Innovation Way, Silicon Valley, CA 94025',
        organization: 'Cognitive Dynamics Labs',
        createdAt: new Date().toISOString()
      }
    ];

    this.data.centers = [
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
        acceptedCategories: [
          'Smartphones and Tablets',
          'Laptops and Computers',
          'Batteries and Chargers',
          'Printers and Office Electronics'
        ],
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
        acceptedCategories: [
          'Batteries and Chargers',
          'Smartphones and Tablets'
        ],
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
        acceptedCategories: [
          'Televisions and Monitors',
          'Large Electrical Appliances',
          'Printers and Office Electronics',
          'Other Electronic Waste'
        ],
        operatingHours: 'Mon - Sun: 07:30 - 19:00',
        isVerified: true,
        latitude: 47.5833,
        longitude: -122.3267
      }
    ];

    this.data.pickups = [
      {
        id: 'pick_01',
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
          {
            status: 'Requested',
            timestamp: new Date().toISOString(),
            changedBy: 'usr_individual_01',
            changedByName: 'Sarah Jenkins',
            note: 'Pickup request initialized'
          },
          {
            status: 'Approved',
            timestamp: new Date().toISOString(),
            changedBy: 'usr_admin_01',
            changedByName: 'Dr. Evelyn Vance',
            note: 'Approved for fleet dispatch'
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    this.save();
  }
}

// Global Singleton for Next.js (avoids multiple instances during dev hot-reloads)
const globalForDb = globalThis as unknown as { nextDb: NextDatabase | undefined };
export const db = globalForDb.nextDb ?? new NextDatabase();
if (process.env.NODE_ENV !== 'production') globalForDb.nextDb = db;
