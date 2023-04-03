// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useImperativeHandle, useRef, useState, Ref, forwardRef } from 'react';
import { TableForwardRefType, TableProps } from './interfaces';
import { getVisualContextClassname } from '../internal/components/visual-context';
import InternalContainer from '../container/internal';
import { getBaseProps } from '../internal/base-component';
import ToolsHeader from './tools-header';
import Thead, { TheadProps } from './thead';
import { TableBodyCell } from './body-cell';
import InternalStatusIndicator from '../status-indicator/internal';
import { useContainerQuery } from '../internal/hooks/container-queries';
import { supportsStickyPosition } from '../internal/utils/dom';
import SelectionControl from './selection-control';
import { checkSortingState, getColumnKey, getItemKey, toContainerVariant } from './utils';
import { useRowEvents } from './use-row-events';
import { focusMarkers, useFocusMove, useSelection } from './use-selection';
import { fireCancelableEvent, fireNonCancelableEvent } from '../internal/events';
import { isDevelopment } from '../internal/is-development';
import { checkColumnWidths, ColumnWidthsProvider, DEFAULT_WIDTH } from './use-column-widths';
import { useScrollSync } from '../internal/hooks/use-scroll-sync';
import { ResizeTracker } from './resizer';
import styles from './styles.css.js';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import StickyHeader, { StickyHeaderRef } from './sticky-header';
import StickyScrollbar from './sticky-scrollbar';
import useFocusVisible from '../internal/hooks/focus-visible';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import useMouseDownTarget from '../internal/hooks/use-mouse-down-target';
import { useDynamicOverlap } from '../internal/hooks/use-dynamic-overlap';
import LiveRegion from '../internal/components/live-region';
import useTableFocusNavigation from './use-table-focus-navigation';
import { SomeRequired } from '../internal/types';
import { TableTdElement } from './body-cell/td-element';
import { useStickyColumns } from './use-sticky-columns';

type InternalTableProps<T> = SomeRequired<TableProps<T>, 'items' | 'selectedItems' | 'variant'> &
  InternalBaseComponentProps;

export interface CellWidths {
  start: number[];
  end: number[];
}

const InternalTable = forwardRef(
  <T,>(
    {
      header,
      footer,
      empty,
      filter,
      pagination,
      preferences,
      items,
      columnDefinitions,
      trackBy,
      loading,
      loadingText,
      selectionType,
      selectedItems,
      isItemDisabled,
      ariaLabels,
      onSelectionChange,
      onSortingChange,
      sortingColumn,
      sortingDescending,
      sortingDisabled,
      visibleColumns,
      stickyColumns,
      stickyHeader,
      stickyHeaderVerticalOffset,
      onRowClick,
      onRowContextMenu,
      wrapLines,
      stripedRows,
      contentDensity,
      submitEdit,
      onEditCancel,
      resizableColumns,
      onColumnWidthsChange,
      variant,
      __internalRootRef,
      totalItemsCount,
      firstIndex,
      renderAriaLive,
      ...rest
    }: InternalTableProps<T>,
    ref: Ref<TableProps.Ref>
  ) => {
    const baseProps = getBaseProps(rest);
    stickyHeader = stickyHeader && supportsStickyPosition();

    const [containerWidth, wrapperMeasureRef] = useContainerQuery<number>(({ width }) => width);
    const wrapperRefObject = useRef(null);
    const wrapperRef = useMergeRefs(wrapperMeasureRef, wrapperRefObject);

    const [tableWidth, tableMeasureRef] = useContainerQuery<number>(({ width }) => width);
    const tableRefObject = useRef(null);
    const tableRef = useMergeRefs(tableMeasureRef, tableRefObject);
    const secondaryWrapperRef = useRef<HTMLDivElement>(null);
    const theadRef = useRef<HTMLTableRowElement>(null);
    const stickyHeaderRef = useRef<StickyHeaderRef>(null);
    const scrollbarRef = useRef<HTMLDivElement>(null);

    const [currentEditCell, setCurrentEditCell] = useState<[number, number] | null>(null);
    const [currentEditLoading, setCurrentEditLoading] = useState(false);
    useImperativeHandle(
      ref,
      () => ({
        scrollToTop: stickyHeaderRef.current?.scrollToTop || (() => undefined),
        cancelEdit: () => setCurrentEditCell(null),
      }),
      []
    );

    const handleScroll = useScrollSync(
      [wrapperRefObject, scrollbarRef, secondaryWrapperRef],
      !supportsStickyPosition()
    );

    const { moveFocusDown, moveFocusUp, moveFocus } = useFocusMove(selectionType, items.length);
    const { onRowClickHandler, onRowContextMenuHandler } = useRowEvents({ onRowClick, onRowContextMenu });
    const visibleColumnDefinitions = visibleColumns
      ? columnDefinitions.filter(column => column.id && visibleColumns.indexOf(column.id) !== -1)
      : columnDefinitions;
    const visibleColumnsLength = visibleColumnDefinitions.length;

    const { isItemSelected, selectAllProps, getItemSelectionProps, updateShiftToggle } = useSelection({
      items,
      trackBy,
      selectedItems,
      selectionType,
      isItemDisabled,
      onSelectionChange,
      ariaLabels,
    });
    if (loading) {
      selectAllProps.disabled = true;
    }

    if (isDevelopment) {
      if (resizableColumns) {
        checkColumnWidths(columnDefinitions);
      }
      if (sortingColumn?.sortingComparator) {
        checkSortingState(columnDefinitions, sortingColumn.sortingComparator);
      }
    }

    const isVisualRefresh = useVisualRefresh();
    const computedVariant = isVisualRefresh
      ? variant
      : ['embedded', 'full-page'].indexOf(variant) > -1
      ? 'container'
      : variant;
    const hasHeader = !!(header || filter || pagination || preferences);
    const hasSelection = !!selectionType;
    const hasFooter = !!footer;

    // Allows keyboard users to scroll horizontally with arrow keys by making the wrapper part of the tab sequence
    const isWrapperScrollable = !!tableWidth && !!containerWidth && tableWidth > containerWidth;
    const wrapperProps = isWrapperScrollable
      ? { role: 'region', tabIndex: 0, 'aria-label': ariaLabels?.tableLabel }
      : {};
    const focusVisibleProps = useFocusVisible();
    const getMouseDownTarget = useMouseDownTarget();
    const wrapWithInlineLoadingState = (submitEdit: TableProps['submitEdit']) => {
      if (!submitEdit) {
        return undefined;
      }
      return async (...args: Parameters<typeof submitEdit>) => {
        setCurrentEditLoading(true);
        try {
          await submitEdit(...args);
        } finally {
          setCurrentEditLoading(false);
        }
      };
    };

    const hasDynamicHeight = computedVariant === 'full-page';
    const overlapElement = useDynamicOverlap({ disabled: !hasDynamicHeight });

    const {
      tableCellRefs,
      cellWidths,
      setCellWidths,
      getStickyColumn,
      shouldDisableStickyColumns,
      startStickyColumnsWidth,
      endStickyColumnsWidth,
      isStuckToTheRight,
      isStuckToTheLeft,
      rightSentinelRef,
      leftSentinelRef,
    } = useStickyColumns({
      visibleColumnsLength,
      hasSelection,
      stickyColumns,
      containerWidth,
      tableRefObject,
      wrapperRefObject,
    });

    const disableStickyColumns = !isWrapperScrollable || shouldDisableStickyColumns;

    const theadProps: TheadProps = {
      containerWidth,
      selectionType,
      selectAllProps,
      columnDefinitions: visibleColumnDefinitions,
      variant: computedVariant,
      wrapLines,
      resizableColumns,
      sortingColumn,
      sortingDisabled,
      sortingDescending,
      onSortingChange,
      onFocusMove: moveFocus,
      onResizeFinish(newWidth) {
        const widthsDetail = columnDefinitions.map(
          (column, index) => newWidth[getColumnKey(column, index)] || (column.width as number) || DEFAULT_WIDTH
        );
        const widthsChanged = widthsDetail.some((width, index) => columnDefinitions[index].width !== width);
        if (widthsChanged) {
          fireNonCancelableEvent(onColumnWidthsChange, { widths: widthsDetail });
        }
      },
      singleSelectionHeaderAriaLabel: ariaLabels?.selectionGroupLabel,
      stripedRows,
      getStickyColumn: !disableStickyColumns ? getStickyColumn : undefined,
      tableCellRefs,
      setCellWidths,
      cellWidths,
      stickyColumns,
      visibleColumnsLength,
      isStuckToTheRight,
      isStuckToTheLeft,
    };
    useTableFocusNavigation(selectionType, tableRefObject, visibleColumnDefinitions, items?.length);
    return (
      <ColumnWidthsProvider
        tableRef={tableRefObject}
        visibleColumnDefinitions={visibleColumnDefinitions}
        resizableColumns={resizableColumns}
        hasSelection={hasSelection}
      >
        <InternalContainer
          {...baseProps}
          __internalRootRef={__internalRootRef}
          className={clsx(baseProps.className, styles.root)}
          header={
            <>
              {hasHeader && (
                <div
                  ref={overlapElement}
                  className={clsx(hasDynamicHeight && [styles['dark-header'], 'awsui-context-content-header'])}
                >
                  <div className={clsx(styles['header-controls'], styles[`variant-${computedVariant}`])}>
                    <ToolsHeader header={header} filter={filter} pagination={pagination} preferences={preferences} />
                  </div>
                </div>
              )}
              {stickyHeader && (
                <StickyHeader
                  ref={stickyHeaderRef}
                  variant={computedVariant}
                  theadProps={theadProps}
                  wrapperRef={wrapperRefObject}
                  theadRef={theadRef}
                  secondaryWrapperRef={secondaryWrapperRef}
                  tableRef={tableRefObject}
                  onScroll={handleScroll}
                  tableHasHeader={hasHeader}
                  contentDensity={contentDensity}
                />
              )}
            </>
          }
          disableHeaderPaddings={true}
          disableContentPaddings={true}
          variant={toContainerVariant(computedVariant)}
          __disableFooterPaddings={true}
          __disableFooterDivider={true}
          footer={
            footer && (
              <div className={clsx(styles['footer-wrapper'], styles[`variant-${computedVariant}`])}>
                <div className={styles.footer}>{footer}</div>
              </div>
            )
          }
          __stickyHeader={stickyHeader}
          __stickyOffset={stickyHeaderVerticalOffset}
          {...focusMarkers.root}
        >
          <div
            ref={wrapperRef}
            className={clsx(styles.wrapper, styles[`variant-${computedVariant}`], {
              [styles['has-footer']]: hasFooter,
              [styles['has-header']]: hasHeader,
            })}
            style={{ scrollPaddingLeft: startStickyColumnsWidth, scrollPaddingRight: endStickyColumnsWidth }}
            onScroll={handleScroll}
            {...wrapperProps}
            {...focusVisibleProps}
          >
            {!!renderAriaLive && !!firstIndex && (
              <LiveRegion>
                <span>{renderAriaLive({ totalItemsCount, firstIndex, lastIndex: firstIndex + items.length - 1 })}</span>
              </LiveRegion>
            )}
            <table
              ref={tableRef}
              className={clsx(
                styles.table,
                resizableColumns && styles['table-layout-fixed'],
                contentDensity === 'compact' && getVisualContextClassname('compact-table')
              )}
              // Browsers have weird mechanism to guess whether it's a data table or a layout table.
              // If we state explicitly, they get it always correctly even with low number of rows.
              role="table"
              aria-label={ariaLabels?.tableLabel}
              aria-rowcount={totalItemsCount ? totalItemsCount + 1 : -1}
            >
              <div className={styles['sentinel-left']} ref={leftSentinelRef} />
              <Thead
                ref={theadRef}
                hidden={stickyHeader}
                onFocusedComponentChange={component => stickyHeaderRef.current?.setFocus(component)}
                {...theadProps}
              />
              <tbody>
                {loading || items.length === 0 ? (
                  <tr>
                    <td
                      colSpan={selectionType ? visibleColumnDefinitions.length + 1 : visibleColumnDefinitions.length}
                      className={clsx(styles['cell-merged'], hasFooter && styles['has-footer'])}
                    >
                      <div
                        className={styles['cell-merged-content']}
                        style={{
                          width:
                            (supportsStickyPosition() && containerWidth && Math.floor(containerWidth)) || undefined,
                        }}
                      >
                        {loading ? (
                          <InternalStatusIndicator type="loading" className={styles.loading} wrapText={true}>
                            <LiveRegion visible={true}>{loadingText}</LiveRegion>
                          </InternalStatusIndicator>
                        ) : (
                          <div className={styles.empty}>{empty}</div>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  items.map((item, rowIndex) => {
                    const firstVisible = rowIndex === 0;
                    const lastVisible = rowIndex === items.length - 1;
                    const isEven = rowIndex % 2 === 0;
                    const isSelected = !!selectionType && isItemSelected(item);
                    const isPrevSelected = !!selectionType && !firstVisible && isItemSelected(items[rowIndex - 1]);
                    const isNextSelected = !!selectionType && !lastVisible && isItemSelected(items[rowIndex + 1]);
                    return (
                      <tr
                        key={getItemKey(trackBy, item, rowIndex)}
                        className={clsx(styles.row, isSelected && styles['row-selected'])}
                        onFocus={({ currentTarget }) => {
                          // When an element inside table row receives focus we want to adjust the scroll.
                          // However, that behaviour is unwanted when the focus is received as result of a click
                          // as it causes the click to never reach the target element.
                          if (!currentTarget.contains(getMouseDownTarget())) {
                            stickyHeaderRef.current?.scrollToRow(currentTarget);
                          }
                        }}
                        {...focusMarkers.item}
                        onClick={onRowClickHandler && onRowClickHandler.bind(null, rowIndex, item)}
                        onContextMenu={onRowContextMenuHandler && onRowContextMenuHandler.bind(null, rowIndex, item)}
                        aria-rowindex={firstIndex ? firstIndex + rowIndex + 1 : undefined}
                      >
                        {selectionType !== undefined && (
                          <TableTdElement
                            className={clsx(styles['selection-control'])}
                            isVisualRefresh={isVisualRefresh}
                            isFirstRow={firstVisible}
                            isLastRow={lastVisible}
                            isSelected={isSelected}
                            isNextSelected={isNextSelected}
                            isPrevSelected={isPrevSelected}
                            wrapLines={false}
                            isEvenRow={isEven}
                            stripedRows={stripedRows}
                            hasSelection={hasSelection}
                            hasFooter={hasFooter}
                            ref={tableCellRefs[0]}
                            isStickyColumn={!disableStickyColumns && (stickyColumns?.start ?? 0) > 0}
                            style={(stickyColumns?.start ?? 0) > 0 ? { left: cellWidths.start[0] } : {}}
                          >
                            <SelectionControl
                              onFocusDown={moveFocusDown}
                              onFocusUp={moveFocusUp}
                              onShiftToggle={updateShiftToggle}
                              {...getItemSelectionProps(item)}
                            />
                          </TableTdElement>
                        )}
                        {visibleColumnDefinitions.map((column, colIndex) => {
                          const isEditing =
                            !!currentEditCell && currentEditCell[0] === rowIndex && currentEditCell[1] === colIndex;
                          const isEditable = !!column.editConfig && !currentEditLoading;

                          // Sticky columns
                          const stickyColumn = getStickyColumn(colIndex);
                          const { isSticky = false, stickyStyles = {} } = !disableStickyColumns ? stickyColumn : {};

                          return (
                            <TableBodyCell
                              key={getColumnKey(column, colIndex)}
                              style={
                                resizableColumns
                                  ? {
                                      ...stickyStyles,
                                    }
                                  : {
                                      width: column.width,
                                      minWidth: column.minWidth,
                                      maxWidth: column.maxWidth,
                                      ...stickyStyles,
                                    }
                              }
                              ariaLabels={ariaLabels}
                              column={column}
                              item={item}
                              ref={tableCellRefs[colIndex + (hasSelection ? 1 : 0)]}
                              wrapLines={wrapLines}
                              isEditable={isEditable}
                              isEditing={isEditing}
                              isFirstRow={firstVisible}
                              isLastRow={lastVisible}
                              isSelected={isSelected}
                              isNextSelected={isNextSelected}
                              isPrevSelected={isPrevSelected}
                              onEditStart={() => setCurrentEditCell([rowIndex, colIndex])}
                              onEditEnd={() => {
                                const wasCancelled = fireCancelableEvent(onEditCancel, {});
                                if (!wasCancelled) {
                                  setCurrentEditCell(null);
                                }
                              }}
                              submitEdit={wrapWithInlineLoadingState(submitEdit)}
                              hasFooter={hasFooter}
                              stripedRows={stripedRows}
                              isEvenRow={isEven}
                              isVisualRefresh={isVisualRefresh}
                              stickyColumn={!disableStickyColumns ? stickyColumn : undefined}
                              isStickyColumn={!disableStickyColumns && isSticky}
                              isLastColumn={colIndex === visibleColumnsLength - 1}
                              isStuckToTheLeft={isStuckToTheLeft}
                              isStuckToTheRight={isStuckToTheRight}
                            />
                          );
                        })}
                      </tr>
                    );
                  })
                )}
              </tbody>
              <div className={styles['sentinel-right']} ref={rightSentinelRef} />
            </table>
            {resizableColumns && <ResizeTracker />}
          </div>
          <StickyScrollbar
            ref={scrollbarRef}
            wrapperRef={wrapperRefObject}
            tableRef={tableRefObject}
            onScroll={handleScroll}
          />
        </InternalContainer>
      </ColumnWidthsProvider>
    );
  }
) as TableForwardRefType;

export default InternalTable;
