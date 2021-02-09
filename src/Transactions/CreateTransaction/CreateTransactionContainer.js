import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';

import {
  getAmountWithCurrency,
  useAllFunds,
  useShowCallout,
  TRANSACTION_TYPES,
} from '@folio/stripes-acq-components';
import {
  stripesConnect,
  stripesShape,
} from '@folio/stripes/core';

import {
  allocationsResource,
  budgetResource,
  encumbrancesResource,
  transfersResource,
} from '../../common/resources';
import {
  TRANSACTION_SOURCE,
} from '../constants';
import CreateTransactionModal from './CreateTransactionModal';
import { handleCreateTransactionErrorResponse } from './utils';

const CreateTransactionContainer = ({
  budgetName,
  transactionType,
  fiscalYearId,
  fundId,
  mutator,
  onClose,
  stripes,
  fetchBudgetResources,
  intl,
  fiscalYearCurrency,
}) => {
  const showCallout = useShowCallout();
  const locale = stripes.locale;
  const currency = fiscalYearCurrency || stripes.currency;

  const transactionTypeKey = transactionType.toLowerCase();
  const initialValues = useMemo(() => ({
    fundId,
    toFundId: fundId,
  }), [fundId]);

  const saveTransaction = useCallback(
    async ({ fundId: _, ...formValue }) => {
      const mutatorObject = mutator[transactionType];

      try {
        const transfer = await mutatorObject.POST({
          ...formValue,
          fiscalYearId,
          currency,
          transactionType,
          source: TRANSACTION_SOURCE.user,
        });

        const { amount } = transfer;

        showCallout({
          messageId: `ui-finance.transaction.${transactionTypeKey}.hasBeenCreated`,
          values: {
            amount: getAmountWithCurrency(locale, currency, amount),
            budgetName,
          },
        });
        onClose();
        fetchBudgetResources();
      } catch (errorResponse) {
        const amountWithCurrency = getAmountWithCurrency(locale, currency, formValue.amount);

        const message = await handleCreateTransactionErrorResponse(
          intl, errorResponse, amountWithCurrency, budgetName, transactionTypeKey,
        );

        showCallout({ message, type: 'error' });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [budgetName, currency, fiscalYearId, showCallout],
  );

  const { funds } = useAllFunds();
  const fundsOptions = useMemo(() => funds?.map(f => ({ label: f.name, value: f.id })), [funds]);

  return (
    <CreateTransactionModal
      fundId={fundId}
      fundsOptions={fundsOptions}
      initialValues={initialValues}
      onClose={onClose}
      onSubmit={saveTransaction}
      title={<FormattedMessage id={`ui-finance.transaction.${transactionTypeKey}.title`} />}
    />
  );
};

CreateTransactionContainer.manifest = Object.freeze({
  budget: budgetResource,
  [TRANSACTION_TYPES.allocation]: allocationsResource,
  [TRANSACTION_TYPES.encumbrance]: encumbrancesResource,
  [TRANSACTION_TYPES.transfer]: transfersResource,
});

CreateTransactionContainer.propTypes = {
  budgetName: PropTypes.string.isRequired,
  transactionType: PropTypes.string.isRequired,
  fiscalYearId: PropTypes.string.isRequired,
  fundId: PropTypes.string.isRequired,
  mutator: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  stripes: stripesShape.isRequired,
  fetchBudgetResources: PropTypes.func.isRequired,
  intl: PropTypes.object,
  fiscalYearCurrency: PropTypes.string,
};

export default stripesConnect(injectIntl(CreateTransactionContainer));
