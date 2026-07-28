import React, { useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { AudiogramChart } from '@/components/common/audiogram/audiogram-chart';
import { AudiogramSymbol } from '@/components/common/audiogram/audiogram-symbol';
import { useAudiogramEditor } from './use-audiogram-editor';
import {
  AudiometryThreshold,
  ConductionRoute,
  Ear,
  HearingLossGrade,
} from '@/types/studies/audiometry.types';
import {
  AudiometrySymbol,
  EAR_COLOR,
  HEARING_LOSS_GRADE_COLOR,
  HEARING_LOSS_GRADE_LABEL_KEYS,
  resolveSymbol,
} from '@/shared/utils/audiometry';
import { useTranslation } from 'react-i18next';
import { TEXT } from '@/static/texts/i18n';

interface ToggleProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
  activeClassName: string;
  title?: string;
}

const Toggle: React.FC<ToggleProps> = ({ isActive, onClick, children, activeClassName, title }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`flex items-center justify-center gap-2 min-h-[44px] px-4 rounded-app-sm border text-xs font-bold transition-all ${
      isActive ? activeClassName : 'bg-white border-neutral-200 text-neutral-500 hover:border-neutral-300'
    }`}
  >
    {children}
  </button>
);

/** Muestra un símbolo ASHA suelto, para leyendas y botones */
const SymbolChip: React.FC<{ symbol: AudiometrySymbol; color: string }> = ({ symbol, color }) => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" aria-hidden>
    <AudiogramSymbol symbol={symbol} x={12} y={12} color={color} size={7} />
  </svg>
);

interface Props {
  initialThresholds?: AudiometryThreshold[];
  onChange?: (thresholds: AudiometryThreshold[]) => void;
}

export const AudiogramEditor: React.FC<Props> = ({ initialThresholds = [], onChange }) => {
  const { t } = useTranslation();
  const {
    thresholds,
    activeEar,
    setActiveEar,
    activeRoute,
    setActiveRoute,
    isMaskedMode,
    setIsMaskedMode,
    isNoResponseMode,
    setIsNoResponseMode,
    upsertThreshold,
    removeThreshold,
    clearEar,
    clearAll,
    rightClassification,
    leftClassification,
    hasThresholds,
  } = useAudiogramEditor(initialThresholds);

  useEffect(() => {
    onChange?.(thresholds);
  }, [thresholds, onChange]);

  const activeColor = EAR_COLOR[activeEar];
  const activeSymbol = resolveSymbol(activeEar, activeRoute, isMaskedMode);

  const classifications = [
    { ear: Ear.RIGHT, label: t(TEXT.CONSULTA.AUDIOGRAM_EDITOR.EAR_RIGHT), classification: rightClassification },
    { ear: Ear.LEFT, label: t(TEXT.CONSULTA.AUDIOGRAM_EDITOR.EAR_LEFT), classification: leftClassification },
  ];

  return (
    <div className="space-y-4">

      {/* CONTROLES — oído y vía. En móvil ocupan 2 columnas; en iPad+ una fila. */}
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          {[Ear.RIGHT, Ear.LEFT].map((ear) => (
            <Toggle
              key={ear}
              isActive={activeEar === ear}
              onClick={() => setActiveEar(ear)}
              activeClassName="text-white border-transparent"
              title={ear === Ear.RIGHT ? t(TEXT.CONSULTA.AUDIOGRAM_EDITOR.EAR_RIGHT) : t(TEXT.CONSULTA.AUDIOGRAM_EDITOR.EAR_LEFT)}
            >
              <span
                className="flex items-center gap-2 w-full justify-center"
                style={activeEar === ear ? undefined : { color: EAR_COLOR[ear] }}
              >
                <SymbolChip
                  symbol={resolveSymbol(ear, activeRoute, isMaskedMode)}
                  color={activeEar === ear ? '#FFFFFF' : EAR_COLOR[ear]}
                />
                {ear === Ear.RIGHT
                  ? t(TEXT.CONSULTA.AUDIOGRAM_EDITOR.EAR_RIGHT)
                  : t(TEXT.CONSULTA.AUDIOGRAM_EDITOR.EAR_LEFT)}
              </span>
            </Toggle>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[ConductionRoute.AIR, ConductionRoute.BONE].map((route) => (
            <Toggle
              key={route}
              isActive={activeRoute === route}
              onClick={() => setActiveRoute(route)}
              activeClassName="bg-neutral-900 border-neutral-900 text-white"
            >
              {route === ConductionRoute.AIR
                ? t(TEXT.CONSULTA.AUDIOGRAM_EDITOR.ROUTE_AIR)
                : t(TEXT.CONSULTA.AUDIOGRAM_EDITOR.ROUTE_BONE)}
            </Toggle>
          ))}

          <Toggle
            isActive={isMaskedMode}
            onClick={() => setIsMaskedMode(!isMaskedMode)}
            activeClassName="bg-neutral-700 border-neutral-700 text-white"
            title={t(TEXT.CONSULTA.AUDIOGRAM_EDITOR.MASKED_HINT)}
          >
            {t(TEXT.CONSULTA.AUDIOGRAM_EDITOR.MASKED)}
          </Toggle>

          <Toggle
            isActive={isNoResponseMode}
            onClick={() => setIsNoResponseMode(!isNoResponseMode)}
            activeClassName="bg-warning border-warning text-white"
            title={t(TEXT.CONSULTA.AUDIOGRAM_EDITOR.NO_RESPONSE_HINT)}
          >
            {t(TEXT.CONSULTA.AUDIOGRAM_EDITOR.NO_RESPONSE)}
          </Toggle>
        </div>
      </div>

      {/* INSTRUCCIÓN + símbolo activo */}
      <div className="flex items-center gap-2 px-3 py-2 bg-neutral-50 border border-neutral-100 rounded-app-sm">
        <SymbolChip symbol={activeSymbol} color={activeColor} />
        <Typography variant={TypographyVariant.CAPTION} className="text-[11px] text-neutral-500">
          {t(TEXT.CONSULTA.AUDIOGRAM_EDITOR.INSTRUCTIONS)}
        </Typography>
      </div>

      {/* GRÁFICO — en móvil hace scroll horizontal con ancho mínimo: comprimir
          la grilla por debajo de ~520px vuelve los símbolos intocables. */}
      <div className="border border-neutral-200 rounded-app-md bg-white overflow-x-auto">
        <div className="min-w-[520px]">
          <AudiogramChart
            thresholds={thresholds}
            onPlotClick={({ frequency, decibels }) => upsertThreshold(frequency, decibels)}
            onThresholdClick={removeThreshold}
          />
        </div>
      </div>

      {/* CLASIFICACIÓN POR OÍDO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {classifications.map(({ ear, label, classification }) => (
          <div
            key={ear}
            className="flex items-center gap-3 px-4 py-3 rounded-app-sm border"
            style={{
              borderColor: `${EAR_COLOR[ear]}30`,
              backgroundColor: `${EAR_COLOR[ear]}0A`,
            }}
          >
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: EAR_COLOR[ear] }} />
            <Typography variant={TypographyVariant.CAPTION} className="text-[11px] font-bold text-neutral-600 flex-1">
              {label}
            </Typography>
            {classification ? (
              <div className="flex items-center gap-2">
                <Typography variant={TypographyVariant.CAPTION} inline className="text-[10px] text-neutral-400">
                  {t(TEXT.CONSULTA.AUDIOGRAM_EDITOR.PTA)} {classification.pureToneAverage} dB
                </Typography>
                <Typography
                  variant={TypographyVariant.CAPTION}
                  inline
                  className="text-[10px] font-black px-2 py-0.5 rounded"
                  style={{
                    color: HEARING_LOSS_GRADE_COLOR[classification.grade],
                    backgroundColor: `${HEARING_LOSS_GRADE_COLOR[classification.grade]}18`,
                  }}
                >
                  {t(HEARING_LOSS_GRADE_LABEL_KEYS[classification.grade])}
                </Typography>
              </div>
            ) : (
              <Typography variant={TypographyVariant.CAPTION} inline className="text-[10px] text-neutral-300">
                {t(TEXT.CONSULTA.AUDIOGRAM_EDITOR.NO_DATA)}
              </Typography>
            )}
          </div>
        ))}
      </div>

      {/* LEYENDA + LIMPIAR */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
        <div className="flex items-center gap-1.5">
          <SymbolChip symbol={AudiometrySymbol.AIR_RIGHT_UNMASKED} color={EAR_COLOR[Ear.RIGHT]} />
          <SymbolChip symbol={AudiometrySymbol.AIR_LEFT_UNMASKED} color={EAR_COLOR[Ear.LEFT]} />
          <Typography variant={TypographyVariant.CAPTION} className="text-[10px] text-neutral-400">
            {t(TEXT.CONSULTA.AUDIOGRAM_EDITOR.LEGEND_AIR)}
          </Typography>
        </div>
        <div className="flex items-center gap-1.5">
          <SymbolChip symbol={AudiometrySymbol.BONE_RIGHT_UNMASKED} color={EAR_COLOR[Ear.RIGHT]} />
          <SymbolChip symbol={AudiometrySymbol.BONE_LEFT_UNMASKED} color={EAR_COLOR[Ear.LEFT]} />
          <Typography variant={TypographyVariant.CAPTION} className="text-[10px] text-neutral-400">
            {t(TEXT.CONSULTA.AUDIOGRAM_EDITOR.LEGEND_BONE)}
          </Typography>
        </div>
        <div className="flex items-center gap-1.5">
          <SymbolChip symbol={AudiometrySymbol.AIR_RIGHT_MASKED} color={EAR_COLOR[Ear.RIGHT]} />
          <SymbolChip symbol={AudiometrySymbol.AIR_LEFT_MASKED} color={EAR_COLOR[Ear.LEFT]} />
          <Typography variant={TypographyVariant.CAPTION} className="text-[10px] text-neutral-400">
            {t(TEXT.CONSULTA.AUDIOGRAM_EDITOR.LEGEND_MASKED)}
          </Typography>
        </div>

        {hasThresholds && (
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={() => clearEar(activeEar)}
              className="flex items-center gap-1.5 min-h-[36px] px-3 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-warning hover:bg-warning/10 rounded-app-sm transition-colors"
            >
              <Trash2 size={12} />
              {t(TEXT.CONSULTA.AUDIOGRAM_EDITOR.CLEAR_EAR)}
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="min-h-[36px] px-3 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-danger hover:bg-danger/10 rounded-app-sm transition-colors"
            >
              {t(TEXT.CONSULTA.AUDIOGRAM_EDITOR.CLEAR_ALL)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
