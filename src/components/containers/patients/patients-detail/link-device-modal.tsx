import React, { useState } from 'react';
import { X, Link, Search, CheckCircle } from 'lucide-react';
import { useProductsQuery } from '@/shared/api/querys/inventory/inventory-query';
import { useUpdatePatientMutation } from '@/shared/api/mutations/patients/update-patient-mutation';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { TEXT } from '@/static/texts/i18n';

interface Props {
    patientUuid: string;
    currentLinkedProductUuid?: string | null;
    onClose: () => void;
    onSuccess: () => void;
}

export const LinkDeviceModal: React.FC<Props> = ({ patientUuid, currentLinkedProductUuid, onClose, onSuccess }) => {
    const { t } = useTranslation();
    const { data: products = [], isLoading } = useProductsQuery(false);
    const { executeUpdatePatient, isPending } = useUpdatePatientMutation();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUuid, setSelectedUuid] = useState<string | null>(currentLinkedProductUuid ?? null);

    const filtered = products.filter(
        (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.model ?? '').toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const handleConfirm = () => {
        executeUpdatePatient(
            { uuid: patientUuid, linkedProductUuid: selectedUuid },
            {
                onSuccess: () => {
                    toast.success(selectedUuid ? t(TEXT.LINK_DEVICE.SUCCESS_LINKED) : t(TEXT.LINK_DEVICE.SUCCESS_UNLINKED));
                    onSuccess();
                    onClose();
                },
                onError: () => {
                    toast.error(t(TEXT.LINK_DEVICE.ERROR));
                },
            },
        );
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/30 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-lg rounded-app-xl shadow-2xl p-8 animate-in zoom-in-95 space-y-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-soft rounded-xl">
                            <Link size={18} className="text-primary" />
                        </div>
                        <p className="text-sm font-black text-neutral-900 uppercase tracking-widest">{t(TEXT.LINK_DEVICE.TITLE)}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="relative">
                    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                        type="text"
                        placeholder={t(TEXT.LINK_DEVICE.SEARCH_PLACEHOLDER)}
                        className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {isLoading ? (
                        <div className="py-8 text-center text-neutral-400 text-xs font-bold uppercase tracking-widest animate-pulse">{t(TEXT.LINK_DEVICE.LOADING_INVENTORY)}</div>
                    ) : filtered.length === 0 ? (
                        <div className="py-8 text-center text-neutral-400 text-xs font-bold uppercase tracking-widest">{t(TEXT.LINK_DEVICE.NO_RESULTS)}</div>
                    ) : (
                        filtered.map((product) => {
                            const isSelected = selectedUuid === product.uuid;
                            return (
                                <button
                                    key={product.uuid}
                                    onClick={() => setSelectedUuid(isSelected ? null : product.uuid)}
                                    className={`w-full flex items-center gap-4 p-4 rounded-app-md border transition-all text-left ${
                                        isSelected
                                            ? 'border-primary/30 bg-primary-soft'
                                            : 'border-neutral-100 hover:border-neutral-200 bg-white'
                                    }`}
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-neutral-900 truncate">{product.name}</p>
                                        <p className="text-[10px] text-neutral-400 uppercase tracking-wide font-bold">
                                            {product.sku}{product.model ? ` · ${product.model}` : ''}
                                        </p>
                                    </div>
                                    {isSelected && <CheckCircle size={18} className="text-primary shrink-0" />}
                                </button>
                            );
                        })
                    )}
                </div>

                {currentLinkedProductUuid && (
                    <button
                        onClick={() => setSelectedUuid(null)}
                        className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-danger/60 hover:text-danger transition-colors"
                    >
                        {t(TEXT.LINK_DEVICE.REMOVE_LINK)}
                    </button>
                )}

                <div className="flex gap-3 pt-2">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl border border-neutral-200 text-xs font-black uppercase tracking-widest text-neutral-500 hover:bg-neutral-50 transition-colors"
                    >
                        {t(TEXT.LINK_DEVICE.CANCEL)}
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isPending || selectedUuid === currentLinkedProductUuid}
                        className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-black uppercase tracking-widest transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? t(TEXT.LINK_DEVICE.SAVING) : t(TEXT.LINK_DEVICE.CONFIRM)}
                    </button>
                </div>
            </div>
        </div>
    );
};
