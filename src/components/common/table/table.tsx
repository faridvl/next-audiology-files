import React, { useState } from 'react';
import { Pagination } from './pagination';
import { Action, ToggleMenu } from '../menu-item/menu-item';
import { Typography, TypographyVariant } from '../typography/typography';

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
    actions?: Action[];
    itemsPerPage?: number;
    onRowClick?: (row: any) => void;
};

export function Table({
    columns,
    data,
    currentPage,
    totalRows,
    actions = [],
    itemsPerPage = 5,
    onRowClick,
}: TableProps) {
    const [page, setPage] = useState(currentPage);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = data.slice(startIndex, endIndex);

    return (
        <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            {columns.map((column) => (
                                <th
                                    key={column.accessor}
                                    className="px-6 py-4 text-left shadow-sm"
                                    style={{ width: column.width }}
                                >
                                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                                        {column.header}
                                    </span>
                                </th>
                            ))}
                            <th className="px-6 py-4 text-right">
                                <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                                    Acciones
                                </span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {currentData.map((item, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className="group hover:bg-blue-50/30 transition-all duration-200 cursor-pointer"
                                onClick={() => onRowClick?.(item)}
                            >
                                {columns.map((column) => (
                                    <td key={column.accessor} className="px-6 py-4">
                                        <div className="text-slate-600 font-medium group-hover:text-slate-900 transition-colors text-sm">
                                            {item[column.accessor]}
                                        </div>
                                    </td>
                                ))}
                                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                    <ToggleMenu actions={actions} rowData={item} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer de la tabla con paginación */}
            <div className="bg-slate-50/30 border-t border-slate-100 px-6 py-4">
                <Pagination
                    currentPage={page}
                    onPageChange={handlePageChange}
                    startIndex={startIndex + 1}
                    endIndex={Math.min(endIndex, totalRows)}
                    totalRows={totalRows}
                />
            </div>
        </div>
    );
}