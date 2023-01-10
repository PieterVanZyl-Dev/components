// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import styles from './styles.css.js';

export default function Row({ children }: any) {
  return <tr className={styles.row}>{children}</tr>;
}
