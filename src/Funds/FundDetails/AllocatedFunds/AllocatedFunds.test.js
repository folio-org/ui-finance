import React from 'react';
import { render } from '@testing-library/react';

import AllocatedFunds from './AllocatedFunds';

const testLabelId = 'allocatedFundsLabelId';
const testAllocatedFunds = 'fund';

const renderAllocatedFunds = ({
  labelId = testLabelId,
  allocatedFunds,
}) => (render(
  <AllocatedFunds
    labelId={labelId}
    allocatedFunds={allocatedFunds}
  />,
));

describe('AllocatedFunds component', () => {
  it('should display allocated funds', () => {
    const { getByText } = renderAllocatedFunds({ allocatedFunds: testAllocatedFunds });

    expect(getByText(testLabelId)).toBeDefined();
    expect(getByText(testAllocatedFunds)).toBeDefined();
  });

  it('should display hyphen', () => {
    const { queryByText } = renderAllocatedFunds({});

    expect(queryByText('-')).toBeDefined();
  });
});
