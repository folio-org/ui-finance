import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import NavigationSettingsForm from './NavigationSettingsForm';
import { FORM_FIELDS_NAMES } from './constants';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  usePaneFocus: jest.fn(() => ({ paneTitleRef: { current: null } })),
}));

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  TitleManager: ({ children }) => children,
}));

const defaultInitialValues = {
  [FORM_FIELDS_NAMES.enabled]: false,
};

let onSubmitMock = jest.fn();

const renderComponent = (props = {}) => {
  const {
    initialValues = defaultInitialValues,
    isNonInteractive = false,
    onSubmit = onSubmitMock,
  } = props;

  return render(
    <NavigationSettingsForm
      onSubmit={onSubmit}
      initialValues={initialValues}
      isNonInteractive={isNonInteractive}
    />,
    { wrapper: MemoryRouter },
  );
};

describe('NavigationSettingsForm', () => {
  beforeEach(() => {
    onSubmitMock = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render form with all elements', () => {
    renderComponent();

    expect(screen.getByText('ui-finance.settings.navigation.title')).toBeInTheDocument();
    expect(screen.getByText('ui-finance.settings.navigation.description')).toBeInTheDocument();
    expect(screen.getByText('ui-finance.settings.navigation.enableBrowseTab')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'stripes-acq-components.button.save' })).toBeInTheDocument();
  });

  it('should associate the "Enable browse tab" label with the checkbox for accessibility', () => {
    renderComponent();

    expect(screen.getByRole('checkbox', { name: 'ui-finance.settings.navigation.enableBrowseTab' })).toBeInTheDocument();
  });

  it('should render checkbox unchecked by default', () => {
    renderComponent();

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).not.toBeChecked();
  });

  it('should render checkbox checked when initial value is true', () => {
    renderComponent({
      initialValues: { [FORM_FIELDS_NAMES.enabled]: true },
    });

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toBeChecked();
  });

  it('should disable checkbox when isNonInteractive is true', () => {
    renderComponent({ isNonInteractive: true });

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toBeDisabled();
  });

  it('should enable checkbox when isNonInteractive is false', () => {
    renderComponent({ isNonInteractive: false });

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).not.toBeDisabled();
  });

  it('should disable save button initially when form is pristine', () => {
    renderComponent();

    const saveButton = screen.getByRole('button', { name: 'stripes-acq-components.button.save' });

    expect(saveButton).toBeDisabled();
  });

  it('should enable save button when checkbox is toggled', async () => {
    renderComponent();

    const checkbox = screen.getByRole('checkbox');
    const saveButton = screen.getByRole('button', { name: 'stripes-acq-components.button.save' });

    expect(saveButton).toBeDisabled();

    await userEvent.click(checkbox);

    expect(saveButton).not.toBeDisabled();
  });

  it('should disable save button when isNonInteractive is true', () => {
    renderComponent({ isNonInteractive: true });

    const saveButton = screen.getByRole('button', { name: 'stripes-acq-components.button.save' });

    expect(saveButton).toBeDisabled();
  });

  it('should call onSubmit when save button is clicked', async () => {
    renderComponent();

    const checkbox = screen.getByRole('checkbox');
    const saveButton = screen.getByRole('button', { name: 'stripes-acq-components.button.save' });

    await userEvent.click(checkbox);

    await userEvent.click(saveButton);

    expect(onSubmitMock).toHaveBeenCalledWith(
      { [FORM_FIELDS_NAMES.enabled]: true },
      expect.anything(),
      expect.anything(),
    );
  });

  it('should submit form with enabled: false when checkbox is unchecked', async () => {
    renderComponent({
      initialValues: { [FORM_FIELDS_NAMES.enabled]: true },
    });

    const checkbox = screen.getByRole('checkbox');
    const saveButton = screen.getByRole('button', { name: 'stripes-acq-components.button.save' });

    await userEvent.click(checkbox);

    await userEvent.click(saveButton);

    expect(onSubmitMock).toHaveBeenCalledWith(
      { [FORM_FIELDS_NAMES.enabled]: false },
      expect.anything(),
      expect.anything(),
    );
  });

  it('should not call onSubmit when save button is disabled', async () => {
    renderComponent();

    const saveButton = screen.getByRole('button', { name: 'stripes-acq-components.button.save' });

    await userEvent.click(saveButton);

    expect(onSubmitMock).not.toHaveBeenCalled();
  });

  it('should have correct form id', () => {
    renderComponent();

    const form = document.getElementById('navigation-settings-form');

    expect(form).toBeInTheDocument();
  });

  it('should have correct pane id', () => {
    renderComponent();

    const pane = document.getElementById('navigation-settings');

    expect(pane).toBeInTheDocument();
  });

  it('should display enable browse tab label in bold', () => {
    renderComponent();

    const label = screen.getByText('ui-finance.settings.navigation.enableBrowseTab');

    expect(label).toBeInTheDocument();
    expect(label.tagName).toBe('STRONG');
  });
});
