import React from 'react';
import { Pagination } from './pagination';
import { Action, ToggleMenu } from '../menu-item/menu-item';
import { Typography, TypographyVariant } from '../typography/typography';
import { tailwind } from '@/utils/tailwind-utils';
import { Inbox } from 'lucide-react';

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

function TableSkeleton({ columns, actions }: { columns: Column[]; actions: Action[] }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="hidden md:block">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50">
                            {columns.map((column) => (
                                <th key={column.accessor} className="px-6 py-3.5 text-left" style={{ width: column.width }}>
                                    <Typography variant={TypographyVariant.OVERLINE} inline>
                                        {column.header}
                                    </Typography>
                                </th>
                            ))}
                            {actions.length > 0 && <th className="px-6 py-3.5 w-20" />}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <tr key={index} className="animate-pulse">
                                {columns.map((column) => (
                                    <td key={column.accessor} className="px-6 py-4">
                                        <div className="h-4 bg-slate-100 rounded-full" style={{ width: index % 2 === 0 ? '70%' : '55%' }} />
                                    </td>
                                ))}
                                {actions.length > 0 && (
                                    <td className="px-6 py-4">
                                        <div className="h-4 w-8 bg-slate-100 rounded-full ml-auto" />
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="md:hidden divide-y divide-slate-50 animate-pulse">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="p-4 space-y-3">
                        <div className="h-4 bg-slate-100 rounded-full w-1/2" />
                        <div className="h-3 bg-slate-100 rounded-full w-1/3" />
                    </div>
                ))}
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                <Inbox size={22} className="text-slate-300" />
            </div>
            <Typography variant={TypographyVariant.HELPER}>
                Sin resultados para mostrar
            </Typography>
        </div>
    );
}

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
        return <TableSkeleton columns={columns} actions={actions} />;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + data.length;

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

            {/* VISTA MOBILE — cards */}
            <div className="md:hidden">
                {data.length > 0 ? (
                    <div className="divide-y divide-slate-50">
                        {data.map((item, rowIndex) => (
                            <div
                                key={item.id || rowIndex}
                                onClick={() => onRowClick?.(item)}
                                className={tailwind(
                                    'px-4 py-3.5 space-y-2 transition-colors duration-150',
                                    onRowClick && 'cursor-pointer active:bg-slate-50/80'
                                )}
                            >
                                {columns
                                    .filter((column) => column.header && item[column.accessor] != null)
                                    .map((column) => (
                                        <div key={column.accessor} className="flex items-start gap-3">
                                            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 shrink-0 w-24 pt-0.5">
                                                {column.header}
                                            </span>
                                            <Typography
                                                variant={TypographyVariant.BODY}
                                                className="text-slate-700 break-words text-sm"
                                            >
                                                {item[column.accessor]}
                                            </Typography>
                                        </div>
                                    ))}
                                {actions.length > 0 && (
                                    <div
                                        className="flex justify-end pt-1"
                                        onClick={(event) => event.stopPropagation()}
                                    >
                                        <ToggleMenu actions={actions} rowData={item} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState />
                )}
            </div>

            {/* VISTA DESKTOP — tabla */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse">

                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50">
                            {columns.map((column) => (
                                <th
                                    key={column.accessor}
                                    className="px-6 py-3.5 text-left"
                                    style={{ width: column.width }}
                                >
                                    <Typography variant={TypographyVariant.OVERLINE} inline>
                                        {column.header}
                                    </Typography>
                                </th>
                            ))}
                            {actions.length > 0 && (
                                <th className="px-6 py-3.5 text-right w-20">
                                    <Typography variant={TypographyVariant.OVERLINE} inline>
                                        Acciones
                                    </Typography>
                                </th>
                            )}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-50">
                        {data.length > 0 ? (
                            data.map((item, rowIndex) => (
                                <tr
                                    key={item.id || rowIndex}
                                    onClick={() => onRowClick?.(item)}
                                    className={tailwind(
                                        'group transition-colors duration-150',
                                        onRowClick && 'cursor-pointer hover:bg-slate-50/60'
                                    )}
                                >
                                    {columns.map((column, columnIndex) => (
                                        <td key={column.accessor} className="px-6 py-4">
                                            <Typography
                                                variant={columnIndex === 0 ? TypographyVariant.BODY_SEMIBOLD : TypographyVariant.BODY}
                                                className={tailwind(
                                                    'transition-colors duration-150',
                                                    columnIndex === 0 ? 'text-slate-800 group-hover:text-[#1E3A8A]' : 'text-slate-500 group-hover:text-slate-700'
                                                )}
                                            >
                                                {item[column.accessor]}
                                            </Typography>
                                        </td>
                                    ))}
                                    {actions.length > 0 && (
                                        <td
                                            className="px-6 py-4 text-right"
                                            onClick={(event) => event.stopPropagation()}
                                        >
                                            <ToggleMenu actions={actions} rowData={item} />
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length + (actions.length > 0 ? 1 : 0)}>
                                    <EmptyState />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* FOOTER — paginación */}
            <div className="border-t border-slate-100 px-6 py-3 bg-slate-50/40">
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
