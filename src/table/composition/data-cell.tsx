// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import styles from './styles.css.js';

export default function DataCell({ children, colSpan, style }: any) {
  return (
    <td
      className={styles['data-cell']}
      colSpan={colSpan}
      style={{
        overflow: style?.overflow,
        textOverflow: style?.textOverflow,
        whiteSpace: style?.whiteSpace,
      }}
    >
      {children}
    </td>
  );
}
