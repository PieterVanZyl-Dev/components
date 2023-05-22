// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import Container from '../../../lib/components/container';

import { FunnelMetrics, setFunnelMetrics } from '../../../lib/components/internal/analytics';

import {
  AnalyticsFunnel,
  AnalyticsFunnelStep,
} from '../../../lib/components/internal/analytics/components/analytics-funnel';

const mockedFunnelInteractionId = 'mocked-funnel-id';
function mockFunnelMetrics() {
  setFunnelMetrics({
    funnelStart: jest.fn(() => mockedFunnelInteractionId),
    funnelError: jest.fn(),
    funnelComplete: jest.fn(),
    funnelSuccessful: jest.fn(),
    funnelCancelled: jest.fn(),
    funnelStepStart: jest.fn(),
    funnelStepComplete: jest.fn(),
    funnelStepNavigation: jest.fn(),
    funnelSubStepStart: jest.fn(),
    funnelSubStepComplete: jest.fn(),
    funnelSubStepError: jest.fn(),
    helpPanelInteracted: jest.fn(),
    externalLinkInteracted: jest.fn(),
  });
}

describe('Funnel Analytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFunnelMetrics();
  });

  test('renders normally when outside the context of a funnel', () => {
    render(<Container />);
    // No error occurred if the component rendered successfully
  });

  test('adds additional analytics attributes', () => {
    const { getByTestId } = render(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1}>
        <AnalyticsFunnelStep stepNumber={2} stepNameSelector=".step-name-selector">
          <Container data-testid="container">Hello</Container>
        </AnalyticsFunnelStep>
      </AnalyticsFunnel>
    );

    expect(getByTestId('container')).toHaveAttribute('data-analytics-funnel-substep', expect.any(String));
  });

  test('sends funnelSubStepStart and funnelSubStepComplete metric when focussed and blurred', () => {
    const { getByTestId } = render(
      <AnalyticsFunnel funnelType="single-page" optionalStepNumbers={[]} totalFunnelSteps={1}>
        <AnalyticsFunnelStep stepNumber={2} stepNameSelector=".step-name-selector">
          <Container>
            <input data-testid="input" />
          </Container>
        </AnalyticsFunnelStep>
      </AnalyticsFunnel>
    );

    expect(FunnelMetrics.funnelSubStepStart).toHaveBeenCalledTimes(0);

    fireEvent.focus(getByTestId('input'));
    fireEvent.blur(getByTestId('input'));

    expect(FunnelMetrics.funnelSubStepStart).toHaveBeenCalledTimes(1);
    expect(FunnelMetrics.funnelSubStepComplete).toHaveBeenCalledTimes(1);
  });
});
