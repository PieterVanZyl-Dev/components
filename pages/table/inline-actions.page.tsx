// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Box from '~components/box';
import Button from '~components/button';
import ButtonDropdown from '~components/button-dropdown';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';
import Table, { TableProps } from '~components/table';
import ScreenshotArea from '../utils/screenshot-area';
import { Instance, generateItems } from './generate-data';
import { columnsConfig } from './shared-configs';

const items = generateItems(10);

const columnDefinitionsSingle: TableProps.ColumnDefinition<Instance>[] = [
  ...columnsConfig,
  {
    id: 'action',
    header: 'Actions',
    cell: item =>
      item.state === 'RUNNING' ? (
        <Button
          variant="inline-action"
          iconName="external"
          iconAlign="right"
          ariaLabel={`Verify payment for ${item.id} (opens in new tab)`}
        >
          Verify payment
        </Button>
      ) : (
        <Button variant="inline-action" ariaLabel={`Download ${item.id}`}>
          Download
        </Button>
      ),
  },
];
const columnDefinitionsMultiple: TableProps.ColumnDefinition<Instance>[] = [
  ...columnsConfig,
  {
    id: 'action',
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
];
const columnDefinitionsDropdown: TableProps.ColumnDefinition<Instance>[] = [
  ...columnsConfig,
  {
    id: 'action',
    header: 'Actions',
    cell: item => (
      <Box>
        <ButtonDropdown
          variant="icon-action"
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
const columnDefinitionsMixed: TableProps.ColumnDefinition<Instance>[] = [
  ...columnsConfig,
  {
    id: 'action',
    header: 'Actions',
    cell: item => (
      <SpaceBetween size="m" direction="horizontal">
        <Button variant="inline-action" ariaLabel={`Download ${item.id}`}>
          Download
        </Button>
        <Box variant="awsui-separator" />
        <ButtonDropdown
          variant="icon-action"
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
      </SpaceBetween>
    ),
  },
];
const columnDefinitionsOnlyIcons: TableProps.ColumnDefinition<Instance>[] = [
  ...columnsConfig,
  {
    id: 'action',
    header: 'Actions',
    cell: item => (
      <Box>
        <SpaceBetween size="s" direction="horizontal">
          <Button variant="inline-icon" iconName="download" ariaLabel={`Download ${item.id}`} />
          <ButtonDropdown
            variant="icon-action"
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
        </SpaceBetween>
      </Box>
    ),
  },
];

export default function () {
  return (
    <ScreenshotArea style={{ padding: '10px 50px' }}>
      <Box padding="l">
        <h1>Tables with inline actions</h1>
        <SpaceBetween size="l">
          <Table
            header={<Header>Table with single actions</Header>}
            columnDefinitions={columnDefinitionsSingle}
            items={items}
            resizableColumns={true}
          />
          <Table
            header={<Header>Table with multiple actions</Header>}
            columnDefinitions={columnDefinitionsMultiple}
            items={items}
            resizableColumns={true}
          />
          <Table
            header={<Header>Table with action dropdowns</Header>}
            columnDefinitions={columnDefinitionsDropdown}
            items={items}
            resizableColumns={true}
          />
          <Table
            header={<Header>Table with mixed actions</Header>}
            columnDefinitions={columnDefinitionsMixed}
            items={items}
            resizableColumns={true}
          />
          <Table
            header={<Header>Table with only icon actions</Header>}
            columnDefinitions={columnDefinitionsOnlyIcons}
            items={items}
            resizableColumns={true}
          />
        </SpaceBetween>
      </Box>
    </ScreenshotArea>
  );
}
