import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import RelatedFunds from '../../../common/RelatedFunds/RelatedFunds';

const GroupFund = ({ funds, currency, fiscalYearId, groupId, onRemoveFundFromGroup }) => {
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
      onRemoveFund={onRemoveFundFromGroup}
    />
  );
};

GroupFund.propTypes = {
  groupId: PropTypes.string.isRequired,
  fiscalYearId: PropTypes.string,
  funds: PropTypes.arrayOf(PropTypes.object),
  currency: PropTypes.string,
  onRemoveFundFromGroup: PropTypes.func,
};

GroupFund.defaultProps = {
  funds: [],
};

export default GroupFund;
