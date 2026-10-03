import React, { useState, useEffect } from 'react';
import { NavigationPage } from './types';
import { storageService } from './services/storageService';
import { exportExperiencesToXLSX } from './services/xlsxExportService';

import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import AuthGate from './components/auth/AuthGate';

import { DashboardView } from './components/views/DashboardView';
import { RecommendView } from './components/views/RecommendView';
import { AccountsView } from './components/views/AccountsView';
import { AccountDetailView } from './components/views/AccountDetailView';
import { ProductsView } from './components/views/ProductsView';
import { ProductDetailView } from './components/views/ProductDetailView';
import { OpportunitiesView } from './components/views/OpportunitiesView';
import { OpportunityDetailView } from './components/views/OpportunityDetailView';
import { GroundTruthView } from './components/views/GroundTruthView';
import { GroundTruthDetailView } from './components/views/GroundTruthDetailView';
import { RecommendationHistoryView } from './components/views/RecommendationHistoryView';
import { RecommendationDetailView } from './components/views/RecommendationDetailView';
import { ExperiencesView } from './components/views/ExperiencesView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { RLAgentView } from './components/views/RLAgentView';
import { ModelDetailView } from './components/views/ModelDetailView';

export default function App() {
  const [currentPage, setCurrentPage] =
    useState<NavigationPage>('dashboard');

  // Selected item IDs for detail views
  const [selectedAccountId, setSelectedAccountId] =
    useState<string | null>('ACC-101');

  const [selectedProductId, setSelectedProductId] =
    useState<string | null>('PROD-201');

  const [selectedOpportunityId, setSelectedOpportunityId] =
    useState<string | null>('OPP-501');

  const [selectedGroundTruthId, setSelectedGroundTruthId] =
    useState<string | null>('GT-001');

  const [selectedRecommendationId, setSelectedRecommendationId] =
    useState<string | null>('REC-701');

  // Preselections when navigating to Recommend
  const [recommendAccountPreselect, setRecommendAccountPreselect] =
    useState<string | null>(null);

  const [recommendOpportunityPreselect, setRecommendOpportunityPreselect] =
    useState<string | null>(null);

  // Reactive state synced with storage
  const [accounts, setAccounts] =
    useState(storageService.getAccounts());

  const [products, setProducts] =
    useState(storageService.getProducts());

  const [opportunities, setOpportunities] =
    useState(storageService.getOpportunities());

  const [groundTruth, setGroundTruth] =
    useState(storageService.getGroundTruth());

  const [recommendations, setRecommendations] =
    useState(storageService.getRecommendations());

  const [experiences, setExperiences] =
    useState(storageService.getExperiences());

  const [modelVersions, setModelVersions] =
    useState(storageService.getModelVersions());

  const [lastExportTime, setLastExportTime] =
    useState(storageService.getLastExportTime());

  // Subscribe to storage changes
  useEffect(() => {
    const unsubscribe = storageService.subscribe(() => {
      setAccounts(storageService.getAccounts());
      setProducts(storageService.getProducts());
      setOpportunities(storageService.getOpportunities());
      setGroundTruth(storageService.getGroundTruth());
      setRecommendations(storageService.getRecommendations());
      setExperiences(storageService.getExperiences());
      setModelVersions(storageService.getModelVersions());
      setLastExportTime(storageService.getLastExportTime());
    });

    return unsubscribe;
  }, []);

  const readyExperiencesCount = experiences.filter(
    (e) =>
      e.experienceStatus === 'Ready for Export' ||
      e.experienceStatus === 'Recorded'
  ).length;

  const currentModel =
    modelVersions.find(
      (model) => model.status === 'Active / Deployed'
    ) || modelVersions[0];

  // Navigation Handlers
  const handleNavigateToRecommend = (
    accountId?: string,
    opportunityId?: string
  ) => {
    if (accountId) {
      setRecommendAccountPreselect(accountId);
    }

    if (opportunityId) {
      setRecommendOpportunityPreselect(opportunityId);
    }

    setCurrentPage('recommend');
  };

  const handleSelectAccount = (id: string) => {
    setSelectedAccountId(id);
    setCurrentPage('account-details');
  };

  const handleSelectProduct = (id: string) => {
    setSelectedProductId(id);
    setCurrentPage('product-details');
  };

  const handleSelectOpportunity = (id: string) => {
    setSelectedOpportunityId(id);
    setCurrentPage('opportunity-details');
  };

  const handleSelectGroundTruth = (id: string) => {
    setSelectedGroundTruthId(id);
    setCurrentPage('groundtruth-details');
  };

  const handleSelectRecommendation = (id: string) => {
    setSelectedRecommendationId(id);
    setCurrentPage('recommendation-details');
  };

  const handleQuickExport = () => {
    exportExperiencesToXLSX(experiences);
  };

  return (
    <AuthGate>
      <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">

        {/* Persistent Sidebar Navigation */}
        <Sidebar
          currentPage={currentPage}
          onNavigate={(page) => setCurrentPage(page)}
          readyExperiencesCount={readyExperiencesCount}
        />

        {/* Main Viewport Container */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">

          {/* Top Header */}
          <Header
            currentPage={currentPage}
            onNavigate={(page) => setCurrentPage(page)}
            onQuickExport={handleQuickExport}
          />

          {/* Dynamic Page Views */}
          <main className="flex-1 overflow-y-auto">

            {/* PAGE 1: Dashboard */}
            {currentPage === 'dashboard' && (
              <DashboardView
                accounts={accounts}
                products={products}
                opportunities={opportunities}
                groundTruth={groundTruth}
                recommendations={recommendations}
                experiences={experiences}
                onNavigate={(page) => setCurrentPage(page)}
                onSelectRecommendation={handleSelectRecommendation}
              />
            )}

            {/* PAGE 2: Recommend */}
            {currentPage === 'recommend' && (
              <RecommendView
                accounts={accounts}
                products={products}
                opportunities={opportunities}
                preselectedAccountId={recommendAccountPreselect}
                preselectedOpportunityId={recommendOpportunityPreselect}
                onNavigate={(page) => setCurrentPage(page)}
                onViewRecommendationDetails={handleSelectRecommendation}
              />
            )}

            {/* PAGE 3: Accounts */}
            {currentPage === 'accounts' && (
              <AccountsView
                accounts={accounts}
                onSelectAccount={handleSelectAccount}
                onNavigateToRecommend={(accId) =>
                  handleNavigateToRecommend(accId)
                }
              />
            )}

            {/* PAGE 4: Account Details */}
            {currentPage === 'account-details' && (
              <AccountDetailView
                account={
                  accounts.find(
                    (a) => a.id === selectedAccountId
                  ) || accounts[0]
                }
                products={products}
                opportunities={opportunities}
                groundTruth={groundTruth}
                recommendations={recommendations}
                onBack={() => setCurrentPage('accounts')}
                onNavigateToRecommend={(accId) =>
                  handleNavigateToRecommend(accId)
                }
                onSelectProduct={handleSelectProduct}
                onSelectOpportunity={handleSelectOpportunity}
                onSelectRecommendation={handleSelectRecommendation}
              />
            )}

            {/* PAGE 5: Products */}
            {currentPage === 'products' && (
              <ProductsView
                products={products}
                onSelectProduct={handleSelectProduct}
              />
            )}

            {/* PAGE 6: Product Details */}
            {currentPage === 'product-details' && (
              <ProductDetailView
                product={
                  products.find(
                    (p) => p.id === selectedProductId
                  ) || products[0]
                }
                accounts={accounts}
                opportunities={opportunities}
                groundTruth={groundTruth}
                recommendations={recommendations}
                onBack={() => setCurrentPage('products')}
                onSelectAccount={handleSelectAccount}
                onSelectOpportunity={handleSelectOpportunity}
              />
            )}

            {/* PAGE 7: Opportunities */}
            {currentPage === 'opportunities' && (
              <OpportunitiesView
                opportunities={opportunities}
                onSelectOpportunity={handleSelectOpportunity}
                onNavigateToRecommend={(accId, oppId) =>
                  handleNavigateToRecommend(accId, oppId)
                }
              />
            )}

            {/* PAGE 8: Opportunity Details */}
            {currentPage === 'opportunity-details' &&
              (() => {
                const currentOpp =
                  opportunities.find(
                    (o) => o.id === selectedOpportunityId
                  ) || opportunities[0];

                const currentAcc =
                  accounts.find(
                    (a) => a.id === currentOpp.accountId
                  );

                const currentProd =
                  products.find(
                    (p) => p.id === currentOpp.currentProductId
                  );

                return (
                  <OpportunityDetailView
                    opportunity={currentOpp}
                    account={currentAcc}
                    currentProduct={currentProd}
                    groundTruth={groundTruth}
                    recommendations={recommendations}
                    onBack={() =>
                      setCurrentPage('opportunities')
                    }
                    onNavigateToRecommend={(accId, oppId) =>
                      handleNavigateToRecommend(accId, oppId)
                    }
                    onSelectAccount={handleSelectAccount}
                    onSelectProduct={handleSelectProduct}
                    onSelectRecommendation={
                      handleSelectRecommendation
                    }
                  />
                );
              })()}

            {/* PAGE 9: Cross-Sell GroundTruth */}
            {currentPage === 'groundtruth' && (
              <GroundTruthView
                groundTruth={groundTruth}
                onSelectGroundTruth={handleSelectGroundTruth}
              />
            )}

            {/* PAGE 10: GroundTruth Details */}
            {currentPage === 'groundtruth-details' &&
              (() => {
                const currentGT =
                  groundTruth.find(
                    (gt) => gt.id === selectedGroundTruthId
                  ) || groundTruth[0];

                const allForAccount =
                  groundTruth.filter(
                    (gt) => gt.accountId === currentGT.accountId
                  );

                return (
                  <GroundTruthDetailView
                    groundTruth={currentGT}
                    allGroundTruthForAccount={allForAccount}
                    onBack={() =>
                      setCurrentPage('groundtruth')
                    }
                    onSelectAccount={handleSelectAccount}
                    onSelectOpportunity={handleSelectOpportunity}
                  />
                );
              })()}

            {/* PAGE 11: Recommendation History */}
            {currentPage === 'history' && (
              <RecommendationHistoryView
                recommendations={recommendations}
                onSelectRecommendation={
                  handleSelectRecommendation
                }
                onNavigateToRecommend={() =>
                  setCurrentPage('recommend')
                }
              />
            )}

            {/* PAGE 12: Recommendation Details */}
            {currentPage === 'recommendation-details' &&
              (() => {
                const currentRec =
                  recommendations.find(
                    (r) => r.id === selectedRecommendationId
                  ) || recommendations[0];

                return (
                  <RecommendationDetailView
                    recommendation={currentRec}
                    onBack={() =>
                      setCurrentPage('history')
                    }
                    onSelectAccount={handleSelectAccount}
                    onSelectOpportunity={
                      handleSelectOpportunity
                    }
                    onSelectProduct={handleSelectProduct}
                  />
                );
              })()}

            {/* PAGE 13: Recommendation Experiences */}
            {currentPage === 'experiences' && (
              <ExperiencesView
                experiences={experiences}
                lastExportTime={lastExportTime}
              />
            )}

            {/* PAGE 14: Analytics */}
            {currentPage === 'analytics' && (
              <AnalyticsView
                recommendations={recommendations}
                experiences={experiences}
                products={products}
                opportunities={opportunities}
              />
            )}

            {/* PAGE 15: RL Agent / Model */}
            {currentPage === 'rl-agent' && (
              <RLAgentView
                modelInfo={currentModel}
                onNavigateToModelDetails={() =>
                  setCurrentPage('model-details')
                }
                readyExperiencesCount={
                  readyExperiencesCount
                }
              />
            )}

            {/* PAGE 16: Model Architecture & Details */}
            {currentPage === 'model-details' && (
              <ModelDetailView
                modelInfo={currentModel}
                allVersions={modelVersions}
                onBack={() =>
                  setCurrentPage('rl-agent')
                }
              />
            )}

          </main>
        </div>
      </div>
    </AuthGate>
  );
}