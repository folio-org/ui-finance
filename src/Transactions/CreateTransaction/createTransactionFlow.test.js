import { createTransactionFlow } from './createTransactionFlow';

const callOrder = [];

const budgetAvailable = 50;
const contragentBudgetAvailable = 10;

const stepsMap = {
  checkNegativeCreateTransactionFlowStep: 'checkNegativeCreateTransactionFlowStep',
  prepareBudgetAmountsMockFlowStep: 'prepareBudgetAmountsMockFlowStep',
  prepareFinalBudgetAmounts: 'prepareFinalBudgetAmounts',
};

const initAccumulatedData = {
  budget: { name: 'TEST-A-2023', available: 50 },
  contragentBudget: { name: 'TEST-B-2023', available: 10 },
};

const checkNegativeCreateTransactionFlowStep = jest.fn(async (fromValues, accumulatedData, { abort }) => {
  callOrder.push(stepsMap.checkNegativeCreateTransactionFlowStep);

  const { amount, from } = fromValues;
  const { budget, contragentBudget } = accumulatedData;

  const fromBudget = [budget, contragentBudget].find(({ name }) => name === from);

  if (fromBudget.available - amount < 0) await abort();
});

const prepareFinalBudgetAmounts = jest.fn(async (fromValues, accumulatedData) => {
  callOrder.push(stepsMap.prepareFinalBudgetAmounts);

  const { amount, from, to } = fromValues;
  const { budget, contragentBudget } = accumulatedData;

  const fromBudget = [budget, contragentBudget].find(({ name }) => name === from);
  const toBudget = [budget, contragentBudget].find(({ name }) => name === to);

  return {
    [fromBudget.name]: fromBudget.available - amount,
    [toBudget.name]: toBudget.available + amount,
  };
});

const prepareBudgetAmountsMockFlowStep = jest.fn(async (_fromValues, { budget, contragentBudget }) => {
  callOrder.push(stepsMap.prepareBudgetAmountsMockFlowStep);

  return {
    budget: { ...budget, available: budgetAvailable },
    contragentBudget: { ...contragentBudget, available: contragentBudgetAvailable },
  };
});

describe('createTransactionFlow', () => {
  const runCreateTransactionFlow = createTransactionFlow(
    prepareBudgetAmountsMockFlowStep,
    checkNegativeCreateTransactionFlowStep,
    prepareFinalBudgetAmounts,
  );

  beforeEach(() => {
    callOrder.length = 0;

    prepareBudgetAmountsMockFlowStep.mockClear();
    checkNegativeCreateTransactionFlowStep.mockClear();
    prepareFinalBudgetAmounts.mockClear();
  });

  it('should call flow steps in defined order', async () => {
    await runCreateTransactionFlow();

    expect(callOrder).toEqual([
      stepsMap.prepareBudgetAmountsMockFlowStep,
      stepsMap.checkNegativeCreateTransactionFlowStep,
      stepsMap.prepareFinalBudgetAmounts,
    ]);
  });

  it('should accumulate the data that was returned from each step', async () => {
    const formValues = {
      amount: 10,
      from: initAccumulatedData.budget.name,
      to: initAccumulatedData.contragentBudget.name,
    };

    const { data, formValues: values } = await runCreateTransactionFlow(formValues, initAccumulatedData);

    expect(values).toEqual(formValues);
    expect(data.budget.available).toEqual(budgetAvailable);
    expect(data.contragentBudget.available).toEqual(contragentBudgetAvailable);
    expect(data[initAccumulatedData.budget.name]).toEqual(budgetAvailable - formValues.amount);
    expect(data[initAccumulatedData.contragentBudget.name]).toEqual(
      contragentBudgetAvailable + formValues.amount,
    );
  });

  it('should abort the flow when \'abort\' is called', async () => {
    const formValues = {
      amount: 100,
      from: initAccumulatedData.budget.name,
      to: initAccumulatedData.contragentBudget.name,
    };

    await runCreateTransactionFlow(formValues, initAccumulatedData);

    expect(prepareBudgetAmountsMockFlowStep).toHaveBeenCalled();
    expect(checkNegativeCreateTransactionFlowStep).toHaveBeenCalled();
    expect(prepareFinalBudgetAmounts).not.toHaveBeenCalled();
  });

  it('should call the \'onError\' handler when an exception has occurred', async () => {
    const formValues = {
      amount: 10,
      from: initAccumulatedData.budget.name,
      to: initAccumulatedData.contragentBudget.name,
    };

    const onError = jest.fn();
    // eslint-disable-next-line prefer-promise-reject-errors
    const someStepWithException = jest.fn(async () => { throw new Error('Test'); });
    const externalErrorHandler = jest.fn();

    await createTransactionFlow(
      prepareBudgetAmountsMockFlowStep,
      checkNegativeCreateTransactionFlowStep,
      someStepWithException,
      prepareFinalBudgetAmounts,
    )(formValues, initAccumulatedData, { onError }).catch(externalErrorHandler);

    expect(someStepWithException).toHaveBeenCalled();
    expect(onError).toHaveBeenCalled();
    expect(externalErrorHandler).toHaveBeenCalled();
  });
});
