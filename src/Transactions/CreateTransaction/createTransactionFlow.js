import {
  isPlainObject,
  isFunction,
} from 'lodash';

const getAccumulatedDataObject = (stepResult) => {
  return isPlainObject(stepResult) ? stepResult : {};
};

export const createTransactionFlow = (...steps) => {
  return async (formValues = {}, accumulateData = {}, { onError } = {}) => {
    const abort = () => {
      // eslint-disable-next-line no-throw-literal
      throw { abortedCreateTransactionFlow: true };
    };

    const result = await steps.reduce(async (acc, step) => {
      const prevAccumulatedData = await acc.then((res) => getAccumulatedDataObject(res));
      const newAccumulatedData = await step(formValues, prevAccumulatedData, { abort });

      return {
        ...prevAccumulatedData,
        ...getAccumulatedDataObject(newAccumulatedData),
      };
    }, Promise.resolve(accumulateData)).catch((errorResponse) => {
      if (errorResponse?.abortedCreateTransactionFlow) return;
      if (onError && isFunction(onError)) onError();

      throw errorResponse;
    });

    return [formValues, result];
  };
};
