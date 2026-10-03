import {
  Account,
  Product,
  Opportunity,
  GroundTruthRecord,
  RecommendationEvent,
  RecommendationExperience,
  RecommendationRecommendationItem,
  ModelVersion,
  ExperienceStatus,
} from '../types';
import {
  initialAccounts,
  initialProducts,
  initialOpportunities,
  initialGroundTruth,
  initialRecommendations,
  initialExperiences,
  currentModelInfo,
  modelVersionHistory,
} from '../data/mockData';

const STORAGE_KEYS = {
  ACCOUNTS: 'crosssync_accounts',
  PRODUCTS: 'crosssync_products',
  OPPORTUNITIES: 'crosssync_opportunities',
  GROUNDTRUTH: 'crosssync_groundtruth',
  RECOMMENDATIONS: 'crosssync_recommendations',
  EXPERIENCES: 'crosssync_experiences',
  MODEL_VERSIONS: 'crosssync_model_versions',
  LAST_EXPORT: 'crosssync_last_export',
};

class StorageService {
  private listeners: (() => void)[] = [];

  constructor() {
    this.init();
  }

  private init() {
    if (!localStorage.getItem(STORAGE_KEYS.ACCOUNTS)) {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(initialAccounts));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
    }
    if (!localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES)) {
      localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(initialOpportunities));
    }
    if (!localStorage.getItem(STORAGE_KEYS.GROUNDTRUTH)) {
      localStorage.setItem(STORAGE_KEYS.GROUNDTRUTH, JSON.stringify(initialGroundTruth));
    }
    if (!localStorage.getItem(STORAGE_KEYS.RECOMMENDATIONS)) {
      localStorage.setItem(STORAGE_KEYS.RECOMMENDATIONS, JSON.stringify(initialRecommendations));
    }
    if (!localStorage.getItem(STORAGE_KEYS.EXPERIENCES)) {
      localStorage.setItem(STORAGE_KEYS.EXPERIENCES, JSON.stringify(initialExperiences));
    }
    if (!localStorage.getItem(STORAGE_KEYS.MODEL_VERSIONS)) {
      localStorage.setItem(STORAGE_KEYS.MODEL_VERSIONS, JSON.stringify(modelVersionHistory));
    }
    if (!localStorage.getItem(STORAGE_KEYS.LAST_EXPORT)) {
      localStorage.setItem(STORAGE_KEYS.LAST_EXPORT, '02 Oct 2026 14:00 UTC');
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  public getAccounts(): Account[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      return data ? JSON.parse(data) : initialAccounts;
    } catch {
      return initialAccounts;
    }
  }

  public getAccountById(id: string): Account | undefined {
    return this.getAccounts().find((a) => a.id === id);
  }

  public getProducts(): Product[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return data ? JSON.parse(data) : initialProducts;
    } catch {
      return initialProducts;
    }
  }

  public getProductById(id: string): Product | undefined {
    return this.getProducts().find((p) => p.id === id);
  }

  public getOpportunities(): Opportunity[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES);
      return data ? JSON.parse(data) : initialOpportunities;
    } catch {
      return initialOpportunities;
    }
  }

  public getOpportunityById(id: string): Opportunity | undefined {
    return this.getOpportunities().find((o) => o.id === id);
  }

  public getGroundTruth(): GroundTruthRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GROUNDTRUTH);
      return data ? JSON.parse(data) : initialGroundTruth;
    } catch {
      return initialGroundTruth;
    }
  }

  public getGroundTruthById(id: string): GroundTruthRecord | undefined {
    return this.getGroundTruth().find((gt) => gt.id === id);
  }

  public getRecommendations(): RecommendationEvent[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RECOMMENDATIONS);
      return data ? JSON.parse(data) : initialRecommendations;
    } catch {
      return initialRecommendations;
    }
  }

  public getRecommendationById(id: string): RecommendationEvent | undefined {
    return this.getRecommendations().find((r) => r.id === id);
  }

  public getExperiences(): RecommendationExperience[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EXPERIENCES);
      return data ? JSON.parse(data) : initialExperiences;
    } catch {
      return initialExperiences;
    }
  }

  public getExperienceById(id: string): RecommendationExperience | undefined {
    return this.getExperiences().find((e) => e.id === id);
  }

  public getModelVersions(): ModelVersion[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MODEL_VERSIONS);
      return data ? JSON.parse(data) : modelVersionHistory;
    } catch {
      return modelVersionHistory;
    }
  }

  public getLastExportTime(): string {
    return localStorage.getItem(STORAGE_KEYS.LAST_EXPORT) || '02 Oct 2026';
  }

  public setLastExportTime(time: string) {
    localStorage.setItem(STORAGE_KEYS.LAST_EXPORT, time);
    this.notify();
  }

  /**
   * Generates Top 5 Cross-Sell Recommendations via the RL Policy simulation
   * taking into account current product, account industry/size, and opportunity margin context.
   */
  public generateRLRecommendations(
    accountId: string,
    currentProductId: string,
    opportunityId: string
  ): RecommendationRecommendationItem[] {
    const account = this.getAccountById(accountId);
    const currentProduct = this.getProductById(currentProductId);
    const opportunity = this.getOpportunityById(opportunityId);
    const allProducts = this.getProducts();

    // Filter out current product — Cross-sell must recommend OTHER complementary products!
    const candidateProducts = allProducts.filter((p) => p.id !== currentProductId && p.active);

    // Compute RL contextual Q-value scores based on business context & historical affinities
    const scoredCandidates = candidateProducts.map((p) => {
      let score = 0.55;

      // 1. Cross-sell family complement logic
      if (currentProduct) {
        if (currentProduct.family === 'Infrastructure') {
          if (p.family === 'Cybersecurity') score += 0.22;
          else if (p.family === 'DevOps & SRE') score += 0.18;
          else if (p.family === 'Data & AI') score += 0.12;
        } else if (currentProduct.family === 'DevOps & SRE') {
          if (p.family === 'Infrastructure') score += 0.23;
          else if (p.family === 'Cybersecurity') score += 0.16;
        } else if (currentProduct.family === 'Data & AI') {
          if (p.family === 'Enterprise Applications') score += 0.20;
          else if (p.family === 'Cybersecurity') score += 0.15;
          else if (p.family === 'Infrastructure') score += 0.10;
        } else if (currentProduct.family === 'Enterprise Applications') {
          if (p.family === 'Data & AI') score += 0.24;
          else if (p.family === 'Cybersecurity') score += 0.14;
        }
      }

      // 2. Account industry alignment
      if (account) {
        if (account.industry === 'Financial Services' && (p.id === 'PROD-202' || p.id === 'PROD-205' || p.id === 'PROD-210')) {
          score += 0.14;
        }
        if (account.industry === 'Healthcare & Life Sciences' && (p.id === 'PROD-207' || p.id === 'PROD-208' || p.id === 'PROD-202')) {
          score += 0.15;
        }
        if (account.industry === 'Retail & E-Commerce' && (p.id === 'PROD-204' || p.id === 'PROD-209' || p.id === 'PROD-205')) {
          score += 0.16;
        }
        if (account.industry === 'Information Technology' && (p.id === 'PROD-203' || p.id === 'PROD-206' || p.id === 'PROD-202')) {
          score += 0.14;
        }
        if (account.customerPriority === 'Tier 1 - Strategic') {
          score += 0.04;
        }
      }

      // 3. Opportunity margin context
      if (opportunity) {
        if (opportunity.margin > 35) score += 0.03;
        if (opportunity.stage === 'Proposal/Price Quote' || opportunity.stage === 'Negotiation/Review') score += 0.02;
      }

      // Clamp between 0.45 and 0.94
      score = Math.min(0.94, Math.max(0.45, Math.round(score * 100) / 100));

      const marginLift = Math.round((p.typicalMargin / 3.5) * 10) / 10;
      const convRate = Math.round((score * 85 + 5) * 10) / 10;

      let synergyReasoning = `High cross-sell synergy with ${currentProduct?.name || 'installed base'}. Proven high conversion in ${account?.industry || 'enterprise'} sector.`;
      if (p.family === 'Cybersecurity') {
        synergyReasoning = `Essential security perimeter add-on for ${currentProduct?.name || 'current deployment'}. Mitigates compliance and data leakage risks.`;
      } else if (p.family === 'Data & AI') {
        synergyReasoning = `High-yield analytics layer directly utilizing data streams from ${currentProduct?.name || 'existing environment'}.`;
      } else if (p.family === 'DevOps & SRE') {
        synergyReasoning = `Accelerates operational delivery velocity and automated cluster orchestration alongside ${currentProduct?.name}.`;
      }

      return {
        productId: p.id,
        productName: p.name,
        agentScore: score,
        productDescription: p.description,
        productFamily: p.family,
        serviceLine: p.serviceLine,
        technology: p.technology,
        partner: p.partner,
        synergyReasoning,
        estimatedMarginImpact: `+${marginLift}% Margin Expansion`,
        historicalConversionRate: convRate,
      };
    });

    // Sort descending by Agent Score and take Top 5
    scoredCandidates.sort((a, b) => b.agentScore - a.agentScore);
    const top5 = scoredCandidates.slice(0, 5).map((item, index) => ({
      ...item,
      rank: index + 1,
    }));

    return top5;
  }

  /**
   * Save a newly generated recommendation event to history & initialize experience record
   */
  public saveRecommendation(
    accountId: string,
    currentProductId: string,
    opportunityId: string,
    topRecommendations: RecommendationRecommendationItem[]
  ): RecommendationEvent {
    const account = this.getAccountById(accountId);
    const currentProduct = this.getProductById(currentProductId);
    const opportunity = this.getOpportunityById(opportunityId);
    const topRec = topRecommendations[0];

    const newId = `REC-${Math.floor(700 + Math.random() * 900)}`;
    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);

    const event: RecommendationEvent = {
      id: newId,
      timestamp,
      accountId,
      accountName: account?.name || 'Unknown Account',
      currentProductId,
      currentProductName: currentProduct?.name || 'Unknown Product',
      opportunityId,
      opportunityName: opportunity?.name || 'Unknown Opportunity',
      opportunityAmount: opportunity?.amount || 0,
      topRecommendations,
      recommendedProductId: topRec.productId,
      recommendedProductName: topRec.productName,
      rank: 1,
      agentScore: topRec.agentScore,
      salespersonAction: 'Pending Review',
      outcome: 'Pending',
    };

    const recs = this.getRecommendations();
    recs.unshift(event);
    localStorage.setItem(STORAGE_KEYS.RECOMMENDATIONS, JSON.stringify(recs));

    // Also create initial Recommendation Experience record with status 'New'
    const newExpId = `EXP-${Math.floor(8800 + Math.random() * 900)}`;
    const newExperience: RecommendationExperience = {
      id: newExpId,
      recommendationId: newId,
      timestamp,
      accountId,
      accountName: account?.name || '',
      industry: account?.industry || '',
      currentProductId,
      currentProductName: currentProduct?.name || '',
      currentProductFamily: currentProduct?.family || '',
      opportunityId,
      opportunityName: opportunity?.name || '',
      opportunityAmount: opportunity?.amount || 0,
      opportunityStage: opportunity?.stage || '',
      recommendedProductId: topRec.productId,
      recommendedProductName: topRec.productName,
      recommendedProductFamily: topRec.productFamily,
      rank: 1,
      agentScore: topRec.agentScore,
      salespersonAction: 'Pending Review',
      outcome: 'In Discussion',
      feedbackReward: 0.0,
      experienceStatus: 'New',
      stateRepresentationVector: `[${account?.customerPriority || 'Tier'}, ${account?.industry || ''}, Marg_${opportunity?.margin || 0}%, Cur_${currentProduct?.name || ''}]`,
      actionTaken: `ACT_REC_${topRec.productName.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`,
      nextStateTransition: 'S_PRIME_EVALUATION_PENDING',
      notes: 'Initial RL recommendation generated. Awaiting salesperson interaction and customer outcome.',
    };

    const experiences = this.getExperiences();
    experiences.unshift(newExperience);
    localStorage.setItem(STORAGE_KEYS.EXPERIENCES, JSON.stringify(experiences));

    this.notify();
    return event;
  }

  /**
   * Records the salesperson response and outcome for a recommendation,
   * calculates the RL feedback reward, and updates the experience store for future retraining.
   */
  public recordSalespersonResponse(
    recommendationId: string,
    action: 'Accepted' | 'Rejected' | 'Adjusted Priority',
    outcome: 'Accepted' | 'Rejected' | 'Opportunity' | 'Closed-Won' | 'In Discussion',
    selectedRank: number,
    selectedProductId?: string,
    notes?: string
  ) {
    const recs = this.getRecommendations();
    const recIndex = recs.findIndex((r) => r.id === recommendationId);
    if (recIndex === -1) return;

    const rec = recs[recIndex];
    rec.salespersonAction = action;
    rec.outcome = outcome;
    if (notes) rec.salespersonNotes = notes;

    // If an alternative ranked item was selected from the Top 5
    if (selectedProductId && selectedProductId !== rec.recommendedProductId) {
      const match = rec.topRecommendations.find((item) => item.productId === selectedProductId);
      if (match) {
        rec.recommendedProductId = match.productId;
        rec.recommendedProductName = match.productName;
        rec.rank = match.rank;
        rec.agentScore = match.agentScore;
      }
    }

    // Determine RL Feedback Reward:
    // Closed-Won: +5.0 (High positive reinforcement)
    // Opportunity: +2.5 (Medium positive reinforcement)
    // Accepted: +1.0 (Sales agreement reward)
    // Rejected: -0.5 (Penalize misleading exploration)
    // In Discussion: +0.2 (Exploration step)
    let reward = 1.0;
    if (outcome === 'Closed-Won') reward = 5.0;
    else if (outcome === 'Opportunity') reward = 2.5;
    else if (outcome === 'Rejected' || action === 'Rejected') reward = -0.5;
    else if (outcome === 'In Discussion') reward = 0.2;

    rec.feedbackReward = reward;
    recs[recIndex] = rec;
    localStorage.setItem(STORAGE_KEYS.RECOMMENDATIONS, JSON.stringify(recs));

    // Update associated Recommendation Experience record
    const experiences = this.getExperiences();
    const expIndex = experiences.findIndex((e) => e.recommendationId === recommendationId);

    if (expIndex !== -1) {
      const exp = experiences[expIndex];
      exp.salespersonAction = action;
      exp.outcome = outcome;
      exp.feedbackReward = reward;
      exp.rank = rec.rank;
      exp.recommendedProductId = rec.recommendedProductId;
      exp.recommendedProductName = rec.recommendedProductName;
      exp.notes = notes || exp.notes;
      exp.experienceStatus = 'Ready for Export';
      exp.nextStateTransition =
        outcome === 'Closed-Won'
          ? 'S_PRIME_CLOSED_WON_MAX_REWARD'
          : outcome === 'Opportunity'
          ? 'S_PRIME_OPPORTUNITY_QUALIFIED'
          : action === 'Rejected'
          ? 'S_PRIME_NEGATIVE_PENALTY_RECORDED'
          : 'S_PRIME_SALES_ACCEPTED';

      experiences[expIndex] = exp;
      localStorage.setItem(STORAGE_KEYS.EXPERIENCES, JSON.stringify(experiences));
    }

    this.notify();
  }

  /**
 * Trains the RL policy using completed experience tuples.
 *
 * This frontend implementation creates a new model version
 * from the available experience buffer and stores the training
 * result in localStorage.
 */
public trainRLModel(): {
  success: boolean;
  message: string;
  version?: string;
  experiencesTrained?: number;
} {
  const experiences = this.getExperiences();

  // Select completed experiences that can be used for retraining.
  const trainingExperiences = experiences.filter(
  (exp) =>
    (exp.experienceStatus === 'Ready for Export' ||
      exp.experienceStatus === 'Recorded') &&
    exp.outcome !== 'In Discussion'
);

  if (trainingExperiences.length === 0) {
    return {
      success: false,
      message: 'No completed experience tuples are available for RL training.',
    };
  }

  const modelVersions = this.getModelVersions();

  // Find the currently deployed model.
  const activeModel =
    modelVersions.find(
      (model) => model.status === 'Active / Deployed'
    ) || modelVersions[0];

  if (!activeModel) {
    return {
      success: false,
      message: 'No existing RL model was found for retraining.',
    };
  }

  // Calculate training statistics from the experience buffer.
  const totalReward = trainingExperiences.reduce(
    (sum, exp) => sum + exp.feedbackReward,
    0
  );

  const averageReward =
    totalReward / trainingExperiences.length;

  const positiveExperiences = trainingExperiences.filter(
    (exp) => exp.feedbackReward > 0
  ).length;

  const positiveRate =
    positiveExperiences / trainingExperiences.length;

  const timestamp = new Date();

  const datePart = timestamp
    .toISOString()
    .substring(0, 10)
    .replace(/-/g, '');

  const versionNumber =
    `v2.5-DQN-ExperienceBuffer-${datePart}`;

  /*
   * Create a new model version.
   *
   * The new model is placed into Evaluation status.
   * It does NOT automatically replace the currently deployed model.
   */
  const trainedModel = {
    ...activeModel,

    version: versionNumber,

    status: 'Evaluation',

    deployedDate:
      timestamp
        .toISOString()
        .replace('T', ' ')
        .substring(0, 16) + ' UTC',

    totalTrainingEpisodes:
      activeModel.totalTrainingEpisodes +
      trainingExperiences.length * 25,

    experiencesTrainedOn:
      activeModel.experiencesTrainedOn +
      trainingExperiences.length,

    avgRewardPerSession: Number(
      (
        (activeModel.avgRewardPerSession + averageReward) /
        2
      ).toFixed(2)
    ),

    modelCheckpointsPath:
      `models/checkpoints/${versionNumber}_evaluation.pt`,

    evaluationSummary:
      `Training completed using ${trainingExperiences.length} experience tuples. ` +
      `Average reward: ${averageReward.toFixed(2)}. ` +
      `Positive reward rate: ${(positiveRate * 100).toFixed(1)}%. ` +
      `Model is currently under evaluation and has not been deployed.`,

  } as ModelVersion;

  // Store the new model at the beginning of the model history.
  const updatedModelVersions = [
    trainedModel,
    ...modelVersions,
  ];

  localStorage.setItem(
    STORAGE_KEYS.MODEL_VERSIONS,
    JSON.stringify(updatedModelVersions)
  );

  // Notify the application so subscribed components refresh.
  this.notify();

  return {
    success: true,
    message: 'RL training completed successfully.',
    version: versionNumber,
    experiencesTrained: trainingExperiences.length,
  };
}
  public updateExperienceStatus(experienceId: string, status: ExperienceStatus) {
    const experiences = this.getExperiences();
    const index = experiences.findIndex((e) => e.id === experienceId);
    if (index !== -1) {
      experiences[index].experienceStatus = status;
      localStorage.setItem(STORAGE_KEYS.EXPERIENCES, JSON.stringify(experiences));
      this.notify();
    }
  }

  public markBatchAsExported(experienceIds: string[], batchId: string) {
    const experiences = this.getExperiences();
    const updated = experiences.map((exp) => {
      if (experienceIds.includes(exp.id)) {
        return {
          ...exp,
          experienceStatus: 'Exported' as ExperienceStatus,
          exportBatchId: batchId,
        };
      }
      return exp;
    });

    localStorage.setItem(STORAGE_KEYS.EXPERIENCES, JSON.stringify(updated));
    const now = new Date();
    this.setLastExportTime(now.toUTCString().replace('GMT', 'UTC'));
    this.notify();
  }

  public resetToDemoData() {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(initialAccounts));
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
    localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(initialOpportunities));
    localStorage.setItem(STORAGE_KEYS.GROUNDTRUTH, JSON.stringify(initialGroundTruth));
    localStorage.setItem(STORAGE_KEYS.RECOMMENDATIONS, JSON.stringify(initialRecommendations));
    localStorage.setItem(STORAGE_KEYS.EXPERIENCES, JSON.stringify(initialExperiences));
    localStorage.setItem(STORAGE_KEYS.MODEL_VERSIONS, JSON.stringify(modelVersionHistory));
    localStorage.setItem(STORAGE_KEYS.LAST_EXPORT, '02 Oct 2026 14:00 UTC');
    this.notify();
  }
}

export const storageService = new StorageService();
