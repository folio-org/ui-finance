import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import { groupFundFiscalYears } from '../../../common/resources';
import RelatedFunds from '../../../common/RelatedFunds/RelatedFunds';
import { getFundsToDisplay } from '../../../Utils/getFundToDisplay';

const LedgerFunds = ({ history, funds, currency, mutator, fiscalYears, resources }) => {
  const buildQuery = useMemo(() => {
    const fiscalYearsIds = fiscalYears.map(fiscalYear => `fiscalYearId="${fiscalYear.id}"`);

    if (fiscalYears.length) {
      return `query=((${fiscalYearsIds.join(' or ')}))`;
    }

    return null;
  }, [fiscalYears]);

  const fundFiscalYears = get(resources, ['groupFundFiscalYears', 'records'], []);

  const fundsToDisplay = getFundsToDisplay(funds, fundFiscalYears);

  return (
    <RelatedFunds
      fundsToDisplay={fundsToDisplay}
      currency={currency}
      parentMutator={mutator}
      history={history}
      parentResources={resources}
      query={buildQuery}
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
