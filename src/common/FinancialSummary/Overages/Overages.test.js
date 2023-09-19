import React from 'react';
import { render } from '@folio/jest-config-stripes/testing-library/react';
import { IntlProvider } from 'react-intl';

import Overages from './Overages';

const TEST_DATA = {
  overEncumbrance: 100,
};

const renderOverages = (data = TEST_DATA, currency = 'USD') => (render(
  <IntlProvider locale="en">
    <Overages
      data={data}
      currency={currency}
    />
  </IntlProvider>,
));

describe('Overages component', () => {
  it('should display amounts', () => {
    const { getByText } = renderOverages();

    expect(getByText('$100.00')).toBeDefined();
  });
});
