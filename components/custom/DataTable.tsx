"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
    getCoreRowModel,
    useReactTable,
    ColumnDef,
    flexRender,
    CellContext,
} from "@tanstack/react-table";
import { AncientScroll } from "./AncientScroll";

type AnyRecord = Record<string, unknown>;

export type DataTableProps<T extends AnyRecord> = {
    initialData: T[];
    idKey?: keyof T & string;
    hiddenColumns?: Array<keyof T & string>;
    readOnlyColumns?: Array<keyof T & string>;
    labels?: Partial<Record<keyof T & string, string>>;
    visibleColumns?: Array<string>;
    onEdit?: (id: unknown, row: T) => void;
    onDelete?: (id: unknown, row: T) => void;
    onRowClick?: (id: unknown, row: T) => void;
    pagination?: boolean;
    title?: string;
    customRenderers?: Partial<Record<string, (value: any, row?: T) => React.ReactNode>>;
};

function toLabel(key: string) {
    return key
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/_/g, " ")
        .replace(/^\w/, (c) => c.toUpperCase());
}

export default function DataTable<T extends AnyRecord>({
    initialData,
    idKey = "id" as keyof T & string,
    hiddenColumns = [],
    labels = {},
    visibleColumns,
    onEdit,
    onDelete,
    onRowClick,
    pagination = false,
    title,
    customRenderers,
}: DataTableProps<T>) {
    "use no memo"; // TanStack Table returns functions that can't be safely memoized by React 19 Compiler
    const [data, setData] = useState<T[]>(initialData);
    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    const keys = useMemo(() => {
        const first = data[0] ?? initialData[0] ?? ({} as T);
        return Object.keys(first) as Array<keyof T & string>;
    }, [data, initialData]);

    // Paginazione
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const totalRows = data.length;
    const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));
    const paginatedData = useMemo(() => {
        if (!pagination) return data;
        const start = (page - 1) * rowsPerPage;
        return data.slice(start, start + rowsPerPage);
    }, [data, page, rowsPerPage, pagination]);

    useEffect(() => {
        if (pagination && page > totalPages) setPage(totalPages);
    }, [totalPages, page, pagination]);

    
    const visibleKeys = useMemo(() => {
        const idStr = idKey as string;
        if (visibleColumns && visibleColumns.length) {
            const asStrings = visibleColumns as string[];
            // keep provided visible columns but exclude idKey
            return asStrings.filter((k) => k !== idStr && k !== idStr);
        }
        return keys.filter((k) => k !== idStr && !(hiddenColumns as string[]).includes(k));
    }, [keys, idKey, hiddenColumns, visibleColumns]);

    const columns = useMemo<ColumnDef<T, unknown>[]>(() => {
        const baseCols: ColumnDef<T, unknown>[] = visibleKeys.map((key) => {
            const headerLabel = (labels as Partial<Record<string, string>>)[key] ?? toLabel(key);
            if (key.includes('.')) {
                const path = key.split('.');
                return {
                    id: key,
                    header: headerLabel,
                    accessorFn: (row: T) => {
                        return path.reduce((acc: unknown, p: string) => {
                            if (acc && typeof acc === 'object' && p in (acc as Record<string, unknown>)) {
                                return (acc as Record<string, unknown>)[p];
                            }
                            return undefined;
                        }, row as unknown);
                    },
                    cell: (info: CellContext<T, unknown>) => {
                        const v = info.getValue();
                        const row = info.row.original;
                        const renderer = customRenderers && customRenderers[key];
                        if (renderer) return renderer(v, row);
                        return typeof v === "boolean" ? (v ? "✓" : "✗") : String(v ?? "");
                    },
                } as ColumnDef<T, unknown>;
            }

            return {
                accessorKey: key as keyof T & string,
                header: headerLabel,
                    cell: (info: CellContext<T, unknown>) => {
                        const v = info.getValue();
                        const row = info.row.original;
                        const renderer = customRenderers && customRenderers[key];
                        if (renderer) return renderer(v, row);
                        return typeof v === "boolean" ? (v ? "✓" : "✗") : String(v ?? "");
                    },
            } as ColumnDef<T, unknown>;
        });

        if (onEdit || onDelete) {
            baseCols.push({
                id: "actions",
                header: "Azioni",
                cell: ({ row }) => (
                    <div className="flex gap-2">
                        {onEdit && (
                            <button
                                className="relative px-3 py-1 text-xs font-serif text-amber-100 bg-amber-700 rounded-sm border border-amber-600 hover:bg-amber-800 transition-colors duration-200 shadow-md"
                                onClick={(e) => { e.stopPropagation(); onEdit(row.original[idKey], row.original); }}
                            >
                                <span className="flex items-center gap-1">
                                    Modifica
                                </span>
                            </button>
                        )}
                        {onDelete && idKey && (
                            <button
                                className="relative px-3 py-1 text-xs font-serif text-amber-100 bg-amber-800 rounded-sm border border-amber-700 hover:bg-amber-900 transition-colors duration-200 shadow-md"
                                onClick={(e) => { e.stopPropagation(); onDelete(row.original[idKey], row.original); }}
                            >
                                <span className="flex items-center gap-1">
                                    Elimina
                                </span>
                            </button>
                        )}
                    </div>
                ),
            });
        }

        return baseCols;
    }, [visibleKeys, labels, idKey, onEdit, onDelete]);

    const table = useReactTable<T>({
        data: paginatedData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="w-full p-4">
            <AncientScroll className="w-full" >
                <div className="relative z-10 p-6">
                    {/* Titolo con decorazioni */}
                    {title && (
                        <div className="mb-6 text-center">
                            <div className="flex items-center justify-center gap-4 mb-2">
                                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-amber-700 to-transparent" />
                                <h2 className="text-3xl font-serif text-amber-900 tracking-wide">{title}</h2>
                                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-amber-700 to-transparent" />
                            </div>
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id} className="border-b-2 border-amber-800/50">
                                        {headerGroup.headers.map((header) => (
                                            <th key={header.id} className="px-4 py-3 text-left">
                                                <span className="font-serif text-amber-900 font-bold text-sm uppercase tracking-wider">
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                                </span>
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody>
                                {table.getRowModel().rows.length === 0 ? (
                                    <tr>
                                        <td colSpan={columns.length} className="text-center py-12">
                                            <div className="flex flex-col items-center gap-3">
                                                <p className="text-amber-700 font-serif text-lg">Nessun record trovato</p>
                                                <p className="text-amber-600/50 text-sm italic">La pergamena è vuota...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    table.getRowModel().rows.map((row, index) => (
                                        <tr
                                            key={row.id}
                                            onClick={() => onRowClick && onRowClick(row.original[idKey], row.original)}
                                            className={`
                                                border-b border-amber-700/20 transition-all duration-200
                                                ${index % 2 === 0 ? 'bg-amber-100/30' : 'bg-transparent'}
                                                ${onRowClick ? 'cursor-pointer hover:bg-amber-200/50' : ''}
                                                hover:shadow-inner
                                            `}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <td key={cell.id} className="px-4 py-3">
                                                    <span className="font-serif text-amber-800">
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </span>
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginazione in stile antico */}
                    {pagination && (
                        <div className="mt-8">
                            {/* Linea decorativa */}
                            <div className="relative mb-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t-2 border-amber-700/30"></div>
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-parchment-100 px-4 text-amber-700/50 text-xl">⚜️</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                {/* Selettore righe per pagina */}
                                <div className="flex items-center gap-3 bg-amber-200/30 p-2 rounded-lg border border-amber-700/30">
                                    <span className="text-sm font-serif text-amber-800">📏 Righe:</span>
                                    <select
                                        className="px-3 py-1 bg-parchment-100 border-2 border-amber-700 rounded text-amber-900 font-serif text-sm focus:outline-none focus:border-amber-900"
                                        value={rowsPerPage}
                                        onChange={e => { setRowsPerPage(Number(e.target.value)); setPage(1); }}
                                    >
                                        {[5, 10, 20, 50].map(n => (
                                            <option key={n} value={n}>{n}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Controlli pagina */}
                                <div className="flex items-center gap-4 bg-amber-200/30 p-2 rounded-lg border border-amber-700/30">
                                    <button
                                        className="px-4 py-1 bg-amber-700 text-amber-100 font-serif rounded border border-amber-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-800 transition-colors flex items-center gap-2"
                                        disabled={page === 1}
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    >
                                        <span>←</span> Prev
                                    </button>
                                    
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-serif text-amber-800">Pag.</span>
                                        <span className="px-3 py-1 bg-parchment-100 border-2 border-amber-700 rounded text-amber-900 font-bold">
                                            {page}
                                        </span>
                                        <span className="text-sm font-serif text-amber-800">di {totalPages}</span>
                                    </div>
                                    
                                    <button
                                        className="px-4 py-1 bg-amber-700 text-amber-100 font-serif rounded border border-amber-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-800 transition-colors flex items-center gap-2"
                                        disabled={page === totalPages}
                                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    >
                                        Next <span>→</span>
                                    </button>
                                </div>
                            </div>

                            {/* Info pagina */}
                            <div className="mt-4 text-center text-xs text-amber-600/50 font-serif">
                                Mostrati {((page-1)*rowsPerPage)+1} - {Math.min(page*rowsPerPage, totalRows)} di {totalRows} elementi
                            </div>
                        </div>
                    )}
                </div>
            </AncientScroll>
        </div>
    );
}