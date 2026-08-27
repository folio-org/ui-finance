import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { useStripes } from '@folio/stripes/core';
import {
  ResponseErrorsContainer,
  useShowCallout,
} from '@folio/stripes-acq-components';

import { useNavigationSettings } from '../../common/hooks';
import { NavigationSettings } from './NavigationSettings';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useShowCallout: jest.fn(),
  ResponseErrorsContainer: {
    create: jest.fn(),
  },
}));

jest.mock('../../common/hooks', () => ({
  ...jest.requireActual('../../common/hooks'),
  useNavigationSettings: jest.fn(),
}));

const wrapper = ({ children }) => (
  <MemoryRouter>
    {children}
  </MemoryRouter>
);

const renderComponent = () => render(<NavigationSettings />, { wrapper });

describe('NavigationSettings', () => {
  const showCalloutMock = jest.fn();
  const hasPermMock = jest.fn();
  const saveNavigationSettingsMock = jest.fn();

  beforeEach(() => {
    saveNavigationSettingsMock.mockClear().mockResolvedValue();
    useNavigationSettings.mockClear().mockReturnValue({
      isBrowseTabEnabled: false,
      isLoading: false,
      saveNavigationSettings: saveNavigationSettingsMock,
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

    expect(screen.getByText('ui-finance.settings.navigation.description')).toBeInTheDocument();
    expect(screen.getByText('ui-finance.settings.navigation.enableBrowseTab')).toBeInTheDocument();
  });

  it('should render loading pane while settings are being fetched', async () => {
    useNavigationSettings.mockReturnValue({
      isBrowseTabEnabled: false,
      isLoading: true,
      saveNavigationSettings: saveNavigationSettingsMock,
    });

    renderComponent();

    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('should render checkbox unchecked when browse tab is disabled', async () => {
    renderComponent();

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).not.toBeChecked();
  });

  it('should render checkbox checked when browse tab is enabled', async () => {
    useNavigationSettings.mockReturnValue({
      isBrowseTabEnabled: true,
      isLoading: false,
      saveNavigationSettings: saveNavigationSettingsMock,
    });

    renderComponent();

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toBeChecked();
  });

  it('should disable checkbox when user lacks edit permissions', async () => {
    hasPermMock.mockReturnValue(false);

    renderComponent();

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toBeDisabled();
  });

  it('should disable save button initially and enable it once the checkbox is toggled', async () => {
    renderComponent();

    const checkbox = screen.getByRole('checkbox');
    const saveButton = screen.getByRole('button', { name: 'stripes-acq-components.button.save' });

    expect(saveButton).toBeDisabled();

    await userEvent.click(checkbox);

    await waitFor(() => {
      expect(saveButton).not.toBeDisabled();
    });
  });

  it('should not enable save button when checkbox is toggled and user lacks permissions', async () => {
    hasPermMock.mockReturnValue(false);

    renderComponent();

    const checkbox = screen.getByRole('checkbox');
    const saveButton = screen.getByRole('button', { name: 'stripes-acq-components.button.save' });

    expect(saveButton).toBeDisabled();

    await userEvent.click(checkbox);

    expect(saveButton).toBeDisabled();
  });

  it('should save the toggled value on submit', async () => {
    renderComponent();

    const checkbox = screen.getByRole('checkbox');
    const saveButton = screen.getByRole('button', { name: 'stripes-acq-components.button.save' });

    await userEvent.click(checkbox);
    await waitFor(() => expect(saveButton).not.toBeDisabled());
    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(saveNavigationSettingsMock).toHaveBeenCalledWith(true);
      expect(showCalloutMock).toHaveBeenCalledWith({
        messageId: 'ui-finance.settings.navigation.submit.success',
      });
    });
  });

  it('should show the structured error message when the backend returns a real FOLIO error code', async () => {
    const errorMessage = 'Test error message';
    const errorHandler = {
      getError: jest.fn(() => ({ message: errorMessage, code: 'someSpecificError' })),
    };

    ResponseErrorsContainer.create.mockResolvedValue({ handler: errorHandler });
    saveNavigationSettingsMock.mockRejectedValueOnce({ response: {} });

    renderComponent();

    const checkbox = screen.getByRole('checkbox');
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

  it('should fall back to the generic message when Okapi rejects the request with a non-JSON body (e.g. a raw 403)', async () => {
    const errorHandler = {
      // this is what ResponseErrorsContainer falls back to when the body isn't
      // valid JSON, e.g. a plain-text "Forbidden" from the gateway
      getError: jest.fn(() => ({ message: "Unexpected token 'F', \"Forbidden\" is not valid JSON", code: 'genericError' })),
    };

    ResponseErrorsContainer.create.mockResolvedValue({ handler: errorHandler });
    saveNavigationSettingsMock.mockRejectedValueOnce({ response: {} });

    renderComponent();

    const checkbox = screen.getByRole('checkbox');
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

  it('should handle request errors without error message', async () => {
    const errorHandler = {
      getError: jest.fn(() => ({ message: null })),
    };

    ResponseErrorsContainer.create.mockResolvedValue({ handler: errorHandler });
    saveNavigationSettingsMock.mockRejectedValueOnce({ response: {} });

    renderComponent();

    const checkbox = screen.getByRole('checkbox');
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
});
