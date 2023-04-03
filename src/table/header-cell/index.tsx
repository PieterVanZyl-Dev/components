// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import InternalIcon from '../../icon/internal';
import useFocusVisible from '../../internal/hooks/focus-visible';
import { KeyCode } from '../../internal/keycode';
import { TableProps } from '../interfaces';
import { getAriaSort, getSortingIconName, getSortingStatus, isSorted } from './utils';
import styles from './styles.css.js';
import { Resizer } from '../resizer';
import { useUniqueId } from '../../internal/hooks/use-unique-id';
import { InteractiveComponent } from '../thead';
import { CellWidths } from '../internal';
import { GetStickyColumn } from '../use-sticky-columns';

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
  isStuckToTheRight?: boolean;
  isStuckToTheLeft?: boolean;
  resizableColumns?: boolean;
  isEditable?: boolean;
  focusedComponent?: InteractiveComponent | null;
  onFocusedComponentChange?: (element: InteractiveComponent | null) => void;
  isStickyColumn?: boolean;
  setCellWidths: React.Dispatch<React.SetStateAction<CellWidths>>;
  tableCellRefs: Array<React.RefObject<HTMLTableCellElement>>;
  isLastStart?: boolean;
  isLastEnd?: boolean;
  getStickyColumn: (colIndex: number) => GetStickyColumn;
}

export const TableHeaderCell = React.forwardRef(function TableHeaderCell<ItemType>(
  props: TableHeaderCellProps<ItemType>,
  ref: React.Ref<HTMLTableCellElement>
) {
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
    isStuckToTheLeft,
    isStuckToTheRight,
    getStickyColumn,
  } = props;
  const focusVisible = useFocusVisible();
  const sortable = !!column.sortingComparator || !!column.sortingField;
  const sorted = !!activeSortingColumn && isSorted(column, activeSortingColumn);
  const sortingStatus = getSortingStatus(sortable, sorted, !!sortingDescending, !!sortingDisabled);
  const handleClick = () =>
    onClick({
      sortingColumn: column,
      isDescending: sorted ? !sortingDescending : false,
    });

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
  // Sticky columns
  const { isStickyLeft, isStickyRight, isLastStickyLeft, isLastStickyRight } = getStickyColumn(colIndex);
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
        [styles['header-cell-freeze']]: isStickyLeft || isStickyRight,
        [styles['header-cell-freeze-last-left']]: isStuckToTheLeft && isLastStickyLeft,
        [styles['header-cell-freeze-last-right']]: isStuckToTheRight && isLastStickyRight,
      })}
      aria-sort={sortingStatus && getAriaSort(sortingStatus)}
      style={style}
      ref={ref}
      scope="col"
    >
      <div
        className={clsx(styles['header-cell-content'], {
          [styles['header-cell-fake-focus']]:
            focusedComponent?.type === 'column' &&
            focusedComponent.col === colIndex &&
            focusVisible['data-awsui-focus-visible'],
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
        {...(sortingDisabled || !sortingStatus
          ? { ['aria-disabled']: 'true' }
          : {
              onKeyPress: handleKeyPress,
              tabIndex: tabIndex,
              role: 'button',
              ...focusVisible,
              onClick: handleClick,
              onFocus: () => onFocusedComponentChange?.({ type: 'column', col: colIndex }),
              onBlur: () => onFocusedComponentChange?.(null),
            })}
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
            showFocusRing={
              focusedComponent?.type === 'resizer' &&
              focusedComponent.col === colIndex &&
              focusVisible['data-awsui-focus-visible']
            }
            onDragMove={newWidth => {
              updateColumn(colIndex, newWidth);
            }}
            onFinish={() => {
              onResizeFinish();
            }}
            ariaLabelledby={headerId}
            onFocus={() => onFocusedComponentChange?.({ type: 'resizer', col: colIndex })}
            onBlur={() => onFocusedComponentChange?.(null)}
            minWidth={typeof column.minWidth === 'string' ? parseInt(column.minWidth) : column.minWidth}
          />
        </>
      )}
    </th>
  );
});
