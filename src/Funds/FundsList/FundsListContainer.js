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
} from '@folio/stripes-acq-components';

import { fundsResource } from '../../common/resources';

import FundsList from './FundsList';
import {
  getKeywordQuery,
} from './FundsListSearchConfig';

const RESULT_COUNT_INCREMENT = 30;
const buildFundsQuery = makeQueryBuilder(
  'cql.allRecords=1',
  (query, qindex) => {
    if (qindex) {
      return `(${qindex}=${query}*)`;
    }

    return getKeywordQuery(query);
  },
  'sortby name/sort.ascending',
);

const resetData = () => {};

const FundsListContainer = ({ mutator, location }) => {
  const [funds, setFunds] = useState([]);
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
        if (!offset) setFundsCount(fundsResponse.totalRecords);

        setFunds((prev) => [...prev, ...fundsResponse.funds]);
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

  useEffect(
    () => {
      setFunds([]);
      setFundsOffset(0);
      loadFunds(0);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.search],
  );

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
});

FundsListContainer.propTypes = {
  mutator: PropTypes.object.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
};

export default withRouter(stripesConnect(FundsListContainer));
