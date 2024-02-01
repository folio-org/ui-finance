import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import {
  ORDER_STATUSES,
  TRANSACTION_TYPES,
} from '@folio/stripes-acq-components';

import { ENCUMBRANCE_STATUS } from '../../common/const';
import TransactionDetails from './TransactionDetails';

jest.mock('./TransactionInformation', () => {
  return jest.fn(() => 'TransactionInformation');
});

const defaultProps = {
  fiscalYearCode: 'fiscalYearCode',
  fundId: 'fundId',
  transaction: { transactionType: TRANSACTION_TYPES.allocation },
  onClose: jest.fn(),
  releaseTransaction: jest.fn(),
  unreleaseTransaction: jest.fn(),
};

const renderTransactionDetails = (props = {}) => render(
  <TransactionDetails
    {...defaultProps}
    {...props}
  />,
);

describe('TransactionDetails component', () => {
  beforeEach(() => {
    defaultProps.releaseTransaction.mockClear();
    defaultProps.unreleaseTransaction.mockClear();
  });

  it('should display transaction details', () => {
    const { getByText } = renderTransactionDetails();

    expect(getByText('ui-finance.transaction.information')).toBeDefined();
  });

  it('should not display release encumbrance button', () => {
    const { queryByText } = renderTransactionDetails();

    expect(queryByText('ui-finance.transaction.releaseEncumbrance.button')).toBeNull();
  });

  it('should display release encumbrance button', () => {
    renderTransactionDetails({
      transaction: { transactionType: TRANSACTION_TYPES.encumbrance },
    });

    expect(screen.getByText('ui-finance.transaction.releaseEncumbrance.button')).toBeDefined();
  });

  describe('Unrelease release', () => {
    it('should not display "Unrelease encumbrance" button for not opened order encumbrance', () => {
      renderTransactionDetails({
        transaction: {
          transactionType: TRANSACTION_TYPES.encumbrance,
          encumbrance: {
            status: ENCUMBRANCE_STATUS.released,
            orderStatus: ORDER_STATUSES.pending,
          },
        },
      });

      expect(screen.queryByText('ui-finance.transaction.unreleaseEncumbrance.button')).not.toBeInTheDocument();
    });

    it('should call "unreleaseTransaction" when "Unrelease encumbrance" action executed', async () => {
      renderTransactionDetails({
        transaction: {
          transactionType: TRANSACTION_TYPES.encumbrance,
          encumbrance: {
            status: ENCUMBRANCE_STATUS.released,
            orderStatus: ORDER_STATUSES.open,
          },
        },
      });

      await userEvent.click(screen.getByText('ui-finance.transaction.unreleaseEncumbrance.button'));
      await userEvent.click(screen.getByText('ui-finance.transaction.button.confirm'));

      expect(defaultProps.unreleaseTransaction).toHaveBeenCalled();
    });
  });
});
