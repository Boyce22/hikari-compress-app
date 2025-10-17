import { useMemo, useState } from 'react';
import clsx from 'clsx';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { Checkbox } from '@/ui/checkbox';
import { MoreHorizontal, ChevronDown, ArrowUpDown, Trash2 } from 'lucide-react';

import { VideoFile } from '@/shared/types/video-file';
import { formatFileSize } from '@/shared/utils/format-file-size';
import { StatusProcessing } from '@/shared/types/status-processing';
import { useVideoFilesContext } from '@/renderer/app/providers/videos-provider';

const COLUMN_LABELS: Record<string, string> = {
  select: 'Selecionar',
  name: 'Nome',
  originalSize: 'Tamanho Original',
  compressedSize: 'Tamanho Compactado',
  compressionRatio: 'Compressão',
  uploadedAt: 'Data de Envio',
  processedAt: 'Data de Processamento',
  progress: 'Progressão',
  actions: 'Ações',
};

const SortableHeader = ({ column, title }: { column: any; title: string }) => (
  <Button
    variant="ghost"
    className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide hover:text-foreground hover:bg-transparent"
    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
  >
    {title} <ArrowUpDown className="ml-2 !h-3.5 !w-3.5 opacity-60" />
  </Button>
);

const ProgressCell = ({ status }: { status: StatusProcessing }) => {
  const colors: Record<StatusProcessing, string> = {
    waiting: 'text-muted-foreground bg-muted/20',
    processing: 'text-muted-foreground bg-muted/20',
    completed: 'text-success bg-success/10',
    error: 'text-destructive bg-destructive/10',
  };

  return (
    <div
      className={clsx(
        'flex items-center justify-center w-28 gap-2 px-2 py-1 rounded-full text-xs font-medium',
        colors[status] ?? colors.waiting,
      )}
    >
      {status === 'processing' && (
        <span className="w-3 h-3 border-2 bg-muted/20 border-t-transparent border-foreground rounded-full animate-spin" />
      )}
      <span className="capitalize">{status}</span>
    </div>
  );
};

const ActionsCell = ({
  name,
  progress,
}: {
  name: string;
  progress: StatusProcessing;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <MoreHorizontal className="h-4 w-4 text-primary-foreground" />
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-48 bg-card text-card-foreground rounded-lg shadow-lg p-1">
      <DropdownMenuLabel className="text-sm font-semibold">Ações</DropdownMenuLabel>
      <DropdownMenuItem
        disabled={progress !== StatusProcessing.WAITING}
        className="text-sm hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Iniciar Compressão
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => navigator.clipboard.writeText(name)}
        className="text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
      >
        Copiar nome do arquivo
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        className="text-sm text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors flex items-center gap-2"
      >
        <Trash2 className="h-4 w-4" /> Remover histórico
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);;

export const columns: ColumnDef<VideoFile>[] = [
  {
    id: 'select',
    enableSorting: false,
    enableHiding: false,
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(val) => table.toggleAllPageRowsSelected(!!val)}
        aria-label="Selecionar todos"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(val) => row.toggleSelected(!!val)}
        aria-label="Selecionar linha"
      />
    ),
  },
  { accessorKey: 'name', header: ({ column }) => <SortableHeader column={column} title="Nome" /> },
  {
    accessorKey: 'originalSize',
    header: 'Tamanho Original',
    cell: ({ row }) => formatFileSize(row.getValue<number>('originalSize')),
  },
  {
    accessorKey: 'compressedSize',
    header: 'Tamanho Compactado',
    cell: ({ row }) => {
      const compressedSize = row.getValue<number>('compressedSize');
      return compressedSize ? formatFileSize(compressedSize) : null
    },
  },
  {
    accessorKey: 'compressionRatio',
    header: 'Compressão',
    cell: ({ row }) => {
      const compressionRatio = row.getValue<number>('compressionRatio');
      return compressionRatio !== undefined && compressionRatio !== null ? `${(compressionRatio * 100).toFixed(1)}%` : null;
    },
  },
  {
    accessorKey: 'uploadedAt',
    header: ({ column }) => <SortableHeader column={column} title="Data de Envio" />,
    cell: ({ row }) => {
      const uploadedAt = row.getValue<string>('uploadedAt');
      return uploadedAt ? new Date(uploadedAt).toLocaleString('pt-BR') : null;
    },
  },
  {
    accessorKey: 'processedAt',
    header: ({ column }) => <SortableHeader column={column} title="Data de Processamento" />,
    cell: ({ row }) => {
      const processedAt = row.getValue<string>('processedAt');
      return processedAt ? new Date(processedAt).toLocaleString('pt-BR') : null;
    },
  },
  {
    accessorKey: 'progress',
    header: 'Progressão',
    cell: ({ row }) => <ProgressCell status={row.getValue<StatusProcessing>('progress')} />,
    enableSorting: false,
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <ActionsCell name={row.original.name} progress={row.original.progress} />
  },
];

export function HistoryTable() {
  const { videos, startCompression } = useVideoFilesContext()
  const [selection, setSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filters, setFilters] = useState<ColumnFiltersState>([]);
  const [visibility, setVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data: useMemo(() => videos, [videos]),
    columns,
    state: { sorting, columnFilters: filters, columnVisibility: visibility, rowSelection: selection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setFilters,
    onColumnVisibilityChange: setVisibility,
    onRowSelectionChange: setSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const nameFilter = table.getColumn('name')?.getFilterValue() as string;

  return (
    <div className="w-full">
      {/* Filtros e colunas */}
      <div className="flex items-center gap-2 py-3">
        <Input
          placeholder="Filtrar por nome..."
          value={nameFilter ?? ''}
          onChange={(e) => table.getColumn('name')?.setFilterValue(e.target.value)}
          className="max-w-xs bg-muted/20 border-muted focus-visible:ring-1 focus-visible:ring-primary"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto text-left text-xs font-medium text-muted-foreground uppercase tracking-wide"
            >
              COLUNAS <ChevronDown className="ml-1 h-4 w-4 opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((c) => c.getCanHide())
              .map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide"
                  checked={col.getIsVisible()}
                  onCheckedChange={(val) => col.toggleVisibility(!!val)}
                >
                  {COLUMN_LABELS[col.id]}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Tabela */}
      <div className="rounded-xl border border-border/40 bg-card/30 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id} className="bg-card">
                {group.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide"
                  >
                    {!header.isPlaceholder && flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="border-muted/20 hover:bg-muted/10 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-3 py-2 text-sm text-foreground/80">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-20 text-center text-muted-foreground">
                  Nenhum resultado encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-between py-3 text-sm text-muted-foreground">
        <span>
          {table.getFilteredSelectedRowModel().rows.length} de {table.getFilteredRowModel().rows.length} selecionado(s)
        </span>
        <div className="space-x-1">
          <Button variant="ghost" size="sm" onClick={table.previousPage} disabled={!table.getCanPreviousPage()}>
            Anterior
          </Button>
          <Button variant="ghost" size="sm" onClick={table.nextPage} disabled={!table.getCanNextPage()}>
            Próximo
          </Button>
        </div>
      </div>
    </div>
  );
}
