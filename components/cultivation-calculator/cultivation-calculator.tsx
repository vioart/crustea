"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Calculator,
  Check,
  ChevronRight,
  CircleHelp,
  Fish,
  Gauge,
  Info,
  RotateCcw,
  TrendingUp,
  Waves,
  Wind,
} from "lucide-react";

type AeratorId = "mini" | "brush";

type FormState = {
  farmerName: string;
  cultivationType: string;
  area: string;
  density: string;
  survivalRate: string;
  harvestSize: string;
  fcr: string;
  seedPrice: string;
  feedPrice: string;
  cycleMonths: string;
  monthlyElectricity: string;
  otherCosts: string;
  sellingPrice: string;
};

const initialForm: FormState = {
  farmerName: "",
  cultivationType: "Pembesaran",
  area: "300",
  density: "30",
  survivalRate: "80",
  harvestSize: "4",
  fcr: "1.25",
  seedPrice: "350",
  feedPrice: "13500",
  cycleMonths: "4",
  monthlyElectricity: "450000",
  otherCosts: "3000000",
  sellingPrice: "24000",
};

const aerators = [
  {
    id: "mini" as const,
    icon: Wind,
    power: "350 W / ½ HP",
    biomassMin: 357.14,
    biomassMax: 357.14,
  },
  {
    id: "brush" as const,
    icon: Waves,
    power: "700 W / 470 W",
    biomassMin: 1200,
    biomassMax: 1300,
  },
];

type InputFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  unit?: string;
  placeholder: string;
  hint?: string;
  inputType?: "text" | "number";
  min?: number;
  step?: string;
};

function InputField({
  label,
  value,
  onChange,
  unit,
  placeholder,
  hint,
  inputType = "number",
  min = 0,
  step = "any",
}: InputFieldProps) {
  return (
    <div className="min-w-0 space-y-2">
      <label className="block text-sm font-medium text-[var(--brand-dark)]">
        {label}
      </label>
      <div className="flex items-center rounded-xl border border-[var(--input)] bg-[var(--card)] transition focus-within:border-[var(--brand-secondary)] focus-within:ring-4 focus-within:ring-[var(--brand-secondary)]/15">
        <input
          type={inputType}
          min={inputType === "number" ? min : undefined}
          step={inputType === "number" ? step : undefined}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 rounded-xl bg-transparent px-4 py-3.5 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
        />
        {unit && (
          <span className="shrink-0 px-4 text-sm text-[var(--muted-foreground)]">
            {unit}
          </span>
        )}
      </div>
      {hint && (
        <p className="text-xs leading-5 text-[var(--muted-foreground)]">
          {hint}
        </p>
      )}
    </div>
  );
}

function SectionHeader({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-[var(--border)] px-5 py-5 sm:px-7">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-secondary)]/10 text-[var(--brand-secondary)]">
        <span className="text-sm font-bold">{number}</span>
      </div>
      <div>
        <h3 className="text-lg font-bold text-[var(--brand-dark)]">{title}</h3>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          {description}
        </p>
      </div>
    </div>
  );
}

function ResultItem({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-[var(--border)] py-3 last:border-b-0">
      <p className="text-sm text-[var(--muted-foreground)]">{label}</p>
      <p className="text-right text-sm font-semibold text-[var(--brand-dark)]">
        {value} {unit}
      </p>
    </div>
  );
}

export default function CultivationCalculator() {
  const t = useTranslations("CultivationCalculator");
  const locale = useLocale();

  const [form, setForm] = useState<FormState>(initialForm);
  const [selectedAerator, setSelectedAerator] = useState<AeratorId>("mini");
  const [hasCalculated, setHasCalculated] = useState(false);

  const activeAerator = aerators.find(
    (aerator) => aerator.id === selectedAerator,
  )!;

  const formatNumber = (value: number, maximumFractionDigits = 2) =>
    new Intl.NumberFormat(locale === "id" ? "id-ID" : "en-US", {
      maximumFractionDigits,
    }).format(value);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(locale === "id" ? "id-ID" : "en-US", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);

  const number = (value: string) =>
    value.trim() === "" ? Number.NaN : Number(value);

  const parsed = {
    area: number(form.area),
    density: number(form.density),
    survivalRate: number(form.survivalRate),
    harvestSize: number(form.harvestSize),
    fcr: number(form.fcr),
    seedPrice: number(form.seedPrice),
    feedPrice: number(form.feedPrice),
    cycleMonths: number(form.cycleMonths),
    monthlyElectricity: number(form.monthlyElectricity),
    otherCosts: number(form.otherCosts),
    sellingPrice: number(form.sellingPrice),
  };

  const isValid =
    Object.values(parsed).every(
      (value) => Number.isFinite(value) && value >= 0,
    ) &&
    parsed.area > 0 &&
    parsed.density > 0 &&
    parsed.survivalRate > 0 &&
    parsed.survivalRate <= 100 &&
    parsed.harvestSize > 0 &&
    parsed.fcr > 0 &&
    parsed.cycleMonths > 0 &&
    form.farmerName.trim() !== "" &&
    form.cultivationType.trim() !== "";

  const result = useMemo(() => {
    const p = parsed;

    const seedCount =
      Number.isFinite(p.area) && Number.isFinite(p.density)
        ? p.area * p.density
        : 0;

    const finalCount = Number.isFinite(p.survivalRate)
      ? seedCount * (p.survivalRate / 100)
      : 0;

    const harvestBiomass =
      Number.isFinite(p.harvestSize) && p.harvestSize > 0
        ? finalCount / p.harvestSize
        : 0;

    const feedAmount = Number.isFinite(p.fcr) ? p.fcr * harvestBiomass : 0;

    const totalSeedCost = Number.isFinite(p.seedPrice)
      ? p.seedPrice * seedCount
      : 0;

    const totalFeedCost = Number.isFinite(p.feedPrice)
      ? p.feedPrice * feedAmount
      : 0;

    const totalElectricity =
      Number.isFinite(p.monthlyElectricity) && Number.isFinite(p.cycleMonths)
        ? p.monthlyElectricity * p.cycleMonths
        : 0;

    const totalExpense =
      totalSeedCost +
      totalFeedCost +
      totalElectricity +
      (Number.isFinite(p.otherCosts) ? p.otherCosts : 0);

    const grossRevenue =
      (Number.isFinite(p.sellingPrice) ? p.sellingPrice : 0) *
      harvestBiomass;

    const netRevenue = grossRevenue - totalExpense;
    const rcRatio = totalExpense > 0 ? grossRevenue / totalExpense : null;

    const estimatedAeratorUnits =
      harvestBiomass > 0
        ? Math.ceil(harvestBiomass / activeAerator.biomassMin)
        : 0;

    // Acuan kebutuhan oksigen: 700 mg O2/kg/jam, dikonversi ke gram/jam.
    const oxygenRequirementGram = (harvestBiomass * 700) / 1000;

    return {
      seedCount,
      finalCount,
      harvestBiomass,
      feedAmount,
      totalSeedCost,
      totalFeedCost,
      totalElectricity,
      totalExpense,
      grossRevenue,
      netRevenue,
      rcRatio,
      estimatedAeratorUnits,
      oxygenRequirementGram,
      isFeasible: rcRatio !== null && rcRatio >= 1,
    };
  }, [
    parsed.area,
    parsed.density,
    parsed.survivalRate,
    parsed.harvestSize,
    parsed.fcr,
    parsed.seedPrice,
    parsed.feedPrice,
    parsed.cycleMonths,
    parsed.monthlyElectricity,
    parsed.otherCosts,
    parsed.sellingPrice,
    activeAerator,
  ]);

  function updateField<K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    setHasCalculated(false);
  }

  function handleCalculate() {
    if (!isValid) {
      setHasCalculated(false);
      return;
    }

    setHasCalculated(true);

    window.setTimeout(() => {
      document
        .getElementById("cultivation-results")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  function handleReset() {
    setForm(initialForm);
    setSelectedAerator("mini");
    setHasCalculated(false);
  }

  const cultivationTypeLabel =
    form.cultivationType === "Pembesaran"
      ? t("fields.cultivationType.options.growOut")
      : form.cultivationType === "Pembenihan"
        ? t("fields.cultivationType.options.hatchery")
        : t("fields.cultivationType.options.nursery");

  const aeratorName = t(`aerator.${selectedAerator}.name`);
  const aeratorDescription = t(`aerator.${selectedAerator}.description`);
  const aeratorNote = t(`aerator.${selectedAerator}.note`);

  return (
    <section
      id="kalkulator-budidaya"
      className="bg-[var(--muted)] py-12 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Intro */}
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--accent)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-dark)]">
            <Calculator size={15} className="text-[var(--brand-secondary)]" />
            {t("intro.eyebrow")}
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-[var(--brand-dark)] sm:text-4xl lg:text-5xl">
            {t("intro.title")}
            <span className="mt-1 block text-[var(--brand-secondary)]">
              {t("intro.titleHighlight")}
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[var(--muted-foreground)] sm:text-base">
            {t("intro.description")}
          </p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)] lg:gap-8">
          {/* Form */}
          <div className="space-y-6">
            {/* Section 1: Cultivation data */}
            <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
              <SectionHeader
                number="01"
                title={t("sections.data.title")}
                description={t("sections.data.description")}
              />

              <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-7">
                <InputField
                  label={t("fields.farmerName.label")}
                  value={form.farmerName}
                  onChange={(value) => updateField("farmerName", value)}
                  inputType="text"
                  placeholder={t("fields.farmerName.placeholder")}
                />

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--brand-dark)]">
                    {t("fields.cultivationType.label")}
                  </label>
                  <select
                    value={form.cultivationType}
                    onChange={(event) =>
                      updateField("cultivationType", event.target.value)
                    }
                    className="w-full rounded-xl border border-[var(--input)] bg-[var(--card)] px-4 py-3.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--brand-secondary)] focus:ring-4 focus:ring-[var(--brand-secondary)]/15"
                  >
                    <option value="Pembesaran">
                      {t("fields.cultivationType.options.growOut")}
                    </option>
                    <option value="Pembenihan">
                      {t("fields.cultivationType.options.hatchery")}
                    </option>
                    <option value="Pendederan">
                      {t("fields.cultivationType.options.nursery")}
                    </option>
                  </select>
                </div>

                <InputField
                  label={t("fields.area.label")}
                  value={form.area}
                  onChange={(value) => updateField("area", value)}
                  unit={t("units.area")}
                  placeholder={t("fields.area.placeholder")}
                />

                <InputField
                  label={t("fields.density.label")}
                  value={form.density}
                  onChange={(value) => updateField("density", value)}
                  unit={t("units.density")}
                  placeholder={t("fields.density.placeholder")}
                  hint={t("fields.density.hint")}
                />

                <div className="rounded-xl bg-[var(--secondary)] p-4 sm:col-span-2">
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {t("automatic.seedCount")}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-[var(--brand-dark)]">
                    {formatNumber(result.seedCount, 0)} {t("units.fish")}
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    {t("automatic.seedCountFormula")}
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: Growth and harvest */}
            <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
              <SectionHeader
                number="02"
                title={t("sections.growth.title")}
                description={t("sections.growth.description")}
              />

              <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-7">
                <InputField
                  label={t("fields.survivalRate.label")}
                  value={form.survivalRate}
                  onChange={(value) => updateField("survivalRate", value)}
                  unit={t("units.percentage")}
                  placeholder={t("fields.survivalRate.placeholder")}
                  hint={t("fields.survivalRate.hint")}
                />

                <InputField
                  label={t("fields.harvestSize.label")}
                  value={form.harvestSize}
                  onChange={(value) => updateField("harvestSize", value)}
                  unit={t("units.fishPerKg")}
                  placeholder={t("fields.harvestSize.placeholder")}
                  hint={t("fields.harvestSize.hint")}
                />

                <div className="rounded-xl bg-[var(--secondary)] p-4">
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {t("automatic.finalCount")}
                  </p>
                  <p className="mt-1 text-xl font-bold text-[var(--brand-dark)]">
                    {formatNumber(result.finalCount, 0)} {t("units.fish")}
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    {t("automatic.finalCountFormula")}
                  </p>
                </div>

                <div className="rounded-xl bg-[var(--secondary)] p-4">
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {t("automatic.harvestBiomass")}
                  </p>
                  <p className="mt-1 text-xl font-bold text-[var(--brand-dark)]">
                    {formatNumber(result.harvestBiomass)} {t("units.weight")}
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    {t("automatic.harvestBiomassFormula")}
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3: Feed */}
            <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
              <SectionHeader
                number="03"
                title={t("sections.feed.title")}
                description={t("sections.feed.description")}
              />

              <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-7">
                <InputField
                  label={t("fields.fcr.label")}
                  value={form.fcr}
                  onChange={(value) => updateField("fcr", value)}
                  placeholder={t("fields.fcr.placeholder")}
                  hint={t("fields.fcr.hint")}
                />

                <div className="rounded-xl bg-[var(--secondary)] p-4">
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {t("automatic.feedAmount")}
                  </p>
                  <p className="mt-1 text-xl font-bold text-[var(--brand-dark)]">
                    {formatNumber(result.feedAmount)} {t("units.weight")}
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    {t("automatic.feedAmountFormula")}
                  </p>
                </div>
              </div>
            </div>

            {/* Section 4: Costs and selling price */}
            <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
              <SectionHeader
                number="04"
                title={t("sections.cost.title")}
                description={t("sections.cost.description")}
              />

              <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-7">
                <InputField
                  label={t("fields.seedPrice.label")}
                  value={form.seedPrice}
                  onChange={(value) => updateField("seedPrice", value)}
                  unit={t("units.seedPrice")}
                  placeholder={t("fields.seedPrice.placeholder")}
                />

                <div className="rounded-xl bg-[var(--secondary)] p-4">
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {t("automatic.seedCost")}
                  </p>
                  <p className="mt-1 text-lg font-bold text-[var(--brand-dark)]">
                    {formatCurrency(result.totalSeedCost)}
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    {t("automatic.seedCostFormula")}
                  </p>
                </div>

                <InputField
                  label={t("fields.feedPrice.label")}
                  value={form.feedPrice}
                  onChange={(value) => updateField("feedPrice", value)}
                  unit={t("units.feedPrice")}
                  placeholder={t("fields.feedPrice.placeholder")}
                />

                <div className="rounded-xl bg-[var(--secondary)] p-4">
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {t("automatic.feedCost")}
                  </p>
                  <p className="mt-1 text-lg font-bold text-[var(--brand-dark)]">
                    {formatCurrency(result.totalFeedCost)}
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    {t("automatic.feedCostFormula")}
                  </p>
                </div>

                <InputField
                  label={t("fields.cycleMonths.label")}
                  value={form.cycleMonths}
                  onChange={(value) => updateField("cycleMonths", value)}
                  unit={t("units.month")}
                  placeholder={t("fields.cycleMonths.placeholder")}
                />

                <InputField
                  label={t("fields.monthlyElectricity.label")}
                  value={form.monthlyElectricity}
                  onChange={(value) =>
                    updateField("monthlyElectricity", value)
                  }
                  unit={t("units.currency")}
                  placeholder={t("fields.monthlyElectricity.placeholder")}
                />

                <div className="rounded-xl bg-[var(--secondary)] p-4">
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {t("automatic.electricityCost")}
                  </p>
                  <p className="mt-1 text-lg font-bold text-[var(--brand-dark)]">
                    {formatCurrency(result.totalElectricity)}
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    {t("automatic.electricityCostFormula")}
                  </p>
                </div>

                <InputField
                  label={t("fields.otherCosts.label")}
                  value={form.otherCosts}
                  onChange={(value) => updateField("otherCosts", value)}
                  unit={t("units.currency")}
                  placeholder={t("fields.otherCosts.placeholder")}
                  hint={t("fields.otherCosts.hint")}
                />

                <InputField
                  label={t("fields.sellingPrice.label")}
                  value={form.sellingPrice}
                  onChange={(value) => updateField("sellingPrice", value)}
                  unit={`${t("units.currency")}/${t("units.weight")}`}
                  placeholder={t("fields.sellingPrice.placeholder")}
                />
              </div>
            </div>

            {/* Section 5: Aerator */}
            <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
              <SectionHeader
                number="05"
                title={t("sections.aerator.title")}
                description={t("sections.aerator.description")}
              />

              <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5">
                {aerators.map((aerator) => {
                  const Icon = aerator.icon;
                  const selected = selectedAerator === aerator.id;

                  return (
                    <button
                      key={aerator.id}
                      type="button"
                      onClick={() => {
                        setSelectedAerator(aerator.id);
                        setHasCalculated(false);
                      }}
                      aria-pressed={selected}
                      className={`relative flex flex-col rounded-xl border p-4 text-left transition hover:shadow-md ${
                        selected
                          ? "border-[var(--brand-primary)] bg-[var(--accent)] ring-2 ring-[var(--brand-primary)]/20"
                          : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--brand-secondary)]"
                      }`}
                    >
                      {selected && (
                        <span className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-[var(--brand-primary)] text-[var(--brand-dark)]">
                          <Check size={12} strokeWidth={3} />
                        </span>
                      )}

                      <span className="mb-3 flex size-10 items-center justify-center rounded-xl bg-[var(--brand-secondary)]/10 text-[var(--brand-secondary)]">
                        <Icon size={22} />
                      </span>

                      <span className="text-sm font-bold text-[var(--brand-dark)]">
                        {t(`aerator.${aerator.id}.name`)}
                      </span>

                      <span className="mt-1 text-xs text-[var(--muted-foreground)]">
                        {t(`aerator.${aerator.id}.subtitle`)}
                      </span>

                      <span className="mt-3 border-t border-[var(--border)] pt-3 text-xs text-[var(--muted-foreground)]">
                        {t("aerator.biomassCapacity")}:{" "}
                        <strong className="text-[var(--brand-secondary)]">
                          {formatNumber(aerator.biomassMin)}
                          {aerator.biomassMin !== aerator.biomassMax &&
                            `–${formatNumber(aerator.biomassMax)}`}{" "}
                          {t("units.weight")}
                        </strong>
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mx-4 mb-4 flex items-start gap-2 rounded-lg bg-[var(--secondary)] p-3 sm:mx-5 sm:mb-5">
                <Info
                  size={16}
                  className="mt-0.5 shrink-0 text-[var(--brand-secondary)]"
                />
                <p className="text-xs leading-5 text-[var(--muted-foreground)]">
                  {aeratorDescription} {aeratorNote}
                </p>
              </div>
            </div>

            {!isValid && (
              <div
                role="alert"
                className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
              >
                {t("validation.general")}
              </div>
            )}

            <div className="flex flex-col gap-3 border-t border-[var(--border)] pt-5 sm:flex-row">
              <button
                type="button"
                onClick={handleCalculate}
                disabled={!isValid}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-5 py-3.5 text-sm font-semibold text-[var(--brand-dark)] shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Calculator size={18} />
                {t("action.calculate")}
                <ChevronRight size={17} />
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-5 py-3.5 text-sm font-medium text-[var(--brand-dark)] transition hover:border-[var(--brand-secondary)] hover:bg-[var(--secondary)]"
              >
                <RotateCcw size={16} />
                {t("action.reset")}
              </button>
            </div>
          </div>

          {/* Results */}
          <aside
            id="cultivation-results"
            className="scroll-mt-24 space-y-5 lg:sticky lg:top-24"
          >
            <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
              <div className="relative overflow-hidden bg-[var(--brand-dark)] p-6 text-white sm:p-7">
                <div className="pointer-events-none absolute -right-8 -top-10 size-36 rounded-full border-[24px] border-white/10" />
                <div className="pointer-events-none absolute -bottom-14 right-20 size-32 rounded-full bg-[var(--brand-secondary)]/40" />

                <div className="relative">
                  <div className="mb-5 flex size-11 items-center justify-center rounded-xl bg-[var(--brand-secondary)] text-white">
                    <Calculator size={23} />
                  </div>

                  <p className="text-sm font-medium text-white/80">
                    {t("result.title")}
                  </p>

                  <h3 className="mt-2 text-2xl font-bold tracking-tight">
                    {t("result.heading")}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-white/80">
                    {t("result.description")}
                  </p>
                </div>
              </div>

              <div className="space-y-5 p-5 sm:p-6">
                {!hasCalculated ? (
                  <div className="py-6 text-center">
                    <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-[var(--brand-secondary)]/10 text-[var(--brand-secondary)]">
                      <Gauge size={30} strokeWidth={1.6} />
                    </div>

                    <h4 className="font-semibold text-[var(--brand-dark)]">
                      {t("result.emptyTitle")}
                    </h4>

                    <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[var(--muted-foreground)]">
                      {t("result.emptyDescription")}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="rounded-xl border border-[var(--brand-secondary)]/30 bg-[var(--brand-secondary)]/10 p-4">
                      <p className="text-sm font-medium text-[var(--brand-secondary)]">
                        {t("result.netRevenue")}
                      </p>

                      <p
                        className={`mt-2 text-3xl font-bold tracking-tight ${
                          result.netRevenue >= 0
                            ? "text-[var(--brand-dark)]"
                            : "text-red-700"
                        }`}
                      >
                        {formatCurrency(result.netRevenue)}
                      </p>

                      <p className="mt-2 text-xs text-[var(--muted-foreground)]">
                        {t("result.netRevenueDescription")}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-[var(--border)] p-4">
                        <Fish
                          size={19}
                          className="mb-3 text-[var(--brand-secondary)]"
                        />
                        <p className="text-xs text-[var(--muted-foreground)]">
                          {t("result.seedCount")}
                        </p>
                        <p className="mt-1 text-lg font-bold text-[var(--brand-dark)]">
                          {formatNumber(result.seedCount, 0)}
                        </p>
                        <p className="text-xs text-[var(--muted-foreground)]">
                          {t("units.fish")}
                        </p>
                      </div>

                      <div className="rounded-xl border border-[var(--border)] p-4">
                        <TrendingUp
                          size={19}
                          className="mb-3 text-[var(--brand-secondary)]"
                        />
                        <p className="text-xs text-[var(--muted-foreground)]">
                          {t("result.harvestBiomass")}
                        </p>
                        <p className="mt-1 text-lg font-bold text-[var(--brand-dark)]">
                          {formatNumber(result.harvestBiomass)}
                        </p>
                        <p className="text-xs text-[var(--muted-foreground)]">
                          {t("units.weight")}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-2 text-sm font-bold text-[var(--brand-dark)]">
                        {t("result.productionSummary")}
                      </h4>

                      <ResultItem
                        label={t("fields.density.label")}
                        value={formatNumber(parsed.density)}
                        unit={t("units.density")}
                      />

                      <ResultItem
                        label={t("automatic.finalCount")}
                        value={formatNumber(result.finalCount, 0)}
                        unit={t("units.fish")}
                      />

                      <ResultItem
                        label={t("automatic.feedAmount")}
                        value={formatNumber(result.feedAmount)}
                        unit={t("units.weight")}
                      />
                    </div>

                    <div>
                      <h4 className="mb-2 text-sm font-bold text-[var(--brand-dark)]">
                        {t("result.costSummary")}
                      </h4>

                      <ResultItem
                        label={t("result.totalSeedCost")}
                        value={formatCurrency(result.totalSeedCost)}
                      />

                      <ResultItem
                        label={t("result.totalFeedCost")}
                        value={formatCurrency(result.totalFeedCost)}
                      />

                      <ResultItem
                        label={t("result.totalElectricity")}
                        value={formatCurrency(result.totalElectricity)}
                      />

                      <ResultItem
                        label={t("result.otherCosts")}
                        value={formatCurrency(parsed.otherCosts)}
                      />

                      <div className="mt-2 rounded-lg bg-[var(--secondary)] px-3">
                        <ResultItem
                          label={t("result.totalExpense")}
                          value={formatCurrency(result.totalExpense)}
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-2 text-sm font-bold text-[var(--brand-dark)]">
                        {t("result.revenueSummary")}
                      </h4>

                      <ResultItem
                        label={t("result.grossRevenue")}
                        value={formatCurrency(result.grossRevenue)}
                      />

                      <ResultItem
                        label={t("result.netRevenueItem")}
                        value={formatCurrency(result.netRevenue)}
                      />

                      <div className="mt-3 rounded-xl border border-[var(--border)] p-4">
                        <p className="text-xs text-[var(--muted-foreground)]">
                          {t("result.rcRatio")}
                        </p>

                        <p className="mt-1 text-2xl font-bold text-[var(--brand-dark)]">
                          {result.rcRatio === null
                            ? t("result.cannotEvaluate")
                            : formatNumber(result.rcRatio, 3)}
                        </p>

                        <span
                          className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            result.isFeasible
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {result.rcRatio === null
                            ? t("result.cannotEvaluate")
                            : result.isFeasible
                              ? t("result.feasible")
                              : t("result.notFeasible")}
                        </span>

                        <p className="mt-2 text-xs leading-5 text-[var(--muted-foreground)]">
                          {t("result.rcDescription")}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-2 text-sm font-bold text-[var(--brand-dark)]">
                        {t("result.aeratorRequirement")}
                      </h4>

                      <div className="rounded-xl border border-[var(--border)] p-4">
                        <div className="flex items-center gap-3">
                          <span className="flex size-10 items-center justify-center rounded-xl bg-[var(--brand-secondary)]/10 text-[var(--brand-secondary)]">
                            {selectedAerator === "mini" ? (
                              <Wind size={21} />
                            ) : (
                              <Waves size={21} />
                            )}
                          </span>

                          <div>
                            <p className="text-sm font-bold text-[var(--brand-dark)]">
                              {aeratorName}
                            </p>
                            <p className="text-xs text-[var(--muted-foreground)]">
                              {activeAerator.power}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs text-[var(--muted-foreground)]">
                              {t("result.estimatedDevices")}
                            </p>
                            <p className="mt-1 text-2xl font-bold text-[var(--brand-dark)]">
                              {result.estimatedAeratorUnits} {t("units.unit")}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-[var(--muted-foreground)]">
                              {t("result.oxygenRequirement")}
                            </p>
                            <p className="mt-1 text-lg font-bold text-[var(--brand-dark)]">
                              {formatNumber(result.oxygenRequirementGram)}{" "}
                              {t("result.oxygenUnit")}
                            </p>
                          </div>
                        </div>

                        <p className="mt-3 text-xs leading-5 text-[var(--muted-foreground)]">
                          {t("result.basedOnCapacity", {
                            capacity: formatNumber(activeAerator.biomassMin),
                          })}{" "}
                          {t("result.oxygenFormula")}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                      <div className="flex items-start gap-2">
                        <Info
                          size={17}
                          className="mt-0.5 shrink-0 text-amber-700"
                        />
                        <div>
                          <p className="text-sm font-semibold text-amber-900">
                            {t("result.technicalValidationTitle")}
                          </p>
                          <p className="mt-1 text-xs leading-5 text-amber-800">
                            {t("result.technicalValidationDescription")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {hasCalculated && (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-6">
                <h4 className="mt-2 text-lg font-bold text-[var(--brand-dark)]">
                  {form.farmerName}
                </h4>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  {cultivationTypeLabel} · {formatNumber(parsed.area)}{" "}
                  {t("units.area")}
                </p>
              </div>
            )}
          </aside>
        </div>

        {/* Calculation notes */}
        <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-secondary)]/10 text-[var(--brand-secondary)]">
              <CircleHelp size={20} />
            </div>

            <div>
              <h3 className="font-bold text-[var(--brand-dark)]">
                {t("technicalNotes.title")}
              </h3>

              <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--muted-foreground)]">
                <li>• {t("technicalNotes.stocking")}</li>
                <li>• {t("technicalNotes.survival")}</li>
                <li>• {t("technicalNotes.biomass")}</li>
                <li>• {t("technicalNotes.feed")}</li>
                <li>• {t("technicalNotes.seedCost")}</li>
                <li>• {t("technicalNotes.feedCost")}</li>
                <li>• {t("technicalNotes.electricity")}</li>
                <li>• {t("technicalNotes.expenses")}</li>
                <li>• {t("technicalNotes.grossRevenue")}</li>
                <li>• {t("technicalNotes.netRevenue")}</li>
                <li>• {t("technicalNotes.rcRatio")}</li>
                <li>• {t("technicalNotes.aerator")}</li>
                <li>• {t("technicalNotes.oxygen")}</li>
                <li>• {t("technicalNotes.limitations")}</li>
                <li>• {t("technicalNotes.general")}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
