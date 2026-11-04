"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Calculator,
  RotateCcw,
  ChevronRight,
  FileDown,
  Sun,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type SystemType = "ongrid" | "hybrid" | "offgrid";
type Phase = "auto" | "1" | "3";
type RoofType = "genteng" | "metal" | "beton" | "spandek";
type LoadItem = {
  id: number;
  name: string;
  watt: number;
  quantity: number;
  hours: number;
};

/**
 * Kalkulator PLTS Crustea — frontend reference implementation.
 * Formula source: Kalkulator PLTS Crustea, deck 20 slides.
 * Semua perhitungan dan data master sementara berjalan langsung di frontend.
 */

const MASTER = {
  // M1 — PSH defaults from slide 17. Extend this list from admin master data.
  locations: [
    {
      id: "dki-jakarta",
      name: "DKI Jakarta — Jakarta",
      psh: 3.82,
      emission: 0.87,
    },
    { id: "bogor", name: "Jawa Barat — Bogor", psh: 3.78, emission: 0.87 },
    { id: "bekasi", name: "Jawa Barat — Bekasi", psh: 3.85, emission: 0.87 },
    { id: "tangerang", name: "Banten — Tangerang", psh: 3.88, emission: 0.87 },
    { id: "bandung", name: "Jawa Barat — Bandung", psh: 4.1, emission: 0.87 },
    {
      id: "semarang",
      name: "Jawa Tengah — Semarang",
      psh: 4.25,
      emission: 0.87,
    },
    {
      id: "yogya",
      name: "DI Yogyakarta — Yogyakarta",
      psh: 4.32,
      emission: 0.87,
    },
    {
      id: "surabaya",
      name: "Jawa Timur — Surabaya",
      psh: 4.45,
      emission: 0.87,
    },
    {
      id: "malang",
      name: "Jawa Timur — Malang",
      psh: 4.3,
      emission: 0.87,
    },
    { id: "denpasar", name: "Bali — Denpasar", psh: 4.65, emission: 0.87 },
  ],
  // M2 — tariff values from slide 17.
  tariffs: [
    { id: "R1-900-RTM", label: "R-1 900 VA RTM", price: 1352 },
    { id: "R1-2200", label: "R-1 1.300–2.200 VA", price: 1444.7 },
    { id: "R2-R3", label: "R-2 / R-3", price: 1699.53 },
    { id: "B2", label: "B-2", price: 1444.7 },
    { id: "B3-I3", label: "B-3 / I-3 (LWBP)", price: 1114.74 },
    { id: "I4", label: "I-4", price: 996.74 },
    { id: "P1", label: "P-1", price: 1699.53 },
    { id: "L", label: "Layanan khusus", price: 1644.52 },
  ],
  // M3 — prices are editable defaults, not a quotation.
  pvPriceTiers: [
    { max: 5, price: 15_500_000 },
    { max: 50, price: 14_500_000 },
    { max: 100, price: 13_500_000 },
    { max: 500, price: 12_000_000 },
    { max: Infinity, price: 10_000_000 },
  ],
  batteryPerKwh: 3_000_000,
  hybridInverterExtraPerKw: 1_500_000,
  offgridPvPerKwp: 12_000_000,
  offgridInverterPerKw: 3_000_000,
  offgridBatteryPerKwh: 3_000_000,
  dieselPricePerLiter: 14_500,
  // M4 — technical constants.
  pr: 0.85,
  selfUseOnGrid: 0.7,
  selfUseHybrid: 0.85,
  maxKwpPerKva: 1.2,
  roofAreaPerKwp: 5.58,
  tariffEscalation: 0.05,
  annualProductionDecline: 0.015,
  criticalLoadFactor: 0.6,
  powerFactor: 0.8,
  dod: 0.8,
  batteryEfficiency: 0.95,
  batteryUnitKwh: 5,
  dieselLiterPerKwh: 0.28,
  dieselEmissionKgPerLiter: 2.57,
  treeAbsorptionKgPerYear: 21.8,
  carKgPerKm: 0.16,
  // M5 — default Jamali factor. Other regions should be managed in master data.
  gridEmission: 0.87,
  inverterCatalog: [
    1, 1.5, 2, 3, 5, 6, 8, 10, 12, 15, 20, 25, 30, 40, 50, 60, 75, 100, 125,
    150, 200, 250, 300, 400, 500,
  ],
  moduleOptions: [300, 450, 550, 615, 660, 720],
};

const DEFAULT_LOADS: LoadItem[] = [
  { id: 1, name: "Lampu LED", watt: 10, quantity: 8, hours: 6 },
  { id: 2, name: "Kulkas 2 pintu", watt: 150, quantity: 1, hours: 24 },
  { id: 3, name: 'TV LED 42"', watt: 100, quantity: 2, hours: 5 },
  { id: 4, name: "AC 1 PK", watt: 800, quantity: 1, hours: 8 },
  {
    id: 5,
    name: "Kipas, rice cooker, WiFi, setrika",
    watt: 100,
    quantity: 1,
    hours: 18.3,
  },
];

const money = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0);
const number = (n: number, digits = 2) =>
  new Intl.NumberFormat("id-ID", { maximumFractionDigits: digits }).format(
    Number.isFinite(n) ? n : 0,
  );
const ceilTo = (n: number, unit: number) => Math.ceil(n / unit) * unit;
const pickInverter = (kw: number) =>
  MASTER.inverterCatalog.find((size) => size >= kw) ?? Math.ceil(kw);
const pvPrice = (kwp: number) =>
  MASTER.pvPriceTiers.find((tier) => kwp <= tier.max)?.price ?? 10_000_000;

function paybackCompound(cost: number, monthlySaving: number) {
  if (cost <= 0 || monthlySaving <= 0) return null;

  let accumulated = 0;

  for (let year = 1; year <= 40; year++) {
    const annualSaving =
      monthlySaving *
      12 *
      Math.pow(1 + MASTER.tariffEscalation, year - 1) *
      Math.pow(1 - MASTER.annualProductionDecline, year - 1);

    if (accumulated + annualSaving >= cost) {
      const remaining = cost - accumulated;
      const fractionOfYear = remaining / annualSaving;

      return year - 1 + fractionOfYear;
    }

    accumulated += annualSaving;
  }

  return null;
}

function paybackCompoundDeck(cost: number, monthlySaving: number) {
  if (cost <= 0 || monthlySaving <= 0) return null;

  let accumulated = 0;

  for (let year = 1; year <= 40; year++) {
    const annualSaving = monthlySaving * 12 * Math.pow(1.0343, year - 1);

    accumulated += annualSaving;

    if (accumulated >= cost) {
      return year;
    }
  }

  return null;
}

type PLTSInput = {
  locationId: string;
  tariffId: string;
  plnPowerVa: number;
  monthlyBill: number;
  targetPercent: number;
  phase: Phase;
  moduleWp: number;
  roofType: RoofType;
  roofArea: number;
  backupHours: number;
  batteryMode: "auto" | "manual";
  batteryKwh: number;
  loads: LoadItem[];
  autonomyDays: number;
  reservePercent: number;
  lossPercent: number;
};

type JsPDFWithAutoTable = jsPDF & {
  lastAutoTable: {
    finalY: number;
  };
};

function calculatePLTS(system: SystemType, input: PLTSInput) {
  const location =
    MASTER.locations.find((x) => x.id === input.locationId) ??
    MASTER.locations[0];
  const psh = location.psh;
  const emission = location.emission ?? MASTER.gridEmission;
  // Didefinisikan di scope calculatePLTS agar selalu tersedia saat object hasil dibuat.
  const resolvedPhase: string =
    input.phase === "auto"
      ? input.plnPowerVa <= 4400
        ? "1 fase"
        : "3 fase"
      : input.phase === "1"
        ? "1 fase"
        : "3 fase";

  if (system === "ongrid" || system === "hybrid") {
    const tariff =
      MASTER.tariffs.find((x) => x.id === input.tariffId) ?? MASTER.tariffs[1];
    const consumption = input.monthlyBill / tariff.price;
    const targetEnergy = consumption * (input.targetPercent / 100);
    const requiredKwp = targetEnergy / (psh * 30 * MASTER.pr);
    const maxKwp = (input.plnPowerVa * MASTER.maxKwpPerKva) / 1000;
    const moduleKwp = input.moduleWp / 1000;
    const maxByRoof = input.roofArea
      ? Math.floor(input.roofArea / MASTER.roofAreaPerKwp / moduleKwp)
      : Infinity;
    const maxByPln = Math.floor(maxKwp / moduleKwp);
    const requiredModules = Math.ceil(requiredKwp / moduleKwp);
    const modules = Math.max(0, Math.min(requiredModules, maxByPln, maxByRoof));
    const kwp = modules * moduleKwp;
    const production = kwp * psh * 30 * MASTER.pr;
    const selfUse =
      system === "hybrid" ? MASTER.selfUseHybrid : MASTER.selfUseOnGrid;
    const used = Math.min(production * selfUse, consumption);
    const saving = used * tariff.price;
    const savingPercent =
      input.monthlyBill > 0 ? (saving / input.monthlyBill) * 100 : 0;

    let batteryKwh = 0;
    let criticalLoadKw = 0;
    let backupHours = 0;
    let hybridInverterKw = 0;
    let inverterKw = 0;
    let totalCost = kwp * pvPrice(kwp);

    if (system === "hybrid") {
      criticalLoadKw = (0.6 * input.plnPowerVa * MASTER.powerFactor) / 1000;
      const calculatedBattery = ceilTo(
        (criticalLoadKw * input.backupHours) / MASTER.dod,
        MASTER.batteryUnitKwh,
      );
      batteryKwh =
        input.batteryMode === "manual" ? input.batteryKwh : calculatedBattery;
      backupHours = (batteryKwh * MASTER.dod) / Math.max(criticalLoadKw, 0.001);
      hybridInverterKw = pickInverter(Math.max(kwp / 1.2, criticalLoadKw));
      totalCost +=
        hybridInverterKw * MASTER.hybridInverterExtraPerKw +
        batteryKwh * MASTER.batteryPerKwh;
    } else {
      inverterKw = pickInverter(kwp / 1.2);
    }

    const simplePayback = saving > 0 ? totalCost / (saving * 12) : null;
    const compoundPayback =
      system === "ongrid"
        ? paybackCompoundDeck(totalCost, saving)
        : paybackCompound(totalCost, saving);
    const co2 = used * 12 * emission;
    const newGridImport = Math.max(0, consumption - used);
    const newBill = newGridImport * tariff.price;
    const roofAreaRequired = kwp * MASTER.roofAreaPerKwp;
    const packagePrices = [0.75, 1, 1.37].map((factor) => totalCost * factor);
    return {
      valid: input.monthlyBill > 0 && input.plnPowerVa > 0 && modules > 0,
      system,
      location,
      tariff,
      consumption,
      requiredKwp,
      maxKwp,
      modules,
      kwp,
      production,
      used,
      saving,
      savingPercent,
      inverterKw,
      criticalLoadKw,
      batteryKwh,
      backupHours,
      hybridInverterKw,
      resolvedPhase,
      totalCost,
      simplePayback,
      compoundPayback,
      co2,
      newGridImport,
      newBill,
      roofAreaRequired,
      trees: co2 / MASTER.treeAbsorptionKgPerYear,
      carKm: co2 / MASTER.carKgPerKm,
      co2_25y: co2 * 25,
      packagePrices,
      outputs: {
        A: kwp,
        B: modules,
        ...(system === "ongrid" ? { C: inverterKw } : {}),
        D: saving,
        E: savingPercent,
        F: totalCost,
        G: compoundPayback,
        H: co2,
        I: batteryKwh,
        J: criticalLoadKw,
        ...(system === "hybrid" ? { K: hybridInverterKw } : {}),
        Q: production,
        R: used,
        S: newGridImport,
        T: newBill,
        U: roofAreaRequired,
        W: packagePrices,
        X: co2 / MASTER.treeAbsorptionKgPerYear,
        Y: co2 * 25,
        Z: simplePayback,
      },
    };
  }

  const loads: LoadItem[] = Array.isArray(input.loads) ? input.loads : [];

  const loadRows = loads.map((load) => ({
    ...load,
    energyWh: load.watt * load.quantity * load.hours,
  }));

  const dailyWh = loadRows.reduce((sum, row) => sum + row.energyWh, 0);

  const dailyKwh = dailyWh / 1000;

  const peakKw =
    loads.reduce((sum, row) => sum + row.watt * row.quantity, 0) / 1000;

  const validLoads =
    loads.length > 0 &&
    loads.every(
      (load) =>
        load.name.trim().length > 0 &&
        Number.isFinite(load.watt) &&
        load.watt > 0 &&
        Number.isFinite(load.quantity) &&
        Number.isInteger(load.quantity) &&
        load.quantity > 0 &&
        Number.isFinite(load.hours) &&
        load.hours > 0 &&
        load.hours <= 24,
    );
  const requiredKwp =
    (dailyKwh * (1 + input.reservePercent / 100)) /
    (psh * (1 - input.lossPercent / 100));
  const moduleCount = Math.ceil(requiredKwp / (input.moduleWp / 1000));
  const kwp = (moduleCount * input.moduleWp) / 1000;
  const production = kwp * psh * 30 * (1 - input.lossPercent / 100);
  const batteryKwh = ceilTo(
    (dailyKwh * (1 + input.reservePercent / 100) * input.autonomyDays) /
      (MASTER.dod * MASTER.batteryEfficiency),
    MASTER.batteryUnitKwh,
  );
  const inverterKw = pickInverter(1.25 * 0.8 * peakKw);
  const cost =
    kwp * MASTER.offgridPvPerKwp +
    inverterKw * MASTER.offgridInverterPerKw +
    batteryKwh * MASTER.offgridBatteryPerKwh;
  const dieselSaving =
    (dailyKwh * 365 * MASTER.dieselLiterPerKwh * MASTER.dieselPricePerLiter) /
    12;
  const payback = dieselSaving > 0 ? cost / (dieselSaving * 12) : null;
  const co2 =
    dailyKwh * 365 * MASTER.dieselLiterPerKwh * MASTER.dieselEmissionKgPerLiter;
  const trees = Math.floor(co2 / MASTER.treeAbsorptionKgPerYear);
  return {
    valid: validLoads && dailyKwh > 0,
    system,
    location,
    loadRows,
    dailyWh,
    dailyKwh,
    peakKw,
    requiredKwp,
    moduleCount,
    kwp,
    production,
    batteryKwh,
    inverterKw,
    cost,
    dieselSaving,
    payback,
    co2,
    trees,
    outputs: {
      A: kwp,
      B: moduleCount,
      C: inverterKw,
      F: cost,
      G: payback,
      H: co2,
      I: batteryKwh,
      L: loadRows.map((row) => ({
        id: row.id,
        name: row.name,
        energyWh: row.energyWh,
      })),
      M: dailyKwh,
      N: peakKw,
      O: dieselSaving,
      Q: production,
      X: trees,
    },
  };
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      {children}
      {hint && <span className="block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-input bg-background px-3.5 py-3 text-sm text-foreground outline-none transition focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10";

export default function PLTSCalculator() {
  const t = useTranslations("PLTSCalculator");
  const locale = useLocale();
  const [system, setSystem] = useState<SystemType>("ongrid");
  const [locationId, setLocationId] = useState("dki-jakarta");
  const [tariffId, setTariffId] = useState("R1-2200");
  const [plnPowerVa, setPlnPowerVa] = useState(2200);
  const [monthlyBill, setMonthlyBill] = useState(700000);
  const [targetPercent, setTargetPercent] = useState(100);
  const [phase, setPhase] = useState<Phase>("auto");
  const [moduleWp, setModuleWp] = useState(615);
  const [roofType, setRoofType] = useState<RoofType>("genteng");
  const [roofArea, setRoofArea] = useState(0);
  const [backupHours, setBackupHours] = useState(4);
  const [batteryMode, setBatteryMode] = useState<"auto" | "manual">("auto");
  const [batteryKwh, setBatteryKwh] = useState(10);
  const [loads, setLoads] = useState<LoadItem[]>(DEFAULT_LOADS);
  const [autonomyDays, setAutonomyDays] = useState(2);
  const [reservePercent, setReservePercent] = useState(15);
  const [lossPercent, setLossPercent] = useState(15);
  const [showResult, setShowResult] = useState(false);

  const result = useMemo(
    () =>
      calculatePLTS(system, {
        locationId,
        tariffId,
        plnPowerVa,
        monthlyBill,
        targetPercent,
        phase,
        moduleWp,
        roofType,
        roofArea,
        backupHours,
        batteryMode,
        batteryKwh,
        loads,
        autonomyDays,
        reservePercent,
        lossPercent,
      }),
    [
      system,
      locationId,
      tariffId,
      plnPowerVa,
      monthlyBill,
      targetPercent,
      phase,
      moduleWp,
      roofType,
      roofArea,
      backupHours,
      batteryMode,
      batteryKwh,
      loads,
      autonomyDays,
      reservePercent,
      lossPercent,
    ],
  );

  const updateLoad = (
    id: number,
    key: keyof LoadItem,
    value: string | number,
  ) =>
    setLoads((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [key]: value } : item)),
    );

  const addLoad = () =>
    setLoads((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: t("form.fields.loads.newLoad"),
        watt: 100,
        quantity: 1,
        hours: 4,
      },
    ]);

  const removeLoad = (id: number) =>
    setLoads((prev) => prev.filter((item) => item.id !== id));

  const reset = () => {
    setLocationId("dki-jakarta");
    setTariffId("R1-2200");
    setPlnPowerVa(2200);
    setMonthlyBill(700000);
    setTargetPercent(100);
    setPhase("auto");
    setModuleWp(615);
    setRoofType("genteng");
    setRoofArea(0);
    setBackupHours(4);
    setBatteryMode("auto");
    setBatteryKwh(10);
    setLoads(DEFAULT_LOADS);
    setAutonomyDays(2);
    setReservePercent(15);
    setLossPercent(15);
    setShowResult(false);
  };

  const isGrid = system !== "offgrid";

  const gridResult = result as ReturnType<typeof calculatePLTS> & {
    consumption: number;
    kwp: number;
    modules: number;
    totalCost: number;
    saving: number;
    savingPercent: number;
    compoundPayback: number | null;
    co2: number;
    batteryKwh: number;
    criticalLoadKw: number;
    backupHours: number;
    inverterKw: number;
    hybridInverterKw: number;
    production: number;
    used: number;
    newBill: number;
    roofAreaRequired: number;
    newGridImport: number;
    simplePayback: number | null;
    trees: number;
    carKm: number;
    co2_25y: number;
    packagePrices: number[];
    resolvedPhase: string;
  };

  const offResult = result as ReturnType<typeof calculatePLTS> & {
    dailyKwh: number;
    peakKw: number;
    kwp: number;
    moduleCount: number;
    batteryKwh: number;
    inverterKw: number;
    cost: number;
    dieselSaving: number;
    payback: number | null;
    co2: number;
    production: number;
  };

  const downloadPdf = async () => {
    if (!result.valid) return;

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 14;

      const systemName =
        system === "ongrid"
          ? t("system.ongrid")
          : system === "hybrid"
            ? t("system.hybrid")
            : t("system.offgrid");

      const now = new Date();

      const reportDate = now.toLocaleDateString(
        locale === "en" ? "en-US" : "id-ID",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        },
      );

      const dateFile = now.toISOString().slice(0, 10);

      const logo = await loadCrusteaLogo();

      // HEADER PDF
      doc.addImage(logo, "PNG", margin, 10, 32, 16);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(5, 84, 106);
      doc.text(t("pdf.title"), pageWidth - margin, 17, {
        align: "right",
      });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(
        t("pdf.system", { system: systemName }),
        pageWidth - margin,
        23,
        {
          align: "right",
        },
      );

      doc.setDrawColor(171, 201, 55);
      doc.setLineWidth(1);
      doc.line(margin, 32, pageWidth - margin, 32);

      let currentY = 39;

      // INFORMASI LAPORAN
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(5, 84, 106);
      doc.text(t("pdf.reportInformation"), margin, currentY);

      currentY += 4;

      autoTable(doc, {
        startY: currentY,
        theme: "grid",
        margin: { left: margin, right: margin },
        styles: {
          fontSize: 9,
          cellPadding: 3,
          lineColor: [228, 233, 223],
        },
        headStyles: {
          fillColor: [5, 84, 106],
          textColor: 255,
        },
        body: [
          [t("pdf.systemType"), systemName],
          [t("pdf.location"), result.location.name],
          [
            t("pdf.psh"),
            `${number(result.location.psh)} ${t("units.hoursPerDay")}`,
          ],
          [t("pdf.moduleCapacity"), `${moduleWp} Wp`],
          [t("pdf.reportDate"), reportDate],
        ],
      });

      currentY = (doc as JsPDFWithAutoTable).lastAutoTable.finalY + 9;

      // DATA INPUT
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(5, 84, 106);
      doc.text(t("pdf.simulationParameters"), margin, currentY);

      currentY += 4;

      const inputRows: string[][] = [
        [t("pdf.location"), result.location.name],
        [
          t("pdf.psh"),
          `${number(result.location.psh)} ${t("units.hoursPerDay")}`,
        ],
        [t("pdf.moduleCapacity"), `${moduleWp} Wp`],
      ];

      if (isGrid) {
        inputRows.push(
          [t("pdf.plnTariff"), gridResult.tariff.label],
          [t("pdf.plnInstalledPower"), `${number(plnPowerVa, 0)} VA`],
          [t("pdf.electricityBill"), money(monthlyBill)],
          [t("pdf.targetSaving"), `${targetPercent}%`],
          [t("pdf.electricalPhase"), gridResult.resolvedPhase],
          [t("pdf.roofType"), roofType],
          [
            t("pdf.roofArea"),
            roofArea > 0 ? `${number(roofArea)} m²` : t("pdf.notSpecified"),
          ],
        );

        if (system === "hybrid") {
          inputRows.push(
            [t("pdf.backupDuration"), `${backupHours} ${t("units.hour")}`],
            [
              t("pdf.batteryCapacityMode"),
              batteryMode === "auto" ? t("pdf.automatic") : t("pdf.manual"),
            ],
          );

          if (batteryMode === "manual") {
            inputRows.push([
              t("pdf.manualBatteryCapacity"),
              `${batteryKwh} kWh`,
            ]);
          }
        }
      } else {
        inputRows.push(
          [t("pdf.autonomyDays"), `${autonomyDays} ${t("units.day")}`],
          [t("pdf.loadReserve"), `${reservePercent}%`],
          [t("pdf.systemLoss"), `${lossPercent}%`],
        );
      }

      autoTable(doc, {
        startY: currentY,
        theme: "grid",
        margin: { left: margin, right: margin },
        styles: {
          fontSize: 8.5,
          cellPadding: 2.8,
          lineColor: [228, 233, 223],
        },
        headStyles: {
          fillColor: [5, 84, 106],
          textColor: 255,
        },
        head: [[t("pdf.parameter"), t("pdf.value")]],
        body: inputRows,
        columnStyles: {
          0: { cellWidth: 65, fontStyle: "bold" },
        },
      });

      currentY = (doc as JsPDFWithAutoTable).lastAutoTable.finalY + 9;

      // RINGKASAN HASIL
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(5, 84, 106);
      doc.text(t("pdf.calculationSummary"), margin, currentY);

      currentY += 4;

      const summaryRows: string[][] =
        system === "offgrid"
          ? [
              [
                t("pdf.dailyConsumption"),
                `${number(offResult.dailyKwh)} kWh/${t("units.day")}`,
              ],
              [t("pdf.peakLoad"), `${number(offResult.peakKw)} kW`],
              [t("pdf.pvCapacity"), `${number(offResult.kwp)} kWp`],
              [
                t("pdf.moduleCount"),
                `${offResult.moduleCount} ${t("units.module")}`,
              ],
              [t("pdf.battery"), `${number(offResult.batteryKwh, 0)} kWh`],
              [t("pdf.inverter"), `${number(offResult.inverterKw)} kW`],
              [t("pdf.systemCost"), money(offResult.cost)],
              [
                t("pdf.dieselSaving"),
                `${money(offResult.dieselSaving)}${t("units.perMonth")}`,
              ],
              [
                t("pdf.payback"),
                offResult.payback !== null
                  ? `${number(offResult.payback, 1)} ${t("units.year")}`
                  : "—",
              ],
              [
                t("pdf.co2Avoided"),
                `${number(offResult.co2, 0)} kg${t("units.perYear")}`,
              ],
              [
                t("pdf.equivalentTrees"),
                `${offResult.trees} ${t("units.tree")}`,
              ],
            ]
          : [
              [t("pdf.pvCapacity"), `${number(gridResult.kwp)} kWp`],
              [t("pdf.moduleCount"), `${gridResult.modules} × ${moduleWp} Wp`],
              [
                t("pdf.monthlyProduction"),
                `${number(gridResult.production)} kWh/${t("units.month")}`,
              ],
              [t("pdf.monthlySaving"), money(gridResult.saving)],
              [t("pdf.savingPercent"), `${number(gridResult.savingPercent)}%`],
              [t("pdf.systemCost"), money(gridResult.totalCost)],
              [
                t("pdf.compoundPayback"),
                gridResult.compoundPayback !== null
                  ? `${number(gridResult.compoundPayback, 1)} ${t("units.year")}`
                  : t("pdf.cannotCalculate"),
              ],
              [
                t("pdf.co2Avoided"),
                `${number(gridResult.co2, 0)} kg${t("units.perYear")}`,
              ],
              [
                t("pdf.equivalentTrees"),
                `${number(gridResult.trees, 0)} ${t("units.tree")}`,
              ],
              [t("pdf.vehicleDistance"), `${number(gridResult.carKm, 0)} km`],
              [
                t("pdf.co2Avoided25Years"),
                `${number(gridResult.co2_25y, 0)} kg`,
              ],
            ];

      if (system === "hybrid") {
        summaryRows.splice(
          4,
          0,
          [t("pdf.criticalLoad"), `${number(gridResult.criticalLoadKw)} kW`],
          [t("pdf.battery"), `${number(gridResult.batteryKwh, 0)} kWh`],
          [
            t("pdf.backupDurationResult"),
            `${number(gridResult.backupHours)} ${t("units.hour")}`,
          ],
          [
            t("pdf.hybridInverter"),
            `${number(gridResult.hybridInverterKw)} kW`,
          ],
        );
      }

      autoTable(doc, {
        startY: currentY,
        theme: "grid",
        margin: { left: margin, right: margin },
        styles: {
          fontSize: 8.5,
          cellPadding: 2.8,
          lineColor: [228, 233, 223],
        },
        headStyles: {
          fillColor: [5, 84, 106],
          textColor: 255,
        },
        body: summaryRows,
        columnStyles: {
          0: { cellWidth: 85, fontStyle: "bold" },
        },
      });

      currentY = (doc as JsPDFWithAutoTable).lastAutoTable.finalY + 9;

      // RINCIAN PERHITUNGAN
      const addSectionTitle = (title: string) => {
        if (currentY > pageHeight - 35) {
          doc.addPage();
          currentY = 20;
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(5, 84, 106);
        doc.text(title, margin, currentY);
        currentY += 4;
      };

      addSectionTitle(t("pdf.calculationDetails"));

      const detailRows: string[][] = [];

      if (system === "offgrid") {
        offResult.loadRows.forEach((row) => {
          detailRows.push([
            "L",
            row.name,
            `${row.watt} W × ${row.quantity} × ${row.hours} ${t("units.hour")}`,
            `${number(row.energyWh, 0)} Wh/${t("units.day")}`,
          ]);
        });

        detailRows.push(
          [
            "M",
            t("pdf.dailyConsumption"),
            t("result.formulas.dailyConsumption"),
            `${number(offResult.dailyKwh)} kWh/${t("units.day")}`,
          ],
          [
            "N",
            t("pdf.peakLoad"),
            t("result.formulas.peakLoad"),
            `${number(offResult.peakKw)} kW`,
          ],
          [
            "A",
            t("pdf.systemType"),
            t("result.formulas.pvSystem"),
            `${number(offResult.kwp)} kWp`,
          ],
          [
            "B",
            t("pdf.moduleCount"),
            t("result.formulas.offgridPvProduction"),
            `${offResult.moduleCount} × ${moduleWp} Wp`,
          ],
          [
            "Q",
            t("pdf.monthlyProduction"),
            t("result.formulas.offgridPvProduction"),
            `${number(offResult.production)} kWh/${t("units.month")}`,
          ],
          [
            "I",
            t("pdf.battery"),
            t("result.formulas.offgridBattery"),
            `${number(offResult.batteryKwh, 0)} kWh`,
          ],
          [
            "C",
            t("pdf.inverter"),
            t("result.formulas.offgridInverter"),
            `${number(offResult.inverterKw)} kW`,
          ],
          [
            "F",
            t("pdf.systemCost"),
            t("result.formulas.offgridSystemCost"),
            money(offResult.cost),
          ],
          [
            "O",
            t("pdf.dieselSaving"),
            t("result.formulas.offgridDieselSaving"),
            `${money(offResult.dieselSaving)}${t("units.perMonth")}`,
          ],
          [
            "G",
            t("pdf.payback"),
            t("result.formulas.offgridPayback"),
            offResult.payback !== null
              ? `${number(offResult.payback, 1)} ${t("units.year")}`
              : "—",
          ],
          [
            "H",
            t("pdf.co2Avoided"),
            t("result.formulas.offgridCo2"),
            `${number(offResult.co2, 0)} kg${t("units.perYear")}`,
          ],
          [
            "X",
            t("pdf.equivalentTrees"),
            t("result.formulas.offgridTrees"),
            `${offResult.trees} ${t("units.tree")}`,
          ],
        );
      } else {
        detailRows.push(
          [
            "A",
            t("pdf.systemType"),
            t("result.formulas.pvSystem"),
            `${number(gridResult.kwp)} kWp`,
          ],
          [
            "B",
            t("pdf.moduleCount"),
            t("result.formulas.moduleCount"),
            `${gridResult.modules} ${t("units.module")}`,
          ],
        );

        if (system === "ongrid") {
          detailRows.push([
            "C",
            t("pdf.inverter"),
            t("result.formulas.inverter"),
            `${number(gridResult.inverterKw)} kW`,
          ]);
        }

        detailRows.push(
          [
            "D",
            t("result.components.saving"),
            t("result.formulas.saving"),
            money(gridResult.saving),
          ],
          [
            "E",
            t("result.components.savingPercent"),
            t("result.formulas.savingPercent"),
            `${number(gridResult.savingPercent)}%`,
          ],
          [
            "F",
            t("pdf.systemCost"),
            t("result.formulas.systemCost"),
            money(gridResult.totalCost),
          ],
        );

        if (system === "hybrid") {
          detailRows.push(
            [
              "J",
              t("pdf.criticalLoad"),
              t("result.formulas.criticalLoad"),
              `${number(gridResult.criticalLoadKw)} kW`,
            ],
            [
              "I",
              t("result.components.lfpBattery"),
              batteryMode === "auto"
                ? t("result.formulas.batteryAuto")
                : t("result.formulas.batteryManual"),
              `${number(gridResult.batteryKwh, 0)} kWh`,
            ],
            [
              "—",
              t("result.components.maximumBackup"),
              t("result.formulas.maximumBackup"),
              `${number(gridResult.backupHours)} ${t("units.hour")}`,
            ],
            [
              "K",
              t("pdf.hybridInverter"),
              t("result.formulas.hybridInverter"),
              `${number(gridResult.hybridInverterKw)} kW`,
            ],
          );
        }

        detailRows.push(
          [
            "G",
            t("pdf.payback"),
            t("result.formulas.compoundPayback"),
            gridResult.compoundPayback !== null
              ? `${number(gridResult.compoundPayback, 1)} ${t("units.year")}`
              : "—",
          ],
          [
            "H",
            t("pdf.co2Avoided"),
            t("result.formulas.co2Avoided"),
            `${number(gridResult.co2, 0)} kg${t("units.perYear")}`,
          ],
          [
            "Q",
            t("pdf.monthlyProduction"),
            t("result.formulas.pvProduction"),
            `${number(gridResult.production)} kWh/${t("units.month")}`,
          ],
          [
            "R",
            t("result.components.selfConsumption"),
            t("result.formulas.selfConsumption"),
            `${number(gridResult.used)} kWh/${t("units.month")}`,
          ],
          [
            "S",
            t("result.components.gridImport"),
            t("result.formulas.gridImport"),
            `${number(gridResult.newGridImport)} kWh/${t("units.month")}`,
          ],
          [
            "T",
            t("result.components.newBill"),
            t("result.formulas.newBill"),
            money(gridResult.newBill),
          ],
          [
            "U",
            t("result.components.roofArea"),
            t("result.formulas.roofArea"),
            `${number(gridResult.roofAreaRequired)} m²`,
          ],
          [
            "W",
            t("result.components.savingPackage"),
            t("result.formulas.savingPackage"),
            money(gridResult.packagePrices[0]),
          ],
          [
            "W",
            t("result.components.standardPackage"),
            t("result.formulas.standardPackage"),
            money(gridResult.packagePrices[1]),
          ],
          [
            "W",
            t("result.components.premiumPackage"),
            t("result.formulas.premiumPackage"),
            money(gridResult.packagePrices[2]),
          ],
          [
            "X",
            t("pdf.equivalentTrees"),
            t("result.formulas.equivalentTrees"),
            `${number(gridResult.trees, 0)} ${t("units.tree")}`,
          ],
          [
            "X",
            t("pdf.vehicleDistance"),
            t("result.formulas.vehicleDistance"),
            `${number(gridResult.carKm, 0)} km`,
          ],
          [
            "Y",
            t("pdf.co2Avoided25Years"),
            t("result.formulas.co2Avoided25Years"),
            `${number(gridResult.co2_25y, 0)} kg`,
          ],
          [
            "Z",
            t("result.components.simplePayback"),
            t("result.formulas.simplePayback"),
            gridResult.simplePayback !== null
              ? `${number(gridResult.simplePayback, 1)} ${t("units.year")}`
              : "—",
          ],
        );
      }

      autoTable(doc, {
        startY: currentY,
        theme: "grid",
        margin: { left: margin, right: margin },
        head: [
          [
            t("result.table.code"),
            t("pdf.component"),
            t("pdf.formula"),
            t("pdf.result"),
          ],
        ],
        body: detailRows,
        styles: {
          fontSize: 7.5,
          cellPadding: 2.3,
          overflow: "linebreak",
          lineColor: [228, 233, 223],
          textColor: [51, 65, 85],
        },
        headStyles: {
          fillColor: [5, 84, 106],
          textColor: 255,
          fontStyle: "bold",
        },
        columnStyles: {
          0: { cellWidth: 12, halign: "center" },
          1: { cellWidth: 43 },
          2: { cellWidth: 75 },
          3: { cellWidth: 50, halign: "right" },
        },
      });

      // FOOTER SEMUA HALAMAN
      const totalPages = doc.getNumberOfPages();

      for (let page = 1; page <= totalPages; page++) {
        doc.setPage(page);

        doc.setDrawColor(228, 233, 223);
        doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);

        doc.text(t("pdf.footer"), margin, pageHeight - 8);

        doc.text(
          t("pdf.page", {
            current: page,
            total: totalPages,
          }),
          pageWidth - margin,
          pageHeight - 8,
          { align: "right" },
        );
      }

      doc.save(`${t("pdf.fileName")}-${system}-${dateFile}.pdf`);
    } catch (error) {
      console.error("Gagal membuat PDF:", error);
      alert(t("pdf.pdfError"));
    }
  };

  return (
    <section className="bg-muted py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* INTRO */}
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
          <p className="mb-4 flex items-center justify-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-secondary">
            <Sun
              className="size-5 text-primary"
              strokeWidth={2}
              aria-hidden="true"
            />
            {t("intro.eyebrow")}
          </p>

          <h1 className="font-display text-3xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-[40px]">
            {t("intro.title")}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-[17px]">
            {t("intro.description")}
          </p>
        </div>

        <div className="mx-auto mt-9 grid max-w-4xl grid-cols-3 gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          {(["ongrid", "hybrid", "offgrid"] as SystemType[]).map((item) => (
            <button
              key={item}
              onClick={() => {
                setSystem(item);
                setShowResult(false);
              }}
              className={`rounded-xl px-2 py-3 text-sm font-bold transition sm:text-base ${
                system === item
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-secondary-foreground hover:bg-secondary"
              }`}
            >
              {t(`system.${item}`)}
            </button>
          ))}
        </div>

        <div className="mt-7 grid items-start gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(340px,.8fr)]">
          {/* FORM INPUT */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-brand-dark">
                  {t("form.title")}
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  {isGrid ? t("form.gridProfile") : t("form.loadProfile")}
                </h2>
              </div>

              <span
                className={`rounded-lg px-3 py-1.5 text-xs font-bold uppercase ${
                  system === "hybrid"
                    ? "bg-violet-100 text-violet-700"
                    : system === "offgrid"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-orange-100 text-orange-700"
                }`}
              >
                {t(`system.${system}`)}
              </span>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={t("form.fields.location.label")}>
                <select
                  className={inputClass}
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                >
                  {MASTER.locations.map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.name} · PSH {number(x.psh)}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label={t("form.fields.module.label")}>
                <select
                  className={inputClass}
                  value={moduleWp}
                  onChange={(e) => setModuleWp(Number(e.target.value))}
                >
                  {MASTER.moduleOptions.map((x) => (
                    <option key={x} value={x}>
                      {x} Wp
                    </option>
                  ))}
                </select>
              </Field>

              {isGrid ? (
                <>
                  <Field label={t("form.fields.tariff.label")}>
                    <select
                      className={inputClass}
                      value={tariffId}
                      onChange={(e) => setTariffId(e.target.value)}
                    >
                      {MASTER.tariffs.map((x) => (
                        <option key={x.id} value={x.id}>
                          {x.label} · Rp{number(x.price, 2)}/kWh
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label={t("form.fields.plnPower.label")}>
                    <select
                      className={inputClass}
                      value={plnPowerVa}
                      onChange={(e) => setPlnPowerVa(Number(e.target.value))}
                    >
                      {[
                        900, 1300, 2200, 3500, 4400, 5500, 6600, 7700, 10600,
                        11000, 13200, 23000, 33000, 41500, 53000,
                      ].map((x) => (
                        <option key={x} value={x}>
                          {number(x, 0)} VA
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label={t("form.fields.monthlyBill.label")}>
                    <input
                      className={inputClass}
                      type="number"
                      min={0}
                      value={monthlyBill}
                      onChange={(e) => setMonthlyBill(Number(e.target.value))}
                    />
                  </Field>

                  <Field
                    label={`${t("form.fields.targetSaving.label")} · ${targetPercent}%`}
                  >
                    <input
                      className="w-full accent-primary"
                      type="range"
                      min={10}
                      max={100}
                      step={5}
                      value={targetPercent}
                      onChange={(e) => setTargetPercent(Number(e.target.value))}
                    />
                  </Field>

                  <Field label={t("form.fields.phase.label")}>
                    <select
                      className={inputClass}
                      value={phase}
                      onChange={(e) => setPhase(e.target.value as Phase)}
                    >
                      <option value="auto">
                        {t("form.fields.phase.options.auto")}
                      </option>
                      <option value="1">
                        {t("form.fields.phase.options.single")}
                      </option>
                      <option value="3">
                        {t("form.fields.phase.options.three")}
                      </option>
                    </select>
                  </Field>

                  <Field label={t("form.fields.roofType.label")}>
                    <select
                      className={inputClass}
                      value={roofType}
                      onChange={(e) => setRoofType(e.target.value as RoofType)}
                    >
                      <option value="genteng">
                        {t("form.fields.roofType.options.tile")}
                      </option>
                      <option value="metal">
                        {t("form.fields.roofType.options.metal")}
                      </option>
                      <option value="beton">
                        {t("form.fields.roofType.options.concrete")}
                      </option>
                      <option value="spandek">
                        {t("form.fields.roofType.options.spandek")}
                      </option>
                    </select>
                  </Field>

                  <Field
                    label={t("form.fields.roofArea.label")}
                    hint={t("form.fields.roofArea.hint")}
                  >
                    <input
                      className={inputClass}
                      type="number"
                      min={0}
                      value={roofArea || ""}
                      placeholder={t("form.fields.roofArea.placeholder")}
                      onChange={(e) => setRoofArea(Number(e.target.value))}
                    />
                  </Field>

                  {system === "hybrid" && (
                    <>
                      <Field label={t("form.fields.backupHours.label")}>
                        <select
                          className={inputClass}
                          value={backupHours}
                          onChange={(e) =>
                            setBackupHours(Number(e.target.value))
                          }
                        >
                          {[2, 4, 6, 8, 12].map((x) => (
                            <option key={x} value={x}>
                              {x} {t("units.hour")}
                            </option>
                          ))}
                        </select>
                      </Field>

                      <Field label={t("form.fields.batteryMode.label")}>
                        <select
                          className={inputClass}
                          value={batteryMode}
                          onChange={(e) =>
                            setBatteryMode(e.target.value as "auto" | "manual")
                          }
                        >
                          <option value="auto">
                            {t("form.fields.batteryMode.options.auto")}
                          </option>
                          <option value="manual">
                            {t("form.fields.batteryMode.options.manual")}
                          </option>
                        </select>
                      </Field>

                      {batteryMode === "manual" && (
                        <Field label={t("form.fields.manualBattery.label")}>
                          <select
                            className={inputClass}
                            value={batteryKwh}
                            onChange={(e) =>
                              setBatteryKwh(Number(e.target.value))
                            }
                          >
                            {[5, 10, 15, 20, 25, 30].map((x) => (
                              <option key={x} value={x}>
                                {x} kWh
                              </option>
                            ))}
                          </select>
                        </Field>
                      )}
                    </>
                  )}
                </>
              ) : (
                <>
                  <div className="sm:col-span-2">
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-slate-800">
                          {t("form.fields.loads.title")}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {t("form.fields.loads.description")}
                        </p>
                      </div>

                      <button
                        onClick={addLoad}
                        className="rounded-lg bg-accent px-3 py-2 text-xs font-bold text-accent-foreground transition hover:bg-secondary"
                      >
                        + {t("form.fields.loads.add")}
                      </button>
                    </div>

                    <div className="space-y-3">
                      {loads.map((load) => (
                        <div
                          key={load.id}
                          className="grid grid-cols-2 gap-2 rounded-xl border border-slate-200 p-3 sm:grid-cols-[1.4fr_.8fr_.65fr_.65fr_auto]"
                        >
                          <input
                            className={`${inputClass} col-span-2 sm:col-span-1`}
                            aria-label={t("form.fields.loads.name")}
                            value={load.name}
                            onChange={(e) =>
                              updateLoad(load.id, "name", e.target.value)
                            }
                          />

                          <input
                            className={inputClass}
                            aria-label={t("form.fields.loads.watt")}
                            type="number"
                            min={0}
                            placeholder={t("form.fields.loads.watt")}
                            value={load.watt}
                            onChange={(e) =>
                              updateLoad(
                                load.id,
                                "watt",
                                Number(e.target.value),
                              )
                            }
                          />

                          <input
                            className={inputClass}
                            aria-label={t("form.fields.loads.quantity")}
                            type="number"
                            min={1}
                            placeholder={t("form.fields.loads.quantity")}
                            value={load.quantity}
                            onChange={(e) =>
                              updateLoad(
                                load.id,
                                "quantity",
                                Number(e.target.value),
                              )
                            }
                          />

                          <input
                            className={inputClass}
                            aria-label={t("form.fields.loads.hours")}
                            type="number"
                            min={0}
                            max={24}
                            step="0.5"
                            placeholder={t("units.hoursPerDay")}
                            value={load.hours}
                            onChange={(e) =>
                              updateLoad(
                                load.id,
                                "hours",
                                Number(e.target.value),
                              )
                            }
                          />

                          <button
                            aria-label={t("form.fields.loads.remove")}
                            onClick={() => removeLoad(load.id)}
                            className="col-span-2 rounded-lg px-2 text-xs font-bold text-red-500 hover:bg-red-50 sm:col-span-1"
                          >
                            {t("form.fields.loads.remove")}
                          </button>

                          <p className="col-span-2 text-xs text-slate-500 sm:col-span-5">
                            {t("form.fields.loads.energy")}:{" "}
                            {number(load.watt * load.quantity * load.hours, 0)}{" "}
                            Wh/{t("units.day")}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Field label={t("form.fields.autonomyDays.label")}>
                    <select
                      className={inputClass}
                      value={autonomyDays}
                      onChange={(e) => setAutonomyDays(Number(e.target.value))}
                    >
                      {[1, 2, 3].map((x) => (
                        <option key={x} value={x}>
                          {x} {t("units.day")}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field
                    label={`${t("form.fields.reservePercent.label")} · ${reservePercent}%`}
                  >
                    <select
                      className={inputClass}
                      value={reservePercent}
                      onChange={(e) =>
                        setReservePercent(Number(e.target.value))
                      }
                    >
                      {[0, 15, 30, 50].map((x) => (
                        <option key={x} value={x}>
                          {x}%
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field
                    label={`${t("form.fields.lossPercent.label")} · ${lossPercent}%`}
                  >
                    <select
                      className={inputClass}
                      value={lossPercent}
                      onChange={(e) => setLossPercent(Number(e.target.value))}
                    >
                      {[0, 15, 20, 30].map((x) => (
                        <option key={x} value={x}>
                          {x}%
                        </option>
                      ))}
                    </select>
                  </Field>
                </>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="mt-7 flex flex-col gap-3 border-t border-[var(--border)] pt-5 sm:flex-row">
              <button
                type="button"
                onClick={() => setShowResult(true)}
                disabled={!result.valid}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Calculator size={18} />
                {t("actions.calculate")}
                <ChevronRight size={17} />
              </button>

              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-5 py-3.5 text-sm font-medium text-[var(--brand-dark)] transition hover:border-[var(--brand-secondary)] hover:bg-[var(--secondary)]"
              >
                <RotateCcw size={16} />
                {t("actions.reset")}
              </button>
            </div>

            <p className="mt-3 text-xs leading-5 text-slate-400">
              {t("notes.estimation")}
            </p>
          </div>

          {/* REALTIME ESTIMATION */}
          <aside className="space-y-5 lg:sticky lg:top-24">
            <div className="rounded-3xl bg-brand-dark p-5 text-white shadow-lg sm:p-6">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-widest text-white/70">
                  {t("live.title")}
                </p>
                <span className="h-2 w-2 rounded-full bg-brand-primary" />
              </div>

              {isGrid ? (
                <>
                  {system === "hybrid" ? (
                    <>
                      {/* A — Sistem PV */}
                      <Metric
                        label={t("live.pvSystem")}
                        value={`${number(gridResult.kwp)} kWp`}
                      />

                      {/* B — Jumlah modul */}
                      <Metric
                        label={t("live.moduleCount")}
                        value={`${gridResult.modules} × ${moduleWp} Wp`}
                      />

                      {/* J — Beban kritis */}
                      <Metric
                        label={t("live.criticalLoad")}
                        value={`${number(gridResult.criticalLoadKw)} kW`}
                        accent
                      />

                      {/* I — Baterai dan durasi backup */}
                      <Metric
                        label={t("live.battery")}
                        value={`${number(gridResult.batteryKwh, 0)} kWh · ${number(gridResult.backupHours, 1)} ${t("units.hour")}`}
                        accent
                      />

                      {/* K — Inverter Hybrid */}
                      <Metric
                        label={t("live.hybridInverter")}
                        value={`${number(gridResult.hybridInverterKw)} kW`}
                        accent
                      />

                      {/* D — Hemat per bulan */}
                      <Metric
                        label={t("live.monthlySaving")}
                        value={money(gridResult.saving)}
                      />

                      {/* E — Persentase hemat */}
                      <Metric
                        label={t("live.savingPercent")}
                        value={`${number(gridResult.savingPercent, 1)}%`}
                        accent
                      />

                      {/* F — Biaya sistem */}
                      <Metric
                        label={t("live.estimatedSystemCost")}
                        value={money(gridResult.totalCost)}
                      />

                      {/* G — Payback */}
                      <Metric
                        label={t("live.payback")}
                        value={
                          gridResult.compoundPayback !== null
                            ? `${number(gridResult.compoundPayback, 1)} ${t("units.year")}`
                            : t("live.notCalculated")
                        }
                        accent
                      />

                      {/* H — CO₂ */}
                      <Metric
                        label={t("live.co2Avoided")}
                        value={`${number(gridResult.co2, 0)} kg`}
                      />
                    </>
                  ) : (
                    <>
                      <Metric
                        label={t("live.pvSystem")}
                        value={`${number(gridResult.kwp)} kWp`}
                      />

                      <Metric
                        label={t("live.moduleCount")}
                        value={`${gridResult.modules} × ${moduleWp} Wp`}
                      />

                      <Metric
                        label={t("live.electricalPhase")}
                        value={gridResult.resolvedPhase}
                      />

                      <Metric
                        label={t("live.estimatedSaving")}
                        value={money(gridResult.saving)}
                        accent
                      />

                      <Metric
                        label={t("live.estimatedSystemCost")}
                        value={money(gridResult.totalCost)}
                      />

                      <Metric
                        label={t("live.payback")}
                        value={
                          gridResult.compoundPayback !== null
                            ? `${number(gridResult.compoundPayback, 1)} ${t("units.year")}`
                            : t("live.notCalculated")
                        }
                        accent
                      />

                      <Metric
                        label={t("live.co2Avoided")}
                        value={`${number(gridResult.co2, 0)} kg`}
                      />
                    </>
                  )}
                </>
              ) : (
                <>
                  {/* M — Total konsumsi harian */}
                  <Metric
                    label={t("live.totalConsumption")}
                    value={`${number(offResult.dailyKwh)} kWh/${t("units.day")}`}
                  />

                  {/* N — Beban puncak */}
                  <Metric
                    label={t("live.peakLoad")}
                    value={`${number(offResult.peakKw)} kW`}
                  />

                  {/* A — Sistem PV */}
                  <Metric
                    label={t("live.pvSystem")}
                    value={`${offResult.moduleCount} × ${moduleWp} Wp = ${number(offResult.kwp)} kWp`}
                  />

                  {/* I — Baterai */}
                  <Metric
                    label={t("live.battery")}
                    value={`${number(offResult.batteryKwh, 0)} kWh`}
                    accent
                  />

                  {/* C — Inverter */}
                  <Metric
                    label={t("live.batteryInverter")}
                    value={`${number(offResult.inverterKw)} kW`}
                  />

                  {/* F — Biaya sistem */}
                  <Metric
                    label={t("live.estimatedSystemCost")}
                    value={money(offResult.cost)}
                  />

                  {/* O — Penghematan genset */}
                  <Metric
                    label={t("live.dieselSaving")}
                    value={`${money(offResult.dieselSaving)}${t("units.perMonth")}`}
                    accent
                  />

                  {/* H — CO2 */}
                  <Metric
                    label={t("live.co2Avoided")}
                    value={`${number(offResult.co2, 0)} kg`}
                  />
                </>
              )}
            </div>

            {showResult && result.valid && (
              <button
                type="button"
                onClick={downloadPdf}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-primary bg-white px-5 py-3.5 text-sm font-semibold text-primary shadow-sm transition hover:bg-primary hover:text-primary-foreground"
              >
                <FileDown size={18} />
                {t("actions.downloadPdf")}
              </button>
            )}

            {/* CALCULATION INFORMATION */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="font-bold text-slate-900">
                {t("notes.informationTitle")}
              </h3>

              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                <li>
                  • {t("notes.locationPsh")}:{" "}
                  {number(
                    (
                      MASTER.locations.find((x) => x.id === locationId) ??
                      MASTER.locations[0]
                    ).psh,
                  )}{" "}
                  {t("units.hoursPerDay")}.
                </li>

                <li>• {t("notes.pr")}</li>

                <li>• {t("notes.masterData")}</li>

                <li>• {t("notes.priceDisclaimer")}</li>
              </ul>
            </div>
          </aside>
        </div>

        {showResult && (
          <div className="mt-7 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-brand-dark">
                  {t("result.eyebrow")}
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  {t("result.title")}
                </h2>
              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-600">
                {t(`system.${system}`)}
              </span>
            </div>

            {isGrid ? (
              <>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Summary
                    label={t("result.systemCost")}
                    value={money(gridResult.totalCost)}
                  />

                  <Summary
                    label={t("result.savingPercent")}
                    value={`${number(gridResult.savingPercent)}%`}
                  />

                  <Summary
                    label={t("result.co2Avoided")}
                    value={`${number(gridResult.co2, 0)} kg`}
                  />

                  <Summary
                    label={t("result.equivalentTrees")}
                    value={`${number(gridResult.trees, 0)} ${t("units.tree")}`}
                  />
                </div>

                <div className="mt-6 overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead>
                      <tr className="border-b bg-slate-50 text-slate-600">
                        <th className="p-3">{t("result.table.code")}</th>
                        <th className="p-3">{t("result.table.component")}</th>
                        <th className="p-3">{t("result.table.formula")}</th>
                        <th className="p-3 text-right">
                          {t("result.table.result")}
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      <ResultRow
                        code="A"
                        label={t("result.components.pvSystem")}
                        formula={t("result.formulas.pvSystem")}
                        value={`${number(gridResult.kwp)} kWp`}
                      />

                      <ResultRow
                        code="B"
                        label={t("result.components.moduleCount")}
                        formula={t("result.formulas.moduleCount")}
                        value={`${gridResult.modules} ${t("units.module")}`}
                      />

                      {system === "ongrid" && (
                        <ResultRow
                          code="C"
                          label={t("result.components.inverter")}
                          formula={t("result.formulas.inverter")}
                          value={`${number(gridResult.inverterKw)} kW`}
                        />
                      )}

                      <ResultRow
                        code="D"
                        label={t("result.components.saving")}
                        formula={t("result.formulas.saving")}
                        value={money(gridResult.saving)}
                      />

                      <ResultRow
                        code="E"
                        label={t("result.components.savingPercent")}
                        formula={t("result.formulas.savingPercent")}
                        value={`${number(gridResult.savingPercent)}%`}
                      />

                      <ResultRow
                        code="F"
                        label={t("result.components.systemCost")}
                        formula={t("result.formulas.systemCost")}
                        value={money(gridResult.totalCost)}
                      />

                      {system === "hybrid" && (
                        <>
                          <ResultRow
                            code="J"
                            label={t("result.components.criticalLoad")}
                            formula={t("result.formulas.criticalLoad")}
                            value={`${number(gridResult.criticalLoadKw)} kW`}
                          />

                          <ResultRow
                            code="I"
                            label={t("result.components.lfpBattery")}
                            formula={
                              batteryMode === "auto"
                                ? t("result.formulas.batteryAuto")
                                : t("result.formulas.batteryManual")
                            }
                            value={`${number(gridResult.batteryKwh, 0)} kWh`}
                          />

                          <ResultRow
                            code="—"
                            label={t("result.components.maximumBackup")}
                            formula={t("result.formulas.maximumBackup")}
                            value={`${number(gridResult.backupHours)} ${t("units.hour")}`}
                          />

                          <ResultRow
                            code="K"
                            label={t("result.components.hybridInverter")}
                            formula={t("result.formulas.hybridInverter")}
                            value={`${number(gridResult.hybridInverterKw)} kW`}
                          />
                        </>
                      )}

                      <ResultRow
                        code="G"
                        label={t("result.components.payback")}
                        formula={t("result.formulas.compoundPayback")}
                        value={
                          gridResult.compoundPayback !== null
                            ? `${number(gridResult.compoundPayback, 1)} ${t("units.year")}`
                            : t("pdf.cannotCalculate")
                        }
                      />

                      {(system === "ongrid" || system === "hybrid") && (
                        <>
                          <ResultRow
                            code="H"
                            label={t("result.components.co2Avoided")}
                            formula={t("result.formulas.co2Avoided")}
                            value={`${number(gridResult.co2, 0)} kg${t("units.perYear")}`}
                          />

                          <ResultRow
                            code="Q"
                            label={t("result.components.pvProduction")}
                            formula={t("result.formulas.pvProduction")}
                            value={`${number(gridResult.production)} kWh${t("units.perMonth")}`}
                          />

                          <ResultRow
                            code="R"
                            label={t("result.components.selfConsumption")}
                            formula={t("result.formulas.selfConsumption")}
                            value={`${number(gridResult.used)} kWh${t("units.perMonth")}`}
                          />

                          <ResultRow
                            code="S"
                            label={t("result.components.gridImport")}
                            formula={t("result.formulas.gridImport")}
                            value={`${number(gridResult.newGridImport)} kWh${t("units.perMonth")}`}
                          />

                          <ResultRow
                            code="T"
                            label={t("result.components.newBill")}
                            formula={t("result.formulas.newBill")}
                            value={money(gridResult.newBill)}
                          />

                          <ResultRow
                            code="U"
                            label={t("result.components.roofArea")}
                            formula={t("result.formulas.roofArea")}
                            value={`${number(gridResult.roofAreaRequired)} m²`}
                          />

                          <ResultRow
                            code="W"
                            label={t("result.components.savingPackage")}
                            formula={t("result.formulas.savingPackage")}
                            value={money(gridResult.packagePrices[0])}
                          />

                          <ResultRow
                            code="W"
                            label={t("result.components.standardPackage")}
                            formula={t("result.formulas.standardPackage")}
                            value={money(gridResult.packagePrices[1])}
                          />

                          <ResultRow
                            code="W"
                            label={t("result.components.premiumPackage")}
                            formula={t("result.formulas.premiumPackage")}
                            value={money(gridResult.packagePrices[2])}
                          />

                          <ResultRow
                            code="X"
                            label={t("result.components.equivalentTrees")}
                            formula={t("result.formulas.equivalentTrees")}
                            value={`${number(gridResult.trees, 0)} ${t("units.tree")}`}
                          />

                          <ResultRow
                            code="X"
                            label={t(
                              "result.components.equivalentVehicleDistance",
                            )}
                            formula={t("result.formulas.vehicleDistance")}
                            value={`${number(gridResult.carKm, 0)} km`}
                          />

                          <ResultRow
                            code="Y"
                            label={t("result.components.co2Avoided25Years")}
                            formula={t("result.formulas.co2Avoided25Years")}
                            value={`${number(gridResult.co2_25y, 0)} kg`}
                          />

                          <ResultRow
                            code="Z"
                            label={t("result.components.simplePayback")}
                            formula={t("result.formulas.simplePayback")}
                            value={
                              gridResult.simplePayback !== null
                                ? `${number(gridResult.simplePayback, 1)} ${t("units.year")}`
                                : t("pdf.cannotCalculate")
                            }
                          />
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Summary
                    label={t("result.dailyConsumption")}
                    value={`${number(offResult.dailyKwh)} kWh${t("units.perDay")}`}
                  />

                  <Summary
                    label={t("result.peakLoad")}
                    value={`${number(offResult.peakKw)} kW`}
                  />

                  <Summary
                    label={t("result.pvCapacity")}
                    value={`${number(offResult.kwp)} kWp`}
                  />

                  <Summary
                    label={t("result.battery")}
                    value={`${number(offResult.batteryKwh, 0)} kWh`}
                  />
                </div>

                <div className="mt-6 overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead>
                      <tr className="border-b bg-slate-50 text-slate-600">
                        <th className="p-3">{t("result.table.code")}</th>
                        <th className="p-3">{t("result.table.component")}</th>
                        <th className="p-3">{t("result.table.formula")}</th>
                        <th className="p-3 text-right">
                          {t("result.table.result")}
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {offResult.loadRows.map((row) => (
                        <ResultRow
                          key={row.id}
                          code="L"
                          label={row.name}
                          formula={`${row.watt} W × ${row.quantity} × ${row.hours} ${t("units.hour")}`}
                          value={`${number(row.energyWh, 0)} Wh${t("units.perDay")}`}
                        />
                      ))}

                      <ResultRow
                        code="M"
                        label={t("result.components.dailyConsumption")}
                        formula={t("result.formulas.dailyConsumption")}
                        value={`${number(offResult.dailyKwh)} kWh${t("units.perDay")}`}
                      />

                      <ResultRow
                        code="N"
                        label={t("result.components.peakLoad")}
                        formula={t("result.formulas.peakLoad")}
                        value={`${number(offResult.peakKw)} kW`}
                      />

                      <ResultRow
                        code="A"
                        label={t("result.components.pvSystem")}
                        formula={t("result.formulas.offgridPvProduction")}
                        value={`${number(offResult.kwp)} kWp`}
                      />

                      <ResultRow
                        code="B"
                        label={t("result.components.moduleCount")}
                        formula={t("result.formulas.moduleCount")}
                        value={`${offResult.moduleCount} ${t("units.module")} × ${moduleWp} Wp`}
                      />

                      <ResultRow
                        code="Q"
                        label={t("result.components.pvProduction")}
                        formula={t("result.formulas.offgridPvProduction")}
                        value={`${number(offResult.production)} kWh${t("units.perMonth")}`}
                      />

                      <ResultRow
                        code="I"
                        label={t("result.components.lfpBattery")}
                        formula={t("result.formulas.offgridBattery")}
                        value={`${number(offResult.batteryKwh, 0)} kWh`}
                      />

                      <ResultRow
                        code="C"
                        label={t("result.components.inverter")}
                        formula={t("result.formulas.offgridInverter")}
                        value={`${number(offResult.inverterKw)} kW`}
                      />

                      <ResultRow
                        code="F"
                        label={t("result.components.systemCost")}
                        formula={t("result.formulas.offgridSystemCost")}
                        value={money(offResult.cost)}
                      />

                      <ResultRow
                        code="O"
                        label={t("result.components.dieselSaving")}
                        formula={t("result.formulas.offgridDieselSaving")}
                        value={`${money(offResult.dieselSaving)}${t("units.perMonth")}`}
                      />

                      <ResultRow
                        code="G"
                        label={t("result.components.simplePayback")}
                        formula={t("result.formulas.offgridPayback")}
                        value={
                          offResult.payback
                            ? `${number(offResult.payback, 1)} ${t("units.year")}`
                            : t("pdf.cannotCalculate")
                        }
                      />

                      <ResultRow
                        code="H"
                        label={t("result.components.co2Avoided")}
                        formula={t("result.formulas.offgridCo2")}
                        value={`${number(offResult.co2, 0)} kg${t("units.perYear")}`}
                      />

                      <ResultRow
                        code="X"
                        label={t("result.components.equivalentTrees")}
                        formula={t("result.formulas.offgridTrees")}
                        value={`${offResult.trees} ${t("units.tree")}`}
                      />
                    </tbody>
                  </table>
                </div>
              </>
            )}

            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-900">
              {t("result.technicalDisclaimer")}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/10 py-3 last:border-0">
      <span className="text-sm text-slate-300">{label}</span>
      <strong
        className={`text-right text-sm font-bold ${
          accent ? "text-brand-primary" : "text-white"
        }`}
      >
        {value}
      </strong>
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-slate-900">{value}</p>
    </div>
  );
}

function ResultRow({
  code,
  label,
  formula,
  value,
}: {
  code: string;
  label: string;
  formula: string;
  value: string;
}) {
  return (
    <tr>
      <td className="p-3">
        <span className="inline-flex min-w-7 justify-center rounded-md bg-accent px-2 py-1 text-xs font-bold text-accent-foreground">
          {code}
        </span>
      </td>
      <td className="p-3 font-semibold text-slate-800">{label}</td>
      <td className="p-3 text-slate-500">{formula}</td>
      <td className="p-3 text-right font-bold text-slate-900">{value}</td>
    </tr>
  );
}

async function loadCrusteaLogo(): Promise<string> {
  const response = await fetch("/logo.svg");

  if (!response.ok) {
    throw new Error("Logo Crustea tidak berhasil dimuat.");
  }

  const svgText = await response.text();
  const svgBlob = new Blob([svgText], {
    type: "image/svg+xml;charset=utf-8",
  });

  const objectUrl = URL.createObjectURL(svgBlob);

  try {
    const image = new Image();

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Gagal membaca logo SVG."));
      image.src = objectUrl;
    });

    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth || 600;
    canvas.height = image.naturalHeight || 300;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Canvas tidak tersedia.");
    }

    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
