// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ExpandableSectionProps } from './interfaces';
import React, { KeyboardEventHandler, MouseEventHandler, ReactNode } from 'react';
import InternalIcon from '../icon/internal';
import clsx from 'clsx';
import styles from './styles.css.js';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import ExpandableSectionContext from './context';
import ExpandableSectionHeaderButton from './expandable-section-header-button';

interface ExpandableDefaultHeaderProps {
  id: string;
  className?: string;
  children?: ReactNode;
  expanded: boolean;
  ariaControls: string;
  ariaLabel?: string;
  onKeyUp: KeyboardEventHandler;
  onKeyDown: KeyboardEventHandler;
  onClick: MouseEventHandler;
  icon: JSX.Element;
  variant: ExpandableSectionProps.Variant;
}

interface ExpandableNavigationHeaderProps extends Omit<ExpandableDefaultHeaderProps, 'onKeyUp' | 'onKeyDown'> {
  ariaLabelledBy?: string;
}

interface ExpandableHeaderTextWrapperProps extends ExpandableDefaultHeaderProps {
  headingTagOverride?: ExpandableSectionProps.HeadingTag;
}

interface ExpandableSectionHeaderProps extends Omit<ExpandableDefaultHeaderProps, 'children' | 'icon'> {
  variant: ExpandableSectionProps.Variant;
  header?: ReactNode;
  headerText?: ReactNode;
  headingTagOverride?: ExpandableSectionProps.HeadingTag;
  ariaLabelledBy?: string;
}

const ExpandableNavigationHeader = ({
  id,
  className,
  onClick,
  ariaLabelledBy,
  ariaLabel,
  ariaControls,
  expanded,
  children,
  icon,
}: ExpandableNavigationHeaderProps) => {
  return (
    <div id={id} className={className} onClick={onClick}>
      <button
        className={styles['icon-container']}
        aria-labelledby={ariaLabelledBy}
        aria-label={ariaLabel}
        aria-controls={ariaControls}
        aria-expanded={expanded}
        type="button"
      >
        {icon}
      </button>
      {children}
    </div>
  );
};

const ExpandableHeaderTextWrapper = ({
  id,
  className,
  onClick,
  ariaLabel,
  ariaControls,
  expanded,
  children,
  icon,
  variant,
  headingTagOverride,
  onKeyUp,
  onKeyDown,
}: ExpandableHeaderTextWrapperProps) => {
  const screenreaderContentId = useUniqueId('expandable-section-header-content-');
  const isContainer = variant === 'container';
  const HeadingTag = headingTagOverride || 'div';
  const headerButtonProps = {
    onKeyUp,
    onKeyDown,
    icon,
    ariaLabel,
    ariaControls,
    onClick,
    expanded,
    screenreaderContentId,
    variant,
    isContainer,
  };
  return (
    <div id={id} className={className} onClick={isContainer ? undefined : onClick}>
      {isContainer ? (
        <ExpandableSectionContext.Provider value={headerButtonProps}>{children}</ExpandableSectionContext.Provider>
      ) : (
        <HeadingTag className={styles['header-wrapper']}>
          <ExpandableSectionHeaderButton {...headerButtonProps}>{children}</ExpandableSectionHeaderButton>
        </HeadingTag>
      )}
    </div>
  );
};

export const ExpandableSectionHeader = ({
  id,
  className,
  variant,
  header,
  headerText,
  headingTagOverride,
  expanded,
  ariaControls,
  ariaLabel,
  ariaLabelledBy,
  onKeyUp,
  onKeyDown,
  onClick,
}: ExpandableSectionHeaderProps) => {
  const icon = (
    <InternalIcon
      size={variant === 'container' ? 'medium' : 'normal'}
      className={clsx(styles.icon, expanded && styles.expanded)}
      name="caret-down-filled"
    />
  );
  const defaultHeaderProps = {
    id: id,
    icon: icon,
    expanded: expanded,
    ariaControls: ariaControls,
    ariaLabel: ariaLabel,
    onClick: onClick,
    variant,
  };

  const triggerClassName = clsx(styles.trigger, styles[`trigger-${variant}`], expanded && styles['trigger-expanded']);
  if (variant === 'navigation') {
    return (
      <ExpandableNavigationHeader
        className={clsx(className, triggerClassName)}
        ariaLabelledBy={ariaLabelledBy}
        {...defaultHeaderProps}
      >
        {header || headerText}
      </ExpandableNavigationHeader>
    );
  }

  return (
    <ExpandableHeaderTextWrapper
      className={clsx(className, triggerClassName, expanded && styles.expanded)}
      headingTagOverride={headingTagOverride}
      onKeyUp={onKeyUp}
      onKeyDown={onKeyDown}
      {...defaultHeaderProps}
    >
      {header || headerText}
    </ExpandableHeaderTextWrapper>
  );
};
