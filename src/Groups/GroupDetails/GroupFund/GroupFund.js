import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import RelatedFunds from '../../../common/RelatedFunds/RelatedFunds';

const GroupFund = ({ funds, currency, fiscalYears, groupId }) => {
  const buildQuery = useMemo(() => {
    const fiscalYearsIds = fiscalYears.map(fiscalYear => `fiscalYearId="${fiscalYear.id}"`);

    if (fiscalYears.length) {
      return `query=((${fiscalYearsIds.join(' or ')}) AND groupId="${groupId}")`;
    }

    return null;
  }, [fiscalYears, groupId]);

  return (
    <RelatedFunds
      currency={currency}
      funds={funds}
      query={buildQuery}
    />
  );
};

GroupFund.propTypes = {
  groupId: PropTypes.string.isRequired,
  fiscalYears: PropTypes.arrayOf(PropTypes.object),
  funds: PropTypes.arrayOf(PropTypes.object),
  currency: PropTypes.string,
};

GroupFund.defaultProps = {
  funds: [],
  fiscalYears: [],
  currency: '',
};

export default GroupFund;
