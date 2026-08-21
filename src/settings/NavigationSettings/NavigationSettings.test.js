import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import {
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';
import {
  ResponseErrorsContainer,
  useShowCallout,
} from '@folio/stripes-acq-components';

import { NavigationSettings } from './NavigationSettings';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useShowCallout: jest.fn(),
  ResponseErrorsContainer: {
    create: jest.fn(),
  },
}));

const queryClient = new QueryClient();
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter>
      {children}
    </MemoryRouter>
  </QueryClientProvider>
);

const renderComponent = () => render(<NavigationSettings />, { wrapper });

describe('NavigationSettings', () => {
  const mockGet = jest.fn();
  const mockPost = jest.fn();
  const mockPut = jest.fn();
  const showCalloutMock = jest.fn();
  const hasPermMock = jest.fn();

  beforeEach(() => {
    queryClient.clear();

    mockGet.mockReturnValue({ json: jest.fn().mockResolvedValue({ items: [] }) });
    mockPost.mockReturnValue({ json: jest.fn().mockResolvedValue({}) });
    mockPut.mockReturnValue({ json: jest.fn().mockResolvedValue({}) });

    useOkapiKy.mockClear().mockReturnValue({
      get: mockGet,
      post: mockPost,
      put: mockPut,
    });
    useShowCallout.mockClear().mockReturnValue(showCalloutMock);
    useStripes.mockClear().mockReturnValue({
      hasPerm: hasPermMock,
    });
    hasPermMock.mockReturnValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render navigation settings', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('ui-finance.settings.navigation.description')).toBeInTheDocument();
    });
    expect(screen.getByText('ui-finance.settings.navigation.enableBrowseTab')).toBeInTheDocument();
  });

  it('should render checkbox unchecked when no settings entry exists', async () => {
    renderComponent();

    const checkbox = await screen.findByRole('checkbox');

    expect(checkbox).not.toBeChecked();
  });

  it('should render checkbox checked when a settings entry with value true exists', async () => {
    mockGet.mockReturnValue({
      json: jest.fn().mockResolvedValue({ items: [{ id: 'settings-id', value: true }] }),
    });

    renderComponent();

    const checkbox = await screen.findByRole('checkbox');

    await waitFor(() => expect(checkbox).toBeChecked());
  });

  it('should disable checkbox when user lacks edit permissions', async () => {
    hasPermMock.mockReturnValue(false);

    renderComponent();

    const checkbox = await screen.findByRole('checkbox');

    expect(checkbox).toBeDisabled();
  });

  it('should disable save button initially and enable it once the checkbox is toggled', async () => {
    renderComponent();

    const checkbox = await screen.findByRole('checkbox');
    const saveButton = screen.getByRole('button', { name: 'stripes-acq-components.button.save' });

    expect(saveButton).toBeDisabled();

    await userEvent.click(checkbox);

    await waitFor(() => {
      expect(saveButton).not.toBeDisabled();
    });
  });

  it('should create a new settings entry via POST when none exists yet', async () => {
    renderComponent();

    const checkbox = await screen.findByRole('checkbox');
    const saveButton = screen.getByRole('button', { name: 'stripes-acq-components.button.save' });

    await userEvent.click(checkbox);
    await waitFor(() => expect(saveButton).not.toBeDisabled());
    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith(
        'settings/entries',
        { json: expect.objectContaining({ scope: 'ui-finance', key: 'enableBrowseTab', value: true }) },
      );
      expect(showCalloutMock).toHaveBeenCalledWith({
        messageId: 'ui-finance.settings.navigation.submit.success',
      });
    });
  });

  it('should update the existing settings entry via PUT when one already exists', async () => {
    mockGet.mockReturnValue({
      json: jest.fn().mockResolvedValue({ items: [{ id: 'settings-id', value: true }] }),
    });

    renderComponent();

    const checkbox = await screen.findByRole('checkbox');

    await waitFor(() => expect(checkbox).toBeChecked());

    const saveButton = screen.getByRole('button', { name: 'stripes-acq-components.button.save' });

    await userEvent.click(checkbox);
    await waitFor(() => expect(saveButton).not.toBeDisabled());
    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(mockPut).toHaveBeenCalledWith(
        'settings/entries/settings-id',
        { json: expect.objectContaining({ id: 'settings-id', scope: 'ui-finance', key: 'enableBrowseTab', value: false }) },
      );
    });
  });

  it('should handle request errors with error message', async () => {
    const errorMessage = 'Test error message';
    const errorHandler = {
      getError: jest.fn(() => ({ message: errorMessage })),
    };

    ResponseErrorsContainer.create.mockResolvedValue({ handler: errorHandler });

    mockPost.mockReturnValueOnce({
      json: jest.fn().mockRejectedValueOnce({ response: {} }),
    });

    renderComponent();

    const checkbox = await screen.findByRole('checkbox');
    const saveButton = screen.getByRole('button', { name: 'stripes-acq-components.button.save' });

    await userEvent.click(checkbox);
    await waitFor(() => expect(saveButton).not.toBeDisabled());
    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(showCalloutMock).toHaveBeenCalledWith({
        type: 'error',
        message: errorMessage,
      });
    });
  });

  it('should handle request errors without error message', async () => {
    const errorHandler = {
      getError: jest.fn(() => ({ message: null })),
    };

    ResponseErrorsContainer.create.mockResolvedValue({ handler: errorHandler });

    mockPost.mockReturnValueOnce({
      json: jest.fn().mockRejectedValueOnce({ response: {} }),
    });

    renderComponent();

    const checkbox = await screen.findByRole('checkbox');
    const saveButton = screen.getByRole('button', { name: 'stripes-acq-components.button.save' });

    await userEvent.click(checkbox);
    await waitFor(() => expect(saveButton).not.toBeDisabled());
    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(showCalloutMock).toHaveBeenCalledWith({
        type: 'error',
        messageId: 'ui-finance.settings.navigation.submit.error.generic',
      });
    });
  });

  it('should not enable save button when checkbox is toggled and user lacks permissions', async () => {
    hasPermMock.mockReturnValue(false);

    renderComponent();

    const checkbox = await screen.findByRole('checkbox');
    const saveButton = screen.getByRole('button', { name: 'stripes-acq-components.button.save' });

    expect(saveButton).toBeDisabled();

    await userEvent.click(checkbox);

    expect(saveButton).toBeDisabled();
  });
});
