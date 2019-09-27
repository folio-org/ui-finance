import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import { groupFundFiscalYears } from '../../../common/resources';
import RelatedFunds from '../../../common/RelatedFunds/RelatedFunds';
import { getFundsToDisplay } from '../../../Utils/getFundToDisplay';

const GroupFund = ({ history, funds, currency, mutator, fiscalYears, groupId, resources }) => {
  const buildQuery = useMemo(() => {
    const fiscalYearsIds = fiscalYears.map(fiscalYear => `fiscalYearId="${fiscalYear.id}"`);

    if (fiscalYears.length) {
      return `query=((${fiscalYearsIds.join(' or ')}) AND groupId="${groupId}")`;
    }

    return null;
  }, [fiscalYears, groupId]);

  const fundFiscalYears = get(resources, ['groupFundFiscalYears', 'records'], []);

  const fundsToDisplay = getFundsToDisplay(funds, fundFiscalYears).filter(fund => fund.available !== undefined);

  return (
    <RelatedFunds
      fundsToDisplay={fundsToDisplay}
      currency={currency}
      parentMutator={mutator}
      history={history}
      query={buildQuery}
    />
  );
};

GroupFund.propTypes = {
  groupId: PropTypes.string.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  mutator: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
  fiscalYears: PropTypes.arrayOf(PropTypes.object),
  funds: PropTypes.arrayOf(PropTypes.object),
  currency: PropTypes.string,
};

GroupFund.defaultProps = {
  funds: [],
  fiscalYears: [],
  currency: '',
};

GroupFund.manifest = Object.freeze({
  groupFundFiscalYears,
});

export default withRouter(stripesConnect(GroupFund));
