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
        <Button variant="inline-action" ariaLabel={`Download ${item.id}`}>
          Download
        </Button>
      ),
  },
  {
    id: 'multiple-actions',
    header: 'Actions',
    cell: item => (
      <SpaceBetween size="m" direction="horizontal">
        <Button variant="inline-action" ariaLabel={`Download ${item.id}`}>
          Download
        </Button>
        <Box variant="awsui-separator" />
        <Button variant="inline-action" ariaLabel={`Upload ${item.id}`}>
          Update
        </Button>
      </SpaceBetween>
    ),
  },
  {
    id: 'action-dropdown',
    header: 'Actions',
    cell: item => (
      <Box textAlign="center">
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
      </Box>
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
            columnDisplay={columnDisplay.filter(({ id }) => id !== 'action-dropdown' && id !== 'multiple-actions')}
          />
          <Table
            header={<Header>Table with multiple actions</Header>}
            columnDefinitions={columnDefinitions}
            items={items}
            columnDisplay={columnDisplay.filter(({ id }) => id !== 'single-action' && id !== 'action-dropdown')}
          />
          <Table
            header={<Header>Table with action dropdowns</Header>}
            columnDefinitions={columnDefinitions}
            items={items}
            columnDisplay={columnDisplay.filter(({ id }) => id !== 'single-action' && id !== 'multiple-actions')}
          />
        </SpaceBetween>
      </Box>
    </ScreenshotArea>
  );
}
