import React, {
  useCallback,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';
import { usePagination } from '@folio/stripes-acq-components';

import FundsList from './FundsList';
import { fetchFundLedgers } from './utils';
import { useFunds } from './hooks';
import { ledgersResource } from '../../common/resources';

const RESULT_COUNT_INCREMENT = 50;

const resetData = () => {};

export const FundsListContainer = ({ mutator: originMutator }) => {
  const mutator = useMemo(() => originMutator, []);

  const fetchReferences = useCallback(async funds => {
    const ledgersResponse = await fetchFundLedgers(mutator.fundsListLedgers, funds, {});

    const ledgersMap = ledgersResponse.reduce((acc, ledgerItem) => {
      acc[ledgerItem.id] = ledgerItem;

      return acc;
    }, {});

    return { ledgersMap };
  }, []);

  const {
    pagination,
    changePage,
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
