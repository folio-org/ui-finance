import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { useShowCallout } from '@folio/stripes-acq-components';

import { NavigationSettings, isBrowseTabEnabled } from './NavigationSettings';

const BROWSE_TAB_STORAGE_KEY = 'ui-finance-browse-tab-enabled';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useStripes: jest.fn(() => ({
    hasPerm: jest.fn(),
  })),
  TitleManager: ({ children }) => children,
}));

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useShowCallout: jest.fn(),
  usePaneFocus: jest.fn(() => ({ paneTitleRef: { current: null } })),
}));

const renderComponent = (props = {}) => render(
  <NavigationSettings {...props} />,
  { wrapper: MemoryRouter },
);

describe('NavigationSettings', () => {
  const showCalloutMock = jest.fn();
  const hasPermMock = jest.fn();

  beforeEach(() => {
    localStorage.clear();
    useShowCallout.mockReturnValue(showCalloutMock);

    const { useStripes } = require('@folio/stripes/core');

    useStripes.mockReturnValue({ hasPerm: hasPermMock });
    hasPermMock.mockReturnValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render navigation settings form', () => {
    renderComponent();

    expect(screen.getByText('ui-finance.settings.navigation.title')).toBeInTheDocument();
    expect(screen.getByText('ui-finance.settings.navigation.description')).toBeInTheDocument();
    expect(screen.getByText('ui-finance.settings.navigation.enableBrowseTab')).toBeInTheDocument();
  });

  it('should render checkbox unchecked when localStorage is empty', () => {
    renderComponent();

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).not.toBeChecked();
  });

  it('should render checkbox checked when localStorage has enabled=true', () => {
    localStorage.setItem(BROWSE_TAB_STORAGE_KEY, JSON.stringify({ enabled: true }));

    renderComponent();

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toBeChecked();
  });

  it('should disable checkbox when user lacks edit permissions', () => {
    hasPermMock.mockReturnValue(false);

    renderComponent();

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toBeDisabled();
  });

  it('should enable checkbox when user has edit permissions', () => {
    hasPermMock.mockReturnValue(true);

    renderComponent();

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).not.toBeDisabled();
  });

  it('should disable save button initially (pristine form)', () => {
    renderComponent();

    const saveButton = screen.getByRole('button', { name: 'stripes-acq-components.button.save' });

    expect(saveButton).toBeDisabled();
  });

  it('should enable save button when checkbox is toggled', async () => {
    renderComponent();

    const checkbox = screen.getByRole('checkbox');
    const saveButton = screen.getByRole('button', { name: 'stripes-acq-components.button.save' });

    await userEvent.click(checkbox);

    await waitFor(() => {
      expect(saveButton).not.toBeDisabled();
    });
  });

  it('should save to localStorage and show success callout on submit', async () => {
    renderComponent();

    const checkbox = screen.getByRole('checkbox');
    const saveButton = screen.getByRole('button', { name: 'stripes-acq-components.button.save' });

    await userEvent.click(checkbox);
    await waitFor(() => {
      expect(saveButton).not.toBeDisabled();
    });

    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(showCalloutMock).toHaveBeenCalledWith({
        messageId: 'ui-finance.settings.navigation.submit.success',
      });
    });

    const stored = JSON.parse(localStorage.getItem(BROWSE_TAB_STORAGE_KEY));

    expect(stored.enabled).toBe(true);
  });

  it('should dispatch custom event on successful save', async () => {
    const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');

    renderComponent();

    const checkbox = screen.getByRole('checkbox');
    const saveButton = screen.getByRole('button', { name: 'stripes-acq-components.button.save' });

    await userEvent.click(checkbox);
    await waitFor(() => {
      expect(saveButton).not.toBeDisabled();
    });

    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(dispatchEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'browse-tab-settings-changed',
        }),
      );
    });

    dispatchEventSpy.mockRestore();
  });

  it('should show error callout when localStorage fails', async () => {
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage full');
    });
    jest.spyOn(console, 'error').mockImplementation(() => {});

    renderComponent();

    const checkbox = screen.getByRole('checkbox');
    const saveButton = screen.getByRole('button', { name: 'stripes-acq-components.button.save' });

    await userEvent.click(checkbox);
    await waitFor(() => {
      expect(saveButton).not.toBeDisabled();
    });

    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(showCalloutMock).toHaveBeenCalledWith({
        type: 'error',
        messageId: 'ui-finance.settings.navigation.submit.error.generic',
      });
    });

    Storage.prototype.setItem.mockRestore();
  });

  it('should disable save button when user lacks permissions even after toggle', async () => {
    hasPermMock.mockReturnValue(false);

    renderComponent();

    const saveButton = screen.getByRole('button', { name: 'stripes-acq-components.button.save' });

    expect(saveButton).toBeDisabled();
  });

  it('should handle corrupted localStorage data gracefully', () => {
    localStorage.setItem(BROWSE_TAB_STORAGE_KEY, 'not-valid-json');

    jest.spyOn(console, 'warn').mockImplementation(() => {});

    renderComponent();

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).not.toBeChecked();
  });
});

describe('isBrowseTabEnabled', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return false when localStorage is empty', () => {
    expect(isBrowseTabEnabled()).toBe(false);
  });

  it('should return true when enabled is true in localStorage', () => {
    localStorage.setItem(BROWSE_TAB_STORAGE_KEY, JSON.stringify({ enabled: true }));

    expect(isBrowseTabEnabled()).toBe(true);
  });

  it('should return false when enabled is false in localStorage', () => {
    localStorage.setItem(BROWSE_TAB_STORAGE_KEY, JSON.stringify({ enabled: false }));

    expect(isBrowseTabEnabled()).toBe(false);
  });

  it('should return false when localStorage has invalid JSON', () => {
    localStorage.setItem(BROWSE_TAB_STORAGE_KEY, 'bad-json');

    jest.spyOn(console, 'warn').mockImplementation(() => {});

    expect(isBrowseTabEnabled()).toBe(false);
  });
});
