import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import RelatedFunds from '../../common/RelatedFunds/RelatedFunds';

const LedgerFunds = ({ funds, currency, fiscalYearId, ledgerId }) => {
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
  fiscalYearId: PropTypes.string,
  funds: PropTypes.arrayOf(PropTypes.object),
  currency: PropTypes.string,
  ledgerId: PropTypes.string,
};

LedgerFunds.defaultProps = {
  funds: [],
};

export default LedgerFunds;
