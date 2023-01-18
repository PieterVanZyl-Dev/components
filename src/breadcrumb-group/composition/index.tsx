// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import styles from './styles.css.js';

function Group({ children }: any) {
  return (
    <nav className={styles.group}>
      <ol>{children}</ol>
    </nav>
  );
}

function Item({ children }: any) {
  return <li className={styles.item}>{children}</li>;
}

export default {
  Group,
  Item,
};
