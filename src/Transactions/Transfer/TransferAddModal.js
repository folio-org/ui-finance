import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
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
  TRANSACTION_TYPES,
} from '../constants';
import TransferAddModalForm from './TransferAddModalForm';

const TransferAddModal = ({
  budgetName,
  fiscalYearId,
  mutator,
  onClose,
  resources,
  stripes,
}) => {
  const showCallout = useShowToast();

  const saveTransfer = useCallback(
    async (formValue) => {
      const { locale, currency } = stripes;

      try {
        const transfer = await mutator.transaction.POST({
          ...formValue,
          fiscalYearId,
          currency,
          transactionType: TRANSACTION_TYPES.transfer,
          source: TRANSACTION_SOURCE.user,
        });

        const { amount } = transfer;
        showCallout('ui-finance.transaction.transfer.hasBeenCreated', 'success', {
          amount: getAmountWithCurrency(locale, currency, amount),
          budgetName,
        });
        onClose();
      } catch (e) {
        showCallout('ui-finance.transaction.transfer.hasNotBeenCreated', 'error', {
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
    <TransferAddModalForm
      funds={funds}
      onClose={onClose}
      onSubmit={saveTransfer}
    />
  );
};

TransferAddModal.manifest = Object.freeze({
  funds: fundsResource,
  budget: budgetResource,
  transaction: {
    ...transactionResource,
    fetch: false,
  },
});

TransferAddModal.propTypes = {
  budgetName: PropTypes.string.isRequired,
  fiscalYearId: PropTypes.string.isRequired,
  mutator: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  resources: PropTypes.object.isRequired,
  stripes: stripesShape.isRequired,
};

export default stripesConnect(TransferAddModal);
