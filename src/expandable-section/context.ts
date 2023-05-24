// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createContext, KeyboardEventHandler, MouseEventHandler } from 'react';
import { ExpandableSectionProps } from './interfaces';

export interface IExpandableSectionContext {
  isContainer: boolean;
  expanded: boolean;
  ariaControls: string;
  ariaLabel?: string;
  onKeyUp: KeyboardEventHandler;
  onKeyDown: KeyboardEventHandler;
  onClick: MouseEventHandler;
  icon: JSX.Element;
  variant: ExpandableSectionProps.Variant;
  screenreaderContentId: string;
}

const ExpandableSectionContext = createContext<IExpandableSectionContext | null>(null);

export default ExpandableSectionContext;
