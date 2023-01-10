// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { Box, Button, Container, Link, StatusIndicator } from '~components';
import ScreenshotArea from '../../utils/screenshot-area';
import Table from '~components/table/composition';

export default function () {
  const wrapLines = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  return (
    <>
      <h1>Table permutations</h1>

      <ScreenshotArea disableAnimations={true}>
        <Container>
          <Table.Table>
            <Table.Head>
              <Table.Row>
                <Table.Header>Property</Table.Header>
                <Table.Header>Type</Table.Header>
                <Table.Header>Value</Table.Header>
              </Table.Row>
            </Table.Head>

            <Table.Body>
              <Table.Row>
                <Table.DataCell>
                  <Link href="#">
                    Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color
                    Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color
                    Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color
                    Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color
                    Color Color
                  </Link>
                </Table.DataCell>

                <Table.DataCell>
                  String String String String String String String String String String String String String String
                  String String String String String String String String String String String String String String
                  String String String String String String String String String String String String String String
                  String String String String String String String String String String String String String String
                </Table.DataCell>

                <Table.DataCell>#000000</Table.DataCell>
              </Table.Row>

              <Table.Row>
                <Table.DataCell>
                  <Link href="#">
                    Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width
                    Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width
                    Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width
                    Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width
                    Width Width
                  </Link>
                </Table.DataCell>

                <Table.DataCell>
                  Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer
                  Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer
                  Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer
                  Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer
                  Integer Integer
                </Table.DataCell>

                <Table.DataCell>100</Table.DataCell>
              </Table.Row>

              <Table.Row>
                <Table.DataCell>
                  <Link href="#">
                    Height Height Height Height Height Height Height Height Height Height Height Height Height Height
                    Height Height Height Height Height Height Height Height Height Height Height Height Height Height
                  </Link>
                </Table.DataCell>

                <Table.DataCell>
                  Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer
                  Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer
                  Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer
                  Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer
                  Integer Integer
                </Table.DataCell>

                <Table.DataCell>200</Table.DataCell>
              </Table.Row>
            </Table.Body>
          </Table.Table>
        </Container>

        <div style={{ marginTop: '20px' }} />

        <Container>
          <Table.Overflow>
            <Table.Table>
              <Table.Head>
                <Table.Row>
                  <Table.Header>Property</Table.Header>
                  <Table.Header>Type</Table.Header>
                  <Table.Header>Value</Table.Header>
                </Table.Row>
              </Table.Head>

              <Table.Body>
                <Table.Row>
                  <Table.DataCell style={wrapLines}>
                    <Link href="#">
                      Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color
                      Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color
                      Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color
                      Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color Color
                      Color Color
                    </Link>
                  </Table.DataCell>

                  <Table.DataCell style={wrapLines}>
                    String String String String String String String String String String String String String String
                    String String String String String String String String String String String String String String
                    String String String String String String String String String String String String String String
                    String String String String String String String String String String String String String String
                  </Table.DataCell>

                  <Table.DataCell style={wrapLines}>#000000</Table.DataCell>
                </Table.Row>

                <Table.Row>
                  <Table.DataCell style={wrapLines}>
                    <Link href="#">
                      Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width
                      Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width
                      Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width
                      Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width Width
                      Width Width
                    </Link>
                  </Table.DataCell>

                  <Table.DataCell style={wrapLines}>
                    Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer
                    Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer
                    Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer
                    Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer
                    Integer Integer
                  </Table.DataCell>

                  <Table.DataCell style={wrapLines}>100</Table.DataCell>
                </Table.Row>

                <Table.Row>
                  <Table.DataCell style={wrapLines}>
                    <Link href="#">
                      Height Height Height Height Height Height Height Height Height Height Height Height Height Height
                      Height Height Height Height Height Height Height Height Height Height Height Height Height Height
                    </Link>
                  </Table.DataCell>

                  <Table.DataCell style={wrapLines}>
                    Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer
                    Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer
                    Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer
                    Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer Integer
                    Integer Integer
                  </Table.DataCell>

                  <Table.DataCell style={wrapLines}>200</Table.DataCell>
                </Table.Row>
              </Table.Body>
            </Table.Table>
          </Table.Overflow>
        </Container>

        <div style={{ marginTop: '20px' }} />

        <Container>
          <Table.Table>
            <Table.Head>
              <Table.Row>
                <Table.Header>Text</Table.Header>

                <Table.Header>Number</Table.Header>
              </Table.Row>
            </Table.Head>

            <Table.Body>
              <Table.Row>
                <Table.DataCell colSpan="2">
                  <Box margin={{ bottom: 'xxs', top: 'xxs' }} textAlign="center">
                    <StatusIndicator type="loading">Loading items</StatusIndicator>
                  </Box>
                </Table.DataCell>
              </Table.Row>
            </Table.Body>
          </Table.Table>
        </Container>

        <div style={{ marginTop: '20px' }} />

        <Container>
          <Table.Table>
            <Table.Head>
              <Table.Row>
                <Table.Header>Text</Table.Header>

                <Table.Header>Number</Table.Header>
              </Table.Row>
            </Table.Head>

            <Table.Body>
              <Table.Row>
                <Table.DataCell colSpan="2">
                  <Box margin={{ bottom: 'xxs', top: 'xxs' }} textAlign="center">
                    <Box variant="strong" textAlign="center">
                      No resources
                    </Box>

                    <Box variant="p" padding={{ bottom: 's' }}>
                      No resources to display.
                    </Box>

                    <Button>Create resource</Button>
                  </Box>
                </Table.DataCell>
              </Table.Row>
            </Table.Body>
          </Table.Table>
        </Container>

        <div style={{ marginTop: '20px' }} />

        <Container>
          <Table.Table>
            <Table.Head>
              <Table.Row>
                <Table.Header>Text</Table.Header>

                <Table.Header>Number</Table.Header>
              </Table.Row>
            </Table.Head>

            <Table.Body>
              <Table.Row>
                <Table.DataCell>
                  <Link>One</Link>
                </Table.DataCell>

                <Table.DataCell>0</Table.DataCell>
              </Table.Row>

              <Table.Row>
                <Table.DataCell>
                  <Link>Two</Link>
                </Table.DataCell>

                <Table.DataCell>1</Table.DataCell>
              </Table.Row>

              <Table.Row>
                <Table.DataCell>
                  <Link>Three</Link>
                </Table.DataCell>

                <Table.DataCell>2</Table.DataCell>
              </Table.Row>
            </Table.Body>

            <Table.Footer>
              <Table.Row>
                <Table.DataCell colSpan="2">footer</Table.DataCell>
              </Table.Row>
            </Table.Footer>
          </Table.Table>
        </Container>

        <div style={{ marginTop: '20px' }} />

        <Container>
          <Table.Table>
            <Table.Head>
              <Table.Row>
                <Table.Header></Table.Header>

                <Table.Header>Text</Table.Header>

                <Table.Header>Number</Table.Header>
              </Table.Row>
            </Table.Head>

            <Table.Body>
              <Table.Row>
                <Table.DataCell></Table.DataCell>

                <Table.DataCell>
                  <Link>One</Link>
                </Table.DataCell>

                <Table.DataCell>0</Table.DataCell>
              </Table.Row>

              <Table.Row>
                <Table.DataCell></Table.DataCell>

                <Table.DataCell>
                  <Link>Two</Link>
                </Table.DataCell>

                <Table.DataCell>1</Table.DataCell>
              </Table.Row>

              <Table.Row>
                <Table.DataCell></Table.DataCell>

                <Table.DataCell>
                  <Link>Three</Link>
                </Table.DataCell>

                <Table.DataCell>2</Table.DataCell>
              </Table.Row>
            </Table.Body>
          </Table.Table>
        </Container>
      </ScreenshotArea>
    </>
  );
}
