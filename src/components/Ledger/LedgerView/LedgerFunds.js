import React, { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';
import { get, groupBy } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import { LIMIT_MAX } from '@folio/stripes-acq-components';

import ConnectionListing from '../../ConnectionListing';
import { groupFundFiscalYears } from '../../../common/resources';


const LedgerFunds = ({ history, funds, currency, mutator, fiscalYears, resources }) => {
  const openFund = useCallback(
    (e, fund) => {
      const path = `/finance/fund/view/${fund.id}`;

      history.push(path);
    },
    [history],
  );

  const buildQuery = useMemo(() => {
    const fiscalYearsIds = fiscalYears.map(fiscalYear => `fiscalYearId="${fiscalYear.id}"`);

    if (fiscalYears.length) {
      return `query=((${fiscalYearsIds.join(' or ')}))`;
    }
    return null;
  }, [fiscalYears]);

  useEffect(() => {
    mutator.groupFundFiscalYears.reset();
    mutator.groupFundFiscalYears.GET({
      params: {
        limit: LIMIT_MAX,
        query: buildQuery,
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildQuery]);

  const fundFiscalYears = get(resources, ['groupFundFiscalYears', 'records'], []);

  const groupedFundFiscalYears = groupBy(fundFiscalYears, 'fundId');

  const fundsToDisplay = funds.map(fund => {
    const groupFundFiscalYear = groupedFundFiscalYears[fund.id];
    if (!groupFundFiscalYear) return fund;

    const sum = groupFundFiscalYear.reduce((result, item) => {
      Object.keys(result).forEach(key => {
        if (item[key]) result[key] += item[key];
      });
      return result;
    }, { available: 0, allocated: 0, unavailable: 0 });

    return { ...sum, ...fund };
  });

  return (
    <ConnectionListing
      items={fundsToDisplay}
      currency={currency}
      openItem={openFund}
    />
  );
};

LedgerFunds.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  mutator: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
  fiscalYears: PropTypes.arrayOf(PropTypes.object),
  funds: PropTypes.arrayOf(PropTypes.object),
  currency: PropTypes.string,
};

LedgerFunds.defaultProps = {
  funds: [],
  fiscalYears: [],
  currency: '',
};

LedgerFunds.manifest = Object.freeze({
  groupFundFiscalYears,
});

export default withRouter(stripesConnect(LedgerFunds));
