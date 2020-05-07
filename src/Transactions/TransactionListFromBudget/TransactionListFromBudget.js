import React, { useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import TransactionsListContainer from '../TransactionsList';
import { BUDGET_ROUTE } from '../../common/const';

const TransactionsListFromBudget = ({ match, history }) => {
  const closePane = useCallback(
    () => {
      history.push(`${BUDGET_ROUTE}${match.params.budgetId}/view`);
    },
    [match, history],
  );

  return (<TransactionsListContainer closePane={closePane} />);
};

TransactionsListFromBudget.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
};

export default withRouter(TransactionsListFromBudget);
