import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { useHistory } from 'react-router';
import { Form } from 'react-final-form';
import { render, screen, waitFor, within } from '@testing-library/react';
import user from '@testing-library/user-event';

import {
  HasCommand,
  expandAllSections,
  collapseAllSections,
} from '@folio/stripes/components';

import { FUNDS_ROUTE } from '../../common/const';
import FundForm from './FundForm';

jest.mock('@folio/stripes-acq-components/lib/AcqUnits/AcqUnitsField', () => {
  return () => <span>AcqUnitsField</span>;
});
jest.mock('@folio/stripes-components/lib/Commander', () => ({
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
  expandAllSections: jest.fn(),
  collapseAllSections: jest.fn(),
}));
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: jest.fn(),
}));

const defaultProps = {
  onCancel: jest.fn(),
  form: {},
  onSubmit: jest.fn,
  pristine: false,
  submitting: false,
};

const renderFundForm = (props = {}) => (render(
  <MemoryRouter>
    <Form
      onSubmit={jest.fn}
      render={() => (
        <FundForm
          {...defaultProps}
          {...props}
        />
      )}
    />
  </MemoryRouter>,
));

const funds = [
  { id: 'fund-1', name: 'Foo' },
  { id: 'fund-2', name: 'Bar' },
  { id: 'fund-3', name: 'Baz' },
];

describe('FundForm component', () => {
  it('should display title for new fund', () => {
    const { getByText } = renderFundForm();

    expect(getByText('ui-finance.fund.paneTitle.create')).toBeDefined();
  });

  it('should display pane footer', () => {
    const { getByText } = renderFundForm();

    expect(getByText('stripes-acq-components.FormFooter.cancel')).toBeDefined();
    expect(getByText('ui-finance.saveAndClose')).toBeDefined();
  });

  describe('Close form', () => {
    it('should close the fund form', () => {
      const { getByText } = renderFundForm();

      user.click(getByText('stripes-acq-components.FormFooter.cancel'));

      expect(defaultProps.onCancel).toHaveBeenCalled();
    });
  });

  describe('Validate fund code', () => {
    it('should display validate colon error', async () => {
      renderFundForm();

      const field = screen.getByRole('textbox', { name: /code/i });

      user.type(field, ':');
      user.click(screen.getByText('ui-finance.saveAndClose'));

      await waitFor(() => expect(screen.getByText('ui-finance.validation.mustNotIncludeColon')).toBeInTheDocument());
    });

    it('should display validate required error', async () => {
      renderFundForm();

      const field = screen.getByRole('textbox', { name: /code/i });

      user.type(field, '');
      user.click(screen.getByText('ui-finance.saveAndClose'));

      await waitFor(() => expect(screen.queryByText('stripes-acq-components.validation.required')).toBeInTheDocument());
    });

    it('should filter funds in the \'Transfer from\' field', async () => {
      renderFundForm({ funds });

      const container = (await screen.findByText('ui-finance.fund.information.transferFrom')).parentNode;
      const label = within(container).getByText('ui-finance.fund.information.transferFrom');

      user.click(label);

      // Options before filtering
      funds.forEach((async ({ name }) => {
        expect(within(container).getByText(name)).toBeInTheDocument();
      }));

      user.type(document.activeElement, 'foo');

      // Options after filtering
      expect(within(container).queryByText(funds[0].name)).toBeInTheDocument();
      expect(within(container).queryByText(funds[1].name)).not.toBeInTheDocument();
      expect(within(container).queryByText(funds[2].name)).not.toBeInTheDocument();

      screen.debug(container, 100000);
    });

    it('should select funds options in the \'Transfer to\' field', async () => {
      renderFundForm({ funds });

      const container = (await screen.findByText('ui-finance.fund.information.transferTo')).parentNode;

      funds.forEach(({ name }) => {
        user.click(within(container).queryByText(name));
      });

      expect(within(container).getByText(`${funds.length} items selected`)).toBeInTheDocument();
    });
  });

  describe('Shortcuts', () => {
    beforeEach(() => {
      HasCommand.mockClear();
      expandAllSections.mockClear();
      collapseAllSections.mockClear();
    });

    it('should call expandAllSections when expandAllSections shortcut is called', async () => {
      expandAllSections.mockClear();
      renderFundForm();

      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'expandAllSections').handler();

      expect(expandAllSections).toHaveBeenCalled();
    });

    it('should call collapseAllSections when collapseAllSections shortcut is called', () => {
      collapseAllSections.mockClear();
      renderFundForm();

      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'collapseAllSections').handler();

      expect(collapseAllSections).toHaveBeenCalled();
    });

    it('should cancel form when cancel shortcut is called', () => {
      const pushMock = jest.fn();

      useHistory.mockClear().mockReturnValue({
        push: pushMock,
      });

      renderFundForm();
      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'cancel').handler();

      expect(defaultProps.onCancel).toHaveBeenCalled();
    });

    it('should navigate to list view when search shortcut is called', () => {
      const pushMock = jest.fn();

      useHistory.mockClear().mockReturnValue({
        push: pushMock,
      });

      renderFundForm();
      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'search').handler();

      expect(pushMock).toHaveBeenCalledWith(FUNDS_ROUTE);
    });
  });
});
