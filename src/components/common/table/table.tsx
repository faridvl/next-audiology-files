import React, { useState } from 'react';
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
    actions?: Action[];
    itemsPerPage?: number;
    onRowClick?: (row: any) => void;
};

const itemsPerPage = 5;

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

    const handleRowClick = (row: any) => {
        if (onRowClick) {
            onRowClick(row);
        }
    };

    return (
        <div className="bg-background rounded-lg shadow-md">
            <table className="w-full table-auto">
                <thead className="bg-muted border-b">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.accessor}
                                className="px-4 py-3 text-left font-medium text-muted-foreground"
                                style={{ width: column.width }}
                            >
                                {column.header}
                            </th>
                        ))}
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentData.map((item, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className="border-b hover:bg-muted/40 transition-colors cursor-pointer"
                            onClick={() => handleRowClick(item)}
                        >
                            {columns.map((column) => (
                                <td key={column.accessor} className="px-4 py-3 text-muted-foreground">
                                    {item[column.accessor]}
                                </td>
                            ))}
                            <td className="px-4 py-3 relative">
                                <ToggleMenu actions={actions} onClick={() => { }} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination currentPage={page} onPageChange={handlePageChange} startIndex={startIndex + 1} endIndex={endIndex} totalRows={totalRows} />
        </div>
    );
}
