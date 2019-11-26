import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import RelatedFunds from '../../../common/RelatedFunds/RelatedFunds';

const LedgerFunds = ({ funds, currency, fiscalYearId }) => {
  const buildQuery = useMemo(() => {
    if (fiscalYearId) {
      return `query=(fiscalYearId=="${fiscalYearId}")`;
    }

    return null;
  }, [fiscalYearId]);

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
};

LedgerFunds.defaultProps = {
  funds: [],
};

export default LedgerFunds;
