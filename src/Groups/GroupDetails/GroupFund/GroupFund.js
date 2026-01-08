import PropTypes from 'prop-types';
import { useMemo } from 'react';

import RelatedFunds from '../../../common/RelatedFunds/RelatedFunds';

const DEFAULT_FUNDS = [];

const GroupFund = ({
  currency,
  fiscalYearId,
  funds = DEFAULT_FUNDS,
  groupId,
  onRemoveFundFromGroup,
}) => {
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
  currency: PropTypes.string,
  fiscalYearId: PropTypes.string,
  funds: PropTypes.arrayOf(PropTypes.object),
  groupId: PropTypes.string.isRequired,
  onRemoveFundFromGroup: PropTypes.func,
};

export default GroupFund;
