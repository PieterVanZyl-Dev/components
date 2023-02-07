// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { useAppLayoutInternals } from './context';
import styles from './styles.css.js';

export default function Background() {
  const {
    breadcrumbs,
    contentHeader,
    dynamicOverlapHeight,
    hasNotificationsContent,
    hasStickyBackground,
    isMobile,
    stickyNotifications,
  } = useAppLayoutInternals();

  if (!hasNotificationsContent && (!breadcrumbs || isMobile) && !contentHeader && dynamicOverlapHeight <= 0) {
    return null;
  }

  return (
    <div className={clsx(styles.background, 'awsui-context-content-header')}>
      <div
        className={clsx(styles['notifications-breadcrumbs-header-main'], {
          [styles['has-notifications-content']]: hasNotificationsContent,
          [styles['has-sticky-background']]: hasStickyBackground,
          [styles['sticky-notifications']]: stickyNotifications,
        })}
      />

      <div
        className={clsx(styles.overlap, {
          [styles['has-sticky-background']]: hasStickyBackground,
        })}
      />
    </div>
  );
}
