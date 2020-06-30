import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';
import { get } from 'lodash';

import {
  getAmountWithCurrency,
  useShowCallout,
} from '@folio/stripes-acq-components';
import {
  stripesConnect,
  stripesShape,
} from '@folio/stripes/core';

import { TRANSACTION_TYPES } from '../../common/const';
import {
  allocationsResource,
  budgetResource,
  encumbrancesResource,
  fundsResource,
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
  resources,
  stripes,
  fetchBudgetResources,
  intl,
  fiscalYearCurrency,
}) => {
  const showCallout = useShowCallout();
  const locale = stripes.locale;
  const currency = fiscalYearCurrency || stripes.currency;

  const transactionTypeKey = transactionType.toLowerCase();

  const saveTransaction = useCallback(
    async (formValue) => {
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

  const funds = get(resources, ['funds', 'records'], []).map(f => ({ label: f.name, value: f.id }));

  return (
    <CreateTransactionModal
      fundId={fundId}
      funds={funds}
      isRequiredTransferFrom={transactionType !== TRANSACTION_TYPES.allocation}
      onClose={onClose}
      onSubmit={saveTransaction}
      store={stripes.store}
      title={<FormattedMessage id={`ui-finance.transaction.${transactionTypeKey}.title`} />}
    />
  );
};

CreateTransactionContainer.manifest = Object.freeze({
  funds: fundsResource,
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
  resources: PropTypes.object.isRequired,
  stripes: stripesShape.isRequired,
  fetchBudgetResources: PropTypes.func.isRequired,
  intl: PropTypes.object,
  fiscalYearCurrency: PropTypes.string,
};

export default stripesConnect(injectIntl(CreateTransactionContainer));
