// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import Header from '~components/header';
import Table, { TableProps } from '~components/table';
import ScreenshotArea from '../utils/screenshot-area';
import { generateItems } from './generate-data';
import { columnsConfig } from './shared-configs';

const items = generateItems(20);

export default function () {
  const [variant, setVariant] = useState<TableProps.Variant>('container');
  const variants: TableProps.Variant[] = ['container', 'embedded', 'full-page', 'stacked'];

  const variantButtons = (
    <div style={{ paddingBottom: '10px', display: 'inline-flex', gap: '10px' }}>
      <b>Variant: </b>
      {variants.map((value, i) => {
        return (
          <label key={i} htmlFor={value}>
            <input
              type="radio"
              name="variant"
              id={value}
              value={value}
              onChange={() => setVariant(value)}
              checked={variant === value}
            />{' '}
            {value}
          </label>
        );
      })}
    </div>
  );
  const [density, setDensity] = useState('comfortable' as 'comfortable' | 'compact');
  return (
    <ScreenshotArea style={{ padding: '10px 50px' }}>
      {variantButtons}
      <button onClick={() => setDensity(density === 'comfortable' ? 'compact' : 'comfortable')}>Toggle Density</button>
      <Table
        header={<Header headingTagOverride="h1">Testing table</Header>}
        columnDefinitions={columnsConfig}
        items={items}
        stickyHeader={true}
        variant={variant}
        contentDensity={density}
      />
      <div style={{ height: '90vh', padding: 10 }}>Placeholder to allow page scroll beyond table</div>
    </ScreenshotArea>
  );
}
