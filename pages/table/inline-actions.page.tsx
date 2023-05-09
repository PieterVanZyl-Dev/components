// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Box from '~components/box';
import Button from '~components/button';
import ButtonDropdown from '~components/button-dropdown';
import Link from '~components/link';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';
import Table, { TableProps } from '~components/table';
import ScreenshotArea from '../utils/screenshot-area';
import { Instance, generateItems } from './generate-data';
import { columnsConfig } from './shared-configs';

const items = generateItems(10);

const columnDefinitions: TableProps.ColumnDefinition<Instance>[] = [
  ...columnsConfig,
  {
    id: 'single-action',
    header: 'Actions',
    cell: item =>
      item.state === 'RUNNING' ? (
        <Link external={true} ariaLabel={`Verify payment for ${item.id} (opens in new tab)`}>
          Verify payment
        </Link>
      ) : (
        <Button variant="link" ariaLabel={`Download ${item.id}`}>
          Download
        </Button>
      ),
  },
  {
    id: 'action-dropdown',
    header: 'Actions',
    cell: item => (
      <ButtonDropdown
        variant="icon"
        expandToViewport={true}
        ariaLabel={`${item.id} actions`}
        items={[
          { id: 'share', text: 'Share' },
          { id: 'edit', text: 'Edit' },
          { id: 'delete', text: 'Delete' },
          { id: 'connect', text: 'Connect' },
          { id: 'manage', text: 'Manage state' },
        ]}
      />
    ),
  },
];

const columnDisplay = columnDefinitions.map(({ id }) => ({ id: id!, visible: true }));

export default function () {
  return (
    <ScreenshotArea style={{ padding: '10px 50px' }}>
      <Box padding="l">
        <h1>Tables with inline actions</h1>
        <SpaceBetween size="l">
          <Table
            header={<Header>Table with single actions</Header>}
            columnDefinitions={columnDefinitions}
            items={items}
            columnDisplay={columnDisplay.filter(({ id }) => id !== 'action-dropdown')}
          />
          <Table
            header={<Header>Table with action dropdowns</Header>}
            columnDefinitions={columnDefinitions}
            items={items}
            columnDisplay={columnDisplay.filter(({ id }) => id !== 'single-action')}
          />
        </SpaceBetween>
      </Box>
    </ScreenshotArea>
  );
}
