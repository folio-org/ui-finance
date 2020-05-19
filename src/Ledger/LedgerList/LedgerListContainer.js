import React, {
  useCallback,
  useEffect,
  useMemo,
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

import { LEDGERS_ROUTE } from '../../common/const';
import { ledgersResource } from '../../common/resources';

import LedgersList from './LedgersList';
import {
  getKeywordQuery,
} from './LedgerListSearchConfig';

const RESULT_COUNT_INCREMENT = 30;

const buildLedgersQuery = makeQueryBuilder(
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

const LedgerListContainer = ({ mutator: originMutator, location, history }) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const mutator = useMemo(() => originMutator, []);
  const [ledgers, setLedgers] = useState([]);
  const [ledgersCount, setLedgersCount] = useState(0);
  const [ledgersOffset, setLedgersOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const loadLedgers = useCallback((offset) => {
    setIsLoading(true);

    return mutator.ledgersListFinance.GET({
      params: {
        limit: RESULT_COUNT_INCREMENT,
        offset,
        query: buildLedgersQuery(queryString.parse(location.search)),
      },
    })
      .then(ledgersResponse => {
        if (!offset) setLedgersCount(ledgersResponse.totalRecords);

        setLedgers((prev) => [...prev, ...ledgersResponse.ledgers]);
      })
      .finally(() => setIsLoading(false));
  }, [location.search, mutator.ledgersListFinance]);

  const onNeedMoreData = useCallback(
    () => {
      const newOffset = ledgersOffset + RESULT_COUNT_INCREMENT;

      loadLedgers(newOffset)
        .then(() => {
          setLedgersOffset(newOffset);
        });
    },
    [ledgersOffset, loadLedgers],
  );

  const refreshList = () => {
    setLedgers([]);
    setLedgersOffset(0);
    loadLedgers(0);
  };

  useEffect(
    () => {
      refreshList();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.search],
  );
  useLocationReset(history, location, LEDGERS_ROUTE, refreshList);

  return (
    <LedgersList
      onNeedMoreData={onNeedMoreData}
      resetData={resetData}
      ledgersCount={ledgersCount}
      isLoading={isLoading}
      ledgers={ledgers}
    />
  );
};

LedgerListContainer.manifest = Object.freeze({
  ledgersListFinance: {
    ...ledgersResource,
    accumulate: true,
    records: '',
  },
});

LedgerListContainer.propTypes = {
  mutator: PropTypes.object.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
};

export default withRouter(stripesConnect(LedgerListContainer));
