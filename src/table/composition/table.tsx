// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import styles from './styles.css.js';

export default function Table({ children }: any) {
  return <table className={styles.table}>{children}</table>;
}
