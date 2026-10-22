"use client";

import React, { useState, useEffect } from "react";
import { useI18n } from "@/i18n/useI18n";
import {
  Filter,
  Calendar,
  Building2,
  ChevronDown,
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
  CalendarDays,
} from "lucide-react";
import {
  PlanningFilterState,
  PlanningHorizon,
  SeasonType,
  CropCategory,
} from "@/types/marketIntelligence";
import { marketService, MarketItem } from "@/services/marketService";

interface PlanningControlsProps {
  filters: PlanningFilterState;
  onFilterChange: (updated: Partial<PlanningFilterState>) => void;
  availableDistricts?: string[];
  availableTalukas?: string[];
  availableMarkets?: string[];
}

export const PlanningControls: React.FC<PlanningControlsProps> = ({
  filters,
  onFilterChange,
  availableDistricts = ["Pune", "Solapur", "Satara", "Ahmednagar", "Nashik"],
  availableTalukas = ["Baramati", "Daund", "Haveli", "Indapur", "Shirur", "Purandar"],
  availableMarkets: propMarkets = ["Baramati APMC", "Pune (Gultekdi) APMC", "Daund APMC", "Indapur APMC"],
}) => {
  const { language } = useI18n();
  const isMr = language === "mr";
  const [isFilterExpanded, setIsFilterExpanded] = useState<boolean>(true);
  const [dbMarkets, setDbMarkets] = useState<MarketItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    marketService
      .getMarkets({ districtName: filters.district })
      .then((mkts) => {
        if (isMounted && mkts && mkts.length > 0) {
          setDbMarkets(mkts);
        }
      })
      .catch((e) => console.warn("Failed to load db markets in controls:", e));
    return () => {
      isMounted = false;
    };
  }, [filters.district]);

  // Combine DB markets with props fallback
  const renderedMarkets =
    dbMarkets.length > 0
      ? dbMarkets.map((m) => (isMr ? m.name_mr || m.name : m.name))
      : propMarkets;

  const cropCategories: { key: CropCategory; labelEn: string; labelMr: string }[] = [
    { key: "all", labelEn: "All Crops", labelMr: "सर्व पिके" },
    { key: "cash_crops", labelEn: "Cash Crops", labelMr: "नगदी पिके" },
    { key: "cereals", labelEn: "Cereals & Millets", labelMr: "धान्य व भरडधान्य" },
    { key: "pulses", labelEn: "Pulses", labelMr: "कडधान्ये" },
    { key: "oilseeds", labelEn: "Oilseeds", labelMr: "गळीत धान्य (तेलबिया)" },
    { key: "vegetables", labelEn: "Vegetables", labelMr: "भाजीपाला" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-surface-border shadow-sm overflow-hidden transition-all">
      {/* Top Bar: Planning Horizon Toggle & Filter Collapse */}
      <div className="p-4 sm:p-5 border-b border-surface-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface-subtle/50">
        {/* Horizon Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-surface-muted rounded-xl border border-surface-border w-full sm:w-auto">
          <button
            type="button"
            onClick={() => onFilterChange({ horizon: "immediate" })}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              filters.horizon === "immediate"
                ? "bg-soil-primary text-white shadow-xs"
                : "text-text-muted hover:text-text-main hover:bg-white/60"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{isMr ? "पुढील १५ दिवस (तातडीचे नियोजन)" : "Next 15 Days (Immediate)"}</span>
          </button>
          <button
            type="button"
            onClick={() => onFilterChange({ horizon: "seasonal" })}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              filters.horizon === "seasonal"
                ? "bg-soil-primary text-white shadow-xs"
                : "text-text-muted hover:text-text-main hover:bg-white/60"
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>{isMr ? "हंगामी नियोजन (आगामी हंगाम)" : "Seasonal Planning"}</span>
          </button>
        </div>

        {/* Toggle Filters Button */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface-border text-xs font-semibold text-text-muted hover:text-text-main hover:bg-surface-muted transition-colors"
          >
            <Filter className="w-3.5 h-3.5 text-soil-primary" />
            <span>{isMr ? "नियोजन निकष" : "Filter Controls"}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isFilterExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Collapsible Filter Body */}
      {isFilterExpanded && (
        <div className="p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* 1. State */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                {isMr ? "राज्य (State)" : "State"}
              </label>
              <div className="w-full px-3 py-2 rounded-xl bg-surface-muted/60 border border-surface-border text-xs font-semibold text-text-main flex items-center justify-between">
                <span>{isMr ? "महाराष्ट्र (Maharashtra)" : "Maharashtra"}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-soil-primaryLight text-soil-primary font-bold">
                  {isMr ? "निश्चित" : "Fixed"}
                </span>
              </div>
            </div>

            {/* 2. District */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                {isMr ? "जिल्हा (District)" : "District"}
              </label>
              <select
                value={filters.district}
                onChange={(e) => onFilterChange({ district: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-surface-border text-xs font-medium text-text-main focus:outline-none focus:ring-2 focus:ring-soil-primary/30 focus:border-soil-primary transition-all"
              >
                {availableDistricts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Taluka */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                {isMr ? "तालुका (Taluka)" : "Taluka"}
              </label>
              <select
                value={filters.taluka}
                onChange={(e) => onFilterChange({ taluka: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-surface-border text-xs font-medium text-text-main focus:outline-none focus:ring-2 focus:ring-soil-primary/30 focus:border-soil-primary transition-all"
              >
                {availableTalukas.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Target Market / APMC Yard */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
                <Building2 className="w-3 h-3 text-soil-primary" />
                <span>{isMr ? "बाजार समिती (APMC Yard)" : "Market / APMC"}</span>
              </label>
              <select
                value={filters.marketApmc}
                onChange={(e) => onFilterChange({ marketApmc: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-surface-border text-xs font-medium text-text-main focus:outline-none focus:ring-2 focus:ring-soil-primary/30 focus:border-soil-primary transition-all"
              >
                {renderedMarkets.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Crop Category Filter & Season (when seasonal active) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-surface-border/60">
            {/* Category Chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-text-muted mr-1">
                {isMr ? "पीक वर्ग:" : "Crop Category:"}
              </span>
              {cropCategories.map((cat) => {
                const isActive = filters.cropCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => onFilterChange({ cropCategory: cat.key })}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? "bg-soil-primary text-white font-semibold shadow-2xs"
                        : "bg-surface-subtle text-text-muted border border-surface-border hover:bg-surface-muted"
                    }`}
                  >
                    {isMr ? cat.labelMr : cat.labelEn}
                  </button>
                );
              })}
            </div>

            {/* Seasonal Horizon Switcher if seasonal horizon active */}
            {filters.horizon === "seasonal" && (
              <div className="flex items-center gap-1.5 bg-surface-subtle px-2.5 py-1 rounded-xl border border-surface-border text-xs">
                <Calendar className="w-3.5 h-3.5 text-soil-primary" />
                <span className="font-bold text-text-muted">{isMr ? "हंगाम:" : "Season:"}</span>
                <select
                  value={filters.season}
                  onChange={(e) => onFilterChange({ season: e.target.value as SeasonType })}
                  className="bg-transparent text-xs font-bold text-soil-primary focus:outline-none cursor-pointer"
                >
                  <option value="kharif">{isMr ? "खरीप (Kharif - पावसाळी)" : "Kharif (Monsoon)"}</option>
                  <option value="rabi">{isMr ? "रब्बी (Rabi - हिवाळी)" : "Rabi (Winter)"}</option>
                  <option value="zaid">{isMr ? "उन्हाळी (Zaid - Summer)" : "Zaid (Summer)"}</option>
                </select>
              </div>
            )}
          </div>

          {/* Operational integrity notice */}
          <div className="p-2.5 rounded-xl bg-surface-subtle/80 border border-surface-border/80 text-[11px] text-text-muted flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 text-soil-secondary shrink-0 mt-0.5" />
            <p>
              {isMr
                ? "टीप: बाजार भाव अधिकृत AGMARKNET / OGD India डेटाबेसमधून थेट संकलित केले जातात. निवडीनुसार जर त्या दिवशी लिलाव नसेल, तर प्रणाली स्पष्टपणे 'माहिती उपलब्ध नाही' असा संदेश दर्शवते."
                : "Note: Market rates are ingested directly from official AGMARKNET / OGD India bulletins. If no trading took place for the selected market, SoilPilot displays an explicit missing-data notice."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
