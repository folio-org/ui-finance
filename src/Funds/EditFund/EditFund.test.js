import React from 'react';
import { MemoryRouter } from 'react-router';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import EditFund from './EditFund';

jest.mock('../FundForm', () => ({
  FundFormContainer: jest.fn().mockReturnValue('FundFormContainer'),
}));

const renderCreateFund = (props) => render(
  <EditFund
    location={{}}
    history={{}}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('EditFund', () => {
  it('should display fund form', () => {
    renderCreateFund();

    expect(screen.getByText('FundFormContainer')).toBeDefined();
  });
});
