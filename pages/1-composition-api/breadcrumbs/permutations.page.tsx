// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { Box, BreadcrumbGroup, Container, Grid, Icon, Link, Popover, SpaceBetween } from '~components';
import Breadcrumbs from './index';
import ScreenshotArea from '../../utils/screenshot-area';

export default function BreadcrumbsPermutations() {
  return (
    <ScreenshotArea disableAnimations={true}>
      <SpaceBetween size="m">
        <Container>
          <BreadcrumbGroup
            items={[
              { text: 'First', href: `#` },
              { text: 'Second', href: `#` },
              { text: 'Third', href: `#` },
            ]}
          />
        </Container>

        <Container>
          <Breadcrumbs.List>
            <Breadcrumbs.ListItem>
              <Link href="#">First</Link>
              <Icon name="angle-right" variant="subtle" />
            </Breadcrumbs.ListItem>

            <Breadcrumbs.ListItem>
              <Link href="#">Second</Link>
              <Icon name="angle-right" variant="subtle" />
            </Breadcrumbs.ListItem>

            <Breadcrumbs.ListItem>
              <Box color="text-status-inactive" fontWeight="bold">
                Third
              </Box>
            </Breadcrumbs.ListItem>
          </Breadcrumbs.List>
        </Container>

        <Container>
          <Breadcrumbs.List>
            <Breadcrumbs.ListItem>
              <Link href="#">Products</Link>
              <Box color="text-status-inactive" fontSize="heading-m">
                /
              </Box>
            </Breadcrumbs.ListItem>

            <Breadcrumbs.ListItem>
              <Link href="#">Analytics</Link>
              <Box color="text-status-inactive" fontSize="heading-m">
                /
              </Box>
            </Breadcrumbs.ListItem>

            <Breadcrumbs.ListItem>
              <Link href="#">Amazon Athena</Link>
              <Box color="text-status-inactive" fontSize="heading-m">
                /
              </Box>
            </Breadcrumbs.ListItem>

            <Breadcrumbs.ListItem>
              <Box color="text-body-secondary" fontWeight="bold">
                Amazon Athena Features
              </Box>
            </Breadcrumbs.ListItem>
          </Breadcrumbs.List>
        </Container>

        <Container>
          <Breadcrumbs.List>
            <Breadcrumbs.ListItem>
              <Icon name="folder" variant="subtle" />
              <Link href="#">components</Link>
              <Box color="text-status-inactive" fontSize="heading-m">
                /
              </Box>
            </Breadcrumbs.ListItem>

            <Breadcrumbs.ListItem>
              <Icon name="folder" variant="subtle" />
              <Link href="#">src</Link>
              <Box color="text-status-inactive" fontSize="heading-m">
                /
              </Box>
            </Breadcrumbs.ListItem>

            <Breadcrumbs.ListItem>
              <Icon name="folder" variant="subtle" />
              <Link href="#">app-layout</Link>
              <Box color="text-status-inactive" fontSize="heading-m">
                /
              </Box>
            </Breadcrumbs.ListItem>

            <Breadcrumbs.ListItem>
              <Icon name="folder" variant="subtle" />
              <Link href="#">visual-refresh</Link>
              <Box color="text-status-inactive" fontSize="heading-m">
                /
              </Box>
            </Breadcrumbs.ListItem>

            <Breadcrumbs.ListItem>
              <Icon name="file" variant="subtle" />
              <Box color="text-body-secondary" fontWeight="normal">
                context.tsx
              </Box>
              <Box color="text-status-inactive" fontSize="heading-m">
                /
              </Box>
            </Breadcrumbs.ListItem>

            <Breadcrumbs.ListItem>
              <Box color="text-body-secondary" fontWeight="bold">
                <Popover
                  fixedWidth={true}
                  header="Code definitions"
                  position="bottom"
                  size="medium"
                  content={
                    <Grid
                      disableGutters={true}
                      gridDefinition={[
                        { colspan: 9 },
                        { colspan: 3 },
                        { colspan: 9 },
                        { colspan: 3 },
                        { colspan: 9 },
                        { colspan: 3 },
                        { colspan: 9 },
                        { colspan: 3 },
                        { colspan: 9 },
                        { colspan: 3 },
                        { colspan: 9 },
                        { colspan: 3 },
                      ]}
                    >
                      <Link href="#">handleNavigationChange</Link>
                      <Box variant="awsui-key-label">Function</Box>
                      <Link href="#">handleToolsChange</Link>
                      <Box variant="awsui-key-label">Function</Box>
                      <Link href="#">handleBodyScroll</Link>
                      <Box variant="awsui-key-label">Function</Box>
                      <Link href="#">openTools</Link>
                      <Box variant="awsui-key-label">Function</Box>
                      <Link href="#">handleSplitPanelChange</Link>
                      <Box variant="awsui-key-label">Function</Box>
                      <Link href="#">handleMainOffsetLeft</Link>
                      <Box variant="awsui-key-label">Function</Box>
                    </Grid>
                  }
                >
                  Jump to
                </Popover>
              </Box>
            </Breadcrumbs.ListItem>
          </Breadcrumbs.List>
        </Container>
      </SpaceBetween>
    </ScreenshotArea>
  );
}
