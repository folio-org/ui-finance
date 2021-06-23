import React from 'react';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import ConnectionListing from './ConnectionListing';

const columns = ['name', 'code', 'allocated', 'unavailable', 'available', 'netTransfers'];

const FUNDS = [
  {
    id: '2',
    name: 'fund 2',
    allocated: 600,
    code: 'code-1',
    netTransfers: 100,
    available: 10,
    unavailable: 100,
  },
  {
    id: '1',
    name: 'fund 1',
    allocated: 300,
    code: 'code-2',
    netTransfers: 10,
    available: 100,
    unavailable: 10,
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
        visibleColumns={columns}
      />
    </MemoryRouter>
  </IntlProvider>,
));

describe('ConnectionListing', () => {
  it('should default sort list by name', () => {
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

  it('should sort list by code', () => {
    renderComponent({});
    user.click(screen.getByText('ui-finance.item.code'));
    const names = screen.getAllByTestId('nameColumn');

    expect(names[0].textContent).toBe('fund 1');
  });

  it('should sort list by netTransfers', () => {
    renderComponent({});
    user.click(screen.getByText('ui-finance.item.netTransfers'));
    const names = screen.getAllByTestId('nameColumn');

    expect(names[0].textContent).toBe('fund 2');
  });

  it('should sort list by available', () => {
    renderComponent({});
    user.click(screen.getByText('ui-finance.item.available'));
    const names = screen.getAllByTestId('nameColumn');

    expect(names[0].textContent).toBe('fund 1');
  });

  it('should sort list by unavailable', () => {
    renderComponent({});
    user.click(screen.getByText('ui-finance.item.unavailable'));
    const names = screen.getAllByTestId('nameColumn');

    expect(names[0].textContent).toBe('fund 2');
  });
});
