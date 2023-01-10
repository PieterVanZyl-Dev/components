// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { List } from './composition/index';
import { KeyValueProps } from './interfaces';
import useBaseComponent from '../internal/hooks/use-base-component';

export { KeyValueProps };

export default function KeyValue({ ...props }: KeyValueProps.List) {
  const baseComponentProps = useBaseComponent('KeyValue');
  return <List {...props} {...baseComponentProps} />;
}

applyDisplayName(KeyValue, 'KeyValue');
