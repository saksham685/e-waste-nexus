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
} from '../types.js';

interface DatabaseSchema {
  users: User[];
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
  constructor(private getter: () => T[], private setter: (items: T[]) => void, private persist: () => void) {}

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
    items.push(item);
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

  delete(id: string): boolean {
    const items = this.getter();
    const filtered = items.filter(item => item.id !== id);
    if (filtered.length === items.length) return false;
    this.setter(filtered);
    this.persist();
    return true;
  }
}

class Database {
  private data: DatabaseSchema = {
    users: [],
    pickups: [],
    collections: [],
    recyclers: [],
    epr: [],
    centers: [],
    auditLogs: []
  };

  public users!: GenericCollection<User>;
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
      (items) => { this.data.users = items; },
      () => this.save()
    );
    this.pickups = new GenericCollection(
      () => this.data.pickups,
      (items) => { this.data.pickups = items; },
      () => this.save()
    );
    this.collections = new GenericCollection(
      () => this.data.collections,
      (items) => { this.data.collections = items; },
      () => this.save()
    );
    this.recyclers = new GenericCollection(
      () => this.data.recyclers,
      (items) => { this.data.recyclers = items; },
      () => this.save()
    );
    this.epr = new GenericCollection(
      () => this.data.epr,
      (items) => { this.data.epr = items; },
      () => this.save()
    );
    this.centers = new GenericCollection(
      () => this.data.centers,
      (items) => { this.data.centers = items; },
      () => this.save()
    );
    this.auditLogs = new GenericCollection(
      () => this.data.auditLogs,
      (items) => { this.data.auditLogs = items; },
      () => this.save()
    );
  }

  private load() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        // Ensure all arrays exist
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
      console.error('Failed to load database from disk, initializing fresh:', err);
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
      console.error('Error saving database to disk:', err);
    }
  }

  public logAudit(
    actorId: string,
    actorName: string,
    actorRole: UserRole,
    action: string,
    entityType: AuditLog['entityType'],
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

  public seedDefaultData(force = false) {
    if (!force && this.data.users.length > 0) return;

    console.log('Seeding initial enterprise E-Waste Nexus dataset...');
    const salt = bcrypt.genSaltSync(10);

    const defaultUsers: User[] = [
      {
        id: 'usr_admin_01',
        name: 'Dr. Evelyn Vance',
        email: 'admin@nexus.eco',
        passwordHash: bcrypt.hashSync('Admin@123', salt),
        role: 'admin',
        status: 'active',
        phone: '+1 (555) 019-2831',
        organization: 'E-Waste Nexus Global Governance',
        createdAt: '2026-01-15T08:00:00.000Z',
        updatedAt: '2026-01-15T08:00:00.000Z'
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
        createdAt: '2026-01-18T10:15:00.000Z',
        updatedAt: '2026-01-18T10:15:00.000Z'
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
        createdAt: '2026-01-20T12:00:00.000Z',
        updatedAt: '2026-01-20T12:00:00.000Z'
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
        createdAt: '2026-02-01T09:30:00.000Z',
        updatedAt: '2026-02-01T09:30:00.000Z'
      }
    ];

    const defaultCenters: CollectionCenter[] = [
      {
        id: 'ctr_01',
        name: 'Metro Silicon Valley Clean Tech Hub',
        address: '1040 Innovation Parkway, Suite 100',
        city: 'San Jose',
        state: 'CA',
        postalCode: '95134',
        phone: '+1 (408) 555-0144',
        email: 'sv-hub@nexus.eco',
        acceptedCategories: [
          'Smartphones and Tablets',
          'Laptops and Computers',
          'Batteries and Chargers',
          'Televisions and Monitors',
          'Printers and Office Electronics'
        ],
        operatingHours: 'Mon-Sat: 08:00 AM - 07:00 PM',
        isVerified: true,
        latitude: 37.403,
        longitude: -121.944,
        createdAt: '2026-01-10T00:00:00.000Z'
      },
      {
        id: 'ctr_02',
        name: 'Bay Area Certified Circular Center',
        address: '750 Mission Bay Blvd North',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94158',
        phone: '+1 (415) 555-0189',
        email: 'sf-circ@nexus.eco',
        acceptedCategories: [
          'Smartphones and Tablets',
          'Laptops and Computers',
          'Batteries and Chargers',
          'Large Electrical Appliances',
          'Other Electronic Waste'
        ],
        operatingHours: 'Mon-Sun: 09:00 AM - 06:00 PM',
        isVerified: true,
        latitude: 37.769,
        longitude: -122.391,
        createdAt: '2026-01-12T00:00:00.000Z'
      },
      {
        id: 'ctr_03',
        name: 'East Bay Lithium & Precious Metal Vault',
        address: '2200 Powell Street',
        city: 'Emeryville',
        state: 'CA',
        postalCode: '94608',
        phone: '+1 (510) 555-0199',
        email: 'eastbay-vault@nexus.eco',
        acceptedCategories: [
          'Batteries and Chargers',
          'Smartphones and Tablets',
          'Laptops and Computers'
        ],
        operatingHours: 'Tue-Sat: 10:00 AM - 05:00 PM',
        isVerified: true,
        latitude: 37.844,
        longitude: -122.298,
        createdAt: '2026-01-15T00:00:00.000Z'
      },
      {
        id: 'ctr_04',
        name: 'Seattle Pacific E-Waste Terminal',
        address: '400 Pine Street',
        city: 'Seattle',
        state: 'WA',
        postalCode: '98101',
        phone: '+1 (206) 555-0212',
        email: 'seattle@nexus.eco',
        acceptedCategories: [
          'Smartphones and Tablets',
          'Laptops and Computers',
          'Televisions and Monitors',
          'Printers and Office Electronics',
          'Large Electrical Appliances'
        ],
        operatingHours: 'Mon-Fri: 08:30 AM - 05:30 PM',
        isVerified: true,
        latitude: 47.611,
        longitude: -122.336,
        createdAt: '2026-01-18T00:00:00.000Z'
      },
      {
        id: 'ctr_05',
        name: 'Austin Green Foundry Depository',
        address: '500 E 4th Street',
        city: 'Austin',
        state: 'TX',
        postalCode: '78701',
        phone: '+1 (512) 555-0318',
        email: 'austin@nexus.eco',
        acceptedCategories: [
          'Smartphones and Tablets',
          'Laptops and Computers',
          'Batteries and Chargers',
          'Other Electronic Waste'
        ],
        operatingHours: 'Mon-Sat: 09:00 AM - 06:00 PM',
        isVerified: true,
        latitude: 30.266,
        longitude: -97.740,
        createdAt: '2026-01-22T00:00:00.000Z'
      }
    ];

    const defaultPickups: PickupRequest[] = [
      {
        id: 'pck_101',
        userId: 'usr_individual_01',
        userName: 'Sarah Jenkins',
        userEmail: 'user@nexus.eco',
        userPhone: '+1 (555) 612-9901',
        category: 'Laptops and Computers',
        estimatedQuantity: 6,
        estimatedWeightKg: 14.5,
        address: '420 Innovation Way, Silicon Valley, CA 94025',
        scheduledDate: '2026-10-28',
        timeSlot: '10:00 AM - 01:00 PM',
        specialInstructions: 'Decommissioned server units and ThinkPad laptops from our AI test bench. Reception is at lobby 2.',
        assignedPartnerId: 'usr_partner_01',
        assignedPartnerName: 'Marcus Sterling (GreenRoute Fleet)',
        currentStatus: 'Assigned',
        statusHistory: [
          {
            status: 'Requested',
            timestamp: '2026-10-24T10:00:00.000Z',
            changedBy: 'usr_individual_01',
            changedByName: 'Sarah Jenkins',
            note: 'Pickup request scheduled online'
          },
          {
            status: 'Approved',
            timestamp: '2026-10-24T11:30:00.000Z',
            changedBy: 'usr_admin_01',
            changedByName: 'Dr. Evelyn Vance (Admin)',
            note: 'Request passed environmental criteria and hazard audit'
          },
          {
            status: 'Assigned',
            timestamp: '2026-10-24T12:00:00.000Z',
            changedBy: 'usr_admin_01',
            changedByName: 'Dr. Evelyn Vance (Admin)',
            note: 'Dispatched to GreenRoute Eco-Logistics Fleet'
          }
        ],
        createdAt: '2026-10-24T10:00:00.000Z',
        updatedAt: '2026-10-24T12:00:00.000Z'
      },
      {
        id: 'pck_102',
        userId: 'usr_individual_01',
        userName: 'Sarah Jenkins',
        userEmail: 'user@nexus.eco',
        userPhone: '+1 (555) 612-9901',
        category: 'Batteries and Chargers',
        estimatedQuantity: 25,
        estimatedWeightKg: 8.2,
        address: '420 Innovation Way, Silicon Valley, CA 94025',
        scheduledDate: '2026-10-20',
        timeSlot: '02:00 PM - 05:00 PM',
        specialInstructions: 'Lithium-ion cells stored in fireproof safe box.',
        assignedPartnerId: 'usr_partner_01',
        assignedPartnerName: 'Marcus Sterling (GreenRoute Fleet)',
        currentStatus: 'Completed',
        statusHistory: [
          { status: 'Requested', timestamp: '2026-10-18T09:00:00.000Z', changedBy: 'usr_individual_01', changedByName: 'Sarah Jenkins' },
          { status: 'Approved', timestamp: '2026-10-18T10:00:00.000Z', changedBy: 'usr_admin_01', changedByName: 'Admin' },
          { status: 'Assigned', timestamp: '2026-10-18T11:00:00.000Z', changedBy: 'usr_admin_01', changedByName: 'Admin' },
          { status: 'Collected', timestamp: '2026-10-20T14:30:00.000Z', changedBy: 'usr_partner_01', changedByName: 'Marcus Sterling' },
          { status: 'Weighed', timestamp: '2026-10-20T16:00:00.000Z', changedBy: 'usr_partner_01', changedByName: 'Marcus Sterling' },
          { status: 'Sent for Recycling', timestamp: '2026-10-21T09:00:00.000Z', changedBy: 'usr_partner_01', changedByName: 'Marcus Sterling' },
          { status: 'Completed', timestamp: '2026-10-22T15:00:00.000Z', changedBy: 'usr_recycler_01', changedByName: 'Elena Rostova (Recycler)' }
        ],
        createdAt: '2026-10-18T09:00:00.000Z',
        updatedAt: '2026-10-22T15:00:00.000Z'
      },
      {
        id: 'pck_103',
        userId: 'usr_individual_01',
        userName: 'Sarah Jenkins',
        userEmail: 'user@nexus.eco',
        userPhone: '+1 (555) 612-9901',
        category: 'Smartphones and Tablets',
        estimatedQuantity: 12,
        estimatedWeightKg: 4.8,
        address: '420 Innovation Way, Silicon Valley, CA 94025',
        scheduledDate: '2026-10-22',
        timeSlot: '09:00 AM - 12:00 PM',
        specialInstructions: 'Decommissioned smartphones from QA device lab.',
        assignedPartnerId: 'usr_partner_01',
        assignedPartnerName: 'Marcus Sterling (GreenRoute Fleet)',
        currentStatus: 'Weighed',
        statusHistory: [
          { status: 'Requested', timestamp: '2026-10-20T08:00:00.000Z', changedBy: 'usr_individual_01', changedByName: 'Sarah Jenkins' },
          { status: 'Approved', timestamp: '2026-10-20T09:30:00.000Z', changedBy: 'usr_admin_01', changedByName: 'Admin' },
          { status: 'Assigned', timestamp: '2026-10-20T10:00:00.000Z', changedBy: 'usr_admin_01', changedByName: 'Admin' },
          { status: 'Collected', timestamp: '2026-10-22T10:15:00.000Z', changedBy: 'usr_partner_01', changedByName: 'Marcus Sterling' },
          { status: 'Weighed', timestamp: '2026-10-22T11:45:00.000Z', changedBy: 'usr_partner_01', changedByName: 'Marcus Sterling' }
        ],
        createdAt: '2026-10-20T08:00:00.000Z',
        updatedAt: '2026-10-22T11:45:00.000Z'
      }
    ];

    const defaultCollections: CollectionRecord[] = [
      {
        id: 'col_201',
        pickupId: 'pck_102',
        partnerId: 'usr_partner_01',
        partnerName: 'Marcus Sterling (GreenRoute Fleet)',
        submittedWeightKg: 8.4,
        verifiedWeightKg: 8.4,
        verificationStatus: 'verified',
        evidenceUrls: ['/uploads/evidence_battery_pack_weight.jpg'],
        notes: '25 hazardous lithium-ion polymer modules securely packed in fire-suppression vermiculite containers.',
        verifiedBy: 'usr_admin_01',
        verifiedAt: '2026-10-21T08:30:00.000Z',
        createdAt: '2026-10-20T16:00:00.000Z',
        updatedAt: '2026-10-21T08:30:00.000Z'
      },
      {
        id: 'col_202',
        pickupId: 'pck_103',
        partnerId: 'usr_partner_01',
        partnerName: 'Marcus Sterling (GreenRoute Fleet)',
        submittedWeightKg: 5.1,
        verificationStatus: 'unverified',
        evidenceUrls: ['/uploads/scale_smartphones_12units.jpg'],
        notes: '12 test devices intact. Awaiting official weigh-scale hub calibration audit.',
        createdAt: '2026-10-22T11:45:00.000Z',
        updatedAt: '2026-10-22T11:45:00.000Z'
      }
    ];

    const defaultRecyclers: RecyclerRecord[] = [
      {
        id: 'rec_301',
        collectionRecordId: 'col_201',
        pickupId: 'pck_102',
        recyclerId: 'usr_recycler_01',
        recyclerName: 'Elena Rostova (AeroSmelt Corp)',
        receivedWeightKg: 8.4,
        processedWeightKg: 8.1,
        category: 'Batteries and Chargers',
        processingEvidenceUrls: ['/uploads/aerosmelt_pyrometallurgy_batch_409.pdf'],
        processingStatus: 'Recycled',
        notes: 'Hydro-metallurgical closed-loop recovery executed. 96.2% cobalt and 98.1% lithium carbonate recovery yield.',
        processedAt: '2026-10-22T14:30:00.000Z',
        createdAt: '2026-10-21T10:00:00.000Z',
        updatedAt: '2026-10-22T15:00:00.000Z'
      }
    ];

    const defaultEpr: EPRRecord[] = [
      {
        id: 'epr_401',
        sourceRecyclerRecordId: 'rec_301',
        pickupId: 'pck_102',
        materialCategory: 'Batteries and Chargers',
        reportingPeriod: '2026-Q4',
        eligibleWeightKg: 8.1,
        creditUnits: 16.2, // Configurable calculation: Batteries yield 2.0 credits/kg due to high rare-metal intensity
        creditStatus: 'Available',
        approvalStatus: 'Approved',
        approvedBy: 'usr_admin_01',
        approvedAt: '2026-10-23T10:15:00.000Z',
        targetProducer: 'OmniConsumer Tech Global',
        isDemoRecord: true,
        notes: 'Eligible for Tier-1 Closed-Loop Battery Directive Compliance. Verified against AeroSmelt Batch #409.',
        createdAt: '2026-10-22T16:00:00.000Z',
        updatedAt: '2026-10-23T10:15:00.000Z'
      },
      {
        id: 'epr_402',
        sourceRecyclerRecordId: 'rec_sample_302',
        pickupId: 'pck_sample_099',
        materialCategory: 'Laptops and Computers',
        reportingPeriod: '2026-Q3',
        eligibleWeightKg: 142.5,
        creditUnits: 171.0, // 1.2 credits/kg for motherboards, copper heat-pipes & displays
        creditStatus: 'Utilized',
        approvalStatus: 'Approved',
        approvedBy: 'usr_admin_01',
        approvedAt: '2026-09-30T17:00:00.000Z',
        targetProducer: 'Nexus Computing Devices Corp',
        isDemoRecord: true,
        notes: 'Applied toward Annual Extended Producer Responsibility Mandatory Target 2026.',
        createdAt: '2026-09-28T11:00:00.000Z',
        updatedAt: '2026-09-30T17:00:00.000Z'
      },
      {
        id: 'epr_403',
        sourceRecyclerRecordId: 'rec_sample_303',
        pickupId: 'pck_sample_098',
        materialCategory: 'Televisions and Monitors',
        reportingPeriod: '2026-Q4',
        eligibleWeightKg: 68.0,
        creditUnits: 68.0, // 1.0 credit/kg
        creditStatus: 'Pending Review',
        approvalStatus: 'Pending',
        targetProducer: 'VisionDisplay Tech',
        isDemoRecord: true,
        notes: 'Lead glass phosphor compliance documentation under technical audit.',
        createdAt: '2026-10-23T14:00:00.000Z',
        updatedAt: '2026-10-23T14:00:00.000Z'
      }
    ];

    const defaultAuditLogs: AuditLog[] = [
      {
        id: 'audit_init_01',
        actorId: 'usr_admin_01',
        actorName: 'Dr. Evelyn Vance',
        actorRole: 'admin',
        action: 'PLATFORM_INITIALIZATION',
        entityType: 'PlatformSetting',
        entityId: 'global_config',
        updatedValues: { environment: 'production-ready', eprRulesVersion: '2026.4' },
        timestamp: '2026-01-15T08:00:00.000Z'
      },
      {
        id: 'audit_init_02',
        actorId: 'usr_partner_01',
        actorName: 'Marcus Sterling',
        actorRole: 'partner',
        action: 'SUBMIT_COLLECTION_WEIGHT',
        entityType: 'CollectionRecord',
        entityId: 'col_201',
        updatedValues: { submittedWeightKg: 8.4, evidenceProvided: true },
        timestamp: '2026-10-20T16:00:00.000Z'
      },
      {
        id: 'audit_init_03',
        actorId: 'usr_admin_01',
        actorName: 'Dr. Evelyn Vance',
        actorRole: 'admin',
        action: 'VERIFY_COLLECTION_WEIGHT',
        entityType: 'CollectionRecord',
        entityId: 'col_201',
        previousValues: { verificationStatus: 'unverified' },
        updatedValues: { verificationStatus: 'verified', verifiedWeightKg: 8.4 },
        timestamp: '2026-10-21T08:30:00.000Z'
      },
      {
        id: 'audit_init_04',
        actorId: 'usr_admin_01',
        actorName: 'Dr. Evelyn Vance',
        actorRole: 'admin',
        action: 'APPROVE_EPR_CREDIT',
        entityType: 'EPRRecord',
        entityId: 'epr_401',
        previousValues: { approvalStatus: 'Pending', creditStatus: 'Pending Review' },
        updatedValues: { approvalStatus: 'Approved', creditStatus: 'Available', creditUnits: 16.2 },
        timestamp: '2026-10-23T10:15:00.000Z'
      }
    ];

    this.data.users = defaultUsers;
    this.data.centers = defaultCenters;
    this.data.pickups = defaultPickups;
    this.data.collections = defaultCollections;
    this.data.recyclers = defaultRecyclers;
    this.data.epr = defaultEpr;
    this.data.auditLogs = defaultAuditLogs;

    this.save();
    console.log('Database successfully seeded with realistic enterprise datasets!');
  }
}

export const db = new Database();
