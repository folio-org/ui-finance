import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import RelatedFunds from '../../../common/RelatedFunds/RelatedFunds';

const GroupFund = ({ funds, currency, fiscalYearId, groupId }) => {
  const buildQuery = useMemo(() => {
    if (fiscalYearId) {
      return `query=(fiscalYearId=="${fiscalYearId}" AND groupFundFY.groupId=="${groupId}")`;
    }

    return null;
  }, [fiscalYearId, groupId]);

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
  fiscalYearId: PropTypes.string,
  funds: PropTypes.arrayOf(PropTypes.object),
  currency: PropTypes.string,
};

GroupFund.defaultProps = {
  funds: [],
};

export default GroupFund;
