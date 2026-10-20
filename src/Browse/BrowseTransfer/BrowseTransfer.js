import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  BUDGETS_API,
  TRANSACTION_TYPES,
} from '@folio/stripes-acq-components';

import { useFiscalYear } from '../../common/hooks';
import CreateTransaction from '../../Transactions/CreateTransaction';

// Opens the existing transfer modal anchored on the budget currently shown in the third pane.
const BrowseTransfer = ({ budgetId, onClose }) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'browse-transfer-budget' });

  const { data: budget, refetch } = useQuery({
    queryKey: [namespace, budgetId],
    queryFn: ({ signal }) => ky.get(`${BUDGETS_API}/${budgetId}`, { signal }).json(),
    enabled: Boolean(budgetId),
  });

  const { fiscalYear } = useFiscalYear(budget?.fiscalYearId);

  const fetchBudgetResources = useCallback(() => refetch(), [refetch]);

  if (!budget || !fiscalYear) return null;

  return (
    <CreateTransaction
      fundId={budget.fundId}
      budget={budget}
      budgetName={budget.name}
      transactionType={TRANSACTION_TYPES.transfer}
      fiscalYearId={fiscalYear.id}
      onClose={onClose}
      fetchBudgetResources={fetchBudgetResources}
      fiscalYearCurrency={fiscalYear.currency}
      labelId="ui-finance.transaction.transfer.title"
    />
  );
};

BrowseTransfer.propTypes = {
  budgetId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default BrowseTransfer;
