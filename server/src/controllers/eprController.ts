import { Response } from 'express';
import { db } from '../db/database.js';
import { AuthRequest } from '../middleware/auth.js';
import { EPRRecord, WasteCategory } from '../types.js';

// Configurable EPR Credit Conversion Factors (credits per kg of verified recycled material)
export const EPR_CONVERSION_FACTORS: Record<WasteCategory, number> = {
  'Batteries and Chargers': 2.0, // High cobalt, lithium, and nickel intensity
  'Smartphones and Tablets': 1.8, // High gold, palladium, tantalum concentration
  'Laptops and Computers': 1.2, // Multi-layer PCBs, copper heat pipes, aluminum
  'Televisions and Monitors': 1.0, // Glass, indium tin oxide, structural plastics
  'Printers and Office Electronics': 0.8, // Electromechanical parts, toner plastics
  'Large Electrical Appliances': 0.5, // Ferrous metals, compressors
  'Other Electronic Waste': 0.5
};

export function createEPRRecord(req: AuthRequest, res: Response): void {
  try {
    const user = req.user!;
    const { sourceRecyclerRecordId, targetProducer, reportingPeriod, isDemoRecord = true, notes } = req.body;

    if (!sourceRecyclerRecordId) {
      res.status(400).json({ success: false, message: 'Source recycler record ID is required.' });
      return;
    }

    // Business Rule 1: Check source recycler record
    const recyclerRecord = db.recyclers.findById(sourceRecyclerRecordId);
    if (!recyclerRecord) {
      res.status(404).json({ success: false, message: 'Source recycler record not found.' });
      return;
    }

    // Business Rule 2: Material must be in Recycled status and have processed weight
    if (recyclerRecord.processingStatus !== 'Recycled' || recyclerRecord.processedWeightKg <= 0) {
      res.status(400).json({
        success: false,
        message: 'EPR credits cannot be issued: source material must have completed recycling with positive processed weight.'
      });
      return;
    }

    // Business Rule 3: Check underlying collection verification
    const collection = db.collections.findById(recyclerRecord.collectionRecordId);
    if (!collection || collection.verificationStatus !== 'verified') {
      res.status(400).json({
        success: false,
        message: 'EPR eligibility failed: underlying physical collection weight has not been officially verified by QA.'
      });
      return;
    }

    // Business Rule 4: Prevent duplicate credit issuance for the same eligible record
    const duplicate = db.epr.findOne(e => e.sourceRecyclerRecordId === sourceRecyclerRecordId && e.approvalStatus !== 'Flagged');
    if (duplicate) {
      res.status(409).json({
        success: false,
        message: `An EPR credit record (#${duplicate.id}) is already active or approved for this recycling batch. Duplicate issuance is strictly prohibited.`
      });
      return;
    }

    const category = recyclerRecord.category;
    const factor = EPR_CONVERSION_FACTORS[category] || 0.5;
    const eligibleWeightKg = recyclerRecord.processedWeightKg;
    const creditUnits = Math.round(eligibleWeightKg * factor * 100) / 100;

    const currentYear = new Date().getFullYear();
    const currentQuarter = Math.floor((new Date().getMonth() + 3) / 3);
    const period = reportingPeriod || `${currentYear}-Q${currentQuarter}`;

    const newRecord: EPRRecord = {
      id: 'epr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      sourceRecyclerRecordId,
      pickupId: recyclerRecord.pickupId,
      materialCategory: category,
      reportingPeriod: period,
      eligibleWeightKg,
      creditUnits,
      creditStatus: 'Pending Review',
      approvalStatus: 'Pending',
      targetProducer: targetProducer || 'Unassigned EPR Pool',
      isDemoRecord: Boolean(isDemoRecord),
      notes: notes || `Generated via ${category} recovery. Multiplier: ${factor}x`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.epr.insert(newRecord);

    db.logAudit(
      user.id,
      user.name,
      user.role,
      'CREATE_EPR_CREDIT_RECORD',
      'EPRRecord',
      newRecord.id,
      undefined,
      { creditUnits, eligibleWeightKg, materialCategory: category, isDemoRecord: newRecord.isDemoRecord }
    );

    res.status(201).json({
      success: true,
      message: `EPR credit claim created for ${creditUnits} credit units (${eligibleWeightKg} kg). Pending compliance authorization.`,
      eprRecord: newRecord
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to create EPR record' });
  }
}

export function getEPRRecords(req: AuthRequest, res: Response): void {
  try {
    const { status, approval, period, category } = req.query;

    let list = db.epr.find();

    if (status && typeof status === 'string') {
      list = list.filter(e => e.creditStatus.toLowerCase() === status.toLowerCase());
    }

    if (approval && typeof approval === 'string') {
      list = list.filter(e => e.approvalStatus.toLowerCase() === approval.toLowerCase());
    }

    if (period && typeof period === 'string') {
      list = list.filter(e => e.reportingPeriod === period);
    }

    if (category && typeof category === 'string') {
      list = list.filter(e => e.materialCategory === category);
    }

    // Enrich with source recycler and pickup data
    const enriched = list.map(item => {
      const recycler = db.recyclers.findById(item.sourceRecyclerRecordId);
      const pickup = db.pickups.findById(item.pickupId);
      return {
        ...item,
        recyclerInfo: recycler,
        pickupInfo: pickup
      };
    });

    enriched.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Compute live summary stats
    const totalCredits = Math.round(list.reduce((sum, r) => sum + (r.approvalStatus === 'Approved' ? r.creditUnits : 0), 0) * 10) / 10;
    const pendingCredits = Math.round(list.reduce((sum, r) => sum + (r.approvalStatus === 'Pending' ? r.creditUnits : 0), 0) * 10) / 10;
    const totalVerifiedWeight = Math.round(list.reduce((sum, r) => sum + (r.approvalStatus === 'Approved' ? r.eligibleWeightKg : 0), 0) * 10) / 10;

    res.json({
      success: true,
      summary: {
        totalApprovedCredits: totalCredits,
        pendingReviewCredits: pendingCredits,
        totalEligibleWeightKg: totalVerifiedWeight,
        totalRecords: list.length
      },
      conversionFactors: EPR_CONVERSION_FACTORS,
      records: enriched
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch EPR records' });
  }
}

export function approveEPRRecord(req: AuthRequest, res: Response): void {
  try {
    const user = req.user!;
    const { id } = req.params;
    const { approvalStatus, creditStatus, targetProducer, notes } = req.body;

    // Rule: Require authorized admin approval
    if (user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Forbidden: Only authorized platform administrators can approve EPR credits.' });
      return;
    }

    const record = db.epr.findById(id);
    if (!record) {
      res.status(404).json({ success: false, message: 'EPR record not found.' });
      return;
    }

    const prev = { ...record };
    const nextApproval = approvalStatus || 'Approved';
    const nextCreditStatus = creditStatus || (nextApproval === 'Approved' ? 'Available' : 'Rejected');

    const updated = db.epr.update(id, {
      approvalStatus: nextApproval,
      creditStatus: nextCreditStatus,
      ...(targetProducer ? { targetProducer } : {}),
      approvedBy: user.id,
      approvedAt: nextApproval === 'Approved' ? new Date().toISOString() : undefined,
      ...(notes ? { notes: `${record.notes || ''}\n[Audit Note]: ${notes}`.trim() } : {}),
      updatedAt: new Date().toISOString()
    });

    db.logAudit(
      user.id,
      user.name,
      user.role,
      'APPROVE_EPR_RECORD',
      'EPRRecord',
      id,
      prev,
      { approvalStatus: nextApproval, creditStatus: nextCreditStatus }
    );

    res.json({
      success: true,
      message: `EPR Record ${id} status set to ${nextApproval} (${nextCreditStatus}).`,
      eprRecord: updated
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to approve EPR record' });
  }
}

export function downloadEPRCsvReport(req: AuthRequest, res: Response): void {
  try {
    const records = db.epr.find();

    const headers = [
      'EPR_Record_ID',
      'Reporting_Period',
      'Material_Category',
      'Eligible_Weight_KG',
      'EPR_Credit_Units',
      'Credit_Status',
      'Approval_Status',
      'Target_Producer',
      'Is_Demo_Record',
      'Approved_At',
      'Created_At'
    ];

    const rows = records.map(r => [
      `"${r.id}"`,
      `"${r.reportingPeriod}"`,
      `"${r.materialCategory}"`,
      r.eligibleWeightKg,
      r.creditUnits,
      `"${r.creditStatus}"`,
      `"${r.approvalStatus}"`,
      `"${r.targetProducer || 'Unassigned'}"`,
      r.isDemoRecord ? 'YES (DEMO DATA)' : 'NO',
      `"${r.approvedAt || 'N/A'}"`,
      `"${r.createdAt}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=EPR_Compliance_Report_${Date.now()}.csv`);
    res.send(csvContent);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to generate CSV report' });
  }
}
