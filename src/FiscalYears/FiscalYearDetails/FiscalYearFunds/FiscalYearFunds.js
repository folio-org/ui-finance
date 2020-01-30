import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import RelatedFunds from '../../../common/RelatedFunds/RelatedFunds';

const FiscalYearFunds = ({ funds, currency, fiscalYearId }) => {
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

FiscalYearFunds.propTypes = {
  fiscalYearId: PropTypes.string,
  funds: PropTypes.arrayOf(PropTypes.object),
  currency: PropTypes.string,
};

FiscalYearFunds.defaultProps = {
  funds: [],
};

export default FiscalYearFunds;
