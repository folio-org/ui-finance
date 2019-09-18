import React, { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';

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
    const fundIds = funds.map(fund => `fundId="${fund.id}"`);
    const fiscalYearsIds = fiscalYears.map(fiscalYear => `fiscalYearId="${fiscalYear.id}"`);

    if (fundIds.length && fiscalYears.length) {
      return `query=((${fundIds.join(' or ')}) AND (${fiscalYearsIds.join(' or ')}))`;
    }
    return null;
  }, [fiscalYears, funds]);

  useEffect(() => {
    mutator.groupFundFiscalYears.reset();
    mutator.groupFundFiscalYears.GET({
      params: {
        limit: LIMIT_MAX,
        query: buildQuery,
      }
    });
  }, [buildQuery, mutator.groupFundFiscalYears]);

  const fundFiscalYears = get(resources, ['groupFundFiscalYears', 'records'], []);

  const fundsToDisplay = funds.map(fund => {
    const sum = fundFiscalYears.filter(item => item.fundId === fund.id)
      .reduce((result, item) => {
        const { available = 0, allocated = 0, unavailable = 0 } = item;
        return {
          available: available + result.available,
          allocated: allocated + result.allocated,
          unavailable: unavailable + result.unavailable,
        };
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
