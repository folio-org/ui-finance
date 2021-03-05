import React from 'react';
import { Router } from 'react-router-dom';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import user from '@testing-library/user-event';

import { LEDGERS_ROUTE } from '../../common/const';
import CreateLedgerFiscalYear from './CreateLedgerFiscalYear';

const mockSaveFiscalYear = jest.fn();

jest.mock('../../FiscalYears', () => {
  return {
    // eslint-disable-next-line react/prop-types
    FiscalYearForm: ({ onCancel, onSubmit }) => (
      <>
        <button
          type="button"
          onClick={onCancel}
        >
          CloseFiscalYearForm
        </button>
        <button
          type="button"
          onClick={onSubmit}
        >
          CreateFiscalYear
        </button>
      </>
    ),
    useSaveFiscalYear: () => mockSaveFiscalYear(),
  };
});

const history = createMemoryHistory();

history.push = jest.fn();

const renderFiscalYearForm = () => (render(
  <Router history={history}>
    <CreateLedgerFiscalYear />
  </Router>,
));

describe('CreateLedgerFiscalYear component', () => {
  describe('Close form', () => {
    it('should close the fiscal year form and return to ledger form', () => {
      const { getByText } = renderFiscalYearForm();

      user.click(getByText('CloseFiscalYearForm'));

      expect(history.push).toHaveBeenCalledWith({ pathname: `${LEDGERS_ROUTE}/create`, search: '', state: { fiscalYearOneId: undefined } });
    });
  });

  describe('Submit form', () => {
    it('should submit fiscal year form', () => {
      const { getByText } = renderFiscalYearForm();

      user.click(getByText('CreateFiscalYear'));

      expect(mockSaveFiscalYear).toHaveBeenCalled();
    });
  });
});
