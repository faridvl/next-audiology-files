import React from 'react';
import { Pagination } from './pagination';
import { Action, ToggleMenu } from '../menu-item/menu-item';

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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="text-slate-500 font-medium">Cargando datos...</span>
            </div>
        );
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + data.length;

    return (
        <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            {columns.map((column) => (
                                <th
                                    key={column.accessor}
                                    className="px-6 py-4 text-left"
                                    style={{ width: column.width }}
                                >
                                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                                        {column.header}
                                    </span>
                                </th>
                            ))}
                            {actions.length > 0 && (
                                <th className="px-6 py-4 text-right">
                                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                                        Acciones
                                    </span>
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {data.length > 0 ? (
                            data.map((item, rowIndex) => (
                                <tr
                                    key={item.id || rowIndex}
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
                                    {actions.length > 0 && (
                                        <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                            <ToggleMenu actions={actions} rowData={item} />
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length + 1} className="px-6 py-10 text-center text-slate-400 text-sm">
                                    No se encontraron resultados
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="bg-slate-50/30 border-t border-slate-100 px-6 py-4">
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