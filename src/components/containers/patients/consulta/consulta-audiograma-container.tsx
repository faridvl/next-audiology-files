import React, { useCallback, useRef, useState } from 'react';
import { ArrowLeft, Save, Paperclip, X, FileText } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Typography, TypographyVariant } from '@/components/common/typography/typography';
import { Button, ButtonVariant } from '@/components/common/button/button';
import { useNavigation } from '@/hooks/use-navigation';
import { usePatientDetailQuery } from '@/shared/api/querys/get-patient-query';
import { useCreateStudyMutation } from '@/shared/api/mutations/studies/create-study-mutation';
import { useUploadDocumentMutation } from '@/shared/api/mutations/documents/upload-document-mutation';
import { FETCH_ENCOUNTER_KEY } from '@/shared/api/querys/encounters-query';
import { AudiogramEditor } from '@/components/containers/audiogram-editor/audiogram-editor';
import { StudyType } from '@/types/studies/study.types';
import { AudiometryThreshold, HearingLossScale } from '@/types/studies/audiometry.types';
import { DocumentCategoryApiValue } from '@/types/documents/document.types';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { TEXT } from '@/static/texts/i18n';

interface Props {
  patientUuid: string;
  encounterUuid: string;
  /** Dentro del panel de visita: sin header propio, y al guardar avisa al panel */
  isEmbedded?: boolean;
  onSaved?: () => void;
  onCancel?: () => void;
}

export const ConsultaAudiogramaContainer: React.FC<Props> = ({ patientUuid, encounterUuid, isEmbedded = false, onSaved, onCancel }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: patient } = usePatientDetailQuery(patientUuid);

  const handleCancel = () => (isEmbedded ? onCancel?.() : navigation.patients.consulta(patientUuid));
  const [thresholds, setThresholds] = useState<AudiometryThreshold[]>([]);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  // useCallback: AudiogramEditor lo llama dentro de un efecto — una referencia
  // nueva en cada render provocaría un bucle de actualización.
  const handleThresholdsChange = useCallback((next: AudiometryThreshold[]) => setThresholds(next), []);

  const { executeCreateStudy, isPending: isCreatingStudy } = useCreateStudyMutation();
  const { executeUploadDocument, isPending: isUploadingDocument } = useUploadDocumentMutation();
  const isPending = isCreatingStudy || isUploadingDocument;

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) setAttachedFile(file);
  }

  function saveStudy(documentUuid: string | null) {
    executeCreateStudy(
      {
        encounterUuid,
        patientUuid,
        tipo: StudyType.AUDIOMETRIA_TONAL,
        // Umbrales tipados con vía, enmascaramiento y sin-respuesta + la escala
        // que produjo la clasificación (DOMAIN_ANALYSIS.md §3.2).
        payload: { thresholds, classificationScale: HearingLossScale.WHO_2021 },
        documentUuid,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [FETCH_ENCOUNTER_KEY, encounterUuid] });
          toast.success(t(TEXT.CONSULTA.AUDIOGRAM.SAVE_SUCCESS));
          if (isEmbedded) onSaved?.();
          else navigation.patients.consulta(patientUuid);
        },
        onError: () => toast.error(t(TEXT.CONSULTA.AUDIOGRAM.SAVE_ERROR)),
      },
    );
  }

  function handleSave() {
    const hasValues = thresholds.length > 0;
    if (!hasValues && !attachedFile) {
      toast.error(t(TEXT.CONSULTA.AUDIOGRAM.EMPTY_ERROR));
      return;
    }

    if (!attachedFile) {
      saveStudy(null);
      return;
    }

    executeUploadDocument(
      { patientUuid, file: attachedFile, category: DocumentCategoryApiValue.EXTERNAL_TEST },
      {
        onSuccess: (document) => saveStudy(document.uuid),
        onError: () => toast.error(t(TEXT.CONSULTA.AUDIOGRAM.SAVE_ERROR)),
      },
    );
  }

  return (
    <div className={isEmbedded ? 'space-y-4' : 'p-4 md:p-6 pb-24 space-y-6 animate-in fade-in duration-500'}>

      {/* HEADER — solo como página propia; en el panel de visita lo pone el drawer */}
      {!isEmbedded && (
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigation.patients.consulta(patientUuid)}
            className="w-10 h-10 rounded-app-sm bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors shrink-0"
          >
            <ArrowLeft size={16} className="text-neutral-500" />
          </button>
          <div>
            <Typography variant={TypographyVariant.CAPTION} className="text-[9px] font-black uppercase tracking-widest text-accent">
              {t(TEXT.CONSULTA.AUDIOGRAM.BREADCRUMB)}
            </Typography>
            <Typography variant={TypographyVariant.SUBTITLE} className="text-neutral-800 leading-tight">
              {patient ? `${patient.firstName} ${patient.lastName}` : '…'}
            </Typography>
          </div>
        </div>
      )}

      {/* ADJUNTAR ARCHIVO DEL EQUIPO */}
      <div className="bg-neutral-50 border border-dashed border-neutral-200 rounded-app-md p-4">
        <input ref={fileInputRef} type="file" accept="application/pdf,image/*" className="hidden" onChange={handleFileSelect} />
        {attachedFile ? (
          <div className="flex items-center gap-3">
            <FileText size={18} className="text-accent shrink-0" />
            <Typography variant={TypographyVariant.CAPTION} className="text-xs text-neutral-700 flex-1 truncate">
              {attachedFile.name}
            </Typography>
            <button
              type="button"
              onClick={() => setAttachedFile(null)}
              className="h-7 w-7 rounded-app-sm bg-white border border-neutral-200 flex items-center justify-center hover:border-neutral-300 transition-colors shrink-0"
            >
              <X size={12} className="text-neutral-400" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 text-xs font-bold text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            <Paperclip size={14} />
            {t(TEXT.CONSULTA.AUDIOGRAM.ATTACH_FILE)}
          </button>
        )}
      </div>

      <AudiogramEditor onChange={handleThresholdsChange} />

      <div className="flex justify-end gap-3">
        <Button variant={ButtonVariant.CANCEL} onClick={handleCancel} text={t(TEXT.GENERAL.BUTTONS.CANCEL)} />
        <Button
          variant={ButtonVariant.PRIMARY}
          className="!h-12 !px-10 !rounded-app-sm shadow-lg shadow-accent/20"
          onClick={handleSave}
          disabled={isPending}
        >
          <Save size={16} className="mr-2" />
          {isPending ? t(TEXT.CONSULTA.AUDIOGRAM.SAVING) : t(TEXT.CONSULTA.AUDIOGRAM.SAVE)}
        </Button>
      </div>
    </div>
  );
};
