// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import styles from './styles.css.js';

export default React.forwardRef<
  HTMLTableElement,
  { children?: React.ReactNode; nativeAttributes?: React.HTMLAttributes<HTMLTableElement> }
>(function Table({ children, nativeAttributes }, ref) {
  return (
    <table className={styles.table} {...nativeAttributes} ref={ref}>
      {children}
    </table>
  );
});
