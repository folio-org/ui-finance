import React from 'react';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import ConnectionListing from './ConnectionListing';

const FUNDS = [
  {
    id: '2',
    name: 'fund 2',
    allocated: 600,
  },
  {
    id: '1',
    name: 'fund 1',
    allocated: 300,
  },
];

const renderComponent = ({
  openItem = () => { },
}) => (render(
  <IntlProvider locale="en">
    <MemoryRouter>
      <ConnectionListing
        items={FUNDS}
        openItem={openItem}
      />
    </MemoryRouter>
  </IntlProvider>,
));

describe('ConnectionListing', () => {
  it('should default sort list by nae', () => {
    renderComponent({});
    const names = screen.getAllByTestId('nameColumn');

    expect(names[0].textContent).toBe('fund 1');
  });

  it('should sort list by name in reverse', () => {
    renderComponent({});
    user.click(screen.getByText('ui-finance.item.name'));
    const names = screen.getAllByTestId('nameColumn');

    expect(names[0].textContent).toBe('fund 2');
  });

  it('should sort list by allocated', () => {
    renderComponent({});
    user.click(screen.getByText('ui-finance.item.allocated'));
    const names = screen.getAllByTestId('nameColumn');

    expect(names[0].textContent).toBe('fund 2');
  });
});
