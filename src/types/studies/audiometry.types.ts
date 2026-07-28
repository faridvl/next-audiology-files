// Modelo clínico de una audiometría tonal liminar.
// Referencias: ASHA 1990 (símbolos), ISO 8253, NTP 285 (vía ósea y enmascaramiento).
// Ver DOMAIN_ANALYSIS.md §3.2 — un umbral sin estos campos no es reproducible.

export enum Ear {
  RIGHT = 'OD',
  LEFT = 'OI',
}

export enum ConductionRoute {
  AIR = 'AEREA',
  BONE = 'OSEA',
}

/** Frecuencias estándar en Hz, incluidas las interoctavas (750, 1500, 3000, 6000) */
export const AUDIOMETRY_FREQUENCIES = [125, 250, 500, 750, 1000, 1500, 2000, 3000, 4000, 6000, 8000] as const;
export type AudiometryFrequency = (typeof AUDIOMETRY_FREQUENCIES)[number];

/** Frecuencias que se rotulan siempre en el eje; el resto solo en pantallas anchas */
export const AUDIOMETRY_OCTAVE_FREQUENCIES: readonly number[] = [125, 250, 500, 1000, 2000, 4000, 8000];

export const AUDIOMETRY_DB_MIN = -10;
export const AUDIOMETRY_DB_MAX = 120;
export const AUDIOMETRY_DB_STEP = 5;

/**
 * Un umbral audiométrico. `isMasked` y `isNoResponse` NO son cosméticos:
 * 60 dB sin enmascarar y 60 dB enmascarado son datos clínicos distintos, y
 * "sin respuesta" significa que no se alcanzó umbral al máximo de salida.
 */
export interface AudiometryThreshold {
  frequency: number;
  ear: Ear;
  route: ConductionRoute;
  decibels: number;
  isMasked: boolean;
  isNoResponse: boolean;
}

/** Payload persistido en Study.payload para tipo AUDIOMETRIA_TONAL */
export interface AudiometryPayload {
  thresholds: AudiometryThreshold[];
  /** Escala usada para clasificar — guardarla evita que los datos históricos
   *  queden irreinterpretables si la escala cambia (DOMAIN_ANALYSIS.md §3.2) */
  classificationScale: HearingLossScale;
}

export enum HearingLossScale {
  WHO_2021 = 'WHO_2021',
  BIAP = 'BIAP',
}

export enum HearingLossGrade {
  NORMAL = 'NORMAL',
  MILD = 'MILD',
  MODERATE = 'MODERATE',
  MODERATELY_SEVERE = 'MODERATELY_SEVERE',
  SEVERE = 'SEVERE',
  PROFOUND = 'PROFOUND',
}

export interface HearingLossClassification {
  grade: HearingLossGrade;
  /** Promedio de tonos puros en dB HL */
  pureToneAverage: number;
  scale: HearingLossScale;
}
