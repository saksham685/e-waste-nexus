export type UserRole = 'individual' | 'partner' | 'recycler' | 'admin';
export type AccountStatus = 'active' | 'pending' | 'suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  phone?: string;
  address?: string;
  organization?: string;
  createdAt: string;
}

export type WasteCategory =
  | 'Smartphones and Tablets'
  | 'Laptops and Computers'
  | 'Batteries and Chargers'
  | 'Televisions and Monitors'
  | 'Printers and Office Electronics'
  | 'Large Electrical Appliances'
  | 'Other Electronic Waste';

export type PickupStatus =
  | 'Requested'
  | 'Approved'
  | 'Assigned'
  | 'Collected'
  | 'Weighed'
  | 'InTransit'
  | 'ReceivedAtCenter'
  | 'TransferredToRecycler'
  | 'Sent for Recycling'
  | 'Processed'
  | 'Certified'
  | 'Completed'
  | 'Rejected'
  | 'Cancelled';

export interface StatusHistoryEntry {
  status: PickupStatus;
  timestamp: string;
  changedBy: string;
  changedByName?: string;
  note?: string;
}

export interface PickupRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  category: WasteCategory;
  deviceCategory?: string;
  estimatedQuantity: number;
  estimatedWeightKg: number;
  actualWeightKg?: number;
  address: string;
  scheduledDate: string;
  timeSlot?: string;
  specialInstructions?: string;
  assignedPartnerId?: string;
  assignedPartnerName?: string;
  currentStatus: PickupStatus;
  statusHistory: StatusHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface CollectionRecord {
  id: string;
  pickupId: string;
  partnerId: string;
  partnerName: string;
  submittedWeightKg: number;
  verifiedWeightKg?: number;
  verificationStatus: 'unverified' | 'verified' | 'disputed';
  evidenceUrls: string[];
  notes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
  pickupDetails?: {
    category: WasteCategory;
    address: string;
    scheduledDate: string;
    userName: string;
    currentStatus: PickupStatus;
  };
}

export interface RecyclerRecord {
  id: string;
  collectionRecordId: string;
  pickupId: string;
  recyclerId: string;
  recyclerName: string;
  receivedWeightKg: number;
  processedWeightKg: number;
  category: WasteCategory;
  processingEvidenceUrls: string[];
  processingStatus: 'Received' | 'In-Processing' | 'Recycled' | 'Disposed';
  notes?: string;
  processedAt?: string;
  createdAt: string;
  collectionInfo?: CollectionRecord;
  pickupInfo?: PickupRequest;
}

export interface EPRRecord {
  id: string;
  sourceRecyclerRecordId?: string;
  pickupId?: string;
  materialCategory?: WasteCategory;
  category?: string;
  producerName: string;
  certificateNumber: string;
  creditsEarnedKg: number;
  recyclerName: string;
  status: string;
  issuedAt: string;
  reportingPeriod?: string;
  eligibleWeightKg?: number;
  creditUnits?: number;
  creditStatus?: 'Available' | 'Pending Review' | 'Utilized' | 'Rejected';
  approvalStatus?: 'Pending' | 'Approved' | 'Flagged';
  approvedBy?: string;
  approvedAt?: string;
  targetProducer?: string;
  isDemoRecord?: boolean;
  notes?: string;
  createdAt?: string;
  recyclerInfo?: RecyclerRecord;
  pickupInfo?: PickupRequest;
}

export interface CollectionCenter {
  id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  email: string;
  acceptedCategories: WasteCategory[];
  operatingHours: string;
  isVerified: boolean;
  latitude: number;
  longitude: number;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  entityType: string;
  entityId: string;
  previousValues?: any;
  updatedValues?: any;
  timestamp: string;
}
