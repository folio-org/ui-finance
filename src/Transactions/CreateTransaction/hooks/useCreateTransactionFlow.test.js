import {
  act,
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';
import { TRANSACTION_TYPES } from '@folio/stripes-acq-components';

import { ALLOCATION_TYPE } from '../../constants';
import { useCreateTransactionFlow } from './useCreateTransactionFlow';

const FY = 'FY2023';
const fund = { id: 'testFundId', code: 'TEST-A' };
const contragentFund = { id: 'testContragentFundId', code: 'TEST-B' };
const budgetName = `${fund.code}-${FY}`;

const accumulatedData = {
  fiscalYearId: 'fiscalYearId',
  fundId: fund.id,
  contragentFundId: contragentFund.id,
  budget: {
    fundId: fund.id,
    available: 100,
    name: budgetName,
  },
  budgetName,
};

const kyMock = {
  get: jest.fn(() => ({
    json: () => Promise.resolve({
      budgets: [{
        fundId: contragentFund.id,
        available: 30,
        name: `${contragentFund.code}-${FY}`,
      }],
    }),
  })),
};

const prepareNewAmountsMockStep = jest.fn((values, accumulated) => {
  const { amount, toFundId, fromFundId } = values;
  const { budget, contragentBudget } = accumulated;

  const fromBudget = [budget, contragentBudget].find(({ fundId }) => fundId === fromFundId);
  const toBudget = [budget, contragentBudget].find(({ fundId }) => fundId && (fundId === toFundId));

  return {
    newAmounts: {
      ...(fromBudget ? { [fromFundId]: fromBudget.available - amount } : {}),
      ...(toBudget ? { [toFundId]: toBudget.available + amount } : {}),
    },
  };
});

describe('useCreateTransactionFlow', () => {
  let runFlow;

  beforeEach(async () => {
    useOkapiKy.mockReturnValue(kyMock);

    const { result } = renderHook(() => useCreateTransactionFlow());

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    runFlow = result.current.runCreateTransactionFlow(prepareNewAmountsMockStep);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should run flow to create a transaction', async () => {
    const formValues = {
      fromFundId: fund.id,
      toFundId: contragentFund.id,
      amount: 50,
    };

    await act(async () => {
      await runFlow(formValues, accumulatedData);
    });

    expect(prepareNewAmountsMockStep).toHaveBeenCalled();
  });

  describe('Allocations', () => {
    const runAllocationTransactionFlow = (values = {}, acc = {}) => {
      return runFlow(
        { ...values },
        {
          ...accumulatedData,
          ...acc,
          transactionType: TRANSACTION_TYPES.allocation,
        },
      );
    };

    it('should create transaction to increase allocation', async () => {
      const values = {
        toFundId: fund.id,
        amount: 50,
      };

      await act(async () => {
        const { data } = await runAllocationTransactionFlow(
          values,
          { allocationType: ALLOCATION_TYPE.increase },
        );

        expect(data.newAmounts[fund.id]).toEqual(150);
      });
    });

    it('should create transaction to decrease allocation', async () => {
      const values = {
        fromFundId: fund.id,
        amount: 30,
      };

      await act(async () => {
        const { data } = await runAllocationTransactionFlow(
          values,
          { allocationType: ALLOCATION_TYPE.decrease },
        );

        expect(data.newAmounts[fund.id]).toEqual(70);
      });
    });

    it('should create transaction to move allocation', async () => {
      const values = {
        fromFundId: contragentFund.id,
        toFundId: fund.id,
        amount: 13,
      };

      await act(async () => {
        const { data } = await runAllocationTransactionFlow(values);

        expect(data.newAmounts[fund.id]).toEqual(113);
        expect(data.newAmounts[contragentFund.id]).toEqual(17);
      });
    });
  });

  describe('Transfers', () => {
    const runTransferTransactionFlow = (values = {}, acc = {}) => {
      return runFlow(
        { ...values },
        {
          ...accumulatedData,
          ...acc,
          transactionType: TRANSACTION_TYPES.transfer,
        },
      );
    };

    it('should create transaction to transfer (from A to B)', async () => {
      const values = {
        fromFundId: fund.id,
        toFundId: contragentFund.id,
        amount: 42,
      };

      await act(async () => {
        const { data } = await runTransferTransactionFlow(values);

        expect(data.newAmounts[fund.id]).toEqual(58);
        expect(data.newAmounts[contragentFund.id]).toEqual(72);
      });
    });

    it('should create transaction to transfer (from B to A)', async () => {
      const values = {
        fromFundId: contragentFund.id,
        toFundId: fund.id,
        amount: 29,
      };

      await act(async () => {
        const { data } = await runTransferTransactionFlow(values);

        expect(data.newAmounts[fund.id]).toEqual(129);
        expect(data.newAmounts[contragentFund.id]).toEqual(1);
      });
    });
  });
});
