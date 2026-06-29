import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TEXT } from '@/static/texts/i18n';
import { tailwind } from '@/utils/tailwind-utils';

const itemsPerPage = 5;

type PaginationProps = {
    currentPage: number;
    onPageChange: (page: number) => void;
    startIndex: number;
    endIndex: number;
    totalRows: number;
};

export function Pagination({ currentPage, onPageChange, startIndex, endIndex, totalRows }: PaginationProps) {
    const { t } = useTranslation();
    const totalPages = Math.ceil(totalRows / itemsPerPage);

    const handlePrevious = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    return (
        <div className="flex items-center justify-between gap-4 flex-wrap">
            <span className="text-[13px] text-slate-400 font-sans">
                {t(TEXT.GENERAL.PAGINATION.SHOWING, { start: startIndex, end: endIndex, total: totalRows })}
            </span>

            <div className="flex items-center gap-1">
                <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className={tailwind(
                        'w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-150 text-sm font-medium',
                        currentPage === 1
                            ? 'text-slate-300 cursor-not-allowed'
                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700 active:scale-95'
                    )}
                    aria-label="Página anterior"
                >
                    <ChevronLeft size={16} />
                </button>

                <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, index) => index + 1)
                        .filter((page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
                        .reduce<(number | 'ellipsis')[]>((accumulator, page, index, array) => {
                            if (index > 0 && page - (array[index - 1] as number) > 1) {
                                accumulator.push('ellipsis');
                            }
                            accumulator.push(page);
                            return accumulator;
                        }, [])
                        .map((entry, index) =>
                            entry === 'ellipsis' ? (
                                <span key={`ellipsis-${index}`} className="w-8 h-8 flex items-center justify-center text-slate-300 text-sm">
                                    ···
                                </span>
                            ) : (
                                <button
                                    key={entry}
                                    onClick={() => onPageChange(entry)}
                                    className={tailwind(
                                        'w-8 h-8 flex items-center justify-center rounded-lg text-[13px] font-medium transition-all duration-150',
                                        entry === currentPage
                                            ? 'bg-[#1E3A8A] text-white shadow-sm'
                                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700 active:scale-95'
                                    )}
                                >
                                    {entry}
                                </button>
                            )
                        )}
                </div>

                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={tailwind(
                        'w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-150',
                        currentPage === totalPages || totalPages === 0
                            ? 'text-slate-300 cursor-not-allowed'
                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700 active:scale-95'
                    )}
                    aria-label="Página siguiente"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}
