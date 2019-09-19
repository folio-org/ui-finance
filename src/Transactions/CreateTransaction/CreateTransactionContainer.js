import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import {
  getAmountWithCurrency,
  useShowToast,
} from '@folio/stripes-acq-components';
import {
  stripesConnect,
  stripesShape,
} from '@folio/stripes/core';

import {
  budgetResource,
  fundsResource,
  transactionResource,
} from '../../common/resources';
import {
  TRANSACTION_SOURCE,
} from '../constants';
import CreateTransactionModal from './CreateTransactionModal';

const CreateTransactionContainer = ({
  budgetName,
  transactionType,
  fiscalYearId,
  fundId,
  mutator,
  onClose,
  resources,
  stripes,
}) => {
  const showCallout = useShowToast();

  const transactionTypeKey = transactionType.toLowerCase();

  const saveTransaction = useCallback(
    async (formValue) => {
      const { locale, currency } = stripes;

      try {
        const transfer = await mutator.transaction.POST({
          ...formValue,
          fiscalYearId,
          currency,
          transactionType,
          source: TRANSACTION_SOURCE.user,
        });

        const { amount } = transfer;
        showCallout(`ui-finance.transaction.${transactionTypeKey}.hasBeenCreated`, 'success', {
          amount: getAmountWithCurrency(locale, currency, amount),
          budgetName,
        });
        onClose();
      } catch (e) {
        showCallout(`ui-finance.transaction.${transactionTypeKey}.hasNotBeenCreated`, 'error', {
          amount: getAmountWithCurrency(locale, currency, formValue.amount),
          budgetName,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [budgetName, fiscalYearId, mutator]
  );

  const funds = get(resources, ['funds', 'records'], []).map(f => ({ label: f.name, value: f.id }));

  return (
    <CreateTransactionModal
      fundId={fundId}
      funds={funds}
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
  transaction: {
    ...transactionResource,
    fetch: false,
  },
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
};

export default stripesConnect(CreateTransactionContainer);
