import React from 'react';
import { MemoryRouter } from 'react-router';
import { render, screen } from '@testing-library/react';

import CreateFund from './CreateFund';

jest.mock('../FundForm', () => ({
  FundFormContainer: jest.fn().mockReturnValue('FundFormContainer'),
}));

const renderCreateFund = (props) => render(
  <CreateFund
    location={{}}
    history={{}}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('CreateFund', () => {
  it('should display fund form', () => {
    renderCreateFund();

    expect(screen.getByText('FundFormContainer')).toBeDefined();
  });
});
