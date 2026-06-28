// src/components/pdf/medical-control-report.tsx
// Componente PDF de reporte de control médico (P2-8)
// Usa @react-pdf/renderer — solo se puede importar en el cliente (dynamic import).

import React from 'react';
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import { PdfReportProps } from '@/types/pdf/report.types';

// Helvetica está incluida en @react-pdf/renderer por defecto
Font.register({ family: 'Helvetica', fonts: [{ src: 'Helvetica' }] });

const COLORS = {
  headerBlue: '#1E3A8A',
  tableBackground: '#F8FAFC',
  borderGray: '#E2E8F0',
  textDark: '#0F172A',
  textMedium: '#475569',
  textLight: '#94A3B8',
  white: '#FFFFFF',
};

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: COLORS.textDark,
    paddingTop: 40,
    paddingBottom: 50,
    paddingHorizontal: 40,
    lineHeight: 1.4,
  },
  // ——— Header ———
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: COLORS.headerBlue,
    padding: 16,
    marginBottom: 0,
  },
  headerTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.white,
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 8,
    color: '#BFDBFE',
    marginTop: 3,
    letterSpacing: 0.5,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  headerSpecialist: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.white,
  },
  headerDate: {
    fontSize: 8,
    color: '#BFDBFE',
    marginTop: 2,
  },
  // ——— Info grid ———
  infoGrid: {
    flexDirection: 'row',
    borderBottom: `1px solid ${COLORS.borderGray}`,
    marginBottom: 12,
  },
  infoCell: {
    flex: 1,
    padding: 8,
    borderRight: `1px solid ${COLORS.borderGray}`,
  },
  infoCellLast: {
    flex: 1,
    padding: 8,
  },
  infoLabel: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.textDark,
    textTransform: 'uppercase',
  },
  // ——— Section ———
  sectionTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.headerBlue,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
    marginTop: 12,
    borderBottom: `1px solid ${COLORS.headerBlue}`,
    paddingBottom: 3,
  },
  // ——— Table ———
  table: {
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: `1px solid ${COLORS.borderGray}`,
  },
  tableRowEven: {
    backgroundColor: COLORS.tableBackground,
  },
  tableKey: {
    width: '35%',
    padding: '5 8',
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.textMedium,
    textTransform: 'uppercase',
  },
  tableValue: {
    width: '65%',
    padding: '5 8',
    fontSize: 9,
    color: COLORS.textDark,
  },
  // ——— Audiogram ———
  audiogramHeaderRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.headerBlue,
  },
  audiogramHeaderCell: {
    flex: 1,
    padding: '4 6',
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.white,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  audiogramRow: {
    flexDirection: 'row',
    borderBottom: `1px solid ${COLORS.borderGray}`,
  },
  audiogramRowEven: {
    backgroundColor: COLORS.tableBackground,
  },
  audiogramCell: {
    flex: 1,
    padding: '4 6',
    fontSize: 8,
    color: COLORS.textDark,
    textAlign: 'center',
  },
  audiogramCellBold: {
    flex: 1,
    padding: '4 6',
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.textMedium,
    textAlign: 'center',
  },
  // ——— Diagnosis ———
  diagnosisBox: {
    backgroundColor: COLORS.tableBackground,
    border: `1px solid ${COLORS.borderGray}`,
    padding: 10,
    marginTop: 4,
  },
  diagnosisText: {
    fontSize: 9,
    color: COLORS.textDark,
    lineHeight: 1.6,
  },
  // ——— Follow up ———
  followUpBox: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  followUpItem: {
    flex: 1,
    backgroundColor: COLORS.tableBackground,
    border: `1px solid ${COLORS.borderGray}`,
    padding: 8,
  },
  followUpLabel: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.textLight,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  followUpValue: {
    fontSize: 9,
    color: COLORS.textDark,
  },
  // ——— Footer ———
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTop: `1px solid ${COLORS.borderGray}`,
    paddingTop: 8,
  },
  footerLeft: {
    fontSize: 7,
    color: COLORS.textLight,
  },
  footerSignature: {
    alignItems: 'center',
  },
  footerSignatureLine: {
    borderTop: `1px solid ${COLORS.textDark}`,
    width: 120,
    marginBottom: 3,
  },
  footerSignatureText: {
    fontSize: 7,
    color: COLORS.textMedium,
    textAlign: 'center',
  },
});

// Formatea un valor de findings para mostrarlo en la tabla
const formatFindingValue = (value: string | boolean | number): string => {
  if (typeof value === 'boolean') return value ? 'Sí' : 'No';
  if (value === '' || value === null || value === undefined) return '—';
  return String(value);
};

// Formatea el nombre de un campo camelCase a texto legible
const formatFieldLabel = (key: string): string => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
};

export const MedicalControlReport: React.FC<PdfReportProps> = (props) => {
  const {
    institutionName,
    specialistName,
    printDate,
    patient,
    controlDate,
    speciality,
    controlNumber,
    findings,
    diagnosis,
    audiogram,
    followUp,
  } = props;

  const findingEntries = Object.entries(findings).filter(
    ([, value]) => value !== '' && value !== null && value !== undefined,
  );

  return (
    <Document
      title={`Reporte Control Médico — ${patient.fullName}`}
      author={specialistName}
      creator="Zynka Medical Records"
    >
      <Page size="LETTER" style={styles.page}>

        {/* HEADER */}
        <View style={styles.headerSection}>
          <View>
            <Text style={styles.headerTitle}>{institutionName}</Text>
            <Text style={styles.headerSubtitle}>
              Sistema de Gestión de Expedientes Digitales — Zynka
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerSpecialist}>{specialistName}</Text>
            <Text style={styles.headerDate}>Fecha de impresión: {printDate}</Text>
          </View>
        </View>

        {/* DATOS PACIENTE */}
        <View style={styles.infoGrid}>
          <View style={styles.infoCell}>
            <Text style={styles.infoLabel}>Paciente</Text>
            <Text style={styles.infoValue}>{patient.fullName}</Text>
          </View>
          <View style={styles.infoCell}>
            <Text style={styles.infoLabel}>Documento</Text>
            <Text style={styles.infoValue}>{patient.documentId}</Text>
          </View>
          <View style={styles.infoCell}>
            <Text style={styles.infoLabel}>Fecha de Nacimiento</Text>
            <Text style={styles.infoValue}>{patient.birthDate || '—'}</Text>
          </View>
          <View style={styles.infoCellLast}>
            <Text style={styles.infoLabel}>Teléfono</Text>
            <Text style={styles.infoValue}>{patient.phone || '—'}</Text>
          </View>
        </View>

        {/* DATOS DEL CONTROL */}
        <View style={styles.infoGrid}>
          <View style={styles.infoCell}>
            <Text style={styles.infoLabel}>Fecha del Control</Text>
            <Text style={styles.infoValue}>{controlDate}</Text>
          </View>
          <View style={styles.infoCell}>
            <Text style={styles.infoLabel}>Especialidad</Text>
            <Text style={styles.infoValue}>{speciality}</Text>
          </View>
          <View style={styles.infoCellLast}>
            <Text style={styles.infoLabel}>N° de Control</Text>
            <Text style={styles.infoValue}>{controlNumber}</Text>
          </View>
        </View>

        {/* HALLAZGOS CLÍNICOS */}
        {findingEntries.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Hallazgos Clínicos</Text>
            <View style={styles.table}>
              {findingEntries.map(([key, value], index) => (
                <View
                  key={key}
                  style={[
                    styles.tableRow,
                    index % 2 === 0 ? styles.tableRowEven : {},
                  ]}
                >
                  <Text style={styles.tableKey}>{formatFieldLabel(key)}</Text>
                  <Text style={styles.tableValue}>{formatFindingValue(value)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* DIAGNÓSTICO */}
        <Text style={styles.sectionTitle}>Diagnóstico</Text>
        <View style={styles.diagnosisBox}>
          <Text style={styles.diagnosisText}>{diagnosis || '—'}</Text>
        </View>

        {/* AUDIOGRAMA (solo AUDIOLOGY) */}
        {audiogram && audiogram.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Audiograma — Umbrales de Audición (dB HL)</Text>
            <View style={styles.table}>
              <View style={styles.audiogramHeaderRow}>
                <Text style={styles.audiogramHeaderCell}>Frecuencia (Hz)</Text>
                <Text style={styles.audiogramHeaderCell}>OD (dB)</Text>
                <Text style={styles.audiogramHeaderCell}>OI (dB)</Text>
              </View>
              {audiogram.map((row, index) => (
                <View
                  key={row.frequency}
                  style={[
                    styles.audiogramRow,
                    index % 2 === 0 ? styles.audiogramRowEven : {},
                  ]}
                >
                  <Text style={styles.audiogramCellBold}>{row.frequency}</Text>
                  <Text style={styles.audiogramCell}>
                    {row.thresholdRight !== null ? String(row.thresholdRight) : '—'}
                  </Text>
                  <Text style={styles.audiogramCell}>
                    {row.thresholdLeft !== null ? String(row.thresholdLeft) : '—'}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* SEGUIMIENTO */}
        {followUp && (
          <View>
            <Text style={styles.sectionTitle}>Seguimiento</Text>
            <View style={styles.followUpBox}>
              <View style={styles.followUpItem}>
                <Text style={styles.followUpLabel}>Fecha Tentativa</Text>
                <Text style={styles.followUpValue}>{followUp.tentativeDate}</Text>
              </View>
              <View style={[styles.followUpItem, { flex: 2 }]}>
                <Text style={styles.followUpLabel}>Notas</Text>
                <Text style={styles.followUpValue}>{followUp.notes || '—'}</Text>
              </View>
            </View>
          </View>
        )}

        {/* PIE DE PÁGINA */}
        <View style={styles.footer} fixed>
          <View>
            <Text style={styles.footerLeft}>{institutionName}</Text>
            <Text style={styles.footerLeft}>
              Documento confidencial — Propiedad privada del paciente
            </Text>
          </View>
          <View style={styles.footerSignature}>
            <View style={styles.footerSignatureLine} />
            <Text style={styles.footerSignatureText}>{specialistName}</Text>
            <Text style={styles.footerSignatureText}>{speciality}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
