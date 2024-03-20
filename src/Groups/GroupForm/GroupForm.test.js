import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { useHistory } from 'react-router';
import { Form } from 'react-final-form';
import { render } from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';

import { HasCommand } from '@folio/stripes/components';

import { GROUPS_ROUTE } from '../../common/const';
import GroupForm from './GroupForm';

jest.mock('@folio/stripes-acq-components/lib/AcqUnits/AcqUnitsField', () => {
  return () => <span>AcqUnitsField</span>;
});
jest.mock('@folio/stripes-components/lib/Commander', () => ({
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
}));
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: jest.fn(),
}));

const defaultProps = {
  initialValues: {},
  onCancel: jest.fn(),
  form: {},
  onSubmit: jest.fn(),
  pristine: false,
  submitting: false,
};

const renderGroupForm = (props = defaultProps) => (render(
  <MemoryRouter>
    <Form
      onSubmit={jest.fn}
      render={() => (
        <GroupForm
          {...props}
        />
      )}
    />
  </MemoryRouter>,
));

describe('GroupForm component', () => {
  it('should display title for new group', () => {
    const { getByText } = renderGroupForm();

    expect(getByText('ui-finance.groups.form.title.create')).toBeDefined();
  });

  it('should display title for editing group', () => {
    const { getByText } = renderGroupForm({ ...defaultProps, initialValues: { id: 'groupId' } });

    expect(getByText('ui-finance.groups.form.title.edit')).toBeDefined();
  });

  it('should display pane footer', () => {
    const { getByText } = renderGroupForm();

    expect(getByText('stripes-acq-components.FormFooter.cancel')).toBeDefined();
    expect(getByText('stripes-components.saveAndClose')).toBeDefined();
  });

  describe('Close form', () => {
    it('should close the group form', async () => {
      const { getByText } = renderGroupForm();

      await user.click(getByText('stripes-acq-components.FormFooter.cancel'));

      expect(defaultProps.onCancel).toHaveBeenCalled();
    });
  });

  describe('Shortcuts', () => {
    beforeEach(() => {
      HasCommand.mockClear();
    });

    it('should cancel form when cancel shortcut is called', () => {
      const pushMock = jest.fn();

      useHistory.mockClear().mockReturnValue({
        push: pushMock,
      });

      renderGroupForm();
      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'cancel').handler();

      expect(defaultProps.onCancel).toHaveBeenCalled();
    });

    it('should navigate to list view when search shortcut is called', () => {
      const pushMock = jest.fn();

      useHistory.mockClear().mockReturnValue({
        push: pushMock,
      });

      renderGroupForm();
      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'search').handler();

      expect(pushMock).toHaveBeenCalledWith(GROUPS_ROUTE);
    });
  });
});
