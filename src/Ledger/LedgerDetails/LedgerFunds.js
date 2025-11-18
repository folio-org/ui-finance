import PropTypes from 'prop-types';
import { useMemo } from 'react';

import RelatedFunds from '../../common/RelatedFunds/RelatedFunds';

const DEFAULT_FUNDS = [];

const LedgerFunds = ({
  currency,
  fiscalYearId,
  funds = DEFAULT_FUNDS,
  ledgerId,
}) => {
  const buildQuery = useMemo(() => {
    if (fiscalYearId && ledgerId) {
      return `query=(fiscalYearId=="${fiscalYearId}" AND fund.ledgerId=="${ledgerId}")`;
    }

    return null;
  }, [fiscalYearId, ledgerId]);

  return (
    <RelatedFunds
      funds={funds}
      currency={currency}
      query={buildQuery}
    />
  );
};

LedgerFunds.propTypes = {
  currency: PropTypes.string,
  fiscalYearId: PropTypes.string,
  funds: PropTypes.arrayOf(PropTypes.object),
  ledgerId: PropTypes.string,
};

export default LedgerFunds;
