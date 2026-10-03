export type NavigationPage =
  | 'dashboard'
  | 'recommend'
  | 'accounts'
  | 'account-details'
  | 'products'
  | 'product-details'
  | 'opportunities'
  | 'opportunity-details'
  | 'groundtruth'
  | 'groundtruth-details'
  | 'history'
  | 'recommendation-details'
  | 'experiences'
  | 'analytics'
  | 'rl-agent'
  | 'model-details';

export interface Account {
  id: string;
  name: string;
  industry: string;
  sector: string;
  annualRevenue: string;
  revenueNumeric: number;
  employees: number;
  customerPriority: 'Tier 1 - Strategic' | 'Tier 2 - Growth' | 'Tier 3 - Standard';
  rating: 'Hot' | 'Warm' | 'Active';
  ownership: 'Public' | 'Private' | 'Subsidiary';
  type: 'Enterprise Customer' | 'Channel Partner' | 'Mid-Market';
  locations: number;
  region: 'North America' | 'EMEA' | 'APAC' | 'LATAM';
  subregion: string;
  salesState: 'Active Expansion' | 'Renewal Due' | 'Stable' | 'Accelerating';
  description: string;
  headquarters: string;
  associatedProductIds: string[];
}

export interface Product {
  id: string;
  name: string;
  family: 'Infrastructure' | 'Cybersecurity' | 'Data & AI' | 'Enterprise Applications' | 'DevOps & SRE';
  description: string;
  productClass: 'Tier-1 Core' | 'Specialized Add-on' | 'Managed Platform Service';
  productType: 'SaaS Subscription' | 'Professional Services' | 'Hybrid Appliance + Cloud' | 'Managed Platform Service';
  productCode: string;
  sku: string;
  active: boolean;
  unitOfMeasure: string;
  seller: string;
  technology: string;
  partner: string;
  serviceLine: string;
  basePrice: string;
  typicalMargin: number;
}

export interface Opportunity {
  id: string;
  accountId: string;
  accountName: string;
  name: string;
  amount: number;
  closeDate: string;
  stage: 'Prospecting' | 'Value Proposition' | 'Proposal/Price Quote' | 'Negotiation/Review' | 'Closed Won' | 'Closed Lost';
  probability: number;
  opportunityScore: number;
  forecastCategory: 'Pipeline' | 'Best Case' | 'Commit' | 'Closed';
  type: string;
  contract: string;
  leadSource: string;
  quantity: number;
  currentProductId: string;
  currentProduct: string;
  projectValue: number;
  margin: number;
  cmPercent: number; // Contribution Margin %
  orderType: 'Subscription' | 'Subscription + SOW' | 'Fixed Milestone' | 'Managed Retainer';
  engagementType: 'Fixed Fee Milestone' | 'Time & Materials' | 'Managed Services' | 'Value-Based';
}

export interface GroundTruthRecord {
  id: string;
  opportunityId: string;
  accountId: string;
  accountName: string;
  currentProductId: string;
  currentProduct: string;
  crossSellRank: number;
  crossSellProductId: string;
  crossSellProduct: string;
  crossSellProductFamily: string;
  historicalWinRate: number;
  closedRevenue: number;
  closedQuarter: string;
  salesRepresentative: string;
}

export interface RecommendationRecommendationItem {
  rank: number;
  productId: string;
  productName: string;
  agentScore: number; // e.g. 0.88 (calibrated RL agent score)
  productDescription: string;
  productFamily: string;
  serviceLine: string;
  technology: string;
  partner: string;
  synergyReasoning: string;
  estimatedMarginImpact: string;
  historicalConversionRate: number;
}

export interface RecommendationEvent {
  id: string;
  timestamp: string;
  accountId: string;
  accountName: string;
  currentProductId: string;
  currentProductName: string;
  opportunityId: string;
  opportunityName: string;
  opportunityAmount: number;
  topRecommendations: RecommendationRecommendationItem[];
  // Selected or focal item for the single-row listing:
  recommendedProductId: string;
  recommendedProductName: string;
  rank: number;
  agentScore: number;
  salespersonAction: 'Accepted' | 'Rejected' | 'Pending Review' | 'Adjusted Priority';
  outcome: 'Accepted' | 'Rejected' | 'Opportunity' | 'Closed-Won' | 'In Discussion' | 'Pending';
  salespersonNotes?: string;
  feedbackReward?: number;
}

export type ExperienceStatus = 'New' | 'Recorded' | 'Ready for Export' | 'Exported';

export interface RecommendationExperience {
  id: string;
  recommendationId: string;
  timestamp: string;
  accountId: string;
  accountName: string;
  industry: string;
  currentProductId: string;
  currentProductName: string;
  currentProductFamily: string;
  opportunityId: string;
  opportunityName: string;
  opportunityAmount: number;
  opportunityStage: string;
  recommendedProductId: string;
  recommendedProductName: string;
  recommendedProductFamily: string;
  rank: number;
  agentScore: number;
  salespersonAction: 'Accepted' | 'Rejected' | 'Adjusted Priority' | 'Pending Review';
  outcome: 'Accepted' | 'Rejected' | 'Opportunity' | 'Closed-Won' | 'In Discussion';
  feedbackReward: number; // e.g. +1.0, +2.5, +5.0, -0.5
  experienceStatus: ExperienceStatus;
  stateRepresentationVector: string; // e.g. [Acc_Strat, Ind_Fin, Marg_34%, Cloud_Core]
  actionTaken: string;
  nextStateTransition: string;
  notes: string;
  exportBatchId?: string;
}

export interface ModelVersion {
  version: string;
  status: 'Active / Deployed' | 'Evaluation' | 'Archived' | 'Staging';
  deployedDate: string;
  algorithm: string;
  actionSpaceSize: number;
  stateSpaceDim: number;
  totalTrainingEpisodes: number;
  experiencesTrainedOn: number;
  hitRateAt5: number; // %
  ndcgAt5: number;
  mrr: number; // Mean Reciprocal Rank
  avgRewardPerSession: number;
  modelCheckpointsPath: string;
  framework: string;
  hyperparameters: {
    learningRate: number;
    gammaDiscount: number;
    epsilonGreedy: number;
    replayBufferSize: number;
    batchSize: number;
    targetUpdateFreq: number;
  };
  evaluationSummary: string;
  featureWeights: { feature: string; weight: number }[];
}
