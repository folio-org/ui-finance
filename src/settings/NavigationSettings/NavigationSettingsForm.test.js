import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { Form } from 'react-final-form';

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
    onSubmit: providedOnSubmit,
  } = props;

  // Always ensure onSubmit is a function
  const onSubmit = providedOnSubmit || (() => {});

  return render(
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      render={(formProps) => (
        <NavigationSettingsForm
          form={formProps.form}
          handleSubmit={formProps.handleSubmit}
          isNonInteractive={isNonInteractive}
        />
      )}
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
    renderComponent({ onSubmit: onSubmitMock });

    expect(screen.getByText('ui-finance.settings.navigation.title')).toBeInTheDocument();
    expect(screen.getByText('ui-finance.settings.navigation.description')).toBeInTheDocument();
    expect(screen.getByText('ui-finance.settings.navigation.enableBrowseTab')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'stripes-acq-components.button.save' })).toBeInTheDocument();
  });

  it('should render checkbox unchecked by default', () => {
    renderComponent({ onSubmit: onSubmitMock });

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('should render checkbox checked when initial value is true', () => {
    renderComponent({
      onSubmit: onSubmitMock,
      initialValues: { [FORM_FIELDS_NAMES.enabled]: true },
    });

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should disable checkbox when isNonInteractive is true', () => {
    renderComponent({
      onSubmit: onSubmitMock,
      isNonInteractive: true,
    });

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
  });

  it('should enable checkbox when isNonInteractive is false', () => {
    renderComponent({
      onSubmit: onSubmitMock,
      isNonInteractive: false,
    });

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeDisabled();
  });

  it('should disable save button initially when form is pristine', () => {
    renderComponent({ onSubmit: onSubmitMock });

    const saveButton = screen.getByRole('button', { name: 'stripes-acq-components.button.save' });
    expect(saveButton).toBeDisabled();
  });

  it('should enable save button when checkbox is toggled', async () => {
    renderComponent({ onSubmit: onSubmitMock });

    const checkbox = screen.getByRole('checkbox');
    const saveButton = screen.getByRole('button', { name: 'stripes-acq-components.button.save' });

    expect(saveButton).toBeDisabled();

    await userEvent.click(checkbox);

    await waitFor(() => {
      expect(saveButton).not.toBeDisabled();
    });
  });

  it('should disable save button when isNonInteractive is true', () => {
    renderComponent({
      onSubmit: onSubmitMock,
      isNonInteractive: true,
    });

    const saveButton = screen.getByRole('button', { name: 'stripes-acq-components.button.save' });
    expect(saveButton).toBeDisabled();
  });

  it('should call onSubmit when save button is clicked', async () => {
    renderComponent({ onSubmit: onSubmitMock });

    const checkbox = screen.getByRole('checkbox');
    const saveButton = screen.getByRole('button', { name: 'stripes-acq-components.button.save' });

    await userEvent.click(checkbox);

    await waitFor(() => {
      expect(saveButton).not.toBeDisabled();
    });

    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledWith(
        { [FORM_FIELDS_NAMES.enabled]: true },
        expect.anything(),
        expect.anything()
      );
    });
  });

  it('should submit form with enabled: false when checkbox is unchecked', async () => {
    renderComponent({
      onSubmit: onSubmitMock,
      initialValues: { [FORM_FIELDS_NAMES.enabled]: true },
    });

    const checkbox = screen.getByRole('checkbox');
    const saveButton = screen.getByRole('button', { name: 'stripes-acq-components.button.save' });

    // Uncheck the checkbox
    await userEvent.click(checkbox);

    await waitFor(() => {
      expect(saveButton).not.toBeDisabled();
    });

    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledWith(
        { [FORM_FIELDS_NAMES.enabled]: false },
        expect.anything(),
        expect.anything()
      );
    });
  });

  it('should not call onSubmit when save button is disabled', async () => {
    renderComponent({ onSubmit: onSubmitMock });

    const saveButton = screen.getByRole('button', { name: 'stripes-acq-components.button.save' });

    expect(saveButton).toBeDisabled();

    // Try to click disabled button (should not trigger submit)
    await userEvent.click(saveButton);

    expect(onSubmitMock).not.toHaveBeenCalled();
  });

  it('should have correct form id', () => {
    renderComponent({ onSubmit: onSubmitMock });

    const form = document.getElementById('navigation-settings-form');
    expect(form).toBeInTheDocument();
  });

  it('should have correct pane id', () => {
    renderComponent({ onSubmit: onSubmitMock });

    const pane = document.getElementById('navigation-settings');
    expect(pane).toBeInTheDocument();
  });

  it('should display enable browse tab label in bold', () => {
    renderComponent({ onSubmit: onSubmitMock });

    const label = screen.getByText('ui-finance.settings.navigation.enableBrowseTab');
    expect(label).toBeInTheDocument();
    expect(label.tagName).toBe('STRONG');
  });
});

