import omit from 'lodash/omit';
import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { v4 as uuidv4 } from 'uuid';

import { ConfirmationModal } from '@folio/stripes/components';
import {
  getAmountWithCurrency,
  getFundsForSelect,
  TRANSACTION_TYPES,
  useAllFunds,
  useShowCallout,
} from '@folio/stripes-acq-components';
import {
  stripesConnect,
  stripesShape,
} from '@folio/stripes/core';

import { BATCH_TRANSACTION_TYPES } from '../../common/const';
import { useBatchTransactionsMutation } from '../../common/hooks';
import {
  TRANSACTION_SOURCE,
} from '../constants';
import CreateTransactionModal from './CreateTransactionModal';
import {
  useCreateTransactionErrorHandler,
  useCreateTransactionFlow,
} from './hooks';
import { isDecreaseAllocationType } from './utils';

export const CreateTransactionContainer = ({
  allocationType,
  budget,
  budgetName,
  fetchBudgetResources,
  fiscalYearCurrency,
  fiscalYearId,
  fundId,
  labelId,
  onClose,
  stripes,
  transactionType,
}) => {
  const intl = useIntl();
  const showCallout = useShowCallout();

  const locale = stripes.locale;
  const currency = fiscalYearCurrency || stripes.currency;
  const transactionTypeKey = transactionType.toLowerCase();

  const { batchTransactions } = useBatchTransactionsMutation();

  const { funds } = useAllFunds();
  const { handleCreateTransactionErrorResponse } = useCreateTransactionErrorHandler();
  const {
    confirmModalProps,
    isConfirmCreateTransactionModalOpen,
    isLoading,
    runCreateTransactionFlow,
  } = useCreateTransactionFlow();

  const initialValues = useMemo(() => {
    const values = isDecreaseAllocationType(allocationType) ? { fromFundId: fundId } : { toFundId: fundId };

    return ({
      fundId,
      ...values,
    });
  }, [fundId, allocationType]);

  const getAccumulatedDataObject = useCallback((formValues) => {
    const { toFundId, fromFundId } = formValues;

    const fund = funds.find(({ id }) => id === fundId);
    const contragentFundId = [toFundId, fromFundId].find((_fundId) => _fundId !== fundId);
    const contragentFund = funds.find(({ id: cFundId }) => cFundId === contragentFundId);

    const amountWithCurrency = getAmountWithCurrency(locale, currency, formValues.amount);

    const accumulatedData = {
      allocationType,
      amountWithCurrency,
      budget,
      budgetName,
      fiscalYearId,
      fund,
      fundId,
      contragentFund,
      contragentFundId,
      transactionType,
    };

    return accumulatedData;
  }, [allocationType, budget, budgetName, currency, fiscalYearId, fundId, funds, locale, transactionType]);

  const handleErrorResponse = useCallback(async ({ formValues, errorResponse }) => {
    const accumulatedData = getAccumulatedDataObject(formValues);

    const message = await handleCreateTransactionErrorResponse({
      ...accumulatedData,
      errorResponse,
      formValues,
      transactionTypeKey,
    });

    showCallout({ message, type: 'error' });
  }, [getAccumulatedDataObject, handleCreateTransactionErrorResponse, showCallout, transactionTypeKey]);

  const saveTransactionStep = useCallback(async (formValues, { resultBudgetName }) => {
    return batchTransactions({
      transactionType: BATCH_TRANSACTION_TYPES.transactionsToCreate,
      data: [{
        ...omit(formValues, ['fundId']),
        id: uuidv4(),
        transactionType,
        fiscalYearId,
        currency,
        source: TRANSACTION_SOURCE.user,
      }],
    }).then(() => {
      const messageId = [
        'ui-finance.transaction',
        transactionTypeKey,
        transactionType === TRANSACTION_TYPES.allocation ? allocationType : null,
        'hasBeenCreated',
      ]
        .filter(Boolean)
        .join('.');

      fetchBudgetResources();
      showCallout({
        messageId,
        values: {
          amount: getAmountWithCurrency(locale, currency, formValues.amount),
          budgetName: resultBudgetName,
        },
      });
    });
  },
  [
    allocationType,
    batchTransactions,
    currency,
    fetchBudgetResources,
    fiscalYearId,
    locale,
    showCallout,
    transactionType,
    transactionTypeKey,
  ]);

  const onSubmitTransactionForm = useCallback(async (formValues) => {
    const accumulatedData = getAccumulatedDataObject(formValues);

    await runCreateTransactionFlow(saveTransactionStep)(formValues, accumulatedData)
      .then(({ isAborted }) => {
        if (!isAborted) {
          onClose();
          fetchBudgetResources();
        }
      })
      .catch(async (error) => handleErrorResponse({ formValues, errorResponse: error?.response }));
  }, [
    fetchBudgetResources,
    getAccumulatedDataObject,
    handleErrorResponse,
    onClose,
    runCreateTransactionFlow,
    saveTransactionStep,
  ]);

  const fundsOptions = useMemo(() => getFundsForSelect(funds), [funds]);

  return (
    <>
      <CreateTransactionModal
        budget={budget}
        fundId={fundId}
        fundsOptions={fundsOptions}
        initialValues={initialValues}
        isLoading={isLoading}
        onClose={onClose}
        onSubmit={onSubmitTransactionForm}
        title={intl.formatMessage({ id: labelId })}
        allocationType={allocationType}
      />

      {
        isConfirmCreateTransactionModalOpen && (
          <ConfirmationModal
            open
            {...confirmModalProps}
          />
        )
      }
    </>
  );
};

CreateTransactionContainer.propTypes = {
  budget: PropTypes.object.isRequired,
  budgetName: PropTypes.string.isRequired,
  transactionType: PropTypes.string.isRequired,
  fiscalYearId: PropTypes.string.isRequired,
  fundId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  stripes: stripesShape.isRequired,
  fetchBudgetResources: PropTypes.func.isRequired,
  fiscalYearCurrency: PropTypes.string,
  labelId: PropTypes.string.isRequired,
  allocationType: PropTypes.string,
};

export default stripesConnect(CreateTransactionContainer);
