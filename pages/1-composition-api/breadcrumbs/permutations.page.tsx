// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { Container } from '~components';
import Breadcrumbs from '~components/breadcrumb-group/composition';
import ScreenshotArea from '../../utils/screenshot-area';

export default function DescriptionListPermutations() {
  return (
    <ScreenshotArea disableAnimations={true}>
      <Container>
        <Breadcrumbs.Group>
          <Breadcrumbs.Item>System</Breadcrumbs.Item>

          <Breadcrumbs.Item>Components</Breadcrumbs.Item>

          <Breadcrumbs.Item>Breadcrumb group</Breadcrumbs.Item>
        </Breadcrumbs.Group>
      </Container>
    </ScreenshotArea>
  );
}
