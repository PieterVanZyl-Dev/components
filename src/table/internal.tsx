// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useImperativeHandle, useEffect, useRef, useState, Ref, forwardRef, createRef } from 'react';
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
import { useMobile } from '../internal/hooks/use-mobile';
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

type InternalTableProps<T> = SomeRequired<TableProps<T>, 'items' | 'selectedItems' | 'variant'> &
  InternalBaseComponentProps;

interface CellWidths {
  left: number[];
  right: number[];
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
    const isMobile = useMobile();
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

    // Sticky columns
    const [tableCellRefs, setTableCellRefs] = useState<Array<React.RefObject<HTMLTableCellElement>>>([]);
    const [cellWidths, setCellWidths] = useState<CellWidths>({ left: [], right: [] });

    // Inline editing
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
    const visibleColumnsLength = React.useMemo(
      () => visibleColumnDefinitions.length,
      [visibleColumnDefinitions.length]
    );

    useEffect(() => {
      // Add and remove refs
      setTableCellRefs(tableCellRefs =>
        [...new Array(visibleColumnsLength + (selectionType ? 1 : 0))].map(
          (_: any, i: number) => tableCellRefs[i] || createRef<HTMLTableCellElement>()
        )
      );
    }, [visibleColumnsLength, selectionType]);

    useEffect(() => {
      //  first checks whether there are any sticky columns to calculate the widths for.
      // If there are none, the effect returns and does nothing.
      if (!(Boolean(stickyColumns?.start) || Boolean(stickyColumns?.end))) {
        return;
      }

      // calculates the width of the columns to the left and right of the sticky columns
      // by iterating over the array of references to each table cell.
      let leftWidthsArray = tableCellRefs
        .map(ref => (ref?.current?.previousSibling as HTMLTableCellElement)?.offsetWidth)
        .filter(x => x);
      leftWidthsArray = leftWidthsArray.map((elem, index) =>
        leftWidthsArray.slice(0, index + 1).reduce((a, b) => a + b)
      );

      let rightWidthsArray = tableCellRefs.map(ref => (ref?.current?.nextSibling as HTMLTableCellElement)?.offsetWidth);
      rightWidthsArray = rightWidthsArray.filter(x => x).reverse();
      rightWidthsArray = rightWidthsArray
        .map((elem, index) => rightWidthsArray.slice(0, index + 1).reduce((a, b) => a + b))
        .reverse();
      setCellWidths({ left: [0, ...leftWidthsArray], right: [...rightWidthsArray, 0] });
    }, [tableCellRefs, stickyColumns]);

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
          console.log('ON RESIZE FINISH!');
          let leftWidthsArray = tableCellRefs
            .map(ref => (ref?.current?.previousSibling as HTMLTableCellElement)?.offsetWidth)
            .filter(x => x);
          leftWidthsArray = leftWidthsArray.map((elem, index) =>
            leftWidthsArray.slice(0, index + 1).reduce((a, b) => a + b)
          );

          let rightWidthsArray = tableCellRefs.map(
            ref => (ref?.current?.nextSibling as HTMLTableCellElement)?.offsetWidth
          );
          rightWidthsArray = rightWidthsArray.filter(x => x).reverse();
          rightWidthsArray = rightWidthsArray
            .map((elem, index) => rightWidthsArray.slice(0, index + 1).reduce((a, b) => a + b))
            .reverse();
          console.log('SETTING CELL WIDTHS!!');
          setCellWidths({ left: [0, ...leftWidthsArray], right: [...rightWidthsArray, 0] });

          fireNonCancelableEvent(onColumnWidthsChange, { widths: widthsDetail });
        }
      },
      singleSelectionHeaderAriaLabel: ariaLabels?.selectionGroupLabel,
      stripedRows,
    };

    // Allows keyboard users to scroll horizontally with arrow keys by making the wrapper part of the tab sequence
    const isWrapperScrollable = tableWidth && containerWidth && tableWidth > containerWidth;
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

    const lastLeftStickyColumnIndex = stickyColumns?.start ? stickyColumns?.start + (hasSelection ? 1 : 0) : 0;
    const lastRightStickyColumnIndex = stickyColumns?.end
      ? visibleColumnDefinitions.length - 1 - stickyColumns?.end + (hasSelection ? 1 : 0)
      : 0;
    const totalStickySpace = cellWidths.left[lastLeftStickyColumnIndex] + cellWidths.right[lastRightStickyColumnIndex];
    console.log({
      lastLeftStickyColumnIndex,
      lastRightStickyColumnIndex,
      cellWidths,
      containerWidth,
      totalStickySpace,
      visibleColumnDefinitions,
    });

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
                  stickyColumns={stickyColumns}
                  cellWidths={cellWidths}
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
              <Thead
                ref={theadRef}
                hidden={stickyHeader}
                onFocusedComponentChange={component => stickyHeaderRef.current?.setFocus(component)}
                stickyColumns={stickyColumns}
                cellWidths={cellWidths}
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
                            style={
                              (stickyColumns?.start ?? 0) > 0
                                ? { position: 'sticky', left: cellWidths.left[0], background: 'white', zIndex: '1' }
                                : {}
                            }
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

                          const lastLeftStickyColumnIndex = stickyColumns?.start
                            ? stickyColumns?.start + (hasSelection ? 1 : 0)
                            : 0;
                          const lastRightStickyColumnIndex = stickyColumns?.end
                            ? visibleColumnDefinitions.length - stickyColumns?.end
                            : 0;

                          const totalStickySpace =
                            cellWidths.left[lastLeftStickyColumnIndex] + cellWidths.right[lastRightStickyColumnIndex];
                          console.log({ totalStickySpace, containerWidth });
                          const isStickyLeft = colIndex + 1 <= (stickyColumns?.start ?? 0);
                          const isStickyRight =
                            colIndex + 1 > visibleColumnDefinitions.length - (stickyColumns?.end ?? 0);
                          const isLastLeftStickyColumn = colIndex + 1 === stickyColumns?.start;
                          const isLastRightStickyColumn =
                            colIndex === visibleColumnDefinitions.length - (stickyColumns?.end ?? 0);

                          const getStickyStyles = () => {
                            const stickySide = isStickyLeft ? 'left' : isStickyRight ? 'right' : undefined;
                            const totalStickyColumns = (stickyColumns?.start ?? 0) + (stickyColumns?.end ?? 0);
                            // Sticky columns disabled conditions
                            if (!stickySide || isMobile || totalStickyColumns >= visibleColumnDefinitions.length) {
                              console.log('Stickyness disabled, returning no styles');
                              return {};
                            }
                            const boxShadow = isLastLeftStickyColumn
                              ? '4px 0px 20px 1px rgba(0, 7, 22, 0.1)'
                              : isLastRightStickyColumn
                              ? '-4px 0px 4px 1px rgba(0, 7, 22, 0.1)'
                              : 'none';
                            const clipPath = isLastLeftStickyColumn
                              ? 'inset(0 -24px 0 0)'
                              : isLastRightStickyColumn
                              ? 'inset(0 0 0 -24px)'
                              : 'none';

                            return {
                              [stickySide]: `${
                                stickySide === 'right'
                                  ? cellWidths.right[colIndex + (selectionType ? 1 : 0)]
                                  : cellWidths.left[colIndex + (selectionType ? 1 : 0)]
                              }px`,
                              boxShadow,
                              clipPath,
                            };
                          };
                          return (
                            <TableBodyCell
                              key={getColumnKey(column, colIndex)}
                              style={
                                resizableColumns
                                  ? {
                                      ...getStickyStyles(),
                                    }
                                  : {
                                      width: column.width,
                                      minWidth: column.minWidth,
                                      maxWidth: column.maxWidth,
                                      ...getStickyStyles(),
                                    }
                              }
                              ariaLabels={ariaLabels}
                              column={column}
                              item={item}
                              ref={tableCellRefs[colIndex + (selectionType ? 1 : 0)]}
                              wrapLines={wrapLines}
                              isEditable={isEditable}
                              isEditing={isEditing}
                              isFirstRow={firstVisible}
                              isLastRow={lastVisible}
                              isSelected={isSelected}
                              isNextSelected={isNextSelected}
                              isPrevSelected={isPrevSelected}
                              isStickyColumn={isStickyLeft || isStickyRight}
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
                            />
                          );
                        })}
                      </tr>
                    );
                  })
                )}
              </tbody>
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
