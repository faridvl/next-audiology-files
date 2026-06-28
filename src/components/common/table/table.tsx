import React from 'react';
import { Pagination } from './pagination';
import { Action, ToggleMenu } from '../menu-item/menu-item';
import { Typography, TypographyVariant } from '../typography/typography';
import { tailwind } from '@/utils/tailwind-utils';

type Column = {
    header: string;
    accessor: string;
    width?: string;
};

type TableProps = {
    columns: Column[];
    data: any[];
    currentPage: number;
    totalRows: number;
    onPageChange: (page: number) => void;
    actions?: Action[];
    itemsPerPage?: number;
    onRowClick?: (row: any) => void;
    isLoading?: boolean;
};

export function Table({
    columns,
    data,
    currentPage,
    totalRows,
    onPageChange,
    actions = [],
    itemsPerPage = 10,
    onRowClick,
    isLoading
}: TableProps) {

    if (isLoading) {
        return (
            <div className="bg-white rounded-[24px] border border-slate-100 p-20 flex flex-col items-center justify-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E3A8A]"></div>

                <Typography variant={TypographyVariant.HELPER}>
                    Cargando datos...
                </Typography>
            </div>
        );
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + data.length;

    return (
        <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">

            {/* VISTA MOBILE — cards */}
            <div className="md:hidden">
                {data.length > 0 ? (
                    <div className="divide-y divide-slate-50">
                        {data.map((item, rowIndex) => (
                            <div
                                key={item.id || rowIndex}
                                onClick={() => onRowClick?.(item)}
                                className={tailwind(
                                    'p-4 space-y-2 transition-all duration-200',
                                    onRowClick && 'cursor-pointer active:bg-slate-50'
                                )}
                            >
                                {columns
                                    .filter((column) => column.header && item[column.accessor] !== undefined && item[column.accessor] !== null)
                                    .map((column) => (
                                        <div key={column.accessor} className="flex items-start gap-2">
                                            {column.header && (
                                                <Typography
                                                    variant={TypographyVariant.OVERLINE}
                                                    inline
                                                    className="text-[10px] text-slate-400 shrink-0 w-24"
                                                >
                                                    {column.header}
                                                </Typography>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <Typography
                                                    variant={TypographyVariant.BODY}
                                                    className="text-slate-700 break-words"
                                                >
                                                    {item[column.accessor]}
                                                </Typography>
                                            </div>
                                        </div>
                                    ))}
                                {actions.length > 0 && (
                                    <div
                                        className="flex justify-end pt-2"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <ToggleMenu actions={actions} rowData={item} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="px-6 py-12 text-center">
                        <Typography variant={TypographyVariant.HELPER}>
                            No se encontraron resultados
                        </Typography>
                    </div>
                )}
            </div>

            {/* VISTA DESKTOP — tabla */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse">

                    {/* HEADER */}
                    <thead>
                        <tr className="bg-slate-50/60 border-b border-slate-100">
                            {columns.map((column) => (
                                <th
                                    key={column.accessor}
                                    className="px-6 py-4 text-left"
                                    style={{ width: column.width }}
                                >
                                    <Typography
                                        variant={TypographyVariant.OVERLINE}
                                        inline
                                    >
                                        {column.header}
                                    </Typography>
                                </th>
                            ))}

                            {actions.length > 0 && (
                                <th className="px-6 py-4 text-right">
                                    <Typography
                                        variant={TypographyVariant.OVERLINE}
                                        inline
                                    >
                                        Acciones
                                    </Typography>
                                </th>
                            )}
                        </tr>
                    </thead>

                    {/* BODY */}
                    <tbody className="divide-y divide-slate-50">
                        {data.length > 0 ? (
                            data.map((item, rowIndex) => (
                                <tr
                                    key={item.id || rowIndex}
                                    onClick={() => onRowClick?.(item)}
                                    className={tailwind(
                                        'group transition-all duration-200',
                                        onRowClick && 'cursor-pointer hover:bg-slate-50'
                                    )}
                                >
                                    {columns.map((column) => (
                                        <td key={column.accessor} className="px-6 py-4">

                                            <Typography
                                                variant={TypographyVariant.BODY}
                                                className="group-hover:text-slate-900 transition-colors"
                                            >
                                                {item[column.accessor]}
                                            </Typography>

                                        </td>
                                    ))}

                                    {actions.length > 0 && (
                                        <td
                                            className="px-6 py-4 text-right"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <ToggleMenu actions={actions} rowData={item} />
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length + 1}
                                    className="px-6 py-12 text-center"
                                >
                                    <Typography variant={TypographyVariant.HELPER}>
                                        No se encontraron resultados
                                    </Typography>
                                </td>
                            </tr>
                        )}
                    </tbody>

                </table>
            </div>

            {/* FOOTER */}
            <div className="bg-slate-50/40 border-t border-slate-100 px-6 py-4">
                <Pagination
                    currentPage={currentPage}
                    onPageChange={onPageChange}
                    startIndex={totalRows > 0 ? startIndex + 1 : 0}
                    endIndex={endIndex}
                    totalRows={totalRows}
                />
            </div>
        </div>
    );
}
