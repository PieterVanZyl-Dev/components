// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { isValidElement, useEffect, useRef } from 'react';
import { SplitButtonProps } from './interfaces';
import styles from './styles.css.js';
import { warnOnce } from '../internal/logging';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { getBaseProps } from '../internal/base-component';
import clsx from 'clsx';
import flattenChildren from 'react-keyed-flatten-children';

// eslint-disable-next-line @cloudscape-design/ban-files
import Button from '../button';
import buttonStyles from '../button/styles.css.js';

// eslint-disable-next-line @cloudscape-design/ban-files
import ButtonDropdown from '../button-dropdown';

interface InternalSplitButtonProps extends SplitButtonProps, InternalBaseComponentProps {}

export default function InternalSplitButton({ children, __internalRootRef, ...props }: InternalSplitButtonProps) {
  const splitButtonRef = useRef<HTMLDivElement>(null);
  const ref = useMergeRefs(splitButtonRef, __internalRootRef);
  const baseProps = getBaseProps(props);

  useEffect(() => {
    if (splitButtonRef.current) {
      getTriggers(splitButtonRef.current).forEach(buttonEl => buttonEl.classList.add(styles.trigger));
    }
  });

  return (
    <div ref={ref} {...baseProps} className={clsx(baseProps.className, styles.root)}>
      {validateChildren(children).map(child => (
        <div key={child.key} className={styles.item}>
          {child}
        </div>
      ))}
    </div>
  );
}

function validateChildren(children: React.ReactNode): React.ReactElement[] {
  const variants = new Set<string>();
  const childrenElements: React.ReactElement[] = [];

  for (const child of flattenChildren(children)) {
    if (!isValidElement(child) || (child.type !== Button && child.type !== ButtonDropdown)) {
      warnOnce('SplitButton', 'Only Button and ButtonDropdown are allowed as component children.');
      continue;
    }

    if (getVariant(child) !== 'normal' && getVariant(child) !== 'primary') {
      warnOnce('SplitButton', 'Only "normal" and "primary" variants are allowed.');
      continue;
    }

    variants.add(getVariant(child));
    if (variants.size > 1) {
      warnOnce('SplitButton', 'All children must be of the same variant.');
      break;
    }

    childrenElements.push(child);
  }

  if (childrenElements.length < 2) {
    warnOnce('SplitButton', 'The component requires at least 2 children.');
    return [];
  }

  return childrenElements;
}

function getTriggers(root: HTMLElement) {
  return Array.from(root.querySelectorAll(`.${buttonStyles.button}`));
}

function getVariant(element: React.ReactElement) {
  if (!element.props || typeof element.props !== 'object') {
    throw new Error('Invariant violation: missing element props.');
  }
  return 'variant' in element.props && typeof element.props.variant === 'string' ? element.props.variant : 'normal';
}
