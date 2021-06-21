import React from 'react';
import { render, screen } from '@testing-library/react';

import RolloverFiscalYearField from './RolloverFiscalYearField';

jest.mock('react-final-form', () => ({
  // eslint-disable-next-line
  Field: ({ component, ...rest }) => {
    const Component = component;

    return <Component {...rest} />;
  },
}));

const renderRolloverFiscalYearField = (props) => render(<RolloverFiscalYearField {...props} />);

describe('RolloverFiscalYearField', () => {
  it('should display rollover fiscal year field', () => {
    renderRolloverFiscalYearField({ fiscalYears: [{}] });

    expect(screen.getByText('ui-finance.budget.fiscalYear')).toBeDefined();
  });
});
