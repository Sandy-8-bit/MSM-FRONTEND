/* eslint-disable @typescript-eslint/no-explicit-any */
// GenericTable.tsx - Enhanced version with improved code quality and documentation
import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Component imports - Replace these with your actual component paths if different
import SearchSm from "@/components/common/SearchSm";
import ButtonSm from "./Buttons";
import DropdownSelect from "./DropDown";
import PaginationControls from "./Pagination";
import CheckboxInput from "./CheckBox";
import { Edit2, EyeIcon, Trash2 } from "lucide-react";

/**
 * Animation configuration for shimmer effect in skeleton loading
 * Creates a smooth opacity transition for loading states
 */
const shimmerAnimationConfig = {
  initial: { opacity: 0.3 },
  animate: {
    opacity: [0.3, 0.6, 0.3],
    transition: { duration: 1.2, repeat: Infinity },
  },
};

/**
 * ShimmerBox Component - Creates animated placeholder boxes for skeleton loading
 * @param className - Additional CSS classes for styling
 */
const ShimmerBox = ({ className }: { className?: string }) => (
  <motion.div
    className={`relative overflow-hidden rounded bg-gray-200 ${className ?? ""}`}
    variants={shimmerAnimationConfig}
    initial="initial"
    animate="animate"
  >
    {/* Moving gradient overlay that creates the shimmer effect */}
    <motion.div
      className="absolute top-0 left-[-50%] h-full w-[200%] bg-gradient-to-r from-transparent via-white/40 to-transparent"
      animate={{ left: ["-50%", "100%"] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
    />
  </motion.div>
);

/**
 * DataCell Configuration Interface
 * Defines how each column should be rendered and behave
 *
 * @param headingTitle - Column header display text
 * @param accessVar - Property path (e.g., 'user.name' or 'items[0]') or function to extract data
 * @param className - Custom CSS classes for column styling
 * @param sortable - Whether this column can be sorted (default: true)
 * @param searchable - Whether this column is included in search (default: true)
 * @param isArray - If true and value is array, automatically uses value[1] as display value
 * @param render - Custom render function: (cellValue, rowData, rowIndex) => ReactNode
 */
export type DataCell = {
  headingTitle: string;
  accessVar?: string | ((row: any) => any);
  className?: string;
  sortable?: boolean;
  searchable?: boolean;
  isArray?: boolean;
  render?: (value: any, row: any, index: number) => React.ReactNode;
};

/**
 * Main GenericTable Component Props Interface
 * Provides comprehensive configuration options for the table
 */
export interface GenericTableProps {
  // Core data - can be simple array or object with records and totalRecords
  data: any[] | { records: any[]; totalRecords?: number };

  // Column configuration array
  dataCell: DataCell[];

  // Loading and display states
  isLoading?: boolean;
  isMasterTable?: boolean; // If true, entire row becomes clickable and calls onView

  // Pagination configuration
  itemsPerPageOptions?: number[];
  defaultItemsPerPage?: number;

  // Navigation and actions
  newItemLink?: string; // If provided, shows "New" button that navigates to this path
  actionWidth?: number | null; // Custom width for action column
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onView?: (row: any) => void;

  // UI customization
  skeletonRows?: number; // Number of skeleton rows to show when loading
  tableTitle?: string; // Currently unused - could be used for table header
  className?: string; // Additional CSS classes for table container

  // Row identification - used for React keys and selection
  rowKey?: (row: any, index: number) => string | number;

  // Selection functionality
  enableSelection?: boolean;
  initialSelectedIds?: Array<string | number>;
  onSelectedChange?: (
    selectedRows: any[],
    selectedIds: Array<string | number>,
  ) => void;
  getRowId?: (row: any, index: number) => string | number; // Alternative to rowKey for selection
}

/**
 * Imperative API interface for parent components to control table
 * Exposed through forwardRef
 */
export type GenericTableRef = {
  clearSelection: () => void;
  getSelectedIds: () => (string | number)[];
  getSelectedRows: () => any[];
  selectAllOnPage: () => void;
};

/**
 * Normalizes input data to consistent format
 * Handles both array inputs and object inputs with records property
 * @param input - Raw data input
 * @returns Normalized data object with records array and totalRecords count
 */
function normalizeDataToRecords(input: any): {
  records: any[];
  totalRecords?: number;
} {
  // Handle null/undefined input
  if (!input) return { records: [], totalRecords: 0 };

  // Handle direct array input
  if (Array.isArray(input)) {
    return { records: input, totalRecords: input.length };
  }

  // Handle object input with records property
  return {
    records: input.records || [],
    totalRecords: input.totalRecords ?? input.records?.length ?? 0,
  };
}

/**
 * Safely resolves nested object properties using dot notation or array indices
 * Supports paths like: 'user.name', 'items[0].title', 'data.users[1].profile.email'
 * @param propertyPath - The property path string
 * @param sourceObject - The object to extract value from
 * @returns The resolved value or undefined if path doesn't exist
 */
function getNestedPropertyValue(propertyPath: string, sourceObject: any): any {
  if (!propertyPath) return undefined;

  // Parse property path: split by dots and brackets, filter empty strings
  // 'user.items[0].name' becomes ['user', 'items', '0', 'name']
  const pathSegments = propertyPath
    .replace(/\]/g, "")
    .split(/\.|\[/)
    .filter(Boolean);

  let currentValue: any = sourceObject;

  // Traverse the path segments
  for (const segment of pathSegments) {
    if (currentValue == null) return undefined;

    // Check if segment is numeric (array index)
    const numericIndex = Number(segment);
    currentValue = isNaN(numericIndex)
      ? currentValue[segment] // Property access
      : currentValue[numericIndex]; // Array access
  }

  return currentValue;
}

/**
 * Main GenericTable Component
 * A comprehensive, reusable table component with search, sort, pagination, and selection
 */
const GenericTable = forwardRef<GenericTableRef, GenericTableProps>(
  (
    {
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
      className = "",
      rowKey,
      enableSelection = false,
      initialSelectedIds = [],
      onSelectedChange,
      getRowId,
    },
    ref,
  ) => {
    const navigate = useNavigate();
    const { records: tableRecords } = normalizeDataToRecords(data);

    // State management for table functionality
    const [searchQuery, setSearchQuery] = useState("");
    const [recordsPerPage, setRecordsPerPage] = useState(defaultItemsPerPage);
    const [currentPageNumber, setCurrentPageNumber] = useState(1);

    // Sort configuration state
    const [sortConfiguration, setSortConfiguration] = useState<{
      key: string | ((r: any) => any) | null;
      direction: "asc" | "desc";
    }>({ key: null, direction: "asc" });

    // Width synchronization state (currently unused but kept for future enhancement)
    const [isActionWidthSynced] = useState(false);

    // Reset to first page when data changes
    useEffect(() => {
      setCurrentPageNumber(1);
    }, [tableRecords.length]);

    // References for action column width calculation
    const actionColumnBodyRefs = useRef<HTMLDivElement[]>([]);
    const actionColumnHeaderRef = useRef<HTMLDivElement>(null);

    /**
     * Calculates the estimated width needed for action buttons column
     * Based on the number of action buttons present
     */
    const calculatedActionColumnWidth = useMemo(() => {
      // Use custom width if provided
      if (actionWidth !== null) return actionWidth;

      // Count active action buttons
      let activeActionCount = 0;
      if (onView) activeActionCount++;
      if (onEdit) activeActionCount++;
      if (onDelete) activeActionCount++;

      // No actions = no width needed
      if (activeActionCount === 0) return 0;

      // Estimate width: each button ~36px + 8px gap between + padding
      const estimatedWidth =
        activeActionCount * 36 + (activeActionCount - 1) * 8 + 16;
      return estimatedWidth;
    }, [onView, onEdit, onDelete, actionWidth]);

    /**
     * Central value resolver for table cells
     * Handles different data access patterns and array handling
     * @param rowData - The row object
     * @param cellConfig - The column configuration
     * @returns The resolved cell value (raw for render functions)
     */
    const resolveCellValue = (rowData: any, cellConfig: DataCell): any => {
      let resolvedValue: any;

      try {
        if (typeof cellConfig.accessVar === "function") {
          // Function-based value extraction
          resolvedValue = cellConfig.accessVar(rowData);
        } else if (cellConfig.accessVar) {
          // String path-based value extraction
          resolvedValue = getNestedPropertyValue(
            String(cellConfig.accessVar),
            rowData,
          );
        } else {
          // No accessor defined
          resolvedValue = undefined;
        }
      } catch {
        // Safely handle any extraction errors
        resolvedValue = undefined;
      }

      // Handle array values when explicitly marked as array column
      if (cellConfig.isArray && Array.isArray(resolvedValue)) {
        // Prefer index 1, fallback to index 0, then empty string
        return resolvedValue[1] ?? resolvedValue[0] ?? "";
      }

      // Return raw value for render functions to handle appropriately
      return resolvedValue;
    };

    /**
     * Converts any value to a searchable/sortable string representation
     * Handles various data types gracefully
     * @param rawValue - The raw value to convert
     * @returns String representation suitable for search/sort operations
     */
    const convertValueToSearchableString = (rawValue: any): string => {
      if (rawValue === null || rawValue === undefined) return "";

      // Handle array values
      if (Array.isArray(rawValue)) {
        return String(rawValue[1] ?? rawValue[0] ?? "");
      }

      // Handle object values
      if (rawValue !== null && typeof rawValue === "object") {
        // Try common object properties first
        if ("name" in rawValue) return String((rawValue as any).name);
        if ("label" in rawValue) return String((rawValue as any).label);
        if ("title" in rawValue) return String((rawValue as any).title);

        // Fallback to JSON string representation
        try {
          return JSON.stringify(rawValue);
        } catch {
          return String(rawValue);
        }
      }

      // Handle primitive values
      return String(rawValue);
    };

    // Get columns that are searchable (default: all columns are searchable)
    const searchableColumns = dataCell.filter(
      (column) => (column.searchable ?? true) === true,
    );

    /**
     * Filter records based on search query
     * Searches across all searchable columns
     */
    const searchFilteredRecords = useMemo(() => {
      if (!searchQuery.trim()) return tableRecords;

      const normalizedSearchQuery = searchQuery.toLowerCase().trim();

      return tableRecords.filter((record) => {
        // Check if search query matches any searchable column
        for (const column of searchableColumns) {
          const cellValue = resolveCellValue(record, column);
          const searchableText = convertValueToSearchableString(cellValue);

          if (searchableText.toLowerCase().includes(normalizedSearchQuery)) {
            return true;
          }
        }
        return false;
      });
    }, [tableRecords, searchQuery, dataCell]);

    /**
     * Sort the filtered records based on sort configuration
     */
    const sortedAndFilteredRecords = useMemo(() => {
      if (!sortConfiguration.key) return searchFilteredRecords;

      const recordsToSort = [...searchFilteredRecords];

      recordsToSort.sort((recordA, recordB) => {
        let valueA: any, valueB: any;

        if (typeof sortConfiguration.key === "function") {
          // Function-based sorting
          valueA = sortConfiguration.key(recordA);
          valueB = sortConfiguration.key(recordB);
        } else {
          // Find matching column configuration
          const matchingColumn = dataCell.find(
            (column) =>
              (typeof column.accessVar === "string" &&
                column.accessVar === sortConfiguration.key) ||
              column.headingTitle === sortConfiguration.key,
          );

          if (matchingColumn) {
            valueA = resolveCellValue(recordA, matchingColumn);
            valueB = resolveCellValue(recordB, matchingColumn);
          } else {
            // Fallback to direct property access
            valueA = getNestedPropertyValue(
              String(sortConfiguration.key),
              recordA,
            );
            valueB = getNestedPropertyValue(
              String(sortConfiguration.key),
              recordB,
            );
          }
        }

        // Convert values to comparable strings
        const stringA = convertValueToSearchableString(valueA);
        const stringB = convertValueToSearchableString(valueB);

        // Handle empty values
        if (!stringA && !stringB) return 0;
        if (!stringA) return 1; // Empty values go to end
        if (!stringB) return -1;

        // Attempt numeric comparison first
        const numericA = Number(stringA);
        const numericB = Number(stringB);

        if (!isNaN(numericA) && !isNaN(numericB)) {
          return sortConfiguration.direction === "asc"
            ? numericA - numericB
            : numericB - numericA;
        }

        // Fall back to string comparison
        const comparisonResult = stringA.localeCompare(stringB);
        return sortConfiguration.direction === "asc"
          ? comparisonResult
          : -comparisonResult;
      });

      return recordsToSort;
    }, [searchFilteredRecords, sortConfiguration, dataCell]);

    // Calculate pagination values
    const totalPagesCount = Math.max(
      1,
      Math.ceil(sortedAndFilteredRecords.length / recordsPerPage),
    );

    // Reset to first page if current page exceeds total pages
    useEffect(() => {
      if (currentPageNumber > totalPagesCount) {
        setCurrentPageNumber(1);
      }
    }, [totalPagesCount]);

    /**
     * Get records for current page
     */
    const currentPageRecords = useMemo(() => {
      const startIndex = (currentPageNumber - 1) * recordsPerPage;
      const endIndex = startIndex + recordsPerPage;
      return sortedAndFilteredRecords.slice(startIndex, endIndex);
    }, [sortedAndFilteredRecords, currentPageNumber, recordsPerPage]);

    /**
     * Handle column sorting
     * Toggles sort direction if same column, otherwise sets new column with ascending order
     */
    const handleColumnSort = (columnConfig: DataCell) => {
      if (columnConfig.sortable === false) return;

      const sortKey = columnConfig.accessVar ?? columnConfig.headingTitle;

      setSortConfiguration((previousConfig) => {
        if (previousConfig.key === sortKey) {
          // Toggle direction for same column
          return {
            key: sortKey,
            direction: previousConfig.direction === "asc" ? "desc" : "asc",
          };
        }
        // New column - start with ascending
        return { key: sortKey, direction: "asc" };
      });
    };

    /**
     * Get CSS classes for consistent column width and alignment
     */
    const getColumnCssClasses = (columnConfig: DataCell) => {
      // Use custom className or default to compact width
      const baseClasses =
        columnConfig.className ?? "min-w-[104px] w-[104px] max-w-[104px]";
      // flex-none ensures consistent column widths between header and body
      return `flex-none shrink-0 ${baseClasses}`;
    };

    /**
     * Selection functionality
     * Resolves a stable ID for each row for selection tracking
     */
    const resolveUniqueRowId = (rowData: any, rowIndex: number) => {
      if (typeof getRowId === "function") return getRowId(rowData, rowIndex);
      if (typeof rowKey === "function") return rowKey(rowData, rowIndex);
      // Fallback to common ID properties or index
      return rowData?.id ?? rowData?.code ?? rowIndex;
    };

    // Selection state using Set for O(1) operations
    const [selectedRowIds, setSelectedRowIds] = useState<Set<string | number>>(
      new Set(initialSelectedIds),
    );

    // Get IDs of all rows on current page
    const currentPageRowIds = useMemo(
      () =>
        currentPageRecords.map((record, index) =>
          resolveUniqueRowId(record, index),
        ),
      [currentPageRecords, rowKey, getRowId],
    );

    // Check if all rows on current page are selected
    const areAllRowsSelectedOnCurrentPage = useMemo(
      () =>
        currentPageRowIds.length > 0 &&
        currentPageRowIds.every((rowId) => selectedRowIds.has(rowId)),
      [currentPageRowIds, selectedRowIds],
    );

    /**
     * Toggle selection state for a single row
     */
    const toggleRowSelection = (rowData: any, rowIndex: number) => {
      const rowId = resolveUniqueRowId(rowData, rowIndex);
      setSelectedRowIds((previousSelection) => {
        const newSelection = new Set(previousSelection);
        if (newSelection.has(rowId)) {
          newSelection.delete(rowId);
        } else {
          newSelection.add(rowId);
        }
        return newSelection;
      });
    };

    /**
     * Toggle selection for all rows on current page
     * Wrapped in useCallback to prevent unnecessary re-renders
     */
    const toggleSelectAllOnCurrentPage = useCallback(() => {
      setSelectedRowIds((previousSelection) => {
        const newSelection = new Set(previousSelection);
        if (areAllRowsSelectedOnCurrentPage) {
          // Deselect all on current page
          currentPageRowIds.forEach((rowId) => newSelection.delete(rowId));
        } else {
          // Select all on current page
          currentPageRowIds.forEach((rowId) => newSelection.add(rowId));
        }
        return newSelection;
      });
    }, [areAllRowsSelectedOnCurrentPage, currentPageRowIds]);

    /**
     * Clear all selections
     */
    const clearAllSelections = () => setSelectedRowIds(new Set());

    /**
     * Get currently selected row objects
     */
    const selectedRowObjects = useMemo(
      () =>
        tableRecords.filter((record, index) =>
          selectedRowIds.has(resolveUniqueRowId(record, index)),
        ),
      [tableRecords, selectedRowIds, rowKey, getRowId],
    );

    // Notify parent component whenever selection changes
    useEffect(() => {
      if (onSelectedChange) {
        onSelectedChange(selectedRowObjects, Array.from(selectedRowIds));
      }
    }, [selectedRowObjects, selectedRowIds]);

    /**
     * Expose imperative API for parent components
     */
    useImperativeHandle(
      ref,
      () => ({
        clearSelection: clearAllSelections,
        getSelectedIds: () => Array.from(selectedRowIds),
        getSelectedRows: () => selectedRowObjects,
        selectAllOnPage: toggleSelectAllOnCurrentPage,
      }),
      [selectedRowObjects, selectedRowIds, toggleSelectAllOnCurrentPage],
    );

    /**
     * Render a table header cell with sorting capability
     */
    const renderTableHeaderCell = (
      columnConfig: DataCell,
      columnIndex: number,
    ) => (
      <div
        key={columnConfig.headingTitle + columnIndex}
        className={`px-1 ${getColumnCssClasses(columnConfig)}`}
        onClick={() => handleColumnSort(columnConfig)}
        role={columnConfig.sortable === false ? undefined : "button"}
      >
        <div className="flex cursor-pointer items-center gap-1 select-none">
          <p
            className={`text-sm font-semibold text-slate-800 ${
              sortConfiguration.key ===
              (columnConfig.accessVar ?? columnConfig.headingTitle)
                ? "font-bold"
                : ""
            }`}
          >
            {columnConfig.headingTitle}
          </p>
          {columnConfig.sortable !== false && (
            <img
              src="/icons/dropdown.svg"
              alt="sort"
              className={`h-4 w-4 transition-transform ${
                sortConfiguration.key ===
                  (columnConfig.accessVar ?? columnConfig.headingTitle) &&
                sortConfiguration.direction === "desc"
                  ? "rotate-180"
                  : ""
              }`}
            />
          )}
        </div>
      </div>
    );

    // Check if any actions are available
    const hasActionButtons = onEdit || onDelete || onView;

    /**
     * Render action column header
     */
    const actionColumnHeader = hasActionButtons ? (
      <div
        className="flex min-w-max flex-col items-start"
        ref={actionColumnHeaderRef}
        style={{
          width:
            actionWidth !== null
              ? `${actionWidth}px`
              : !isActionWidthSynced
                ? `${isMasterTable ? calculatedActionColumnWidth / 1.5 : calculatedActionColumnWidth}px`
                : undefined,
        }}
      >
        <p className="px-3 text-sm font-semibold text-zinc-900">Action</p>
      </div>
    ) : null;

    /**
     * Default row key function when none provided
     */
    const getDefaultRowKey = (rowData: any, rowIndex: number) =>
      rowKey
        ? rowKey(rowData, rowIndex)
        : (rowData.id ?? rowData.code ?? rowIndex);

    // Calculate skeleton rows count for loading state
    const skeletonRowsCount = isLoading ? recordsPerPage || skeletonRows : 0;

    return (
      <div
        className={`flex flex-col justify-between rounded-[12px] bg-white py-4 ${className}`}
      >
        <div className="body-container flex flex-col gap-0">
          {/* Table Controls Header */}
          <header className="mb-3 flex w-full items-center justify-between px-4">
            {/* Left side controls - Search and Items per page */}
            <section className="flex items-center gap-2">
              <SearchSm
                placeholder="Search"
                onChange={(event: any) => {
                  setSearchQuery(event.target.value);
                  setCurrentPageNumber(1); // Reset to first page on search
                }}
                inputValue={searchQuery}
                onSearch={() => {}} // Search is handled by onChange
                onClear={() => {
                  setSearchQuery("");
                  setCurrentPageNumber(1);
                }}
              />

              <DropdownSelect
                title=""
                direction="down"
                options={itemsPerPageOptions.map((itemCount) => ({
                  id: itemCount,
                  label: `${itemCount} Entries`,
                }))}
                selected={{
                  id: recordsPerPage,
                  label: `${recordsPerPage} Entries`,
                }}
                onChange={(selectedOption: any) => {
                  setRecordsPerPage(selectedOption.id);
                  setCurrentPageNumber(1); // Reset to first page when changing items per page
                }}
              />
            </section>

            {/* Right side controls - New button, Selection indicator, Pagination */}
            <div className="ml-auto flex items-center gap-2">
              {/* New Item Button */}
              {newItemLink && (
                <ButtonSm
                  className="py-3 text-white"
                  state="default"
                  text="New"
                  onClick={() => navigate(newItemLink)}
                />
              )}

              {/* Selection Status Indicator */}
              {enableSelection && selectedRowIds.size > 0 && (
                <div className="ml-2 flex flex-row items-center gap-2 rounded-md border border-blue-500 bg-blue-500/10 px-2 py-1">
                  <span className="text-sm font-medium text-blue-600">
                    Selected {selectedRowIds.size}
                  </span>
                  <img
                    onClick={clearAllSelections}
                    src="/icons/chip-x-icon.svg"
                    alt="Clear Selection"
                    className="h-4 w-4 cursor-pointer transition-transform hover:scale-110"
                  />
                </div>
              )}

              {/* Pagination Controls */}
              <PaginationControls
                totalPages={totalPagesCount}
                currentPage={currentPageNumber}
                onPageChange={setCurrentPageNumber}
              />
            </div>
            <div />
          </header>

          {/* Main Table Container */}
          <div className="tables flex min-h-[300px] w-full flex-col overflow-x-auto bg-white md:overflow-x-auto">
            {/* Table Header */}
            <header className="header flex w-full flex-row items-center justify-between gap-2 bg-slate-50 px-3 py-3">
              {/* Serial Number Column with optional Selection Checkbox */}
              <div
                className={`flex ${
                  enableSelection
                    ? "w-[88px] max-w-[88px] min-w-[88px]"
                    : "w-[56px] max-w-[56px] min-w-[56px]"
                } flex-none shrink-0 items-center justify-start gap-2 px-1.5`}
              >
                <p className="text-sm font-semibold text-zinc-900">S.No</p>
                {enableSelection && (
                  <CheckboxInput
                    checked={areAllRowsSelectedOnCurrentPage}
                    onChange={toggleSelectAllOnCurrentPage}
                    label=""
                  />
                )}
              </div>

              {/* Data Column Headers */}
              {dataCell.map((columnConfig, columnIndex) =>
                renderTableHeaderCell(columnConfig, columnIndex),
              )}

              {/* Action Column Header */}
              {hasActionButtons && actionColumnHeader}
            </header>

            {/* Loading Skeleton Rows */}
            {isLoading && (
              <div>
                {Array.from({ length: skeletonRowsCount }).map(
                  (_, skeletonRowIndex) => (
                    <div
                      key={skeletonRowIndex}
                      className="flex w-full flex-row items-center justify-between border-b border-slate-200 px-3 py-2"
                    >
                      {/* Skeleton Serial Number Column */}
                      <div className="flex w-8 min-w-8 items-center justify-start gap-2 pt-1 pl-1.5">
                        <ShimmerBox className="h-4 w-10" />
                      </div>

                      {/* Skeleton Data Columns */}
                      {dataCell.map((columnConfig, columnIndex) => (
                        <div
                          key={columnIndex}
                          className={`px-1 pt-1 ${getColumnCssClasses(columnConfig)}`}
                        >
                          <ShimmerBox className="h-4 w-full max-w-28" />
                        </div>
                      ))}

                      {/* Skeleton Action Buttons */}
                      {hasActionButtons && (
                        <div
                          className="flex min-w-max items-center gap-2 px-1"
                          style={{
                            width:
                              actionWidth !== null
                                ? `${actionWidth}px`
                                : `${calculatedActionColumnWidth}px`,
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
                  ),
                )}
              </div>
            )}

            {/* No Data Message */}
            {!isLoading && currentPageRecords.length === 0 && (
              <h2 className="text-md my-3 text-center font-medium text-zinc-600">
                No Records Found
              </h2>
            )}

            {/* Table Data Rows */}
            {!isLoading &&
              currentPageRecords.map((rowData, rowIndex) => (
                <div
                  style={{
                    cursor: isMasterTable ? "pointer" : "auto",
                  }}
                  onClick={(event) => {
                    if (isMasterTable && onView) {
                      event.stopPropagation();
                      onView(rowData);
                    }
                  }}
                  key={getDefaultRowKey(rowData, rowIndex)}
                  className="flex w-full flex-row items-center justify-between gap-2 border-b border-slate-200 px-3 py-2 text-sm text-zinc-700 hover:bg-slate-50"
                >
                  {/* Serial Number Column with optional Selection Checkbox */}
                  <div
                    className={`flex ${
                      enableSelection
                        ? "w-[88px] max-w-[88px] min-w-[88px]"
                        : "w-[56px] max-w-[56px] min-w-[56px]"
                    } flex-none shrink-0 items-center justify-start gap-2 pt-1 pl-1.5`}
                  >
                    <p className="w-10">
                      {(currentPageNumber - 1) * recordsPerPage + rowIndex + 1}
                    </p>

                    {enableSelection && (
                      <CheckboxInput
                        checked={selectedRowIds.has(
                          resolveUniqueRowId(rowData, rowIndex),
                        )}
                        onChange={(event: any) => {
                          event.stopPropagation?.();
                          toggleRowSelection(rowData, rowIndex);
                        }}
                        label=""
                      />
                    )}
                  </div>

                  {/* Data Columns */}
                  {dataCell.map((columnConfig, columnIndex) => {
                    const cellValue = resolveCellValue(rowData, columnConfig);
                    return (
                      <div
                        key={columnConfig.headingTitle + columnIndex}
                        className={`px-2 pt-1 ${getColumnCssClasses(columnConfig)}`}
                      >
                        <div className="text-left text-sm leading-tight font-medium break-words whitespace-normal">
                          {columnConfig.render ? (
                            // Use custom render function if provided
                            columnConfig.render(cellValue, rowData, rowIndex)
                          ) : (
                            // Default rendering logic
                            <span>
                              {Array.isArray(cellValue)
                                ? (cellValue[1] ?? cellValue[0] ?? "-")
                                : cellValue == null
                                  ? "-"
                                  : String(cellValue)}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Action Buttons Column */}
                  {hasActionButtons && (
                    <div
                      className="flex min-w-max flex-row items-center gap-2 px-2"
                      ref={(element) => {
                        if (element) actionColumnBodyRefs.current.push(element);
                      }}
                    >
                      {/* View Button - Hidden in master table mode since entire row is clickable */}
                      {onView && !isMasterTable && (
                        <ButtonSm
                          className="aspect-square bg-white outline-1 outline-white"
                          onClick={(event) => {
                            event.stopPropagation();
                            onView(rowData);
                          }}
                          iconPosition="right"
                          state="outline"
                        >
                          <EyeIcon size={14} />
                        </ButtonSm>
                      )}

                      {/* Edit Button */}
                      {onEdit && (
                        <ButtonSm
                          className="aspect-square bg-white outline-1 outline-white"
                          onClick={(event) => {
                            event.stopPropagation();
                            onEdit(rowData);
                          }}
                          state="outline"
                        >
                          <Edit2 size={14} />
                        </ButtonSm>
                      )}

                      {/* Delete Button */}
                      {onDelete && (
                        <ButtonSm
                          onClick={(event) => {
                            event.stopPropagation();
                            onDelete(rowData);
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

        {/* Table Footer with Record Count Information */}
        <footer className="container mt-3 flex min-w-full flex-row items-center gap-2 self-end px-4 py-2">
          {/* Visual indicator dot */}
          <div className="h-[10px] w-[10px] rounded-full bg-blue-500" />

          {/* Record count display */}
          <div className="text-sm text-zinc-600">
            Showing {(currentPageNumber - 1) * recordsPerPage + 1} -{" "}
            {Math.min(
              currentPageNumber * recordsPerPage,
              sortedAndFilteredRecords.length,
            )}{" "}
            of {sortedAndFilteredRecords.length}
          </div>
        </footer>
      </div>
    );
  },
);

// Set display name for better debugging experience
GenericTable.displayName = "GenericTable";

export default GenericTable;
