import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import ConnectionListing from '../../ConnectionListing';
import { budgetsResource } from '../../../common/resources';

const LedgerFunds = ({ funds, currency, mutator, resources }) => {
  const buildQuery = useMemo(() => {
    const fundIds = funds.map(fund => `fundId="${fund.id}"`);
    if (fundIds.length) {
      return `query=((${fundIds.join(' or ')}) AND budgetStatus='Active')`;
    }
    return null;
  }, [funds]);

  useEffect(() => {
    mutator.budgets.GET({
      params: {
        query: buildQuery,
      }
    });
  }, [buildQuery]);

  const budgets = get(resources, ['budgets', 'records'], []);

  const fundsToDisplay = funds.map(fund => {
    const budget = budgets.find(item => item.fundId === fund.id);
    const { available, allocated, unavailable } = budget || {};
    return { available, allocated, unavailable, ...fund };
  });

  return (
    <ConnectionListing
      items={fundsToDisplay}
      currency={currency}
      openItem={() => null}
    />
  );
};

LedgerFunds.propTypes = {
  mutator: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
  funds: PropTypes.arrayOf(PropTypes.object),
  currency: PropTypes.string,
};

LedgerFunds.defaultProps = {
  funds: [],
  currency: '',
};

LedgerFunds.manifest = Object.freeze({
  budgets: {
    ...budgetsResource,
    accumulate: true,
    fetch: true,
  },
});

export default stripesConnect(LedgerFunds);
