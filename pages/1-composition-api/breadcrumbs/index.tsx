// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { Box, Icon, Link, Popover } from '~components';
import styles from './styles.scss';

function List({ children }: any) {
  const permittedContent = [ListItem];

  return <ol className={styles.list}>{handlePermittedContent('Breadcrumbs.List', permittedContent, children)}</ol>;
}

function ListItem({ children }: any) {
  const permittedContent = [Box, Icon, Link, Popover];

  return <li className={styles.item}>{handlePermittedContent('Breadcrumbs.ListItem', permittedContent, children)}</li>;
}

function handlePermittedContent(displayName: string, permittedContent: any, children: any) {
  return (
    <>
      {React.Children.map(children, child => {
        if (permittedContent.includes(child.type)) {
          return child;
        } else {
          console.error(`${displayName} does not support ${child.type.displayName} as a subcomponent.`);
        }
      })}
    </>
  );
}

export default {
  List,
  ListItem,
};
