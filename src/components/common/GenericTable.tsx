/* eslint-disable @typescript-eslint/no-explicit-any */
// GenericTable.tsx
import React, { useMemo, useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

// Replace these with your actual components paths if different
import SearchSm from '@/components/common/SearchSm'
import ButtonSm from './Buttons'
import DropdownSelect from './DropDown'
import PaginationControls from './Pagination'
import { Edit2, EyeIcon, Trash2 } from 'lucide-react'

/* Small shimmer box used in skeleton rows */
const shimmer = {
  initial: { opacity: 0.3 },
  animate: {
    opacity: [0.3, 0.6, 0.3],
    transition: { duration: 1.2, repeat: Infinity },
  },
}
const ShimmerBox = ({ className }: { className?: string }) => (
  <motion.div
    className={`relative overflow-hidden rounded bg-gray-200 ${className ?? ''}`}
    variants={shimmer}
    initial="initial"
    animate="animate"
  >
    <motion.div
      className="absolute top-0 left-[-50%] h-full w-[200%] bg-gradient-to-r from-transparent via-white/40 to-transparent"
      animate={{ left: ['-50%', '100%'] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
    />
  </motion.div>
)

/**
 * DataCell:
 * - headingTitle: column label
 * - accessVar: either 'branch' or 'branch[1]' or a function (row=>value)
 * - isArray: if true and value is an array, table will automatically use value[1]
 * - render: (value, row, index) => ReactNode  <-- value is already resolved
 */
export type DataCell = {
  headingTitle: string
  accessVar?: string | ((row: any) => any)
  className?: string
  sortable?: boolean
  searchable?: boolean
  isArray?: boolean
  render?: (value: any, row: any, index: number) => React.ReactNode
}

export interface GenericTableProps {
  data: any[] | { records: any[]; totalRecords?: number }
  dataCell: DataCell[]
  isLoading?: boolean
  isMasterTable?: boolean
  itemsPerPageOptions?: number[]
  defaultItemsPerPage?: number
  newItemLink?: string
  actionWidth?: number | null
  onEdit?: (row: any) => void
  onDelete?: (row: any) => void
  onView?: (row: any) => void
  skeletonRows?: number
  tableTitle?: string
  className?: string
  rowKey?: (row: any, index: number) => string | number
}

function toRecords(input: any): { records: any[]; totalRecords?: number } {
  if (!input) return { records: [], totalRecords: 0 }
  if (Array.isArray(input))
    return { records: input, totalRecords: input.length }
  return {
    records: input.records || [],
    totalRecords: input.totalRecords ?? input.records?.length ?? 0,
  }
}

// resolves accessVar like 'address.city' or 'arr[0].name'
function getNestedValue(accessVar: string, obj: any) {
  if (!accessVar) return undefined
  const parts = accessVar.replace(/\]/g, '').split(/\.|\[/).filter(Boolean)
  let cur: any = obj
  for (const p of parts) {
    if (cur == null) return undefined
    const idx = Number(p)
    cur = isNaN(idx) ? cur[p] : cur[idx]
  }
  return cur
}

export default function GenericTable({
  data,
  dataCell,
  isMasterTable = false,
  isLoading = false,
  itemsPerPageOptions = [5, 10, 15, 20],
  defaultItemsPerPage = 10,
  newItemLink,
  actionWidth = null,
  onEdit,
  onDelete,
  onView,
  skeletonRows = 5,
  className = '',
  rowKey,
}: GenericTableProps) {
  const nav = useNavigate()
  const { records } = toRecords(data)

  const [searchValue, setSearchValue] = useState('')
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState<{
    key: string | ((r: any) => any) | null
    direction: 'asc' | 'desc'
  }>({ key: null, direction: 'asc' })

  // NEW: State to track if initial width sync is done
  const [isWidthSynced] = useState(false)

  useEffect(() => {
    setCurrentPage(1)
  }, [JSON.stringify(records)])

  const actionBodyRefs = useRef<HTMLDivElement[]>([])
  const headerActionRef = useRef<HTMLDivElement>(null)

  // Calculate estimated action width based on buttons
  const estimatedActionWidth = useMemo(() => {
    if (actionWidth !== null) return actionWidth

    let buttonCount = 0
    if (onView) buttonCount++
    if (onEdit) buttonCount++
    if (onDelete) buttonCount++

    if (buttonCount === 0) return 0

    // Estimate: each button is ~36px wide + 8px gap + padding
    return buttonCount * 36 + (buttonCount - 1) * 8 + 16
  }, [onView, onEdit, onDelete, actionWidth])

  // NEW: central resolver that returns a safe primitive (string/number) or the raw value for render functions
  const resolveCellValue = (row: any, cell: DataCell): any => {
    let raw: any
    try {
      if (typeof cell.accessVar === 'function') raw = cell.accessVar(row)
      else if (cell.accessVar) raw = getNestedValue(String(cell.accessVar), row)
      else raw = undefined
    } catch {
      raw = undefined
    }

    // If user explicitly marked this column as isArray and it's an array, pick index 1
    if (cell.isArray && Array.isArray(raw)) {
      // prefer index 1, fallback to index 0 or empty string
      return raw[1] ?? raw[0] ?? ''
    }

    // Return raw value for render functions to handle
    return raw
  }

  // Helper function to get searchable/sortable string value
  const getStringValue = (raw: any): string => {
    if (raw === null || raw === undefined) return ''

    // If value is array, handle gracefully: prefer index 1 if present
    if (Array.isArray(raw)) return String(raw[1] ?? raw[0] ?? '')

    // objects -> try to pick name-like props, else JSON stringify fallback
    if (raw !== null && typeof raw === 'object') {
      if ('name' in raw) return String((raw as any).name)
      if ('label' in raw) return String((raw as any).label)
      // fallback to stringify (rare, but safe)
      try {
        return JSON.stringify(raw)
      } catch {
        return String(raw)
      }
    }

    // primitives
    return String(raw)
  }

  // SEARCH
  const searchableCells = dataCell.filter(
    (c) => (c.searchable ?? true) === true
  )
  const filtered = useMemo(() => {
    if (!searchValue) return records
    const q = searchValue.toLowerCase().trim()
    return records.filter((row) => {
      for (const cell of searchableCells) {
        const v = resolveCellValue(row, cell)
        const searchStr = getStringValue(v)
        if (searchStr.toLowerCase().includes(q)) return true
      }
      return false
    })
  }, [records, searchValue, dataCell])

  // SORT
  const sorted = useMemo(() => {
    if (!sortConfig.key) return filtered
    const arr = [...filtered]
    arr.sort((a, b) => {
      let valA: any, valB: any
      if (typeof sortConfig.key === 'function') {
        valA = sortConfig.key(a)
        valB = sortConfig.key(b)
      } else {
        // find matching column by accessVar or headingTitle
        const col = dataCell.find(
          (c) =>
            (typeof c.accessVar === 'string' &&
              c.accessVar === sortConfig.key) ||
            c.headingTitle === sortConfig.key
        )
        if (col) {
          valA = resolveCellValue(a, col)
          valB = resolveCellValue(b, col)
        } else {
          valA = getNestedValue(String(sortConfig.key), a)
          valB = getNestedValue(String(sortConfig.key), b)
        }
      }

      // Convert to sortable strings
      const strA = getStringValue(valA)
      const strB = getStringValue(valB)

      if (!strA && !strB) return 0
      if (!strA) return 1
      if (!strB) return -1

      // Try numeric comparison first
      const numA = Number(strA)
      const numB = Number(strB)
      if (!isNaN(numA) && !isNaN(numB)) {
        return sortConfig.direction === 'asc' ? numA - numB : numB - numA
      }

      // String comparison
      return sortConfig.direction === 'asc'
        ? strA.localeCompare(strB)
        : strB.localeCompare(strA)
    })
    return arr
  }, [filtered, sortConfig, dataCell])

  // PAGINATION
  const totalPages = Math.max(1, Math.ceil(sorted.length / itemsPerPage))
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1)
  }, [totalPages])

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return sorted.slice(start, start + itemsPerPage)
  }, [sorted, currentPage, itemsPerPage])

  // helpers
  const onSort = (cell: DataCell) => {
    if (cell.sortable === false) return
    const key = cell.accessVar ?? cell.headingTitle
    setSortConfig((prev) => {
      if (prev.key === key)
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
      return { key, direction: 'asc' }
    })
  }

  // Get base className for consistent width and alignment
  const getColumnClassName = (cell: DataCell) => {
    // fallback is compact; your cells can override via className
    const base = cell.className ?? 'min-w-[104px] w-[104px] max-w-[104px]'
    // flex-none/shrink-0 = identical column width in header & body
    return `flex-none shrink-0 ${base}`
  }

  const renderHeaderCell = (cell: DataCell, idx: number) => (
    <div
      key={cell.headingTitle + idx}
      className={`px-1 ${getColumnClassName(cell)}`}
      onClick={() => onSort(cell)}
      role={cell.sortable === false ? undefined : 'button'}
    >
      <div className="flex cursor-pointer items-center gap-1 select-none">
        <p
          className={`text-sm font-semibold text-slate-800 ${sortConfig.key === (cell.accessVar ?? cell.headingTitle) ? 'font-bold' : ''}`}
        >
          {cell.headingTitle}
        </p>
        {cell.sortable !== false && (
          <img
            src="/icons/dropdown.svg"
            alt="sort"
            className={`h-4 w-4 transition-transform ${sortConfig.key === (cell.accessVar ?? cell.headingTitle) && sortConfig.direction === 'desc' ? 'rotate-180' : ''}`}
          />
        )}
      </div>
    </div>
  )

  const hasActions = onEdit || onDelete || onView

  const headerAction = hasActions ? (
    <div
      className="flex min-w-max flex-col items-start"
      ref={headerActionRef}
      style={{
        width:
          actionWidth !== null
            ? `${actionWidth}px`
            : !isWidthSynced
              ? `${isMasterTable ? estimatedActionWidth / 1.5 : estimatedActionWidth}px`
              : undefined,
      }}
    >
      <p className="px-3 text-sm font-semibold text-zinc-900">Action</p>
    </div>
  ) : null

  const defaultRowKey = (r: any, i: number) =>
    rowKey ? rowKey(r, i) : (r.id ?? r.code ?? i)
  const skeletonCount = isLoading ? itemsPerPage || skeletonRows : 0

  return (
    <div
      className={`flex flex-col justify-between rounded-[12px] bg-white py-4 ${className}`}
    >
      <div className="body-contaienr flex flex-col gap-0">
        {/* controls */}
        <header className="mb-3 flex w-full items-center justify-between px-4">
          <section className="flex items-center gap-2">
            <SearchSm
              placeholder="Search"
              onChange={(e: any) => {
                setSearchValue(e.target.value)
                setCurrentPage(1)
              }}
              inputValue={searchValue}
              onSearch={() => {}}
              onClear={() => {
                setSearchValue('')
                setCurrentPage(1)
              }}
            />

            <DropdownSelect
              title=""
              direction="down"
              options={itemsPerPageOptions.map((item) => ({
                id: item,
                label: `${item} Entries`,
              }))}
              selected={{ id: itemsPerPage, label: `${itemsPerPage} Entries` }}
              onChange={(e: any) => {
                setItemsPerPage(e.id)
                setCurrentPage(1)
              }}
            />
          </section>
          <div className="ml-auto flex items-center gap-2">
            {newItemLink && (
              <ButtonSm
                className="py-3 text-white"
                state="default"
                text="New"
                onClick={() => nav(newItemLink)}
              />
            )}
            <PaginationControls
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
          <div />
        </header>

        {/* table */}
        <div className="tables flex min-h-[300px] w-full flex-col overflow-x-auto bg-white md:overflow-x-auto">
          <header className="header flex w-full flex-row items-center justify-between gap-2 bg-slate-50 px-3 py-3">
            <div className="flex w-[56px] max-w-[56px] min-w-[56px] flex-none shrink-0 items-center justify-start gap-2 px-1.5">
              <p className="text-sm font-semibold text-zinc-900">S.No</p>
            </div>

            {dataCell.map((cell, idx) => renderHeaderCell(cell, idx))}

            {hasActions && headerAction}
          </header>

          {/* skeleton */}
          {isLoading && (
            <div>
              {Array.from({ length: skeletonCount }).map((_, rIdx) => (
                <div
                  key={rIdx}
                  className="flex w-full flex-row items-center justify-between border-b border-slate-200 px-3 py-2"
                >
                  <div className="flex w-8 min-w-8 items-center justify-start gap-2 pt-1 pl-1.5">
                    <ShimmerBox className="h-4 w-10" />
                  </div>

                  {dataCell.map((cell, cIdx) => (
                    <div
                      key={cIdx}
                      className={`px-1 pt-1 ${getColumnClassName(cell)}`}
                    >
                      <ShimmerBox className="h-4 w-full max-w-28" />
                    </div>
                  ))}

                  {hasActions && (
                    <div
                      className="flex min-w-max items-center gap-2 px-1"
                      style={{
                        width:
                          actionWidth !== null
                            ? `${actionWidth}px`
                            : `${estimatedActionWidth}px`,
                      }}
                    >
                      {onView && !isMasterTable && (
                        <ShimmerBox className="h-4 w-20" />
                      )}
                      {onEdit && <ShimmerBox className="h-4 w-20" />}
                      {onDelete && <ShimmerBox className="h-4 w-20" />}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* no data */}
          {!isLoading && paginated.length === 0 && (
            <h2 className="text-md my-3 text-center font-medium text-zinc-600">
              No Records Found
            </h2>
          )}

          {/* rows */}
          {!isLoading &&
            paginated.map((row, idx) => (
              <div
                style={{
                  cursor: isMasterTable ? 'pointer' : 'auto',
                }}
                onClick={(e) => {
                  if (isMasterTable && onView) {
                    e.stopPropagation()
                    onView(row)
                  }
                }}
                key={defaultRowKey(row, idx)}
                className="flex w-full flex-row items-center justify-between gap-2 border-b border-slate-200 px-3 py-2 text-sm text-zinc-700 hover:bg-slate-50"
              >
                <div className="flex w-[56px] max-w-[56px] min-w-[56px] flex-none shrink-0 items-center justify-start gap-2 pt-1 pl-1.5">
                  <p>{(currentPage - 1) * itemsPerPage + idx + 1}</p>
                </div>

                {dataCell.map((cell, cIdx) => {
                  const value = resolveCellValue(row, cell)
                  return (
                    <div
                      key={cell.headingTitle + cIdx}
                      className={`px-2 pt-1 ${getColumnClassName(cell)}`}
                    >
                      <div className="text-left text-sm leading-tight font-medium break-words whitespace-normal">
                        {cell.render ? (
                          cell.render(value, row, idx)
                        ) : (
                          <span>
                            {Array.isArray(value)
                              ? (value[1] ?? value[0] ?? '-')
                              : value == null
                                ? '-'
                                : String(value)}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}

                {hasActions && (
                  <div
                    className="flex min-w-max flex-row items-center gap-2 px-2"
                    ref={(el) => {
                      if (el) actionBodyRefs.current.push(el)
                    }}
                  >
                    {onView && !isMasterTable && (
                      <ButtonSm
                        className="aspect-square bg-white outline-1 outline-white"
                        onClick={(e) => {
                          e.stopPropagation()
                          onView(row)
                        }}
                        iconPosition="right"
                        state="outline"
                      >
                        <EyeIcon size={14} />
                      </ButtonSm>
                    )}
                    {onEdit && (
                      <ButtonSm
                        className="aspect-square bg-white outline-1 outline-white"
                        onClick={(e) => {
                          e.stopPropagation()
                          onEdit(row)
                        }}
                        state="outline"
                      >
                        <Edit2 size={14} />
                      </ButtonSm>
                    )}
                    {onDelete && (
                      <ButtonSm
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete(row)
                        }}
                        className="aspect-square bg-white text-red-500 shadow-sm outline-1 outline-white hover:bg-red-100 hover:text-red-500 active:bg-red-100 active:text-red-500"
                        state="default"
                      >
                        <Trash2 size={14} />
                      </ButtonSm>
                    )}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* footer pagination */}
      <footer className="container mt-3 flex min-w-full flex-row items-center gap-2 self-end px-4 py-2">
        <div className="h-[10px] w-[10px] rounded-full bg-blue-500" />
        <div className="text-sm text-zinc-600">
          Showing {(currentPage - 1) * itemsPerPage + 1} -{' '}
          {Math.min(currentPage * itemsPerPage, sorted.length)} of{' '}
          {sorted.length}
        </div>
      </footer>
    </div>
  )
}
