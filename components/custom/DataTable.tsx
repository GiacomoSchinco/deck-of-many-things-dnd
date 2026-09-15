"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Check, ChevronLeft, ChevronRight, Pencil, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";

type AnyRecord = Record<string, unknown>;

export type ColumnDef<T extends AnyRecord = AnyRecord> = {
    key: string;
    label: string;
    render?: (value: unknown, row: T) => React.ReactNode;
    /** Allineamento. Se omesso: numeri a destra, testo a sinistra. */
    align?: 'left' | 'right' | 'center';
};

export type DataTableProps<T extends AnyRecord> = {
    initialData: T[];
    /** Abbreviazione: definisce le colonne in un unico posto invece di visibleColumns + labels + customRenderers */
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
    /** Densità delle righe: `compact` per tabelle lunghe da consultare */
    density?: 'comfortable' | 'compact';
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
    density = 'comfortable',
    className,
}: DataTableProps<T>) {
    // Risolve dalla scorciatoia `columns` o dalle prop individuali
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
        if (v === null || v === undefined) return <span className="text-ink-muted/50">—</span>;
        if (typeof v === "boolean") {
            return v
                ? <Check className="h-4 w-4 text-success" aria-label="Sì" />
                : <X className="h-4 w-4 text-ink-muted/60" aria-label="No" />;
        }
        return String(v);
    }, [customRenderers]);

    type LocalCol = {
        id: string;
        header: string;
        align: 'left' | 'right' | 'center';
        /** Prima colonna: è l'identità della riga, va in evidenza */
        emphasis: boolean;
        cell: (row: T) => React.ReactNode;
    };
    const columns = useMemo(() => {
        const baseCols: LocalCol[] = visibleKeys.map((key, index) => {
            const headerLabel = (labels as Partial<Record<string, string>>)[key] ?? toLabel(key);
            // I numeri si allineano a destra: è così che si confrontano le cifre
            // in colonna. Si può forzare con `align` sulla ColumnDef.
            const explicit = columnDefs?.find((c) => c.key === key)?.align;
            const isNumber = typeof (data[0] as Record<string, unknown> | undefined)?.[key] === 'number';
            const align = explicit ?? (isNumber ? 'right' : 'left');
            const emphasis = index === 0;

            if (key.includes('.')) {
                const path = key.split('.');
                const accessor = (row: T) => path.reduce((acc: unknown, p: string) => {
                    if (acc && typeof acc === 'object' && p in (acc as Record<string, unknown>)) return (acc as Record<string, unknown>)[p];
                    return undefined;
                }, row as unknown);
                return {
                    id: key,
                    header: headerLabel,
                    align,
                    emphasis,
                    cell: (row: T) => renderCellForKey(key, accessor(row), row),
                };
            }

            return {
                id: key,
                header: headerLabel,
                align,
                emphasis,
                cell: (row: T) => renderCellForKey(key, (row as Record<string, unknown>)[key], row),
            };
        });

        if (onEdit || onDelete) {
            baseCols.push({
                id: "actions",
                header: "Azioni",
                align: 'right',
                emphasis: false,
                cell: (row: T) => (
                    <div className="flex justify-end gap-2">
                        {onEdit && (
                            <button
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-serif rounded-control metal-primary border border-primary/50 text-primary-foreground shadow-e1 hover:shadow-e2 hover:-translate-y-0.5 active:translate-y-0 active:shadow-press transition-[transform,box-shadow] duration-200"
                                onClick={(e) => { e.stopPropagation(); onEdit((row as Record<string, unknown>)[idKey], row); }}
                            >
                                <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                                Modifica
                            </button>
                        )}
                        {onDelete && idKey && (
                            <button
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-serif rounded-control metal-danger border border-destructive/50 text-destructive-foreground shadow-e1 hover:shadow-e2 hover:-translate-y-0.5 active:translate-y-0 active:shadow-press transition-[transform,box-shadow] duration-200"
                                onClick={(e) => { e.stopPropagation(); onDelete((row as Record<string, unknown>)[idKey], row); }}
                            >
                                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                                Elimina
                            </button>
                        )}
                    </div>
                ),
            });
        }

        return baseCols;
    }, [visibleKeys, labels, idKey, onEdit, onDelete, renderCellForKey, columnDefs, data]);

    const cellPadding = density === 'compact' ? 'px-4 py-2' : 'px-4 py-3';
    const startRow = totalRows === 0 ? 0 : (page - 1) * rowsPerPage + 1;
    const endRow = Math.min(page * rowsPerPage, totalRows);

    return (
        <div className={cn("w-full", className)}>
            {/* La superficie dà bordo, materiale e ombra; l'intestazione resta
                ritagliata dal raggio grazie a `overflow-hidden`. */}
            <div className="surface overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm text-ink">
                        <thead className="sticky top-0 z-10">
                            <tr className="border-b border-frame/30 bg-gradient-to-b from-parchment-300/70 to-parchment-200/40 backdrop-blur-sm">
                                {columns.map((col) => (
                                    <th
                                        key={col.id}
                                        scope="col"
                                        className={cn(
                                            'whitespace-nowrap px-4 py-3 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted',
                                            col.align === 'right' && 'text-right',
                                            col.align === 'center' && 'text-center',
                                            col.align === 'left' && 'text-left'
                                        )}
                                    >
                                        {col.header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length} className="p-4">
                                        <EmptyState
                                            title={emptyMessage}
                                            description="La pergamena è vuota: nessuna voce da mostrare."
                                        />
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((row, index) => {
                                    const clickable = Boolean(onRowClick);
                                    // Riga cliccabile = riga raggiungibile da tastiera. Prima
                                    // l'unico modo per aprirla era il mouse.
                                    const activate = () =>
                                        onRowClick?.((row as Record<string, unknown>)[idKey], row);

                                    return (
                                        <tr
                                            key={String((row as Record<string, unknown>)[idKey] ?? index)}
                                            tabIndex={clickable ? 0 : undefined}
                                            onClick={clickable ? activate : undefined}
                                            onKeyDown={
                                                clickable
                                                    ? (e) => {
                                                        if (e.key === 'Enter' || e.key === ' ') {
                                                            e.preventDefault();
                                                            activate();
                                                        }
                                                    }
                                                    : undefined
                                            }
                                            className={cn(
                                                'border-b border-frame/15 transition-colors duration-150 last:border-0',
                                                index % 2 === 1 && 'bg-parchment-200/25',
                                                clickable &&
                                                    'cursor-pointer hover:bg-parchment-300/40 focus-visible:bg-parchment-300/40 focus-visible:outline-none'
                                            )}
                                        >
                                            {columns.map((col) => (
                                                <td
                                                    key={col.id}
                                                    className={cn(
                                                        cellPadding,
                                                        col.align === 'right' && 'text-right',
                                                        col.align === 'center' && 'text-center'
                                                    )}
                                                >
                                                    <div
                                                        className={cn(
                                                            'text-ink',
                                                            col.emphasis && 'font-serif font-medium text-ink-strong'
                                                        )}
                                                    >
                                                        {col.cell(row)}
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Paginazione: una sola barra, controlli della stessa altezza e
                conteggio sempre visibile (prima comparivano tre blocchi
                staccati con tre stili diversi). */}
            {pagination && totalRows > 0 && (
                <nav
                    aria-label="Paginazione della tabella"
                    className="surface-tile mt-4 flex flex-col gap-3 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between"
                >
                    <div className="flex items-center gap-2">
                        <label htmlFor="datatable-rows" className="eyebrow">
                            Righe per pagina
                        </label>
                        <select
                            id="datatable-rows"
                            className="surface-well px-2.5 py-1 text-sm text-ink"
                            value={rowsPerPage}
                            onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(1); }}
                        >
                            {[5, 10, 20, 50].map(n => (
                                <option key={n} value={n}>{n}</option>
                            ))}
                        </select>
                    </div>

                    <p className="order-last text-xs text-ink-muted sm:order-none" aria-live="polite">
                        {startRow}–{endRow} di {totalRows}
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            aria-label="Pagina precedente"
                            className="grid h-8 w-8 place-items-center rounded-control metal-primary border border-primary/50 text-primary-foreground shadow-e1 transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-e2 active:translate-y-0 active:shadow-press disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-e1"
                            disabled={page === 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                        >
                            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                        </button>

                        <span className="px-1 text-sm text-ink-muted tabular-nums">
                            <strong className="font-semibold text-ink-strong">{page}</strong> / {totalPages}
                        </span>

                        <button
                            type="button"
                            aria-label="Pagina successiva"
                            className="grid h-8 w-8 place-items-center rounded-control metal-primary border border-primary/50 text-primary-foreground shadow-e1 transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-e2 active:translate-y-0 active:shadow-press disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-e1"
                            disabled={page === totalPages}
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        >
                            <ChevronRight className="w-4 h-4" aria-hidden="true" />
                        </button>
                    </div>
                </nav>
            )}
        </div>
    );
}