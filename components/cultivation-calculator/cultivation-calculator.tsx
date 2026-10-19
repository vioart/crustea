
"use client";

import { useMemo, useState } from "react";
import {
  Calculator,
  Check,
  ChevronRight,
  CircleHelp,
  Fish,
  Gauge,
  Info,
  Map,
  RotateCcw,
  Waves,
  Wind,
  Zap,
} from "lucide-react";

type AeratorId = "mini" | "brush" | "brush-weighted";

type Aerator = {
  id: AeratorId;
  name: string;
  subtitle: string;
  description: string;
  icon: typeof Wind;
  power: string;
  oxygenOutput: string;
  biomassMin: number;
  biomassMax: number;
  areaMin: number;
  areaMax: number;
  densityMin: number;
  densityMax: number;
  note: string;
};

const aerators: Aerator[] = [
  {
    id: "mini",
    name: "Aerator Mini",
    subtitle: "Untuk kolam skala kecil",
    description:
      "Pilihan aerator mini untuk kebutuhan budidaya ikan nila pada kolam berukuran kecil.",
    icon: Wind,
    power: "350 W / ½ HP",
    oxygenOutput: "250.000 mg O₂/jam",
    biomassMin: 357.14,
    biomassMax: 357.14,
    areaMin: 30,
    areaMax: 50,
    densityMin: 33,
    densityMax: 36,
    note: "Data pembesaran ikan nila pada materi teknis.",
  },
  {
    id: "brush",
    name: "Aerator Brush",
    subtitle: "Untuk pembesaran ikan",
    description:
      "Aerator brush dengan pemasangan sesuai SOP untuk mendukung budidaya dengan biomassa lebih besar.",
    icon: Waves,
    power: "700 W / 470 W",
    oxygenOutput: "1.000.000 mg O₂/jam*",
    biomassMin: 1200,
    biomassMax: 1300,
    areaMin: 200,
    areaMax: 300,
    densityMin: 30,
    densityMax: 50,
    note: "Kapasitas biomassa mengikuti rentang pada materi teknis.",
  },
  {
    id: "brush-weighted",
    name: "Brush + Pemberat",
    subtitle: "Konfigurasi dengan pemberat",
    description:
      "Aerator brush dengan penambahan pemberat untuk konfigurasi budidaya yang memiliki acuan biomassa lebih besar.",
    icon: Gauge,
    power: "700 W / 600 W",
    oxygenOutput: "1.300.000 mg O₂/jam*",
    biomassMin: 1600,
    biomassMax: 1800,
    areaMin: 200,
    areaMax: 300,
    densityMin: 40,
    densityMax: 60,
    note: "Kapasitas biomassa mengikuti rentang pada materi teknis.",
  },
];

type InputFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  unit: string;
  placeholder?: string;
  hint?: string;
  min?: number;
};

function InputField({
  label,
  value,
  onChange,
  unit,
  placeholder,
  hint,
  min = 0,
}: InputFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[var(--brand-dark)]">
        {label}
      </label>

      <div className="flex items-center rounded-xl border border-[var(--input)] bg-[var(--card)] transition focus-within:border-[var(--brand-secondary)] focus-within:ring-4 focus-within:ring-[var(--brand-secondary)]/15">
        <input
          type="number"
          min={min}
          step="any"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder ?? "Masukkan nilai"}
          className="min-w-0 flex-1 rounded-xl bg-transparent px-4 py-3.5 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
        />

        <span className="shrink-0 px-4 text-sm text-[var(--muted-foreground)]">
          {unit}
        </span>
      </div>

      {hint && (
        <p className="text-xs leading-5 text-[var(--muted-foreground)]">
          {hint}
        </p>
      )}
    </div>
  );
}

export default function CultivationCalculator() {
  const [selectedAerator, setSelectedAerator] =
    useState<AeratorId>("mini");

  const [area, setArea] = useState("40");
  const [density, setDensity] = useState("35");
  const [averageWeight, setAverageWeight] = useState("200");
  const [targetBiomass, setTargetBiomass] = useState("");
  const [calculationMode, setCalculationMode] = useState<
    "pond" | "biomass"
  >("pond");
  const [hasCalculated, setHasCalculated] = useState(false);

  const activeAerator = aerators.find(
    (aerator) => aerator.id === selectedAerator,
  )!;

  const parsedArea = Number(area);
  const parsedDensity = Number(density);
  const parsedWeight = Number(averageWeight);
  const parsedBiomass = Number(targetBiomass);

  const isPondInputValid =
    area.trim() !== "" &&
    density.trim() !== "" &&
    averageWeight.trim() !== "" &&
    Number.isFinite(parsedArea) &&
    Number.isFinite(parsedDensity) &&
    Number.isFinite(parsedWeight) &&
    parsedArea > 0 &&
    parsedDensity > 0 &&
    parsedWeight > 0;

  const isBiomassInputValid =
    targetBiomass.trim() !== "" &&
    Number.isFinite(parsedBiomass) &&
    parsedBiomass > 0;

  const result = useMemo(() => {
    const fishCount = isPondInputValid
      ? Math.floor(parsedArea * parsedDensity)
      : 0;

    const calculatedBiomass = isPondInputValid
      ? (fishCount * parsedWeight) / 1000
      : 0;

    const biomass =
      calculationMode === "pond"
        ? calculatedBiomass
        : isBiomassInputValid
          ? parsedBiomass
          : 0;

    // Batas bawah kapasitas hanya digunakan sebagai acuan awal.
    const estimatedUnits =
      biomass > 0
        ? Math.ceil(biomass / activeAerator.biomassMin)
        : 0;

    const oxygenRequirement = biomass * 700;

    return {
      fishCount,
      biomass,
      estimatedUnits,
      oxygenRequirement,
      isValid:
        calculationMode === "pond"
          ? isPondInputValid
          : isBiomassInputValid,
    };
  }, [
    activeAerator,
    calculationMode,
    isBiomassInputValid,
    isPondInputValid,
    parsedArea,
    parsedDensity,
    parsedWeight,
    parsedBiomass,
  ]);

  function handleCalculate() {
    if (!result.isValid) {
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
    setSelectedAerator("mini");
    setArea("40");
    setDensity("35");
    setAverageWeight("200");
    setTargetBiomass("");
    setCalculationMode("pond");
    setHasCalculated(false);
  }

  function formatNumber(value: number, maximumFractionDigits = 2) {
    return new Intl.NumberFormat("id-ID", {
      maximumFractionDigits,
    }).format(value);
  }

  return (
    <section
      id="kalkulator-budidaya"
      className="bg-[var(--muted)] py-12 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Intro */}
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--accent)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-dark)]">
            <Calculator
              size={15}
              className="text-[var(--brand-secondary)]"
            />
            Kalkulator Budidaya
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-[var(--brand-dark)] sm:text-4xl lg:text-5xl">
            Rencanakan Budidaya
            <span className="mt-1 block text-[var(--brand-secondary)]">
              dengan Lebih Terukur
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[var(--muted-foreground)] sm:text-base">
            Pilih aerator dan masukkan data budidaya untuk mendapatkan
            estimasi awal biomassa, kebutuhan oksigen, dan jumlah alat
            berdasarkan parameter yang tersedia.
          </p>
        </div>

        {/* Main layout */}
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)] lg:gap-8">
          {/* Form */}
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
              <div className="border-b border-[var(--border)] px-5 py-5 sm:px-7">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-secondary)]/10 text-[var(--brand-secondary)]">
                    <span className="text-sm font-bold">01</span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[var(--brand-dark)]">
                      Pilih jenis aerator
                    </h3>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                      Pilih alat yang ingin kamu gunakan.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 p-4 sm:grid-cols-3 sm:p-5">
                {aerators.map((aerator) => {
                  const Icon = aerator.icon;
                  const isSelected = selectedAerator === aerator.id;

                  return (
                    <button
                      key={aerator.id}
                      type="button"
                      onClick={() => {
                        setSelectedAerator(aerator.id);
                        setHasCalculated(false);
                      }}
                      aria-pressed={isSelected}
                      className={`group relative flex h-full flex-col rounded-xl border p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                        isSelected
                          ? "border-[var(--brand-primary)] bg-[var(--accent)] ring-2 ring-[var(--brand-primary)]/20"
                          : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--brand-secondary)]"
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-[var(--brand-primary)] text-[var(--brand-dark)]">
                          <Check size={12} strokeWidth={3} />
                        </span>
                      )}

                      <div
                        className={`mb-4 flex size-11 items-center justify-center rounded-xl transition ${
                          isSelected
                            ? "bg-[var(--brand-dark)] text-white"
                            : "bg-[var(--brand-secondary)]/10 text-[var(--brand-secondary)] group-hover:bg-[var(--accent)]"
                        }`}
                      >
                        <Icon size={23} strokeWidth={1.8} />
                      </div>

                      <h4 className="pr-2 text-sm font-bold leading-5 text-[var(--brand-dark)]">
                        {aerator.name}
                      </h4>

                      <p className="mt-2 text-xs leading-5 text-[var(--muted-foreground)]">
                        {aerator.subtitle}
                      </p>

                      <div className="mt-4 border-t border-[var(--border)] pt-3">
                        <p className="text-[11px] text-[var(--muted-foreground)]">
                          Acuan biomassa
                        </p>
                        <p className="mt-1 text-sm font-bold text-[var(--brand-secondary)]">
                          {formatNumber(aerator.biomassMin)}
                          {aerator.biomassMin !== aerator.biomassMax &&
                            `–${formatNumber(aerator.biomassMax)}`}{" "}
                          kg
                        </p>
                      </div>
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
                  {activeAerator.description} {activeAerator.note}
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
              <div className="border-b border-[var(--border)] px-5 py-5 sm:px-7">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-secondary)]/10 text-[var(--brand-secondary)]">
                    <span className="text-sm font-bold">02</span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[var(--brand-dark)]">
                      Data budidaya
                    </h3>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                      Masukkan data sesuai kondisi kolam.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 p-5 sm:p-7">
                <div>
                  <p className="mb-3 text-sm font-semibold text-[var(--brand-dark)]">
                    Metode perhitungan
                  </p>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCalculationMode("pond");
                        setHasCalculated(false);
                      }}
                      className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${
                        calculationMode === "pond"
                          ? "border-[var(--brand-secondary)] bg-[var(--brand-secondary)]/10 ring-1 ring-[var(--brand-secondary)]/20"
                          : "border-[var(--border)] hover:border-[var(--brand-secondary)]"
                      }`}
                    >
                      <Map
                        size={20}
                        className="shrink-0 text-[var(--brand-secondary)]"
                      />
                      <span>
                        <span className="block text-sm font-semibold text-[var(--brand-dark)]">
                          Berdasarkan kolam
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-[var(--muted-foreground)]">
                          Hitung biomassa dari data kolam dan ikan.
                        </span>
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCalculationMode("biomass");
                        setHasCalculated(false);
                      }}
                      className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${
                        calculationMode === "biomass"
                          ? "border-[var(--brand-secondary)] bg-[var(--brand-secondary)]/10 ring-1 ring-[var(--brand-secondary)]/20"
                          : "border-[var(--border)] hover:border-[var(--brand-secondary)]"
                      }`}
                    >
                      <Fish
                        size={20}
                        className="shrink-0 text-[var(--brand-secondary)]"
                      />
                      <span>
                        <span className="block text-sm font-semibold text-[var(--brand-dark)]">
                          Berdasarkan biomassa
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-[var(--muted-foreground)]">
                          Masukkan target berat total ikan.
                        </span>
                      </span>
                    </button>
                  </div>
                </div>

                {calculationMode === "pond" ? (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <InputField
                      label="Luas kolam"
                      value={area}
                      onChange={(value) => {
                        setArea(value);
                        setHasCalculated(false);
                      }}
                      unit="m²"
                      placeholder="Contoh: 40"
                      hint="Total luas kolam yang digunakan."
                    />

                    <InputField
                      label="Kepadatan tebar"
                      value={density}
                      onChange={(value) => {
                        setDensity(value);
                        setHasCalculated(false);
                      }}
                      unit="ekor/m²"
                      placeholder="Contoh: 35"
                      hint="Jumlah ikan per meter persegi."
                    />

                    <div className="sm:col-span-2">
                      <InputField
                        label="Berat rata-rata ikan"
                        value={averageWeight}
                        onChange={(value) => {
                          setAverageWeight(value);
                          setHasCalculated(false);
                        }}
                        unit="gram/ekor"
                        placeholder="Contoh: 200"
                        hint="Berat rata-rata ikan pada kondisi atau fase budidaya yang ingin dihitung."
                      />
                    </div>
                  </div>
                ) : (
                  <InputField
                    label="Target biomassa ikan"
                    value={targetBiomass}
                    onChange={(value) => {
                      setTargetBiomass(value);
                      setHasCalculated(false);
                    }}
                    unit="kg"
                    placeholder="Contoh: 300"
                    hint="Masukkan estimasi total berat ikan yang ingin ditampung."
                  />
                )}

                {hasCalculated && !result.isValid && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                  >
                    Isi semua data dengan angka yang valid dan lebih besar
                    dari nol.
                  </div>
                )}

                <div className="flex flex-col gap-3 border-t border-[var(--border)] pt-5 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleCalculate}
                    disabled={!result.isValid}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-5 py-3.5 text-sm font-semibold text-[var(--brand-dark)] shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Calculator size={18} />
                    Hitung Kebutuhan Aerator
                    <ChevronRight size={17} />
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-5 py-3.5 text-sm font-medium text-[var(--brand-dark)] transition hover:border-[var(--brand-secondary)] hover:bg-[var(--secondary)]"
                  >
                    <RotateCcw size={16} />
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results panel */}
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
                    Ringkasan kalkulasi
                  </p>

                  <h3 className="mt-2 text-2xl font-bold tracking-tight">
                    Hasil Budidaya
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-white/80">
                    Estimasi berdasarkan input dan acuan kapasitas alat.
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
                      Hasil akan muncul di sini
                    </h4>

                    <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[var(--muted-foreground)]">
                      Pilih aerator, lengkapi data budidaya, lalu tekan
                      tombol hitung untuk melihat hasil simulasi.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="rounded-xl border border-[var(--brand-secondary)]/30 bg-[var(--brand-secondary)]/10 p-4">
                      <p className="text-sm font-medium text-[var(--brand-secondary)]">
                        Estimasi jumlah aerator
                      </p>

                      <div className="mt-2 flex items-end gap-2">
                        <span className="text-4xl font-bold tracking-tight text-[var(--brand-dark)]">
                          {result.estimatedUnits}
                        </span>
                        <span className="pb-1 text-sm text-[var(--brand-secondary)]">
                          unit
                        </span>
                      </div>

                      <p className="mt-2 text-xs leading-5 text-[var(--brand-secondary)]">
                        Menggunakan kapasitas acuan{" "}
                        {formatNumber(activeAerator.biomassMin)} kg biomassa
                        per alat.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-[var(--border)] p-4">
                        <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-[var(--brand-secondary)]/10 text-[var(--brand-secondary)]">
                          <Fish size={19} />
                        </div>
                        <p className="text-xs leading-5 text-[var(--muted-foreground)]">
                          Estimasi jumlah ikan
                        </p>
                        <p className="mt-1 text-lg font-bold text-[var(--brand-dark)]">
                          {calculationMode === "pond"
                            ? formatNumber(result.fishCount, 0)
                            : "—"}
                        </p>
                        <p className="text-xs text-[var(--muted-foreground)]">
                          ekor
                        </p>
                      </div>

                      <div className="rounded-xl border border-[var(--border)] p-4">
                        <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-[var(--brand-primary)]/15 text-[var(--brand-dark)]">
                          <Gauge size={19} />
                        </div>
                        <p className="text-xs leading-5 text-[var(--muted-foreground)]">
                          Target biomassa
                        </p>
                        <p className="mt-1 text-lg font-bold text-[var(--brand-dark)]">
                          {formatNumber(result.biomass)}
                        </p>
                        <p className="text-xs text-[var(--muted-foreground)]">
                          kg
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-[var(--border)] p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-[var(--brand-dark)]">
                            Estimasi kebutuhan oksigen
                          </p>
                          <p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">
                            Menggunakan acuan 700 mg O₂/kg/jam dari materi.
                          </p>
                        </div>
                        <Zap
                          size={20}
                          className="shrink-0 text-[var(--brand-secondary)]"
                        />
                      </div>

                      <p className="mt-3 text-xl font-bold text-[var(--brand-dark)]">
                        {formatNumber(result.oxygenRequirement / 1000)}{" "}
                        <span className="text-sm font-medium text-[var(--muted-foreground)]">
                          g O₂/jam
                        </span>
                      </p>
                    </div>

                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                      <div className="flex items-start gap-2">
                        <Info
                          size={17}
                          className="mt-0.5 shrink-0 text-amber-700"
                        />
                        <div>
                          <p className="text-sm font-semibold text-amber-900">
                            Perlu validasi teknis
                          </p>
                          <p className="mt-1 text-xs leading-5 text-amber-800">
                            Hasil ini adalah estimasi matematis awal, bukan
                            rekomendasi jumlah alat yang siap digunakan.
                            Kapasitas aktual, konfigurasi kolam, dan faktor
                            keamanan perlu dikonfirmasi oleh tim teknis.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Selected equipment */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Alat yang dipilih
              </p>

              <div className="mt-4 flex items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-secondary)]/10 text-[var(--brand-secondary)]">
                  {(() => {
                    const Icon = activeAerator.icon;
                    return <Icon size={24} />;
                  })()}
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-[var(--brand-dark)]">
                    {activeAerator.name}
                  </h4>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    Daya pada materi: {activeAerator.power}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[var(--border)] pt-4">
                <div>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Output O₂ pada materi
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[var(--brand-dark)]">
                    {activeAerator.oxygenOutput}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Acuan biomassa per alat
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[var(--brand-secondary)]">
                    {formatNumber(activeAerator.biomassMin)}
                    {activeAerator.biomassMin !== activeAerator.biomassMax &&
                      `–${formatNumber(activeAerator.biomassMax)}`}{" "}
                    kg
                  </p>
                </div>
              </div>

              <p className="mt-3 text-xs leading-5 text-[var(--muted-foreground)]">
                *Angka output oksigen ditampilkan sesuai materi yang
                diberikan dan belum diverifikasi terhadap spesifikasi alat.
              </p>
            </div>
          </aside>
        </div>

        {/* Technical notes */}
        <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-secondary)]/10 text-[var(--brand-secondary)]">
              <CircleHelp size={20} />
            </div>

            <div>
              <h3 className="font-bold text-[var(--brand-dark)]">
                Catatan perhitungan
              </h3>

              <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--muted-foreground)]">
                <li>
                  • Biomassa dihitung dari jumlah ikan dikalikan berat
                  rata-rata ikan.
                </li>
                <li>
                  • Estimasi jumlah alat menggunakan pembulatan ke atas
                  berdasarkan batas bawah kapasitas biomassa pada materi.
                </li>
                <li>
                  • Kebutuhan oksigen dihitung dengan acuan 700 mg
                  O₂/kg/jam sesuai materi yang diberikan.
                </li>
                <li>
                  • Perhitungan belum memperhitungkan faktor keamanan,
                  kondisi air, kedalaman kolam, distribusi oksigen, atau
                  konfigurasi aktual aerator.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
