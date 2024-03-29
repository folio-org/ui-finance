import React from 'react';
import { render } from '@folio/jest-config-stripes/testing-library/react';
import { IntlProvider } from 'react-intl';

import FundingInformation from './FundingInformation';

const TEST_DATA = {
  initialAllocation: 100,
  netTransfers: -10,
  allocationTo: -5,
  allocationFrom: 20,
};

const renderFundingInformation = (data = TEST_DATA, currency = 'USD') => (render(
  <IntlProvider locale="en">
    <FundingInformation
      data={data}
      currency={currency}
    />
  </IntlProvider>,
));

describe('FundingInformation component', () => {
  it('should display amounts', () => {
    const { getByText } = renderFundingInformation();

    expect(getByText('$100.00')).toBeDefined();
    expect(getByText('($10.00)')).toBeDefined();
    expect(getByText('($5.00)')).toBeDefined();
    expect(getByText('$20.00')).toBeDefined();
  });
});
