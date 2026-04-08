import get from 'lodash/get';

import { ResponseErrorsContainer } from '@folio/stripes-acq-components';

import { BATCH_ALLOCATION_FIELDS, BATCH_ALLOCATION_FORM_SPECIAL_FIELDS } from '../constants';
import {
  handleRecalculateError,
  isBudgetStatusShouldBeSet,
  shouldBlockNavigation,
} from './utils';

describe('handleRecalculateError', () => {
  const showCallout = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a map of form errors when parameterized errors are present', async () => {
    const error = {
      response: {
        json: async () => ({
          errors: [
            {
              message: 'Error message 1',
              parameters: [{ key: 'financeData[0].field1' }],
            },
            {
              message: 'Error message 2',
              parameters: [{ key: 'financeData[1].field2' }],
            },
          ],
        }),
      },
    };

    const handler = {
      originalResponseBody: await error.response.json(),
    };

    jest.spyOn(ResponseErrorsContainer, 'create').mockResolvedValue({ handler });

    const result = await handleRecalculateError(error, showCallout);

    expect(get(result, 'fyFinanceData.0.field1')).toEqual('Error message 1');
    expect(get(result, 'fyFinanceData.1.field2')).toEqual('Error message 2');
    expect(showCallout).not.toHaveBeenCalled();
  });

  it('should show a callout error message when non-parameterized errors are present', async () => {
    const error = {
      response: {
        json: async () => ({
          errors: [
            {
              message: 'Non-parameterized error message',
            },
          ],
        }),
      },
    };

    const handler = {
      originalResponseBody: await error.response.json(),
    };

    jest.spyOn(ResponseErrorsContainer, 'create').mockResolvedValue({ handler });

    const result = await handleRecalculateError(error, showCallout);

    expect(Object.values(result).length).toBe(0);
    expect(showCallout).toHaveBeenCalledTimes(1);
    expect(showCallout).toHaveBeenCalledWith({
      message: 'Non-parameterized error message',
      type: 'error',
    });
  });

  it('should show a default callout error message when non-parameterized errors are present without a message', async () => {
    const error = {
      response: {
        json: async () => ({
          errors: [{}],
        }),
      },
    };

    const handler = {
      originalResponseBody: await error.response.json(),
    };

    jest.spyOn(ResponseErrorsContainer, 'create').mockResolvedValue({ handler });

    const result = await handleRecalculateError(error, showCallout);

    expect(Object.values(result).length).toBe(0);
    expect(showCallout).toHaveBeenCalledTimes(1);
    expect(showCallout).toHaveBeenCalledWith({
      messageId: 'ui-finance.allocation.batch.form.recalculate.error',
      type: 'error',
    });
  });
});

describe('isBudgetStatusShouldBeSet', () => {
  const {
    budgetAllocationChange,
    budgetStatus,
    budgetAllowableExpenditure,
    budgetAllowableEncumbrance,
  } = BATCH_ALLOCATION_FIELDS;

  it('returns true when budgetId is missing and allocation change > 0 and other fields empty', () => {
    const item = {
      // budgetId intentionally absent
      [budgetAllocationChange]: 5,
      [budgetStatus]: undefined,
      [budgetAllowableExpenditure]: undefined,
      [budgetAllowableEncumbrance]: undefined,
    };

    expect(isBudgetStatusShouldBeSet(item)).toBeTruthy();
  });

  it('returns false when allocation change is not greater than 0', () => {
    const item = {
      [budgetAllocationChange]: 0,
    };

    expect(isBudgetStatusShouldBeSet(item)).toBeFalsy();
  });

  it('returns false when budgetId is present', () => {
    const item = {
      budgetId: 'B1',
      [budgetAllocationChange]: 10,
    };

    expect(isBudgetStatusShouldBeSet(item)).toBeFalsy();
  });
});

describe('shouldBlockNavigation', () => {
  const createMockEngine = ({
    submitting = false,
    submitSucceeded = false,
    dirty = false,
  } = {}) => ({
    getFormState: jest.fn(() => ({ submitting, submitSucceeded })),
    getFieldState: jest.fn(() => ({ dirty })),
  });

  it('should block navigation when form is dirty and not submitted yet', () => {
    const engine = createMockEngine({ dirty: true, submitSucceeded: false, submitting: false });

    const result = shouldBlockNavigation(engine);

    expect(result).toBe(true);
    expect(engine.getFormState).toHaveBeenCalled();
    expect(engine.getFieldState).toHaveBeenCalledWith(BATCH_ALLOCATION_FORM_SPECIAL_FIELDS.fyFinanceData);
  });

  it('should not block navigation when form is clean', () => {
    const engine = createMockEngine({ dirty: false, submitSucceeded: false, submitting: false });

    const result = shouldBlockNavigation(engine);

    expect(result).toBe(false);
  });

  it('should not block navigation when form is successfully submitted', () => {
    const engine = createMockEngine({ dirty: true, submitSucceeded: true, submitting: false });

    const result = shouldBlockNavigation(engine);

    expect(result).toBe(false);
  });

  it('should not block navigation when form is submitting', () => {
    const engine = createMockEngine({ dirty: true, submitSucceeded: false, submitting: true });

    const result = shouldBlockNavigation(engine);

    expect(result).toBe(false);
  });

  it('should not block navigation when form is submitting and dirty', () => {
    const engine = createMockEngine({ dirty: true, submitSucceeded: false, submitting: true });

    const result = shouldBlockNavigation(engine);

    expect(result).toBe(false);
  });

  it('should not block navigation when form is submitted successfully and dirty', () => {
    const engine = createMockEngine({ dirty: true, submitSucceeded: true, submitting: false });

    const result = shouldBlockNavigation(engine);

    expect(result).toBe(false);
  });

  it('should not block navigation when form is clean and submitted', () => {
    const engine = createMockEngine({ dirty: false, submitSucceeded: true, submitting: false });

    const result = shouldBlockNavigation(engine);

    expect(result).toBe(false);
  });

  it('should block navigation only when all conditions are met: dirty, not submitted, not submitting', () => {
    const scenarios = [
      { dirty: true, submitSucceeded: false, submitting: false, expected: true },
      { dirty: false, submitSucceeded: false, submitting: false, expected: false },
      { dirty: true, submitSucceeded: true, submitting: false, expected: false },
      { dirty: true, submitSucceeded: false, submitting: true, expected: false },
      { dirty: false, submitSucceeded: true, submitting: false, expected: false },
      { dirty: false, submitSucceeded: false, submitting: true, expected: false },
      { dirty: false, submitSucceeded: true, submitting: true, expected: false },
      { dirty: true, submitSucceeded: true, submitting: true, expected: false },
    ];

    scenarios.forEach(({ dirty, submitSucceeded, submitting, expected }) => {
      const engine = createMockEngine({ dirty, submitSucceeded, submitting });
      const result = shouldBlockNavigation(engine);

      expect(result).toBe(expected);
    });
  });
});
