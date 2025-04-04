import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { useOkapiKy } from '@folio/stripes/core';
import {
  useExchangeRateSource,
  useShowCallout,
} from '@folio/stripes-acq-components';

import { ExchangeRateSourceSettings } from './ExchangeRateSourceSettings';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useExchangeRateSource: jest.fn(),
  useShowCallout: jest.fn(),
}));

const defaultProps = {};

const renderComponent = (props = {}) => render(
  <ExchangeRateSourceSettings
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('ExchangeRateSourceSettings', () => {
  const kyMock = {
    put: jest.fn(() => ({
      json: jest.fn(() => Promise.resolve({})),
    })),
    post: jest.fn(() => ({
      json: jest.fn(() => Promise.resolve({})),
    })),
  };
  const showCalloutMock = jest.fn();

  beforeEach(() => {
    useExchangeRateSource.mockReturnValue({
      refetch: jest.fn(),
    });
    useOkapiKy.mockReturnValue(kyMock);
    useShowCallout.mockReturnValue(showCalloutMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render exchange rate source settings', () => {
    renderComponent();

    expect(screen.getByText('ui-finance.settings.exchangeRateSource.title')).toBeInTheDocument();
  });

  it('should create new exchange rate source', async () => {
    renderComponent();

    await userEvent.click(screen.getByRole('checkbox', { name: 'ui-finance.settings.exchangeRateSource.form.field.enabled' }));
    await userEvent.type(screen.getByRole('textbox', { name: 'ui-finance.settings.exchangeRateSource.form.field.providerUri' }), 'https://example.com');
    await userEvent.click(screen.getByRole('button', { name: 'stripes-acq-components.button.save' }));

    expect(kyMock.post).toHaveBeenCalled();
    expect(showCalloutMock).toHaveBeenCalled();
  });

  it('should update existing exchange rate source', async () => {
    useExchangeRateSource.mockReturnValue({
      exchangeRateSource: { id: '123' },
      refetch: jest.fn(),
    });

    renderComponent();

    await userEvent.click(screen.getByRole('checkbox', { name: 'ui-finance.settings.exchangeRateSource.form.field.enabled' }));
    await userEvent.type(screen.getByRole('textbox', { name: 'ui-finance.settings.exchangeRateSource.form.field.providerUri' }), 'https://example.com');
    await userEvent.click(screen.getByRole('button', { name: 'stripes-acq-components.button.save' }));

    expect(kyMock.put).toHaveBeenCalled();
    expect(showCalloutMock).toHaveBeenCalled();
  });

  it('should handle request errors', async () => {
    kyMock.post.mockReturnValueOnce({
      json: jest.fn().mockRejectedValueOnce(({
        response: {
          clone: () => ({
            json: jest.fn().mockReturnValue({ message: 'Error message' }),
          }),
        },
      })),
    });
    renderComponent();

    await userEvent.click(screen.getByRole('checkbox', { name: 'ui-finance.settings.exchangeRateSource.form.field.enabled' }));
    await userEvent.type(screen.getByRole('textbox', { name: 'ui-finance.settings.exchangeRateSource.form.field.providerUri' }), 'https://example.com');
    await userEvent.click(screen.getByRole('button', { name: 'stripes-acq-components.button.save' }));

    expect(showCalloutMock).toHaveBeenCalledWith(expect.objectContaining({ type: 'error' }));
  });
});
