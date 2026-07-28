import {
  AUDIOMETRY_DB_MAX,
  AUDIOMETRY_DB_MIN,
  AudiometryThreshold,
  ConductionRoute,
  Ear,
  HearingLossClassification,
  HearingLossGrade,
  HearingLossScale,
} from '@/types/studies/audiometry.types';

/**
 * Símbolos ASHA 1990. La FORMA debe bastar por sí sola: el color rojo/azul es
 * convención de pantalla, pero ~8% de hombres tiene deuteranopía y el rojo/azul
 * es justo el par problemático — además el expediente se imprime en b/n.
 */
export enum AudiometrySymbol {
  AIR_RIGHT_UNMASKED = 'AIR_RIGHT_UNMASKED',
  AIR_LEFT_UNMASKED = 'AIR_LEFT_UNMASKED',
  AIR_RIGHT_MASKED = 'AIR_RIGHT_MASKED',
  AIR_LEFT_MASKED = 'AIR_LEFT_MASKED',
  BONE_RIGHT_UNMASKED = 'BONE_RIGHT_UNMASKED',
  BONE_LEFT_UNMASKED = 'BONE_LEFT_UNMASKED',
  BONE_RIGHT_MASKED = 'BONE_RIGHT_MASKED',
  BONE_LEFT_MASKED = 'BONE_LEFT_MASKED',
}

export function resolveSymbol(
  ear: Ear,
  route: ConductionRoute,
  isMasked: boolean,
): AudiometrySymbol {
  const isRight = ear === Ear.RIGHT;
  if (route === ConductionRoute.AIR) {
    if (isMasked) return isRight ? AudiometrySymbol.AIR_RIGHT_MASKED : AudiometrySymbol.AIR_LEFT_MASKED;
    return isRight ? AudiometrySymbol.AIR_RIGHT_UNMASKED : AudiometrySymbol.AIR_LEFT_UNMASKED;
  }
  if (isMasked) return isRight ? AudiometrySymbol.BONE_RIGHT_MASKED : AudiometrySymbol.BONE_LEFT_MASKED;
  return isRight ? AudiometrySymbol.BONE_RIGHT_UNMASKED : AudiometrySymbol.BONE_LEFT_UNMASKED;
}

export const EAR_COLOR: Record<Ear, string> = {
  [Ear.RIGHT]: '#DC2626',
  [Ear.LEFT]: '#2563EB',
};

/**
 * Eje X logarítmico: en un audiograma clínico la distancia entre 125 y 250 Hz
 * (una octava) es igual a la que hay entre 4000 y 8000 Hz. Un eje lineal
 * comprime los graves y deforma la curva.
 */
export function frequencyToPercent(frequency: number, minHz: number, maxHz: number): number {
  const logMin = Math.log2(minHz);
  const logMax = Math.log2(maxHz);
  return ((Math.log2(frequency) - logMin) / (logMax - logMin)) * 100;
}

export function percentToFrequency(percent: number, minHz: number, maxHz: number): number {
  const logMin = Math.log2(minHz);
  const logMax = Math.log2(maxHz);
  return 2 ** (logMin + (percent / 100) * (logMax - logMin));
}

export function decibelsToPercent(decibels: number): number {
  return ((decibels - AUDIOMETRY_DB_MIN) / (AUDIOMETRY_DB_MAX - AUDIOMETRY_DB_MIN)) * 100;
}

export function percentToDecibels(percent: number): number {
  return AUDIOMETRY_DB_MIN + (percent / 100) * (AUDIOMETRY_DB_MAX - AUDIOMETRY_DB_MIN);
}

/** Frecuencias del PTA según WHO: 500, 1000, 2000, 4000 */
const PURE_TONE_AVERAGE_FREQUENCIES = [500, 1000, 2000, 4000];

/** BIAP imputa los "sin respuesta" como 120 dB en vez de descartarlos */
const NO_RESPONSE_IMPUTED_DECIBELS = 120;

/**
 * Escalas NO intercambiables: un PTA de 38 dB es "leve" en la escala antigua
 * (corte 25 dB) pero "moderada" en WHO 2021 (corte 35 dB). Por eso el Study
 * guarda qué escala produjo la clasificación.
 */
const SCALE_THRESHOLDS: Record<HearingLossScale, Array<{ grade: HearingLossGrade; maxDecibels: number }>> = {
  [HearingLossScale.WHO_2021]: [
    { grade: HearingLossGrade.NORMAL, maxDecibels: 20 },
    { grade: HearingLossGrade.MILD, maxDecibels: 35 },
    { grade: HearingLossGrade.MODERATE, maxDecibels: 50 },
    { grade: HearingLossGrade.MODERATELY_SEVERE, maxDecibels: 65 },
    { grade: HearingLossGrade.SEVERE, maxDecibels: 80 },
    { grade: HearingLossGrade.PROFOUND, maxDecibels: Number.POSITIVE_INFINITY },
  ],
  [HearingLossScale.BIAP]: [
    { grade: HearingLossGrade.NORMAL, maxDecibels: 20 },
    { grade: HearingLossGrade.MILD, maxDecibels: 40 },
    { grade: HearingLossGrade.MODERATE, maxDecibels: 55 },
    { grade: HearingLossGrade.MODERATELY_SEVERE, maxDecibels: 70 },
    { grade: HearingLossGrade.SEVERE, maxDecibels: 90 },
    { grade: HearingLossGrade.PROFOUND, maxDecibels: Number.POSITIVE_INFINITY },
  ],
};

export function classifyHearingLoss(
  thresholds: AudiometryThreshold[],
  ear: Ear,
  scale: HearingLossScale = HearingLossScale.WHO_2021,
): HearingLossClassification | null {
  const airThresholds = thresholds.filter(
    (threshold) => threshold.ear === ear && threshold.route === ConductionRoute.AIR,
  );

  const relevant = PURE_TONE_AVERAGE_FREQUENCIES.map((frequency) =>
    airThresholds.find((threshold) => threshold.frequency === frequency),
  ).filter((threshold): threshold is AudiometryThreshold => threshold !== undefined);

  if (relevant.length === 0) return null;

  const sum = relevant.reduce(
    (total, threshold) =>
      total + (threshold.isNoResponse ? NO_RESPONSE_IMPUTED_DECIBELS : threshold.decibels),
    0,
  );
  const pureToneAverage = Math.round(sum / relevant.length);

  const grade =
    SCALE_THRESHOLDS[scale].find((entry) => pureToneAverage <= entry.maxDecibels)?.grade ??
    HearingLossGrade.PROFOUND;

  return { grade, pureToneAverage, scale };
}

/** Claves i18n del grado — se resuelven con t() en cada consumidor */
export const HEARING_LOSS_GRADE_LABEL_KEYS: Record<HearingLossGrade, string> = {
  [HearingLossGrade.NORMAL]: 'consulta.audiogramEditor.grades.normal',
  [HearingLossGrade.MILD]: 'consulta.audiogramEditor.grades.mild',
  [HearingLossGrade.MODERATE]: 'consulta.audiogramEditor.grades.moderate',
  [HearingLossGrade.MODERATELY_SEVERE]: 'consulta.audiogramEditor.grades.moderatelySevere',
  [HearingLossGrade.SEVERE]: 'consulta.audiogramEditor.grades.severe',
  [HearingLossGrade.PROFOUND]: 'consulta.audiogramEditor.grades.profound',
};

export const HEARING_LOSS_GRADE_COLOR: Record<HearingLossGrade, string> = {
  [HearingLossGrade.NORMAL]: '#10B981',
  [HearingLossGrade.MILD]: '#84CC16',
  [HearingLossGrade.MODERATE]: '#F59E0B',
  [HearingLossGrade.MODERATELY_SEVERE]: '#F97316',
  [HearingLossGrade.SEVERE]: '#EF4444',
  [HearingLossGrade.PROFOUND]: '#7C3AED',
};

/** Clave estable para identificar un umbral (una medición por freq+oído+vía) */
export function thresholdKey(threshold: Pick<AudiometryThreshold, 'frequency' | 'ear' | 'route'>): string {
  return `${threshold.ear}-${threshold.route}-${threshold.frequency}`;
}

/** Forma legacy: `{ OD: { '1000': '20' }, OI: {...} }` — solo vía aérea, sin
 *  enmascaramiento ni sin-respuesta. La usaban los estudios creados antes de
 *  tipar los umbrales, y los MedicalControl anteriores a S6. */
interface LegacyAudiogramPayload {
  OD?: Record<string, string>;
  OI?: Record<string, string>;
}

/**
 * Lee el payload de un estudio de audiometría en cualquiera de sus dos formas.
 * Sin migración de datos (decisión tomada): los registros viejos se leen tal
 * como se guardaron y se muestran como vía aérea sin enmascarar.
 */
export function parseAudiometryPayload(payload: unknown): AudiometryThreshold[] {
  if (!payload || typeof payload !== 'object') return [];

  const candidate = payload as { thresholds?: unknown };
  if (Array.isArray(candidate.thresholds)) {
    return candidate.thresholds.filter(
      (item): item is AudiometryThreshold =>
        !!item &&
        typeof item === 'object' &&
        typeof (item as AudiometryThreshold).frequency === 'number' &&
        typeof (item as AudiometryThreshold).decibels === 'number',
    );
  }

  const legacy = payload as LegacyAudiogramPayload;
  const result: AudiometryThreshold[] = [];
  for (const ear of [Ear.RIGHT, Ear.LEFT]) {
    const values = ear === Ear.RIGHT ? legacy.OD : legacy.OI;
    if (!values) continue;
    for (const [frequency, decibels] of Object.entries(values)) {
      const parsedFrequency = Number(frequency);
      const parsedDecibels = Number(decibels);
      if (!Number.isFinite(parsedFrequency) || decibels === '' || !Number.isFinite(parsedDecibels)) continue;
      result.push({
        frequency: parsedFrequency,
        ear,
        route: ConductionRoute.AIR,
        decibels: parsedDecibels,
        isMasked: false,
        isNoResponse: false,
      });
    }
  }
  return result.sort((a, b) => a.frequency - b.frequency);
}
