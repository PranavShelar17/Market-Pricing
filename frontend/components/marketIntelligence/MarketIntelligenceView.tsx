"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useSelectedFarmer } from "@/context/FarmerContext";
import { useI18n } from "@/i18n/useI18n";
import {
  TrendingUp,
  LayoutDashboard,
  ChevronRight,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

import { PlanningFilterState } from "@/types/marketIntelligence";
import { MarketIntelligenceHeader } from "./MarketIntelligenceHeader";
import { PlanningControls } from "./PlanningControls";
import { MarketOverviewCards } from "./MarketOverviewCards";
import { Next15DaysSection } from "./Next15DaysSection";
import { SeasonalPlannerSection } from "./SeasonalPlannerSection";
import { FieldSuitabilitySection } from "./FieldSuitabilitySection";
import { CropPlanningComparison } from "./CropPlanningComparison";
import { PriceTrendOutlook } from "./PriceTrendOutlook";
import { FuturePriceOutlook } from "./FuturePriceOutlook";
import { DataSourceReliability } from "./DataSourceReliability";

export const MarketIntelligenceView: React.FC = () => {
  const { location, field, farmer } = useAuth();
  const { selectedFarmer } = useSelectedFarmer();
  const { language } = useI18n();
  const isMr = language === "mr";

  // Active location context from auth
  const activeState = location?.state || "Maharashtra";
  const activeDistrict = location?.district || "Pune";
  const activeTaluka = location?.taluka || "Baramati";
  const activeVillage = location?.village || "Malegaon Kh";
  const activeGat = selectedFarmer?.gat_no || field?.gat_no || "18";
  const activeArea = field?.area ?? 2.48;

  // Local interactive filter state
  const [filters, setFilters] = useState<PlanningFilterState>({
    state: activeState,
    district: activeDistrict,
    taluka: activeTaluka,
    marketApmc: "Baramati APMC",
    horizon: "immediate",
    season: "kharif",
    cropCategory: "all",
    selectedCropId: "",
  });

  const handleFilterChange = (updated: Partial<PlanningFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-text-muted">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 hover:text-soil-primary transition-colors"
        >
          <LayoutDashboard className="w-3.5 h-3.5 text-soil-primary" />
          <span>{isMr ? "डॅशबोर्ड" : "Dashboard"}</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-surface-borderStrong" />
        <span className="text-text-main font-bold">
          {isMr ? "बाजार भाव व पीक नियोजन" : "Market Intelligence & Crop Planner"}
        </span>
      </nav>

      {/* SECTION A: Page Header with Location Context & Status */}
      <MarketIntelligenceHeader
        state={filters.state}
        district={filters.district}
        taluka={filters.taluka}
        village={activeVillage}
        gatNo={activeGat}
      />

      {/* SECTION B: Planning Controls & Horizon Switcher */}
      <PlanningControls
        filters={filters}
        onFilterChange={handleFilterChange}
        availableDistricts={["Pune", "Solapur", "Satara", "Ahmednagar", "Nashik"]}
        availableTalukas={["Baramati", "Daund", "Haveli", "Indapur", "Shirur", "Purandar"]}
        availableMarkets={["Baramati APMC", "Pune (Gultekdi) APMC", "Daund APMC", "Indapur APMC"]}
      />

      {/* SECTION C: Market Overview with Explicit Empty State */}
      <MarketOverviewCards
        selectedDistrict={filters.district}
        selectedMarket={filters.marketApmc}
        selectedCommodity={filters.cropCategory !== "all" ? filters.cropCategory : "All Commodities"}
      />

      {/* SECTION E or F: Dedicated Horizon Views */}
      {filters.horizon === "immediate" ? (
        <Next15DaysSection
          currentVillage={activeVillage}
          currentGat={activeGat}
          fieldId={field?.id ?? (selectedFarmer as any)?.field_id}
        />
      ) : (
        <SeasonalPlannerSection
          activeSeason={filters.season}
          onSeasonSelect={(season) => handleFilterChange({ season })}
          gatNo={activeGat}
          fieldAcreage={activeArea}
          fieldId={field?.id ?? (selectedFarmer as any)?.field_id}
        />
      )}

      {/* SECTION J: Field Suitability Assessment Layer (Phase 8) */}
      <FieldSuitabilitySection
        currentGat={activeGat}
        fieldId={field?.id ?? (selectedFarmer as any)?.field_id}
        farmerName={farmer?.name ?? selectedFarmer?.name}
        currentVillage={activeVillage}
        currentTaluka={activeTaluka}
        currentDistrict={activeDistrict}
        activeSeason={filters.season}
      />

      {/* SECTION D: Crop Planning Options Comparison (Cards / Table Layout) */}
      <CropPlanningComparison
        categoryFilter={filters.cropCategory}
        horizon={filters.horizon}
        season={filters.season}
        fieldAcreage={activeArea}
        currentGat={activeGat}
        fieldId={field?.id ?? (selectedFarmer as any)?.field_id}
        farmerName={farmer?.name ?? selectedFarmer?.name}
        currentVillage={activeVillage}
        currentTaluka={activeTaluka}
        currentDistrict={activeDistrict}
      />

      {/* SECTION G: Historical Price Analysis & Trend Detection (Phase 5) */}
      <PriceTrendOutlook
        selectedMarket={filters.marketApmc}
        selectedCommodity={isMr ? "निवडलेले पीक" : "Target Crop"}
      />

      {/* SECTION H: Future Price Outlook & Harvest-Time Forecasting Engine (Phase 6) */}
      <FuturePriceOutlook
        selectedMarket={filters.marketApmc}
        selectedCommodity={isMr ? "निवडलेले पीक" : "Target Crop"}
      />

      {/* SECTION I: Data Sources and Reliability Panel */}
      <DataSourceReliability selectedMarket={filters.marketApmc} />
    </div>
  );
};
