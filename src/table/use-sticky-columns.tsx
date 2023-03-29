// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useLayoutEffect, useState, createRef, useEffect } from 'react';
import { warnOnce } from '../internal/logging';
import { TableProps } from './interfaces';
interface CellWidths {
  start: number[];
  end: number[];
}
interface StickyStyles {
  left?: string;
  right?: string;
  boxShadow?: string;
  clipPath?: string;
}

interface StickyColumnParams {
  visibleColumnsLength: number;
  hasSelection: boolean;
  stickyColumns?: TableProps.StickyColumns;
  containerWidth: number | null;
}

export interface GetStickyColumn {
  isSticky: boolean;
  isLastStart: boolean;
  isLastEnd: boolean;
  stickyStyles: StickyStyles;
}

export const getStickyStyles = ({
  colIndex,
  stickyColumns,
  visibleColumnsLength,
  hasSelection,
  cellWidths,
}: {
  colIndex: number;
  stickyColumns?: TableProps.StickyColumns;
  visibleColumnsLength: number;
  hasSelection: boolean;
  cellWidths?: CellWidths;
}): StickyStyles => {
  const isStickyStart = colIndex + 1 <= (stickyColumns?.start ?? 0);
  const isStickyEnd = colIndex + 1 > visibleColumnsLength - (stickyColumns?.end ?? 0);
  const stickySide = isStickyStart ? 'left' : isStickyEnd ? 'right' : '';
  return {
    [stickySide]: `${
      stickySide === 'right'
        ? cellWidths?.end[colIndex + (hasSelection ? 1 : 0)]
        : cellWidths?.start[colIndex + (hasSelection ? 1 : 0)]
    }px`,
  };
};

export const updateCellWidths = ({
  tableCellRefs,
  setCellWidths,
}: {
  tableCellRefs: React.RefObject<HTMLTableCellElement>[];
  setCellWidths: (cellWidths: CellWidths) => void;
}) => {
  let startWidthsArray = tableCellRefs
    .map(ref => (ref?.current?.previousSibling as HTMLTableCellElement)?.offsetWidth)
    .filter(x => x);
  startWidthsArray = startWidthsArray.map((elem, index) =>
    startWidthsArray.slice(0, index + 1).reduce((a, b) => a + b)
  );

  let endWidthsArray = tableCellRefs.map(ref => (ref?.current?.nextSibling as HTMLTableCellElement)?.offsetWidth);
  endWidthsArray = endWidthsArray.filter(x => x).reverse();
  endWidthsArray = endWidthsArray
    .map((elem, index) => endWidthsArray.slice(0, index + 1).reduce((a, b) => a + b))
    .reverse();
  setCellWidths({ start: [0, ...startWidthsArray], end: [...endWidthsArray, 0] });
};

export const useStickyColumns = ({
  visibleColumnsLength,
  hasSelection,
  stickyColumns,
  containerWidth,
}: StickyColumnParams) => {
  const [tableCellRefs, setTableCellRefs] = useState<Array<React.RefObject<HTMLTableCellElement>>>([]);
  const [cellWidths, setCellWidths] = useState<CellWidths>({ start: [], end: [] });
  const [shouldDisable, setShouldDisable] = useState<boolean>(false);

  const { start = 0, end = 0 } = stickyColumns || {};
  const lastStartStickyColumnIndex = start + (hasSelection ? 1 : 0);
  const lastEndStickyColumnIndex = visibleColumnsLength - 1 - end + (hasSelection ? 1 : 0);
  const startStickyColumnsWidth = cellWidths?.start[lastStartStickyColumnIndex] ?? 0;
  const endStickyColumnsWidth = cellWidths?.end[lastEndStickyColumnIndex] ?? 0;
  const totalStickySpace = startStickyColumnsWidth + endStickyColumnsWidth;

  // We allow the table to have a minimum of 150px of available space besides the sum of the widths of the sticky columns
  const MINIMUM_SPACE_BESIDES_STICKY_COLUMNS = 150;

  const getStickyColumn = (colIndex: number): GetStickyColumn => {
    return {
      isSticky:
        colIndex + 1 <= (stickyColumns?.start ?? 0) || colIndex + 1 > visibleColumnsLength - (stickyColumns?.end ?? 0),
      isLastStart: colIndex + 1 === stickyColumns?.start,
      isLastEnd: colIndex === visibleColumnsLength - (stickyColumns?.end ?? 0),
      stickyStyles: getStickyStyles({ colIndex, stickyColumns, visibleColumnsLength, hasSelection, cellWidths }),
    };
  };

  useEffect(() => {
    // Add and remove refs
    setTableCellRefs(tableCellRefs =>
      [...new Array(visibleColumnsLength + (hasSelection ? 1 : 0))].map(
        (_: any, i: number) => tableCellRefs[i] || createRef<HTMLTableCellElement>()
      )
    );
  }, [visibleColumnsLength, hasSelection]);

  useEffect(() => {
    const shouldDisable =
      !stickyColumns ||
      totalStickySpace + MINIMUM_SPACE_BESIDES_STICKY_COLUMNS > (containerWidth ?? Number.MAX_SAFE_INTEGER);
    if (shouldDisable) {
      warnOnce(
        'Table',
        `The sum of all sticky columns widths must not be greater than the difference between the table container width and ${MINIMUM_SPACE_BESIDES_STICKY_COLUMNS}px.`
      );
    }
    setShouldDisable(shouldDisable);
  }, [containerWidth, stickyColumns, totalStickySpace, visibleColumnsLength]);

  useLayoutEffect(() => {
    // First checks whether there are any sticky columns to calculate the widths for.
    // If there are none, the effect returns and does nothing.
    if (!(Boolean(stickyColumns?.start) || Boolean(stickyColumns?.end))) {
      return;
    }
    updateCellWidths({ tableCellRefs, setCellWidths });
  }, [tableCellRefs, stickyColumns]);

  return {
    tableCellRefs,
    cellWidths,
    setCellWidths,
    getStickyColumn,
    shouldDisableStickyColumns: shouldDisable,
    startStickyColumnsWidth,
    endStickyColumnsWidth,
  };
};
