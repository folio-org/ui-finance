import React, {
  useCallback,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';
import {
  RESULT_COUNT_INCREMENT,
  usePagination,
} from '@folio/stripes-acq-components';

import FundsList from './FundsList';
import { fetchFundLedgers } from './utils';
import { useFunds } from './hooks';
import { ledgersResource } from '../../common/resources';

const resetData = () => {};

export const FundsListContainer = ({ mutator: originMutator }) => {
  const mutator = useMemo(() => originMutator, []);

  const fetchReferences = useCallback(async fundsResponse => {
    const ledgersResponse = await fetchFundLedgers(mutator.fundsListLedgers, fundsResponse, {});

    const ledgersMap = ledgersResponse.reduce((acc, ledgerItem) => {
      acc[ledgerItem.id] = ledgerItem;

      return acc;
    }, {});

    return { ledgersMap };
  }, []);

  const {
    pagination,
    changePage,
    refreshPage,
  } = usePagination({ limit: RESULT_COUNT_INCREMENT, offset: 0 });
  const { funds, totalRecords, isFetching } = useFunds({ pagination, fetchReferences });

  return (
    <FundsList
      onNeedMoreData={changePage}
      resetData={resetData}
      fundsCount={totalRecords}
      isLoading={isFetching}
      funds={funds}
      pagination={pagination}
      refreshList={refreshPage}
    />
  );
};

FundsListContainer.manifest = Object.freeze({
  fundsListLedgers: {
    ...ledgersResource,
    accumulate: true,
  },
});

FundsListContainer.propTypes = {
  mutator: PropTypes.object.isRequired,
};

export default stripesConnect(FundsListContainer);
