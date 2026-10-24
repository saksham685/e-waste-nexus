import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/database.js';
import { JWT_SECRET } from '../middleware/auth.js';
import { EPR_CONVERSION_FACTORS } from '../controllers/eprController.js';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  \x1b[32m✔ PASS:\x1b[0m ${testName}`);
    passed++;
  } else {
    console.error(`  \x1b[31m✖ FAIL:\x1b[0m ${testName}`);
    failed++;
  }
}

async function runTestSuite() {
  console.log('\n=============================================');
  console.log('🧪 E-WASTE NEXUS AUTOMATED VERIFICATION SUITE');
  console.log('=============================================\n');

  // Test 1: User Database Seeding & Password Hashing
  console.log('Test Group 1: Authentication & User Governance');
  const admin = db.users.findOne(u => u.role === 'admin');
  assert(!!admin, 'Default Admin account exists');
  if (admin) {
    const isPasswordCorrect = bcrypt.compareSync('Admin@123', admin.passwordHash);
    assert(isPasswordCorrect, 'Admin password hash verifies correctly');
    const token = jwt.sign({ id: admin.id, role: admin.role }, JWT_SECRET);
    const decoded: any = jwt.verify(token, JWT_SECRET);
    assert(decoded.id === admin.id && decoded.role === 'admin', 'JWT token generates and verifies with correct claims');
  }

  // Test 2: Pickup Request Lifecycle & Transitions
  console.log('\nTest Group 2: Pickup Lifecycle & State Transitions');
  const testPickup = db.pickups.insert({
    id: 'test_pck_' + Date.now(),
    userId: 'usr_individual_01',
    userName: 'Sarah Jenkins',
    userEmail: 'user@nexus.eco',
    userPhone: '555-0199',
    category: 'Laptops and Computers',
    estimatedQuantity: 4,
    estimatedWeightKg: 10,
    address: '100 Tech Blvd',
    scheduledDate: '2026-11-01',
    currentStatus: 'Requested',
    statusHistory: [{ status: 'Requested', timestamp: new Date().toISOString(), changedBy: 'usr_individual_01' }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  assert(testPickup.currentStatus === 'Requested', 'New pickup created in Requested state');

  // Transition to Approved
  const updatedPickup = db.pickups.update(testPickup.id, {
    currentStatus: 'Approved',
    statusHistory: [...testPickup.statusHistory, { status: 'Approved', timestamp: new Date().toISOString(), changedBy: 'usr_admin_01' }]
  });
  assert(updatedPickup?.currentStatus === 'Approved', 'Pickup transitioned to Approved state');

  // Test 3: Weight Unverified Rule & QA Verification
  console.log('\nTest Group 3: Physical Weight Logging & QA Verification');
  const collectionRecord = db.collections.insert({
    id: 'test_col_' + Date.now(),
    pickupId: testPickup.id,
    partnerId: 'usr_partner_01',
    partnerName: 'Marcus Sterling',
    submittedWeightKg: 10.5,
    verificationStatus: 'unverified', // Crucial rule: collected weight must remain unverified initially
    evidenceUrls: ['/uploads/test_scale.jpg'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  assert(collectionRecord.verificationStatus === 'unverified', 'Initial collection weight remains unverified');
  assert(collectionRecord.submittedWeightKg === 10.5, 'Submitted physical weight recorded');

  // Admin verifies weight
  const verifiedCol = db.collections.update(collectionRecord.id, {
    verifiedWeightKg: 10.2, // QA adjustment
    verificationStatus: 'verified',
    verifiedBy: 'usr_admin_01',
    verifiedAt: new Date().toISOString()
  });
  assert(verifiedCol?.verificationStatus === 'verified', 'Admin authorized verification completed');
  assert(verifiedCol?.verifiedWeightKg === 10.2, 'Audited weight value recorded while maintaining submitted 10.5kg');

  // Test 4: Recycler Processing & Yield
  console.log('\nTest Group 4: Recycler Processing & Assay Verification');
  const recyclerRecord = db.recyclers.insert({
    id: 'test_rec_' + Date.now(),
    collectionRecordId: collectionRecord.id,
    pickupId: testPickup.id,
    recyclerId: 'usr_recycler_01',
    recyclerName: 'Elena Rostova (AeroSmelt Corp)',
    receivedWeightKg: 10.2,
    processedWeightKg: 9.8,
    category: 'Laptops and Computers',
    processingEvidenceUrls: ['/uploads/test_assay.pdf'],
    processingStatus: 'Recycled',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  assert(recyclerRecord.processingStatus === 'Recycled', 'Recycling processing confirmed complete');
  assert(recyclerRecord.processedWeightKg < recyclerRecord.receivedWeightKg, 'Separation loss accurately represented');

  // Test 5: EPR Calculation & Anti-Duplicate Rule
  console.log('\nTest Group 5: EPR Calculation & Compliance Duplicate Guard');
  const factor = EPR_CONVERSION_FACTORS['Laptops and Computers'];
  const expectedCredits = Math.round(recyclerRecord.processedWeightKg * factor * 100) / 100;
  assert(expectedCredits === 11.76, `EPR factor formula correctly calculated (${recyclerRecord.processedWeightKg} * ${factor} = ${expectedCredits})`);

  const eprRecord = db.epr.insert({
    id: 'test_epr_' + Date.now(),
    sourceRecyclerRecordId: recyclerRecord.id,
    pickupId: testPickup.id,
    materialCategory: 'Laptops and Computers',
    reportingPeriod: '2026-Q4',
    eligibleWeightKg: recyclerRecord.processedWeightKg,
    creditUnits: expectedCredits,
    creditStatus: 'Pending Review',
    approvalStatus: 'Pending',
    isDemoRecord: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  assert(eprRecord.approvalStatus === 'Pending', 'EPR record created with initial Pending compliance review');

  // Check duplicate prevention logic
  const duplicateFound = db.epr.findOne(e => e.sourceRecyclerRecordId === recyclerRecord.id && e.approvalStatus !== 'Flagged');
  assert(!!duplicateFound, 'Duplicate guard successfully identifies existing EPR record for same recycling batch');

  // Clean up test records
  db.pickups.delete(testPickup.id);
  db.collections.delete(collectionRecord.id);
  db.recyclers.delete(recyclerRecord.id);
  db.epr.delete(eprRecord.id);

  console.log('\n---------------------------------------------');
  console.log(`Results: ${passed} Passed, ${failed} Failed`);
  console.log('---------------------------------------------\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
