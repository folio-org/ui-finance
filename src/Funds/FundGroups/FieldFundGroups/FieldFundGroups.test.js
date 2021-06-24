import React from 'react';
import { render, screen } from '@testing-library/react';

import FieldFundGroups from './FieldFundGroups';

jest.mock('react-final-form', () => ({
  // eslint-disable-next-line
  Field: ({ component, ...rest }) => {
    const Component = component;

    return <Component {...rest} />;
  },
}));

const renderFieldFundGroups = (props = {}) => render(<FieldFundGroups {...props} name="name" />);

describe('FieldFundGroups', () => {
  it('should display field label', () => {
    renderFieldFundGroups();

    expect(screen.getByText('ui-finance.fund.information.group')).toBeDefined();
  });
});
