import { MemoryRouter } from 'react-router-dom';

import {
  act,
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';
import { useOkapiKy } from '@folio/stripes/core';
import {
  TRANSACTION_TYPES,
  useAllFunds,
} from '@folio/stripes-acq-components';

import { useBatchTransactionsMutation, useBudgetByFundAndFY } from '../../common/hooks';
import { ALLOCATION_TYPE } from '../constants';
import { CreateTransactionContainer } from './CreateTransactionContainer';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useAllFunds: jest.fn().mockReturnValue({ funds: [] }),
}));
jest.mock('../../common/hooks', () => ({
  ...jest.requireActual('../../common/hooks'),
  useBatchTransactionsMutation: jest.fn(),
  useBudgetByFundAndFY: jest.fn(),
}));

const funds = [
  { id: 'fundId', code: 'FNDA', name: 'Fund A' },
  { id: 'fundId2', code: 'FNDB', name: 'Fund B' },
  { id: 'fundId3', code: 'FNDC', name: 'Fund C' },
];

const defaultProps = {
  allocationType: ALLOCATION_TYPE.move,
  budget: {
    allocated: 10,
    available: 10,
    fundId: funds[0].id,
    name: 'budgetName',
  },
  budgetName: 'budgetName',
  fetchBudgetResources: jest.fn(),
  fiscalYearCurrency: 'USD',
  fiscalYearId: 'fiscalYearId',
  fundId: funds[0].id,
  labelId: 'decreaseAllocation',
  onClose: jest.fn(),
  stripes: {
    actionNames: [],
    clone: jest.fn(),
    hasInterface: jest.fn(() => true),
    hasAnyPerm: jest.fn(() => true),
    hasPerm: jest.fn(() => true),
    logger: {},
  },
  transactionType: TRANSACTION_TYPES.allocation,
};

const kyMock = {
  get: jest.fn(() => ({
    json: () => Promise.resolve({
      budgets: [
        defaultProps.budget,
        {
          fundId: funds[1].id,
          available: 30,
          name: funds[1].name,
        },
      ],
    }),
  })),
};

const batchTransactionsMock = jest.fn().mockResolvedValue({});

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
  const selectFund = async (field, value) => {
    // Select the specific button based on the field name attribute
    const buttonSelector = screen.getByRole('button', { name: (_name, element) => element?.getAttribute('name')?.startsWith(field) });

    await act(async () => user.click(buttonSelector));

    // Wait for the dropdown options to appear and select the option
    const fundOption = await screen.findByRole('option', { name: new RegExp(`.*${value}.*`, 'i') });

    await act(async () => user.click(fundOption));
  };

  const fillTransactionAmount = async (amount) => {
    const amountField = screen.getByRole('spinbutton', { name: 'ui-finance.transaction.amount' });

    await act(async () => {
      await user.clear(amountField);
      await user.type(amountField, amount);
    });
  };

  const clickConfirmButton = async () => {
    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'ui-finance.transaction.button.confirm' }));
    });
  };

  const clickCancelButton = async () => {
    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'ui-finance.transaction.button.cancel' }));
    });
  };

  beforeEach(() => {
    defaultProps.fetchBudgetResources.mockClear();
    useAllFunds.mockReturnValue({ funds });
    useBatchTransactionsMutation.mockReturnValue({ batchTransactions: batchTransactionsMock });
    useOkapiKy.mockReturnValue(kyMock);
    useBudgetByFundAndFY.mockReturnValue({
      budget: {
        allocated: 12345,
        available: 1234,
        id: 'budget-id-2',
        fundId: funds[1].value,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display transaction form', async () => {
    renderCreateTransactionContainer();

    expect(await screen.findByText(defaultProps.labelId)).toBeInTheDocument();
  });

  it('should close transaction form when cancel button is clicked', async () => {
    renderCreateTransactionContainer();

    await clickCancelButton();

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  describe('Allocation transactions', () => {
    describe('Move allocation', () => {
      const moveAllocationProps = {
        allocationType: ALLOCATION_TYPE.move,
        transactionType: TRANSACTION_TYPES.allocation,
      };

      it('should save move allocation transaction', async () => {
        renderCreateTransactionContainer(moveAllocationProps);

        await selectFund('to', funds[0].code);
        await fillTransactionAmount('1');
        await clickConfirmButton();

        expect(batchTransactionsMock).toHaveBeenCalled();
      });

      it('should fetch budget data from foreign fund during move allocation', async () => {
        renderCreateTransactionContainer(moveAllocationProps);

        await selectFund('to', funds[1].code);
        await selectFund('from', funds[0].code);
        await fillTransactionAmount('1');
        await clickConfirmButton();

        expect(kyMock.get).toHaveBeenCalled();
      });
    });

    describe('Increase allocation', () => {
      const increaseAllocationProps = {
        allocationType: ALLOCATION_TYPE.increase,
        transactionType: TRANSACTION_TYPES.allocation,
      };

      it('should save increase allocation transaction', async () => {
        renderCreateTransactionContainer(increaseAllocationProps);

        await fillTransactionAmount('100');
        await clickConfirmButton();

        expect(batchTransactionsMock).toHaveBeenCalled();
      });
    });

    describe('Decrease allocation', () => {
      const decreaseAllocationProps = {
        allocationType: ALLOCATION_TYPE.decrease,
        transactionType: TRANSACTION_TYPES.allocation,
      };

      it('should save decrease allocation transaction', async () => {
        renderCreateTransactionContainer(decreaseAllocationProps);

        await fillTransactionAmount('5');
        await clickConfirmButton();

        expect(batchTransactionsMock).toHaveBeenCalled();
      });
    });
  });

  describe('Transfer transactions', () => {
    const transferProps = {
      transactionType: TRANSACTION_TYPES.transfer,
      allocationType: undefined, // Transfer transactions shouldn't have allocationType
    };

    it('should save transfer transaction', async () => {
      renderCreateTransactionContainer(transferProps);

      await selectFund('from', funds[1].code);
      await selectFund('to', funds[0].code);
      await fillTransactionAmount('50');
      await clickConfirmButton();

      expect(batchTransactionsMock).toHaveBeenCalled();
    });

    describe('Confirm transaction creation', () => {
      const budgetExceededAmount = '10000';

      beforeEach(async () => {
        // Mock the API to return budgets that will trigger the confirmation modal
        kyMock.get.mockReturnValue({
          json: () => Promise.resolve({
            budgets: [
              {
                fundId: funds[1].id,
                available: 50, // This budget will go negative when transferring 10000
                name: funds[1].name,
              },
            ],
          }),
        });

        renderCreateTransactionContainer(transferProps);

        await fillTransactionAmount(budgetExceededAmount);
        await selectFund('from', funds[1].code);
        await selectFund('to', funds[0].code);
        await clickConfirmButton();
      });

      it('should display confirm transaction creation modal', async () => {
        // Wait for the confirmation modal to appear
        expect(await screen.findByText('ui-finance.transaction.confirmModal.negativeAvailableAmount.heading')).toBeInTheDocument();
      });

      it('should close confirm transaction creation modal when Cancel button is clicked', async () => {
        // Wait for the confirmation modal to appear first
        await screen.findByText('ui-finance.transaction.confirmModal.negativeAvailableAmount.heading');

        await act(async () => {
          await user.click(screen.getByRole('button', { name: /stripes-components\.cancel/i }));
        });

        expect(screen.queryByText('ui-finance.transaction.confirmModal.negativeAvailableAmount.heading')).not.toBeInTheDocument();
        expect(defaultProps.fetchBudgetResources).not.toHaveBeenCalled();
      });

      it('should create new transaction and refresh budget view when Confirm button is clicked', async () => {
        // Wait for the confirmation modal to appear first
        await screen.findByText('ui-finance.transaction.confirmModal.negativeAvailableAmount.heading');

        const confirmButtons = screen.getAllByRole('button', { name: /ui-finance\.transaction\.button\.confirm/i });

        await act(async () => {
          await user.click(confirmButtons[1]); // Second confirm button in the modal
        });

        expect(batchTransactionsMock).toHaveBeenCalled();
        expect(defaultProps.fetchBudgetResources).toHaveBeenCalled();
      });
    });
  });
});
