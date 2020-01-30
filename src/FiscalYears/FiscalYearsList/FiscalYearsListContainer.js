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

import { fiscalYearsResource } from '../../common/resources';

import FiscalYearsList from './FiscalYearsList';
import {
  getKeywordQuery,
} from './FiscalYearsListSearchConfig';

const RESULT_COUNT_INCREMENT = 30;
const buildTitlesQuery = makeQueryBuilder(
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

const FiscalYearsListContainer = ({ mutator, location }) => {
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
        query: buildTitlesQuery(queryString.parse(location.search)),
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

  useEffect(
    () => {
      setFiscalYears([]);
      setFiscalYearsOffset(0);
      loadFiscalYears(0);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.search],
  );

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
  location: ReactRouterPropTypes.location.isRequired,
};

export default withRouter(stripesConnect(FiscalYearsListContainer));
