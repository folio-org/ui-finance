import React, { useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import TransactionsListContainer from '../TransactionsList';
import { FUNDS_ROUTE } from '../../common/const';

const TransactionsListFromFund = ({ match, history }) => {
  const closePane = useCallback(
    () => {
      history.push(`${FUNDS_ROUTE}/view/${match.params.fundId}`);
    },
    [match, history],
  );

  return (<TransactionsListContainer closePane={closePane} />);
};

TransactionsListFromFund.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
};

export default withRouter(TransactionsListFromFund);
