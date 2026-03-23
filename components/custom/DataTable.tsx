"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Calendar, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

type AnyRecord = Record<string, unknown>;

export type ColumnDef<T extends AnyRecord = AnyRecord> = {
    key: string;
    label: string;
    render?: (value: unknown, row: T) => React.ReactNode;
};

export type DataTableProps<T extends AnyRecord> = {
    initialData: T[];
    /** Shorthand: define columns in one place instead of visibleColumns + labels + customRenderers */
    columns?: ColumnDef<T>[];
    idKey?: keyof T & string;
    hiddenColumns?: Array<keyof T & string>;
    labels?: Partial<Record<keyof T & string, string>>;
    visibleColumns?: Array<string>;
    onEdit?: (id: unknown, row: T) => void;
    onDelete?: (id: unknown, row: T) => void;
    onRowClick?: (id: unknown, row: T) => void;
    pagination?: boolean;
    customRenderers?: Partial<Record<string, (value: unknown, row?: T) => React.ReactNode>>;
    emptyMessage?: string;
    className?: string;
};

function toLabel(key: string) {
    return key
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/_/g, " ")
        .replace(/^\w/, (c) => c.toUpperCase());
}

export default function DataTable<T extends AnyRecord>({
    initialData,
    columns: columnDefs,
    idKey = "id" as keyof T & string,
    hiddenColumns = [],
    labels: labelsRaw = {},
    visibleColumns: visibleColumnsRaw,
    onEdit,
    onDelete,
    onRowClick,
    pagination = false,
    customRenderers: customRenderersRaw,
    emptyMessage = "Nessun record trovato",
    className,
}: DataTableProps<T>) {
    // Resolve from `columns` shorthand or individual props
    const labels = columnDefs
        ? Object.fromEntries(columnDefs.map((c) => [c.key, c.label]))
        : (labelsRaw as Record<string, string>);
    const visibleColumns = columnDefs ? columnDefs.map((c) => c.key) : visibleColumnsRaw;
    const customRenderers = columnDefs
        ? Object.fromEntries(columnDefs.filter((c) => c.render).map((c) => [c.key, c.render!]))
        : customRenderersRaw;
    const [data, setData] = useState<T[]>(() => initialData);
    useEffect(() => { Promise.resolve().then(() => setData(initialData)); }, [initialData]);

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
        if (pagination && page > totalPages) Promise.resolve().then(() => setPage(totalPages));
    }, [totalPages, page, pagination]);

    const visibleKeys = useMemo(() => {
        const idStr = idKey as string;
        if (visibleColumns && visibleColumns.length) {
            return (visibleColumns as string[]).filter((k) => k !== idStr && !(hiddenColumns as string[]).includes(k));
        }
        return keys.filter((k) => k !== idStr && !(hiddenColumns as string[]).includes(k));
    }, [keys, idKey, hiddenColumns, visibleColumns]);

    const renderCellForKey = useCallback((key: string, v: unknown, row?: T) => {
        const renderer = customRenderers && (customRenderers as Record<string, (v: unknown, r?: T) => React.ReactNode>)[key];
        if (renderer) return renderer(v, row as T);
        if (v === null || v === undefined) return <span className="text-amber-400/60">—</span>;
        if (typeof v === "boolean") return v ? "✓" : "✗";
        return String(v);
    }, [customRenderers]);

    type LocalCol = { id: string; header: string; cell: (row: T) => React.ReactNode };
    const columns = useMemo(() => {
        const baseCols: LocalCol[] = visibleKeys.map((key) => {
            const headerLabel = (labels as Partial<Record<string, string>>)[key] ?? toLabel(key);
            if (key.includes('.')) {
                const path = key.split('.');
                const accessor = (row: T) => path.reduce((acc: unknown, p: string) => {
                    if (acc && typeof acc === 'object' && p in (acc as Record<string, unknown>)) return (acc as Record<string, unknown>)[p];
                    return undefined;
                }, row as unknown);
                return {
                    id: key,
                    header: headerLabel,
                    cell: (row: T) => renderCellForKey(key, accessor(row), row),
                };
            }

            return {
                id: key,
                header: headerLabel,
                cell: (row: T) => renderCellForKey(key, (row as Record<string, unknown>)[key], row),
            };
        });

        if (onEdit || onDelete) {
            baseCols.push({
                id: "actions",
                header: "Azioni",
                cell: (row: T) => (
                    <div className="flex gap-2">
                        {onEdit && (
                            <button
                                className="px-3 py-1.5 text-xs font-serif text-amber-100 bg-amber-700 rounded-md border border-amber-600 hover:bg-amber-800 transition-all"
                                onClick={(e) => { e.stopPropagation(); onEdit((row as Record<string, unknown>)[idKey], row); }}
                            >
                                ✏️ Modifica
                            </button>
                        )}
                        {onDelete && idKey && (
                            <button
                                className="px-3 py-1.5 text-xs font-serif text-amber-100 bg-amber-800 rounded-md border border-amber-700 hover:bg-amber-900 transition-all"
                                onClick={(e) => { e.stopPropagation(); onDelete((row as Record<string, unknown>)[idKey], row); }}
                            >
                                🗑️ Elimina
                            </button>
                        )}
                    </div>
                ),
            });
        }

        return baseCols;
    }, [visibleKeys, labels, idKey, onEdit, onDelete, renderCellForKey]);

    return (
        <div className={cn("w-full", className)}>
            {/* Tabella */}
            <div className="overflow-x-auto rounded-lg border border-amber-900/20 bg-amber-50/30">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b-2 border-amber-800/50 bg-amber-100/50">
                            {columns.map((col) => (
                                <th key={col.id} className="px-4 py-3 text-left">
                                    <span className="font-serif text-amber-900 font-semibold text-sm uppercase tracking-wider">
                                        {col.header}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="text-center py-16">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="text-6xl opacity-30">📜</div>
                                        <p className="text-amber-700 font-serif text-lg">{emptyMessage}</p>
                                        <p className="text-amber-600/50 text-sm italic">La pergamena è vuota...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((row, index) => (
                                <tr
                                    key={String((row as Record<string, unknown>)[idKey] ?? index)}
                                    onClick={() => onRowClick && onRowClick((row as Record<string, unknown>)[idKey], row)}
                                    className={`
                                        border-b border-amber-700/20 transition-all duration-200
                                        ${index % 2 === 0 ? 'bg-amber-100/20' : 'bg-transparent'}
                                        ${onRowClick ? 'cursor-pointer hover:bg-amber-200/40' : ''}
                                    `}
                                >
                                    {columns.map((col) => (
                                        <td key={col.id} className="px-4 py-3">
                                            <div className="font-serif text-amber-800">
                                                {col.cell(row)}
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Paginazione */}
            {pagination && totalPages > 1 && (
                <div className="mt-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-serif text-amber-800 flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                Righe:
                            </span>
                            <select
                                className="px-3 py-1.5 bg-amber-50 border-2 border-amber-700 rounded-lg text-amber-900 font-serif text-sm"
                                value={rowsPerPage}
                                onChange={e => { setRowsPerPage(Number(e.target.value)); setPage(1); }}
                            >
                                {[5, 10, 20, 50].map(n => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                className="px-4 py-1.5 bg-amber-700 text-amber-100 font-serif rounded-lg disabled:opacity-50 hover:bg-amber-800 transition-all flex items-center gap-2"
                                disabled={page === 1}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Prec
                            </button>
                            
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-serif text-amber-800">Pag.</span>
                                <span className="px-3 py-1.5 bg-amber-50 border-2 border-amber-700 rounded-lg text-amber-900 font-bold min-w-[60px] text-center">
                                    {page}
                                </span>
                                <span className="text-sm font-serif text-amber-800">di {totalPages}</span>
                            </div>
                            
                            <button
                                className="px-4 py-1.5 bg-amber-700 text-amber-100 font-serif rounded-lg disabled:opacity-50 hover:bg-amber-800 transition-all flex items-center gap-2"
                                disabled={page === totalPages}
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            >
                                Succ
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="mt-3 text-center">
                        <p className="text-xs text-amber-600/60 font-serif flex items-center justify-center gap-2">
                            <Calendar className="w-3 h-3" />
                            Mostrati {((page-1)*rowsPerPage)+1} - {Math.min(page*rowsPerPage, totalRows)} di {totalRows} elementi
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}