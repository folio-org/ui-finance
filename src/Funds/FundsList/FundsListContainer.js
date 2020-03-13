import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  withRouter,
} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import queryString from 'query-string';

import { stripesConnect } from '@folio/stripes/core';
import {
  makeQueryBuilder,
  useLocationReset,
} from '@folio/stripes-acq-components';

import { FUNDS_ROUTE } from '../../common/const';
import {
  fundsResource,
  ledgersResource,
} from '../../common/resources';

import FundsList from './FundsList';
import {
  getKeywordQuery,
} from './FundsListSearchConfig';
import { fetchFundLedgers } from './utils';

const RESULT_COUNT_INCREMENT = 30;
const buildFundsQuery = makeQueryBuilder(
  'cql.allRecords=1',
  (query, qindex) => {
    if (qindex) {
      return `(${qindex}=${query}*)`;
    }

    return `(${getKeywordQuery(query)})`;
  },
  'sortby name/sort.ascending',
);

const resetData = () => {};

const FundsListContainer = ({ mutator, location, history }) => {
  const [funds, setFunds] = useState([]);
  const [ledgersMap, setLedgersMap] = useState({});
  const [fundsCount, setFundsCount] = useState(0);
  const [fundsOffset, setFundsOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const loadFunds = (offset) => {
    setIsLoading(true);

    return mutator.fundsListFunds.GET({
      params: {
        limit: RESULT_COUNT_INCREMENT,
        offset,
        query: buildFundsQuery(queryString.parse(location.search)),
      },
    })
      .then(fundsResponse => {
        const ledgersPromise = fetchFundLedgers(
          mutator.fundsListLedgers, fundsResponse.funds, ledgersMap,
        );

        return Promise.all([fundsResponse, ledgersPromise]);
      })
      .then(([fundsResponse, ledgersResponse]) => {
        if (!offset) setFundsCount(fundsResponse.totalRecords);

        const newLedgersMap = {
          ...ledgersMap,
          ...ledgersResponse.reduce((acc, ledgerItem) => {
            acc[ledgerItem.id] = ledgerItem;

            return acc;
          }, {}),
        };

        setLedgersMap(newLedgersMap);

        setFunds((prev) => [
          ...prev,
          ...fundsResponse.funds.map(fund => ({
            ...fund,
            ledger: newLedgersMap[fund.ledgerId]?.name,
          })),
        ]);
      })
      .finally(() => setIsLoading(false));
  };

  const onNeedMoreData = useCallback(
    () => {
      const newOffset = fundsOffset + RESULT_COUNT_INCREMENT;

      loadFunds(newOffset)
        .then(() => {
          setFundsOffset(newOffset);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fundsOffset],
  );

  const refreshList = () => {
    setFunds([]);
    setFundsOffset(0);
    loadFunds(0);
  };

  useEffect(
    () => {
      refreshList();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.search],
  );
  useLocationReset(history, location, FUNDS_ROUTE, refreshList);

  return (
    <FundsList
      onNeedMoreData={onNeedMoreData}
      resetData={resetData}
      fundsCount={fundsCount}
      isLoading={isLoading}
      funds={funds}
    />
  );
};

FundsListContainer.manifest = Object.freeze({
  fundsListFunds: {
    ...fundsResource,
    accumulate: true,
    records: null,
  },
  fundsListLedgers: {
    ...ledgersResource,
    accumulate: true,
  },
});

FundsListContainer.propTypes = {
  mutator: PropTypes.object.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
};

export default withRouter(stripesConnect(FundsListContainer));
