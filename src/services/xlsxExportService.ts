import * as XLSX from 'xlsx';
import { RecommendationExperience } from '../types';
import { storageService } from './storageService';

export interface ExportFilterParams {
  dateFrom?: string;
  dateTo?: string;
  accountId?: string;
  productId?: string;
  outcome?: string;
  status?: string;
}

export function filterExperiences(
  experiences: RecommendationExperience[],
  filters: ExportFilterParams
): RecommendationExperience[] {
  return experiences.filter((exp) => {
    if (filters.accountId && exp.accountId !== filters.accountId) return false;
    if (filters.productId && exp.recommendedProductId !== filters.productId && exp.currentProductId !== filters.productId) {
      return false;
    }
    if (filters.outcome && exp.outcome !== filters.outcome) return false;
    if (filters.status && exp.experienceStatus !== filters.status) return false;
    if (filters.dateFrom) {
      const expDate = exp.timestamp.substring(0, 10);
      if (expDate < filters.dateFrom) return false;
    }
    if (filters.dateTo) {
      const expDate = exp.timestamp.substring(0, 10);
      if (expDate > filters.dateTo) return false;
    }
    return true;
  });
}

export function exportExperiencesToXLSX(
  experiences: RecommendationExperience[],
  customFilename?: string
): { success: boolean; count: number; filename: string } {
  if (!experiences || experiences.length === 0) {
    return { success: false, count: 0, filename: '' };
  }

  // 1. Prepare Primary Experience Training Sheet
  const experienceRows = experiences.map((exp) => ({
    'Experience ID': exp.id,
    'Recommendation ID': exp.recommendationId,
    'Timestamp (UTC)': exp.timestamp,
    'Account Name': exp.accountName,
    'Account ID': exp.accountId,
    'Industry': exp.industry,
    'Current Product': exp.currentProductName,
    'Current Product ID': exp.currentProductId,
    'Current Product Family': exp.currentProductFamily,
    'Opportunity Name': exp.opportunityName,
    'Opportunity ID': exp.opportunityId,
    'Opportunity Amount ($)': exp.opportunityAmount,
    'Opportunity Stage': exp.opportunityStage,
    'Recommended Product': exp.recommendedProductName,
    'Recommended Product ID': exp.recommendedProductId,
    'Recommended Family': exp.recommendedProductFamily,
    'RL Rank (#)': exp.rank,
    'Agent Score': exp.agentScore,
    'Salesperson Action': exp.salespersonAction,
    'Final Outcome': exp.outcome,
    'RL Feedback Reward': exp.feedbackReward,
    'Experience Status': exp.experienceStatus,
    'State Vector Representation': exp.stateRepresentationVector,
    'RL Action Key': exp.actionTaken,
    'Next State Transition': exp.nextStateTransition,
    'Salesperson Context Notes': exp.notes,
    'Export Batch ID': exp.exportBatchId || 'PENDING_BATCH',
  }));

  const wsExperiences = XLSX.utils.json_to_sheet(experienceRows);

  // Set explicit column widths for clean viewing in Excel
  wsExperiences['!cols'] = [
    { wch: 14 }, // Experience ID
    { wch: 16 }, // Recommendation ID
    { wch: 20 }, // Timestamp
    { wch: 25 }, // Account Name
    { wch: 12 }, // Account ID
    { wch: 22 }, // Industry
    { wch: 32 }, // Current Product
    { wch: 14 }, // Current Product ID
    { wch: 20 }, // Current Family
    { wch: 34 }, // Opportunity Name
    { wch: 14 }, // Opportunity ID
    { wch: 18 }, // Amount
    { wch: 20 }, // Stage
    { wch: 32 }, // Recommended Product
    { wch: 14 }, // Recommended ID
    { wch: 20 }, // Recommended Family
    { wch: 10 }, // Rank
    { wch: 12 }, // Agent Score
    { wch: 18 }, // Sales Action
    { wch: 16 }, // Outcome
    { wch: 16 }, // Reward
    { wch: 18 }, // Status
    { wch: 45 }, // State Vector
    { wch: 35 }, // Action Key
    { wch: 35 }, // State Transition
    { wch: 45 }, // Notes
    { wch: 20 }, // Export Batch
  ];

  // 2. Prepare RL Metadata Sheet
  const metadataRows = [
    { Parameter: 'Platform Name', Value: 'CrossSync — RL-Based Cross-Sell System' },
    { Parameter: 'Export Date', Value: new Date().toISOString() },
    { Parameter: 'Total Experience Records in File', Value: experiences.length },
    { Parameter: 'Active RL Agent Policy Version', Value: 'v2.4-DQN-CrossSell-Policy' },
    { Parameter: 'Algorithm', Value: 'Deep Q-Network (DQN) with Contextual Action Elimination' },
    { Parameter: 'Experience Replay Buffer Target', Value: 'models/replay_buffers/v2.5_retrain_queue.h5' },
    { Parameter: 'Reward Function Bounds', Value: '[-0.5 to +5.0] (Accepted: +1.0, Won: +5.0, Rejected: -0.5)' },
    { Parameter: 'Purpose', Value: 'Preserved post-deployment human feedback for offline RL retraining loops' },
  ];

  const wsMetadata = XLSX.utils.json_to_sheet(metadataRows);
  wsMetadata['!cols'] = [{ wch: 32 }, { wch: 60 }];

  // 3. Create Workbook & Append Sheets
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, wsExperiences, 'RL_Experiences');
  XLSX.utils.book_append_sheet(wb, wsMetadata, 'RL_Model_Metadata');

  // 4. Generate filename and trigger download
  const dateStr = new Date().toISOString().substring(0, 10).replace(/-/g, '');
  const finalFilename = customFilename || `crosssync_experience_data_${dateStr}.xlsx`;

  XLSX.writeFile(wb, finalFilename);

  // 5. Update experience status to 'Exported' and stamp batch
  const batchId = `BATCH-${dateStr}-${Math.floor(100 + Math.random() * 900)}`;
  const expIds = experiences.map((e) => e.id);
  storageService.markBatchAsExported(expIds, batchId);

  return { success: true, count: experiences.length, filename: finalFilename };
}
