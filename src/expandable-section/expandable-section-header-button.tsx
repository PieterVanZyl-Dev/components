// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './styles.css.js';
import { IExpandableSectionContext } from './context';

export default function ({
  children,
  isContainer,
  ariaControls,
  expanded,
  onKeyUp,
  onKeyDown,
  ariaLabel,
  screenreaderContentId,
  variant,
  icon,
  onClick,
}: IExpandableSectionContext & {
  children: ReactNode;
}) {
  return (
    <span
      className={styles['header-container-button']}
      role="button"
      tabIndex={0}
      onKeyUp={onKeyUp}
      onKeyDown={onKeyDown}
      onClick={isContainer ? onClick : undefined}
      aria-label={ariaLabel}
      // Do not use aria-labelledby={id} but ScreenreaderOnly because safari+VO does not read headerText in this case.
      aria-labelledby={ariaLabel || !isContainer ? undefined : screenreaderContentId}
      aria-controls={ariaControls}
      aria-expanded={expanded}
    >
      <span className={clsx(styles['icon-container'], styles[`icon-container-${variant}`])}>{icon}</span>
      <span>{children}</span>
    </span>
  );
}
