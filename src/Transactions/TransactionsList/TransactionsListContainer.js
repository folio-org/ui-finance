import React from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router-dom';

import {
  LoadingView,
  Paneset,
  Pane,
} from '@folio/stripes/components';
import {
  RESULT_COUNT_INCREMENT,
  usePagination,
  useAllFunds,
} from '@folio/stripes-acq-components';

import TransactionsList from './TransactionsList';
import {
  useBudget,
  useTransactions,
} from './hooks';

const resetData = () => {};

const TransactionsListContainer = ({ closePane }) => {
  const match = useRouteMatch();
  const {
    pagination,
    changePage,
  } = usePagination({ limit: RESULT_COUNT_INCREMENT, offset: 0 });
  const budgetId = match.params.budgetId;
  const { budget, isLoading } = useBudget(budgetId);
  const { funds } = useAllFunds();
  const {
    transactions,
    totalRecords,
    isFetching,
  } = useTransactions({ budget, pagination });

  if (isLoading) {
    return (
      <LoadingView dismissible onClose={closePane} />

    );
  }

  return (
    <div data-test-transactions-list>
      <Paneset>
        <Pane
          paneTitle={budget?.name}
          defaultWidth="100%"
          padContent={false}
          onClose={closePane}
          dismissible
        >
          <TransactionsList
            onNeedMoreData={changePage}
            resetData={resetData}
            transactionsCount={totalRecords}
            isLoadingTransactions={isFetching}
            transactions={transactions}
            pagination={pagination}
            fundId={budget.fundId}
            funds={funds}
          />
        </Pane>
      </Paneset>
    </div>
  );
};

TransactionsListContainer.propTypes = {
  closePane: PropTypes.func.isRequired,
};

export default TransactionsListContainer;
