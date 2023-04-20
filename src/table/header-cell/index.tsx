// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import InternalIcon from '../../icon/internal';
import { KeyCode } from '../../internal/keycode';
import { TableProps } from '../interfaces';
import { getAriaSort, getSortingIconName, getSortingStatus, isSorted } from './utils';
import styles from './styles.css.js';
import { Resizer } from '../resizer';
import { useUniqueId } from '../../internal/hooks/use-unique-id';
import { InteractiveComponent } from '../thead';
import { getStickyClassNames, StickyColumnProperties } from '../use-sticky-columns';
import { useStickyState } from '../use-sticky-state';
import { useReaction } from '../../area-chart/model/async-store';

interface TableHeaderCellProps<ItemType> {
  className?: string;
  style?: React.CSSProperties;
  tabIndex: number;
  column: TableProps.ColumnDefinition<ItemType>;
  activeSortingColumn?: TableProps.SortingColumn<ItemType>;
  sortingDescending?: boolean;
  sortingDisabled?: boolean;
  wrapLines?: boolean;
  hidden?: boolean;
  onClick(detail: TableProps.SortingState<any>): void;
  onResizeFinish: () => void;
  colIndex: number;
  updateColumn: (colIndex: number, newWidth: number) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  resizableColumns?: boolean;
  isEditable?: boolean;
  focusedComponent?: InteractiveComponent | null;
  onFocusedComponentChange?: (element: InteractiveComponent | null) => void;
  stickyColumnProperties: StickyColumnProperties;
}

export function TableHeaderCell<ItemType>(props: TableHeaderCellProps<ItemType>) {
  const {
    className,
    style,
    tabIndex,
    column,
    activeSortingColumn,
    sortingDescending,
    sortingDisabled,
    wrapLines,
    colIndex,
    hidden,
    onClick,
    onFocusedComponentChange,
    focusedComponent,
    updateColumn,
    resizableColumns,
    onResizeFinish,
    isEditable,
    cellRefs,
    stickyState,
  } = props;
  const sortable = !!column.sortingComparator || !!column.sortingField;
  const sorted = !!activeSortingColumn && isSorted(column, activeSortingColumn);
  const sortingStatus = getSortingStatus(sortable, sorted, !!sortingDescending, !!sortingDisabled);
  const handleClick = () =>
    onClick({
      sortingColumn: column,
      isDescending: sorted ? !sortingDescending : false,
    });
  const ref = React.useRef();
  // Elements with role="button" do not have the default behavior of <button>, where pressing
  // Enter or Space will trigger a click event. Therefore we need to add this ourselves.
  // The native <button> element cannot be used due to a misaligned implementation in Firefox:
  // https://bugzilla.mozilla.org/show_bug.cgi?id=843003
  const handleKeyPress = ({ nativeEvent: e }: React.KeyboardEvent) => {
    if (e.keyCode === KeyCode.enter || e.keyCode === KeyCode.space) {
      e.preventDefault();
      handleClick();
    }
  };
  const headerId = useUniqueId('table-header-');
  const stickyClasses = [styles['sticky-cell'], styles['sticky-cell-last-left'], styles['sticky-cell-last-left']];

  useReaction(
    stickyState.store,
    state => state.cellStyles,
    styles => {
      if (ref && ref.current) {
        const classNames = styles[colIndex]?.classNames.th;

        if (classNames?.length) {
          const differences = stickyClasses.filter(el => !classNames.includes(el));
          differences.forEach(name => {
            ref.current.classList.remove(name);
          });
          classNames.forEach(name => {
            ref.current.classList.add(name);
          });
        }
        console.log('in th element', styles[colIndex]?.style);
        const cellStyle = styles[colIndex]?.style;
        for (const key in cellStyle) {
          if (cellStyle.hasOwnProperty(key) && cellStyle[key] !== undefined) {
            ref.current.style[key] = cellStyle[key];
          }
        }
      }
    }
  );
  return (
    <th
      className={clsx(className, {
        [styles['header-cell-resizable']]: !!resizableColumns,
        [styles['header-cell-sortable']]: sortingStatus,
        [styles['header-cell-sorted']]: sortingStatus === 'ascending' || sortingStatus === 'descending',
        [styles['header-cell-disabled']]: sortingDisabled,
        [styles['header-cell-ascending']]: sortingStatus === 'ascending',
        [styles['header-cell-descending']]: sortingStatus === 'descending',
        [styles['header-cell-hidden']]: hidden,
      })}
      aria-sort={sortingStatus && getAriaSort(sortingStatus)}
      style={style}
      scope="col"
      ref={node => {
        cellRefs.current[colIndex] = node;
        ref.current = node;
      }}
    >
      <div
        className={clsx(styles['header-cell-content'], {
          [styles['header-cell-fake-focus']]: focusedComponent?.type === 'column' && focusedComponent.col === colIndex,
        })}
        aria-label={
          column.ariaLabel
            ? column.ariaLabel({
                sorted: sorted,
                descending: sorted && !!sortingDescending,
                disabled: !!sortingDisabled,
              })
            : undefined
        }
        {...(sortingStatus && !sortingDisabled
          ? {
              onKeyPress: handleKeyPress,
              tabIndex: tabIndex,
              role: 'button',
              onClick: handleClick,
              onFocus: () => onFocusedComponentChange?.({ type: 'column', col: colIndex }),
              onBlur: () => onFocusedComponentChange?.(null),
            }
          : {})}
      >
        <div className={clsx(styles['header-cell-text'], wrapLines && styles['header-cell-text-wrap'])} id={headerId}>
          {column.header}
          {isEditable ? (
            <span className={styles['edit-icon']} role="img" aria-label={column.editConfig?.editIconAriaLabel}>
              <InternalIcon name="edit" />
            </span>
          ) : null}
        </div>
        {sortingStatus && (
          <span className={styles['sorting-icon']}>
            <InternalIcon name={getSortingIconName(sortingStatus)} />
          </span>
        )}
      </div>
      {resizableColumns && (
        <>
          <Resizer
            tabIndex={tabIndex}
            showFocusRing={focusedComponent?.type === 'resizer' && focusedComponent.col === colIndex}
            onDragMove={newWidth => updateColumn(colIndex, newWidth)}
            onFinish={onResizeFinish}
            ariaLabelledby={headerId}
            onFocus={() => onFocusedComponentChange?.({ type: 'resizer', col: colIndex })}
            onBlur={() => onFocusedComponentChange?.(null)}
            minWidth={typeof column.minWidth === 'string' ? parseInt(column.minWidth) : column.minWidth}
          />
        </>
      )}
    </th>
  );
}
