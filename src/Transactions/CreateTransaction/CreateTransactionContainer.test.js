import user from '@folio/jest-config-stripes/testing-library/user-event';
import { act, render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { MemoryRouter } from 'react-router';

import {
  TRANSACTION_TYPES,
  useAllFunds,
} from '@folio/stripes-acq-components';

import { getFundActiveBudget } from '../../common/utils';
import { CreateTransactionContainer } from './CreateTransactionContainer';
import { ALLOCATION_TYPE } from '../constants';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useAllFunds: jest.fn().mockReturnValue({ funds: [] }),
}));
jest.mock('../../common/utils', () => ({
  ...jest.requireActual('../../common/utils'),
  getFundActiveBudget: jest.fn(() => () => Promise.resolve({
    id: 'budgetId',
    name: 'budgetName',
    available: 10,
    fundId: 'fundId2',
  })),
}));

const funds = [
  { id: 'fundId', code: 'FNDA', name: 'Fund A' },
  { id: 'fundId2', code: 'FNDB', name: 'Fund B' },
  { id: 'fundId3', code: 'FNDC', name: 'Fund C' },
];

const mutatorMock = {
  [TRANSACTION_TYPES.allocation]: {
    POST: jest.fn((data) => Promise.resolve(data)),
  },
  [TRANSACTION_TYPES.transfer]: {
    POST: jest.fn((data) => Promise.resolve(data)),
  },
};

const defaultProps = {
  mutator: mutatorMock,
  budget: { name: 'budgetName', available: 10 },
  budgetName: 'budgetName',
  transactionType: TRANSACTION_TYPES.allocation,
  fiscalYearId: 'fiscalYearId',
  fiscalYearCurrency: 'USD',
  fundId: 'fundId',
  onClose: jest.fn(),
  stripes: { hasPerm: jest.fn(), hasInterface: jest.fn(), clone: jest.fn(), logger: {}, actionNames: [] },
  fetchBudgetResources: jest.fn(),
  allocationType: ALLOCATION_TYPE.decrease,
  labelId: 'decreaseAllocation',
};

const renderCreateTransactionContainer = (props = {}) => render(
  <div>
    <CreateTransactionContainer
      {...defaultProps}
      {...props}
    />
  </div>,
  { wrapper: MemoryRouter },
);

describe('CreateTransactionContainer', () => {
  const selectFund = async (field = 'from', value = funds[0].code) => {
    await act(async () => {
      const selectBox = (await screen.findAllByLabelText(`ui-finance.transaction.${field}`))[0];

      await user.click(selectBox);

      const fromFundOptions = await screen.findAllByText(new RegExp(`.*${value}.*`));

      user.click(fromFundOptions[field === 'from' ? 0 : 1]);
    });
  };

  beforeEach(() => {
    defaultProps.fetchBudgetResources.mockClear();
    getFundActiveBudget.mockClear();
    useAllFunds.mockClear().mockReturnValue({ funds });
  });

  it('should display BudgetForm', async () => {
    renderCreateTransactionContainer();

    expect(await screen.findByText(defaultProps.labelId)).toBeInTheDocument();
  });

  it('should close transaction form', async () => {
    renderCreateTransactionContainer();

    await act(async () => user.click(await screen.findByText('ui-finance.transaction.button.cancel')));

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  describe('save transaction', () => {
    it('should save transaction', async () => {
      renderCreateTransactionContainer({ allocationType: undefined });

      await selectFund('to');
      await act(async () => user.type(await screen.findByText('ui-finance.transaction.amount'), '1'));
      await act(async () => user.click(await screen.findByText('ui-finance.transaction.button.confirm')));

      expect(mutatorMock.Allocation.POST).toHaveBeenCalled();
    });

    it('should fetch budget data from foreign fund', async () => {
      renderCreateTransactionContainer({ allocationType: undefined });

      await act(async () => selectFund('from'));
      await act(async () => selectFund('to', funds[1].code));

      await act(async () => user.type(await screen.findByText('ui-finance.transaction.amount'), '1'));
      await act(async () => user.click(await screen.findByText('ui-finance.transaction.button.confirm')));

      await jest.runAllTimersAsync();

      expect(getFundActiveBudget).toHaveBeenCalled();
    });

    describe('Confirm transaction creation', () => {
      const budgetExceededAmount = '10000';

      beforeEach(async () => {
        renderCreateTransactionContainer({
          allocationType: null,
          transactionType: TRANSACTION_TYPES.transfer,
        });

        await act(async () => user.type(await screen.findByText('ui-finance.transaction.amount'), budgetExceededAmount));
        await user.click(screen.getAllByText('stripes-components.selection.controlLabel')[1]);
        await selectFund('from', funds[1].code);
        await selectFund('to', funds[0].code);
        await act(async () => user.click(await screen.findByText('ui-finance.transaction.button.confirm')));
      });

      it('should display confirm transaction creation modal', async () => {
        expect(screen.getByText('ui-finance.transaction.confirmModal.negativeAvailableAmount.heading')).toBeInTheDocument();
      });

      it('should close confirm transaction creation modal when \'Cancel\' button was clicked', async () => {
        await act(async () => user.click(await screen.findByText('stripes-components.cancel')));

        expect(screen.queryByText('ui-finance.transaction.confirmModal.negativeAvailableAmount.heading')).not.toBeInTheDocument();
        expect(defaultProps.fetchBudgetResources).not.toHaveBeenCalled();
      });

      it('should create new transaction and refresh budget view when \'Confirm\' button was clicked', async () => {
        const confirmBtns = screen.getAllByText('ui-finance.transaction.button.confirm');

        await act(async () => user.click(confirmBtns[1]));

        expect(defaultProps.fetchBudgetResources).toHaveBeenCalled();
      });
    });
  });
});
