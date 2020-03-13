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

import { FISCAL_YEAR_ROUTE } from '../../common/const';
import { fiscalYearsResource } from '../../common/resources';

import FiscalYearsList from './FiscalYearsList';
import {
  getKeywordQuery,
} from './FiscalYearsListSearchConfig';

const RESULT_COUNT_INCREMENT = 30;
const buildFiscalYearsQuery = makeQueryBuilder(
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

const FiscalYearsListContainer = ({ mutator, location, history }) => {
  const [fiscalYears, setFiscalYears] = useState([]);
  const [fiscalYearsCount, setFiscalYearsCount] = useState(0);
  const [fiscalYearsOffset, setFiscalYearsOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const loadFiscalYears = (offset) => {
    setIsLoading(true);

    return mutator.fiscalYearsListFYears.GET({
      params: {
        limit: RESULT_COUNT_INCREMENT,
        offset,
        query: buildFiscalYearsQuery(queryString.parse(location.search)),
      },
    })
      .then(fiscalYearsResponse => {
        if (!offset) setFiscalYearsCount(fiscalYearsResponse.totalRecords);

        setFiscalYears((prev) => [...prev, ...fiscalYearsResponse.fiscalYears]);
      })
      .finally(() => setIsLoading(false));
  };

  const onNeedMoreData = useCallback(
    () => {
      const newOffset = fiscalYearsOffset + RESULT_COUNT_INCREMENT;

      loadFiscalYears(newOffset)
        .then(() => {
          setFiscalYearsOffset(newOffset);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fiscalYearsOffset],
  );

  const refreshList = () => {
    setFiscalYears([]);
    setFiscalYearsOffset(0);
    loadFiscalYears(0);
  };

  useEffect(
    () => {
      refreshList();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.search],
  );
  useLocationReset(history, location, FISCAL_YEAR_ROUTE, refreshList);

  return (
    <FiscalYearsList
      onNeedMoreData={onNeedMoreData}
      resetData={resetData}
      fiscalYearsCount={fiscalYearsCount}
      isLoading={isLoading}
      fiscalYears={fiscalYears}
    />
  );
};

FiscalYearsListContainer.manifest = Object.freeze({
  fiscalYearsListFYears: {
    ...fiscalYearsResource,
    accumulate: true,
    records: null,
  },
});

FiscalYearsListContainer.propTypes = {
  mutator: PropTypes.object.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
};

export default withRouter(stripesConnect(FiscalYearsListContainer));
