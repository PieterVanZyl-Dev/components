// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import React from 'react';
import { Breakpoint } from '../internal/breakpoints';

export interface ContainerProps extends BaseComponentProps {
  /**
   * Heading element of the container. Use the [header component](/components/header/).
   */
  header?: React.ReactNode;

  /**
   * Determines whether the container header has padding. If `true`, removes the default padding from the header.
   */
  disableHeaderPaddings?: boolean;

  media?: {
    /**
     * Use this slot to render your media element.
     */
    content?: React.ReactNode;

    /**
     * Defines the media slot's orientation within the container.
     */
    orientation?:
      | MediaDefinition.Orientation
      | ReadonlyArray<MediaDefinition.BreakpointMapping<MediaDefinition.Orientation>>;

    /**
     * Defines the width of the media slot when vertically oriented. Corresponds to the `width` CSS-property.
     * When this value is set, the media element may be cropped, with `object-fit: cover` centering it.
     * Note: This value is considered only when `orientation` is set to `vertical`.
     * If no width is provided, the media slot will take a maximum of 66% of the container's width.
     */
    width?: MediaDefinition.Dimension | ReadonlyArray<MediaDefinition.BreakpointMapping<MediaDefinition.Dimension>>;

    /**
     * Defines the height of the vertically oriented media slot. Corresponds to the `height` CSS-property.
     * When this value is set, the media element may be cropped, with `object-fit: cover` centering it.
     * Note: This value is only considered if `orientation` is set to `vertical`.
     * If no height is provided, the media slot will be displayed at its full height.
     */
    height?: MediaDefinition.Dimension | ReadonlyArray<MediaDefinition.BreakpointMapping<MediaDefinition.Dimension>>;
  };

  /**
   * Main content of the container.
   */
  children?: React.ReactNode;

  /**
   * Determines whether the container content has padding. If `true`, removes the default padding from the content area.
   */
  disableContentPaddings?: boolean;

  /**
   * Enabling this property will make the container to fit into available height. If content is too short, the container
   * will stretch, if too long, the container will shrink and show vertical scrollbar.
   *
   * Use this property to align heights of multiple containers displayed in a single row. It is recommended to stretch
   * all containers to the height of the longest one, to avoid extra vertical scroll areas.
   */
  fitHeight?: boolean;

  /**
   * Footer of the container.
   */
  footer?: React.ReactNode;

  /**
   * Specify a container variant with one of the following:
   * * `default` - Use this variant in standalone context.
   * * `stacked` - Use this variant adjacent to other stacked containers (such as a container,
   *               table).
   * @visualrefresh `stacked` variant
   */
  variant?: 'default' | 'stacked';
}

export namespace MediaDefinition {
  export type Orientation = 'horizontal' | 'vertical';
  export type Dimension = string | number;
  export type BreakpointMapping<T> = Partial<Record<Breakpoint, T>>;
}
