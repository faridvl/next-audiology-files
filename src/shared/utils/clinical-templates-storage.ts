// src/shared/utils/clinical-templates-storage.ts
// Utilidad para persistir plantillas clínicas en localStorage (P3-3)
// TODO(!): P3-3 — Migrar a GET/POST /clinical-templates en API para persistencia real.

import { ClinicalTemplate } from '@/types/clinical-template/clinical-template.types';

const buildStorageKey = (tenantUuid: string): string =>
  `clinical_templates_${tenantUuid}`;

export function loadTemplates(tenantUuid: string): ClinicalTemplate[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(buildStorageKey(tenantUuid));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as ClinicalTemplate[];
  } catch {
    return [];
  }
}

export function saveTemplates(tenantUuid: string, templates: ClinicalTemplate[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(buildStorageKey(tenantUuid), JSON.stringify(templates));
}

/**
 * Carga la primera plantilla que coincida con la especialidad dada.
 * Usada desde new-control para renderizar campos dinámicos.
 */
export function loadTemplateBySpeciality(
  tenantUuid: string,
  speciality: string,
): ClinicalTemplate | null {
  const templates = loadTemplates(tenantUuid);
  return templates.find((template) => template.speciality === speciality) ?? null;
}
